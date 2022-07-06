import os
from flask import Flask, request, jsonify, send_file
import cv2
import shutil
from samevisage import apiazure

#----------------------------------------------------------------
def cutVideo(video, path):
    print("video:", video)
    print("path:", path)
    vidcap = cv2.VideoCapture(video)
    success, image = vidcap.read()
    count = 1
    while success:
        cv2.imwrite(f"{path}/image_{count}.jpg", image)    
        success, image = vidcap.read()
        print('Saved image ', count)
        count += 1

def createFolder(parent_dir, directory):    
    path = os.path.join(parent_dir, directory)

    try:
        os.makedirs(path, exist_ok = True)
        print("Directory created successfully")
    except OSError as error:
        print("Directory can not be created")
        return 0
    
    return 1

def analyze(timestamp, name, pathToImage, sceneFolder, scene, i, filename):
    try: 
        image = apiazure(f"BackEnd/analyze/input/{timestamp}/{name}/{filename}", pathToImage)
    except:
        return i

    if (image != 0):
        if ( createFolder(f"BackEnd/analyze/output/{timestamp}/{sceneFolder[0]}", name) == 1):
            image.save(f"BackEnd/analyze/output/{timestamp}/{sceneFolder[0]}/{name}/{i}.jpg")
            i += 1
    return i
    
#----------------------------------------------------------------


app = Flask(__name__)

@app.route("/api/find", methods=["POST"])
def process_image():

    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):
        json = request.json
    else:
        return jsonify({'msg': 'error not a JSON'}), 400

    try: 
        json["Timestamp"]
    except:
        return jsonify({'msg': 'error no Timestamp find'}), 400

    try: 
        json["PathDictRef"]
    except:
        return jsonify({'msg': 'error no PathDictRef find'}), 400

    try: 
        json["PathDictScene"]
    except:
        return jsonify({'msg': 'error no PathDictRef find'}), 400

    timestamp = json["Timestamp"]

    createFolder("BackEnd/analyze/output", timestamp)
    i = 0
    for scene in json["PathDictScene"]:
        sceneFolder = scene.split('.')
        createFolder(f"BackEnd/analyze/input/{timestamp}", "file")
        createFolder(f"BackEnd/analyze/input/{timestamp}/file", sceneFolder[0])
        if (sceneFolder[1] == "jpg"):
            shutil.move(f'BackEnd/analyze/input/{timestamp}/{scene}', f'BackEnd/analyze/input/{timestamp}/file/{sceneFolder[0]}/{scene}')
        elif (sceneFolder[1] == "mp4"):
            cutVideo(f'BackEnd/analyze/input/{timestamp}/{scene}', f'BackEnd/analyze/input/{timestamp}/file/{sceneFolder[0]}')
            os.remove(f'BackEnd/analyze/input/{timestamp}/{scene}')

        createFolder(f"BackEnd/analyze/output/{timestamp}", sceneFolder[0] )

        for ref in json["PathDictRef"]:
            tempo = json["PathDictRef"][ref]
            name = tempo["name"]
            filename = tempo["filename"]
            if (sceneFolder[1] == "jpg"):
                pathToImage = f"BackEnd/analyze/input/{timestamp}/{name}/{filename}"
                i = analyze(timestamp, name, pathToImage, sceneFolder, scene, i, filename)
            elif (sceneFolder[1] == "mp4"):
                for image in os.listdir(f'BackEnd/analyze/input/{timestamp}/file/{sceneFolder[0]}'):
                    pathToImage = f"BackEnd/analyze/input/{timestamp}/file/{sceneFolder[0]}/{image}"
                    print("pathToImage:", pathToImage)
                    i = analyze(timestamp, name, pathToImage, sceneFolder, scene, i, filename)
        i = 0
    
    return jsonify({'result': 'ok'}),200

if __name__ == "__main__":
    app.run(debug=True)
