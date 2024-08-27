from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Replace with your MongoDB connection string
mongo_uri = "mongodb://localhost:27017/"
client = MongoClient(mongo_uri)

# Replace 'your_database_name' and 'your_collection_name' with actual database and collection names
db = client['license_plate_db']
collection = db['detected_plates']

@app.route('/device-status', methods=['GET'])
def get_device_status():
    try:
        # Retrieve data from MongoDB
        data = list(collection.find({}, {'_id': False}))  # Exclude '_id' field
        return jsonify(data)
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
