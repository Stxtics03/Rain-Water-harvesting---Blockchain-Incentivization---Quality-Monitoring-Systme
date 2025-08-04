document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});
// Store chart instances
const chartInstances = {};

// Data modes
let currentMode = 'safe';

const safeData = {
  ph: 6.8,
  tds: 230,
  turbidity: 15,
  temperature: 26,
  level: 76
};

const unsafeData = {
  ph: 5.2,         // Too acidic
  tds: 780,        // Too high
  turbidity: 28,    // Very cloudy
  temperature: 34,  // Too hot
  level: 12         // Too low
};

function toggleDataMode() {
  currentMode = currentMode === 'safe' ? 'unsafe' : 'safe';
  renderData(currentMode === 'safe' ? safeData : unsafeData);
  document.getElementById('toggleBtn').innerText = 
    currentMode === 'safe' ? 'Show Unsafe Data' : 'Show Safe Data';
}

function renderData(data) {
    // Update the text values
    document.getElementById('phValue').innerText = data.ph.toFixed(1);
    document.getElementById('phStatus').innerText =
      data.ph >= 6.5 && data.ph <= 8.5 ? '✅ Safe' : '⚠️ Unsafe';
  
    document.getElementById('tdsValue').innerText = data.tds + ' ppm';
    document.getElementById('tdsStatus').innerText =
      data.tds <= 500 ? '✅ Safe' : '⚠️ High';
  
    document.getElementById('turbValue').innerText = data.turbidity + ' NTU';
    document.getElementById('turbStatus').innerText =
      data.turbidity <= 5 ? '✅ Clear' : '⚠️ Cloudy';
  
    document.getElementById('tempValue').innerText = data.temperature + ' °C';
    document.getElementById('tempStatus').innerText =
      data.temperature <= 30 ? '✅ Normal' : '⚠️ Hot';
  
    document.getElementById('levelValue').innerText = data.level + '%';
    document.getElementById('levelStatus').innerText =
      data.level >= 90 ? '⚠️ Overflow Risk' :
      data.level <= 20 ? '⚠️ Low' : '✅ OK';
  
    // Update or create charts
    updateChart('phChart', 'pH Level', [7.2, data.ph], 'rgba(0, 123, 255, 0.8)', 'rgba(0, 123, 255, 0.2)');
    updateChart('tdsChart', 'TDS', [220, data.tds], 'rgba(40, 167, 69, 0.8)', 'rgba(40, 167, 69, 0.2)');
    updateChart('turbChart', 'Turbidity', [10, data.turbidity], 'rgba(102, 16, 242, 0.8)', 'rgba(102, 16, 242, 0.2)');
    updateChart('tempChart', 'Temperature', [25, data.temperature], 'rgba(255, 159, 64, 0.8)', 'rgba(255, 159, 64, 0.2)');
    updateChart('levelChart', 'Tank Level (%)', [65, data.level], 'rgba(0, 128, 128, 0.8)', 'rgba(0, 128, 128, 0.2)');
}

function updateChart(canvasId, label, dataPoints, borderColor, fillColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy previous chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    // Create new chart
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1h ago', 'Now'],
            datasets: [{
                label: label,
                data: dataPoints,
                borderColor: borderColor,
                backgroundColor: fillColor,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: borderColor
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

    
    
}

// Initialize with safe data
renderData(safeData);   