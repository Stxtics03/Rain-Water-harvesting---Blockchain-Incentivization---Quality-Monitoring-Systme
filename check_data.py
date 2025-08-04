from pymongo import MongoClient

client = MongoClient("mongodb+srv://axuserver:axuserver123@cluster0.qtbwaos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["AxGuard"]
collection = db["SensorData"]

latest = collection.find_one(sort=[("timestamp", -1)])
print("Latest data:", latest)
