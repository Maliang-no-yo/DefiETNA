# Groupe de jezier_c 979591

## Instalation

Pour récupérer le projet, il faut éxecuter la commande:
```bash
git clone <le projet>
```

Pour lancer le projet, il faut aller dans le dossier BackEnd et éxecuter le script main.py:
```bash
python main.py
``` 

## Information
### Samevisage
Dans le script samevisage.py, on utilise les services azures pour appeler l'api Visage:
```python
    KEY = "573ba42a01ec4b0b9cd1a616cedc9ab7"
    ENDPOINT = "https://dtc2.cognitiveservices.azure.com/"
    face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(KEY))
```

KEY contient notre clé d'abonnement et ENDPOINT contient notre point de terminaison.
Ensuite, on les stokes dans face_client avec la class FaceClient qui va vérifier si la clé d'abonnement et le point de terminaison existe à chaque requet.

```python
response_detected_faces = face_client.face.detect_with_stream(
        image=open(scene, 'rb'),      
        detection_model='detection_03',
        recognition_model='recognition_04',
    )
```
Cette partie s'occupe de chercher le visage dans l'image donner (scene).

```python
img_source = open(ref, 'rb')
    response_face_source = face_client.face.detect_with_stream(
        image=img_source,
        detection_model='detection_03',
        recognition_model='recognition_04'
    )
```
Cette partie contient l'image du visage qui doit être rechercher (ref).

```python
matched_faces = face_client.face.find_similar(
        face_id=face_id_source,
        face_ids=face_ids
    )
```
Cette partie s'occupe de vérifier si le visage trouvé correspond au visage de référence.

```python
img = Image.open(open(scene, 'rb'))
    draw = ImageDraw.Draw(img)

    for matched_face in matched_faces:
        for face in response_detected_faces:
            if face.face_id == matched_face.face_id:
                rect = face.face_rectangle
                left = rect.left
                top = rect.top
                right = rect.width + left
                bottom = rect.height + top
                draw.rectangle(((left, top), (right, bottom)), outline='green')
    img.show()
```
Cette partie montre le visage qui est similaire dans l'image par un rectangle vert.