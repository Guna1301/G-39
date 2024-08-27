import datetime
import numpy as np
import cv2
import easyocr
import requests
from tensorflow.lite.python.interpreter import Interpreter
import time
import re
from pymongo import MongoClient

# Path settings
model_path = 'Licence-Plate-Detection-using-TensorFlow-Lite/detect.tflite'  # Path to your TFLite model
label_path = 'Licence-Plate-Detection-using-TensorFlow-Lite/labelmap.txt'   # Path to your labels file

# Detection settings
detection_threshold = 0.7
min_confidence = 0.5

# OCR settings
ocr_language = ['en']

# MongoDB settings
mongo_client = MongoClient('mongodb+srv://kotadeepthi2005:deepthi@cluster0.aac3rfk.mongodb.net')
db = mongo_client['vms']
collection = db['slots']

# Load labels
def load_labels(label_path):
    with open(label_path, 'r') as f:
        labels = [line.strip() for line in f.readlines()]
    return labels

# Initialize EasyOCR
reader = easyocr.Reader(ocr_language)

# Load TFLite model
def load_model(model_path):
    interpreter = Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    height = input_details[0]['shape'][1]
    width = input_details[0]['shape'][2]
    return interpreter, input_details, output_details, height, width

# Function to preprocess the frame for the model
def preprocess_frame(frame, input_details, height, width):
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (width, height))
    input_data = np.expand_dims(image_resized, axis=0)
    if input_details[0]['dtype'] == np.float32:
        input_mean = 127.5
        input_std = 127.5
        input_data = (np.float32(input_data) - input_mean) / input_std
    return input_data

# Function to process detections
def process_detections(frame, imH, imW, boxes, classes, scores, labels):
    detections = []
    for i in range(len(scores)):
        if min_confidence <= scores[i] <= 1.0:
            ymin = int(max(1, (boxes[i][0] * imH)))
            xmin = int(max(1, (boxes[i][1] * imW)))
            ymax = int(min(imH, (boxes[i][2] * imH)))
            xmax = int(min(imW, (boxes[i][3] * imW)))
            detections.append([labels[int(classes[i])], scores[i], xmin, ymin, xmax, ymax])
            cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (10, 255, 0), 2)
    return detections

# Function to perform OCR on detected license plates
def perform_ocr_on_license_plates(frame, detections, reader):
    for detection in detections:
        if detection[0] == 'LicensePlate':
            xmin, ymin, xmax, ymax = detection[2], detection[3], detection[4], detection[5]
            roi = frame[ymin:ymax, xmin:xmax]
            result = reader.readtext(roi, detail=0)
            text = ' '.join(result)
            print("Detected License Plate:", text)
            cv2.putText(frame, text, (xmin, ymin - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            number_plate = None
            if re.match(r'^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$', text.replace(" ", "")):
                print("License plate with required format detected. Stopping detection.")
                detected_plate = ''.join(text.split()).lower()
                document = collection.find_one({"nodename": node})
                if document:
                    # Extract the number_plate value
                    number_plate = document.get("vehiclenumber")
                    
                    if number_plate:
                        actual_plate = ''.join(number_plate.split()).lower()
                        status = (detected_plate == actual_plate)
                        if(status):
                            print("License plate detected is correct")
                        else:
                            print("wrong match")

                        # Update the MongoDB document
                        formatted_time = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")
                        collection.update_one(
                            {"node_name": node},
                            {"$set": {"time": formatted_time, "status": status,"devicestatus":True}}
                        )
                    else:
                        print("No number_plate found in the document.")
                else:
                    print("Document with node_name not found.")
                return True
    return False

# Function to start license plate detection from a video stream
def start_license_plate_detection(stream_url, model_path, label_path):
    # Load labels
    labels = load_labels(label_path)
    print("Labels loaded:", labels)
    
    # Load model
    interpreter, input_details, output_details, height, width = load_model(model_path)
    print("Model loaded successfully.")
    
    # Start the video stream with retry mechanism
    retry_attempts = 5
    retry_delay = 5  # seconds

    while True:
        cap = cv2.VideoCapture(stream_url)
        if not cap.isOpened():
            print("Error: Unable to open video stream. Retrying...")
            time.sleep(retry_delay)
            continue

        print("Video stream opened successfully.")
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("Error: Unable to read frame. Retrying...")
                break

            imH, imW, _ = frame.shape
            input_data = preprocess_frame(frame, input_details, height, width)

            interpreter.set_tensor(input_details[0]['index'], input_data)
            interpreter.invoke()
            boxes = interpreter.get_tensor(output_details[1]['index'])[0]
            classes = interpreter.get_tensor(output_details[3]['index'])[0]
            scores = interpreter.get_tensor(output_details[0]['index'])[0]

            detections = process_detections(frame, imH, imW, boxes, classes, scores, labels)
            if perform_ocr_on_license_plates(frame, detections, reader):
                cap.release()
                cv2.destroyAllWindows()
                return

            cv2.imshow('License Plate Detection', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                return

        cap.release()
        cv2.destroyAllWindows()

def get_fixed_plate_from_arduino(arduino_ip):
    try:
        response = requests.get(f"{arduino_ip}/get_fixed_plate")  # Set a timeout
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        node = data.get("node", "").strip()
        return node
    except requests.ConnectTimeout:
        print("Connection timed out. Please check if the Arduino is connected and the IP address is correct.")
    except requests.ConnectionError as e:
        print(f"Failed to connect: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

if __name__ == "__main__":
    stream_url = 'http://192.168.45.127/jpg_stream'  # Update this with your ESP32-CAM's stream URL
    try:
        while True:
            node = get_fixed_plate_from_arduino('http://192.168.45.127')
            if node:
                print(f"Node obtained from Arduino: {node}")
                start_license_plate_detection(stream_url, model_path, label_path)
            else:
                print("Failed to get fixed plate or node. Retrying in 5 seconds...")
                time.sleep(5)
    except KeyboardInterrupt:
        print("Keyboard interrupt detected. Exiting program.")
    finally:
        cv2.destroyAllWindows()
