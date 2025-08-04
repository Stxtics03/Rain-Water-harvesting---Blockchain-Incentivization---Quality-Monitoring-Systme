from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb+srv://axuserver:axuserver123@cluster0.qtbwaos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["AxGuard"]
collection = db["SensorData"]

dummy = {
    "temperature": 26.5,
    "pH": 7.2,
    "turbidity": 3.5,
    "tank_level": 80,
    "solid_detected": False,
    "timestamp": datetime.utcnow()
}

collection.insert_one(dummy)
print("✅ Dummy data inserted")
