import asyncio
import io
import glob
import os
import re
import sys
import time
import uuid
import requests
from urllib.parse import urlparse
from io import BytesIO
from PIL import Image, ImageDraw
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.face.models import TrainingStatusType, Person, QualityForRecognition

def apiazure(ref, scene):
    KEY = "573ba42a01ec4b0b9cd1a616cedc9ab7"
    ENDPOINT = "https://dtc2.cognitiveservices.azure.com/"
    face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(KEY))

    try: 
        response_detected_faces = face_client.face.detect_with_stream(
            image=open(scene, 'rb'),      
            detection_model='detection_03',
            recognition_model='recognition_04',
        )
    except:
        return 0

    face_ids = [face.face_id for face in response_detected_faces]

    try:
        response_face_source = face_client.face.detect_with_stream(
            image=open(ref, 'rb'),
            detection_model='detection_03',
            recognition_model='recognition_04'
        )
    except:
        return 0

    face_id_source = response_face_source[0].face_id

    matched_faces = face_client.face.find_similar(
        face_id=face_id_source,
        face_ids=face_ids
    )

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
                return img
    return 0
    
