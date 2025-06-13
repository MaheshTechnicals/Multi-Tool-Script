// Speed Calculator JavaScript

// Unit conversion factors
const distanceUnits = {
    km: { name: 'Kilometers', toMeters: 1000 },
    mi: { name: 'Miles', toMeters: 1609.344 },
    m: { name: 'Meters', toMeters: 1 },
    ft: { name: 'Feet', toMeters: 0.3048 }
};

const timeUnits = {
    h: { name: 'Hours', toSeconds: 3600 },
    min: { name: 'Minutes', toSeconds: 60 },
    s: { name: 'Seconds', toSeconds: 1 }
};

const speedUnits = {
    kmh: { name: 'km/h', toMeterPerSecond: 1/3.6 },
    mph: { name: 'mph', toMeterPerSecond: 0.44704 },
    ms: { name: 'm/s', toMeterPerSecond: 1 },
    fts: { name: 'ft/s', toMeterPerSecond: 0.3048 }
};

// DOM elements
let currentCalculation = 'speed';
let speedResults;

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateSpeedDisplay();
});

function initializeElements() {
    speedResults = document.getElementById('speedResults');
}

function initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const calculation = this.getAttribute('data-calculate');
            switchCalculation(calculation);
        });
    });

    // Button events
    document.getElementById('calculateBtn').addEventListener('click', performCalculation);
    document.getElementById('clearBtn').addEventListener('click', clearAllInputs);
    document.getElementById('copyBtn').addEventListener('click', copyResult);

    // Input events for real-time calculation
    addInputListeners();
}

function addInputListeners() {
    // Speed calculation inputs
    document.getElementById('speedDistance').addEventListener('input', performCalculation);
    document.getElementById('speedDistanceUnit').addEventListener('change', performCalculation);
    document.getElementById('speedTime').addEventListener('input', performCalculation);
    document.getElementById('speedTimeUnit').addEventListener('change', performCalculation);

    // Distance calculation inputs
    document.getElementById('distanceSpeed').addEventListener('input', performCalculation);
    document.getElementById('distanceSpeedUnit').addEventListener('change', performCalculation);
    document.getElementById('distanceTime').addEventListener('input', performCalculation);
    document.getElementById('distanceTimeUnit').addEventListener('change', performCalculation);

    // Time calculation inputs
    document.getElementById('timeDistance').addEventListener('input', performCalculation);
    document.getElementById('timeDistanceUnit').addEventListener('change', performCalculation);
    document.getElementById('timeSpeed').addEventListener('input', performCalculation);
    document.getElementById('timeSpeedUnit').addEventListener('change', performCalculation);
}

function switchCalculation(calculation) {
    currentCalculation = calculation;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-calculate') === calculation) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(calculation + 'Tab').classList.add('active');
    
    updateSpeedDisplay();
}

function performCalculation() {
    let result = null;
    
    if (currentCalculation === 'speed') {
        result = calculateSpeed();
    } else if (currentCalculation === 'distance') {
        result = calculateDistance();
    } else if (currentCalculation === 'time') {
        result = calculateTime();
    }
    
    updateSpeedDisplay(result);
}

function calculateSpeed() {
    const distance = parseFloat(document.getElementById('speedDistance').value);
    const distanceUnit = document.getElementById('speedDistanceUnit').value;
    const time = parseFloat(document.getElementById('speedTime').value);
    const timeUnit = document.getElementById('speedTimeUnit').value;
    
    if (isNaN(distance) || isNaN(time) || time === 0) {
        return null;
    }
    
    // Convert to base units (meters and seconds)
    const distanceInMeters = distance * distanceUnits[distanceUnit].toMeters;
    const timeInSeconds = time * timeUnits[timeUnit].toSeconds;
    
    // Calculate speed in m/s
    const speedMeterPerSecond = distanceInMeters / timeInSeconds;
    
    // Convert to different units
    const speeds = {};
    Object.keys(speedUnits).forEach(unit => {
        speeds[unit] = speedMeterPerSecond / speedUnits[unit].toMeterPerSecond;
    });
    
    return {
        type: 'speed',
        input: {
            distance: distance,
            distanceUnit: distanceUnits[distanceUnit].name,
            time: time,
            timeUnit: timeUnits[timeUnit].name
        },
        result: speeds,
        formula: `Speed = ${distance} ${distanceUnits[distanceUnit].name} ÷ ${time} ${timeUnits[timeUnit].name}`
    };
}

function calculateDistance() {
    const speed = parseFloat(document.getElementById('distanceSpeed').value);
    const speedUnit = document.getElementById('distanceSpeedUnit').value;
    const time = parseFloat(document.getElementById('distanceTime').value);
    const timeUnit = document.getElementById('distanceTimeUnit').value;
    
    if (isNaN(speed) || isNaN(time)) {
        return null;
    }
    
    // Convert to base units
    const speedMeterPerSecond = speed * speedUnits[speedUnit].toMeterPerSecond;
    const timeInSeconds = time * timeUnits[timeUnit].toSeconds;
    
    // Calculate distance in meters
    const distanceInMeters = speedMeterPerSecond * timeInSeconds;
    
    // Convert to different units
    const distances = {};
    Object.keys(distanceUnits).forEach(unit => {
        distances[unit] = distanceInMeters / distanceUnits[unit].toMeters;
    });
    
    return {
        type: 'distance',
        input: {
            speed: speed,
            speedUnit: speedUnits[speedUnit].name,
            time: time,
            timeUnit: timeUnits[timeUnit].name
        },
        result: distances,
        formula: `Distance = ${speed} ${speedUnits[speedUnit].name} × ${time} ${timeUnits[timeUnit].name}`
    };
}

