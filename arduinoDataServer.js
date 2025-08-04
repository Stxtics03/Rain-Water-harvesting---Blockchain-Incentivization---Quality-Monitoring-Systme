const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Serial Port Setup
const port = new SerialPort({
  path: 'COM4',      // Update to your Arduino COM port
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// WebSocket Server
const wss = new WebSocket.Server({ port: 3001 });
console.log('✅ WebSocket server started on ws://localhost:3001');

// HTTP Server for REST API
const httpServer = app.listen(3000, () => {
  console.log('✅ HTTP server started on http://localhost:3000');
});

// Store latest sensor data
let currentSensorData = {
  ph: 0,
  turbidity: 0,
  water_level: "NORMAL",
  temperature: 0,
  tds: 0
};

wss.on('connection', function connection(ws) {
  console.log('🔗 Client connected to WebSocket');
  ws.send(JSON.stringify(currentSensorData));
});

app.get('/data', (req, res) => {
  res.json(currentSensorData);
});

parser.on('data', function (data) {
  const rawData = data.trim();
  console.log('📥 From Arduino:', rawData);

  try {
    const values = rawData.split(',');
    if (values.length === 5) {
      currentSensorData = {
        ph: parseFloat(values[0]) || 0,
        turbidity: parseFloat(values[1]) || 0,
        water_level: values[2].trim() || "NORMAL",
        temperature: parseFloat(values[3]) || 0,
        tds: parseFloat(values[4]) || 0
      };
      console.log('📊 Parsed data:', currentSensorData);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(currentSensorData));
        }
      });
    } else {
      console.log('⚠️ Invalid data format from Arduino:', rawData);
    }
  } catch (error) {
    console.error('❌ Error parsing Arduino data:', error);
  }
});

port.on('error', function(err) {
  console.error('❌ Serial port error:', err);
});
