from pymongo import MongoClient

# MongoDB connection string (same as your upload_to_mongo.py)
client = MongoClient("mongodb+srv://axuserver:axuserver123@cluster0.qtbwaos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Access database and collection
db = client["AxGuard"]
collection = db["SensorData"]

# Delete all documents in the collection
result = collection.delete_many({})
print(f"✅ Deleted {result.deleted_count} documents from SensorData.")