function calculateTime() {
    const distance = parseFloat(document.getElementById('timeDistance').value);
    const distanceUnit = document.getElementById('timeDistanceUnit').value;
    const speed = parseFloat(document.getElementById('timeSpeed').value);
    const speedUnit = document.getElementById('timeSpeedUnit').value;
    
    if (isNaN(distance) || isNaN(speed) || speed === 0) {
        return null;
    }
    
    // Convert to base units
    const distanceInMeters = distance * distanceUnits[distanceUnit].toMeters;
    const speedMeterPerSecond = speed * speedUnits[speedUnit].toMeterPerSecond;
    
    // Calculate time in seconds
    const timeInSeconds = distanceInMeters / speedMeterPerSecond;
    
    // Convert to different units
    const times = {};
    Object.keys(timeUnits).forEach(unit => {
        times[unit] = timeInSeconds / timeUnits[unit].toSeconds;
    });
    
    return {
        type: 'time',
        input: {
            distance: distance,
            distanceUnit: distanceUnits[distanceUnit].name,
            speed: speed,
            speedUnit: speedUnits[speedUnit].name
        },
        result: times,
        formula: `Time = ${distance} ${distanceUnits[distanceUnit].name} ÷ ${speed} ${speedUnits[speedUnit].name}`
    };
}

function updateSpeedDisplay(data = null) {
    if (!data) {
        speedResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-tachometer-alt"></i>
                <p>Enter values to calculate ${currentCalculation}</p>
            </div>
        `;
        return;
    }
    
    let content = '';
    
    if (data.type === 'speed') {
        content = `
            <div class="calculation-summary">
                <h4><i class="fas fa-tachometer-alt"></i> Speed Calculation Result</h4>
                <div class="formula-display">${data.formula}</div>
                <div class="main-result">
                    <div class="result-grid">
                        <div class="result-item primary">
                            <span class="result-label">km/h</span>
                            <span class="result-value">${formatNumber(data.result.kmh)}</span>
                        </div>
                        <div class="result-item primary">
                            <span class="result-label">mph</span>
                            <span class="result-value">${formatNumber(data.result.mph)}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">m/s</span>
                            <span class="result-value">${formatNumber(data.result.ms)}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">ft/s</span>
                            <span class="result-value">${formatNumber(data.result.fts)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (data.type === 'distance') {
        content = `
            <div class="calculation-summary">
                <h4><i class="fas fa-route"></i> Distance Calculation Result</h4>
                <div class="formula-display">${data.formula}</div>
                <div class="main-result">
                    <div class="result-grid">
                        <div class="result-item primary">
                            <span class="result-label">Kilometers</span>
                            <span class="result-value">${formatNumber(data.result.km)}</span>
                        </div>
                        <div class="result-item primary">
                            <span class="result-label">Miles</span>
                            <span class="result-value">${formatNumber(data.result.mi)}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Meters</span>
                            <span class="result-value">${formatNumber(data.result.m)}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Feet</span>
                            <span class="result-value">${formatNumber(data.result.ft)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (data.type === 'time') {
        content = `
            <div class="calculation-summary">
                <h4><i class="fas fa-clock"></i> Time Calculation Result</h4>
                <div class="formula-display">${data.formula}</div>
                <div class="main-result">
                    <div class="result-grid">
                        <div class="result-item primary">
                            <span class="result-label">Hours</span>
                            <span class="result-value">${formatNumber(data.result.h)}</span>
                        </div>
                        <div class="result-item primary">
                            <span class="result-label">Minutes</span>
                            <span class="result-value">${formatNumber(data.result.min)}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Seconds</span>
                            <span class="result-value">${formatNumber(data.result.s)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    speedResults.innerHTML = content;
}

function formatNumber(num) {
    if (Math.abs(num) >= 1000000) {
        return num.toExponential(4);
    } else if (Math.abs(num) < 0.001 && num !== 0) {
        return num.toExponential(4);
    } else {
        return parseFloat(num.toFixed(6)).toString();
    }
}

function clearAllInputs() {
    // Clear all input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    updateSpeedDisplay();
}

function copyResult() {
    const resultItems = document.querySelectorAll('.result-item.primary');
    if (resultItems.length > 0) {
        let copyText = '';
        resultItems.forEach(item => {
            const label = item.querySelector('.result-label').textContent;
            const value = item.querySelector('.result-value').textContent;
            copyText += `${label}: ${value}\n`;
        });
        
        navigator.clipboard.writeText(copyText.trim()).then(() => {
            // Show feedback
            const originalText = document.getElementById('copyBtn').innerHTML;
            document.getElementById('copyBtn').innerHTML = '<i class="fas fa-check"></i> Copied!';
            document.getElementById('copyBtn').style.background = '#00d4aa';
            
            setTimeout(() => {
                document.getElementById('copyBtn').innerHTML = originalText;
                document.getElementById('copyBtn').style.background = '';
            }, 2000);
        });
    }
}
