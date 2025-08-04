import serial
import time
from pymongo import MongoClient
from datetime import datetime

# MongoDB setup
MONGO_URI = "mongodb+srv://axuserver:axuserver123@cluster0.qtbwaos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "AxGuard"
COLLECTION_NAME = "SensorData"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Arduino Serial setup
SERIAL_PORT = 'COM5'  # Update if needed
BAUD_RATE = 9600

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"✅ Connected to {SERIAL_PORT} at {BAUD_RATE} baud.")
except Exception as e:
    print("❌ Error opening serial port:", e)
    exit()

def parse_data(line):
    if line.startswith("DATA:"):
        try:
            values = line.strip().split("DATA:")[1]
            parts = values.split(",")

            # Handle both formats: 3 values or 5 values
            if len(parts) == 5:
                temperature = float(parts[0])
                ph = float(parts[1])
                turbidity = float(parts[2])
                tank_level = float(parts[3])
                solid_detected = bool(int(parts[4]))
            elif len(parts) == 3:
                temperature = float(parts[0])
                ph = 0.0
                turbidity = 0.0
                tank_level = float(parts[1])
                solid_detected = bool(int(parts[2]))
            else:
                print("⚠️ Unexpected number of values:", parts)
                return None

            return {
                "temperature": temperature,
                "pH": ph,
                "turbidity": turbidity,
                "tank_level": tank_level,
                "solid_detected": solid_detected,
                "timestamp": datetime.utcnow()
            }

        except Exception as e:
            print("❌ Failed to parse line:", line, "| Error:", e)
            return None
    return None

print("📡 Listening to serial for sensor data...")

while True:
    try:
        if ser.in_waiting:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            data = parse_data(line)
            if data:
                collection.insert_one(data)
                print("✅ Uploaded to MongoDB:", data)
        time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Script stopped by user.")
        break
    except Exception as e:
        print("❌ Error during loop:", e)
