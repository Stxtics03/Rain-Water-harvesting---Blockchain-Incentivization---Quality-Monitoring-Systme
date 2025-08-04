import serial
import time
from upload_to_mongo import upload_data

# Ports
arduino1_port = "COM5"  # Arduino 1: Temp, Water Sensor
arduino2_port = "COM4"  # Arduino 2: pH, Turbidity, Water Level
baud_rate = 9600

try:
    ser1 = serial.Serial(arduino1_port, baud_rate, timeout=1)
    ser2 = serial.Serial(arduino2_port, baud_rate, timeout=1)
    time.sleep(2)  # Wait for Arduino to initialize
except Exception as e:
    print(f"[ERROR] Could not open ports: {e}")
    exit()

print("✅ Listening on COM5 (Arduino 1) and COM4 (Arduino 2)...")

while True:
    try:
        # Read Arduino 1
        if ser1.in_waiting > 0:
            line1 = ser1.readline().decode().strip()
            if line1:
                print(f"[Arduino 1] {line1}")
                # Optionally store line1 too, if needed

        # Read Arduino 2 (Main MongoDB upload)
        if ser2.in_waiting > 0:
            line2 = ser2.readline().decode().strip()
            if line2:
                print(f"[Arduino 2] {line2}")
                upload_data(line2)

        time.sleep(0.2)

    except KeyboardInterrupt:
        print("\n🛑 Stopped by user.")
        break
    except Exception as e:
        print(f"[ERROR] {e}")
