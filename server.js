const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// MongoDB setup
const MONGO_URI = "mongodb+srv://axuserver:axuserver123@cluster0.qtbwaos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  dbName: "AxGuard"
}).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Sensor data schema
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  pH: Number,
  turbidity: Number,
  tank_level: Number,
  solid_detected: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorSchema, 'SensorData');

// Serve static files (dashboard.html should be in 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get the latest sensor data
app.get('/api/sensor/latest', async (req, res) => {
  try {
    console.log("🔍 Fetching latest sensor data...");
    
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    console.log("📊 Query result from DB:", latest);

    if (!latest) {
      console.log("⚠️ No data found in database");
      return res.status(404).json({});
    }
    
    res.json(latest);
    
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch sensor data" });
  }
});

// API route to receive sensor data from Arduino/ESP32
app.post('/api/sensor/data', async (req, res) => {
  try {
    console.log("📥 Received sensor data:", req.body);
    
    const sensorData = new SensorData({
      temperature: req.body.temperature,
      pH: req.body.pH,
      turbidity: req.body.turbidity,
      tank_level: req.body.tank_level,
      solid_detected: req.body.solid_detected,
      timestamp: new Date()
    });
    
    await sensorData.save();
    console.log("✅ Data saved to database");
    
    res.status(200).json({ message: "Data saved successfully" });
    
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ error: "Failed to save sensor data" });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    message: 'AxGuard server is running'
  });
});

// Serve dashboard at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 AxGuard server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/sensor/latest`);
});