// Temperature Converter JavaScript

// Temperature scale data
const temperatureScales = {
    celsius: {
        name: 'Celsius',
        symbol: '°C',
        toKelvin: (temp) => temp + 273.15,
        fromKelvin: (temp) => temp - 273.15
    },
    fahrenheit: {
        name: 'Fahrenheit',
        symbol: '°F',
        toKelvin: (temp) => (temp - 32) * 5/9 + 273.15,
        fromKelvin: (temp) => (temp - 273.15) * 9/5 + 32
    },
    kelvin: {
        name: 'Kelvin',
        symbol: 'K',
        toKelvin: (temp) => temp,
        fromKelvin: (temp) => temp
    },
    rankine: {
        name: 'Rankine',
        symbol: '°R',
        toKelvin: (temp) => temp * 5/9,
        fromKelvin: (temp) => temp * 9/5
    },
    reaumur: {
        name: 'Réaumur',
        symbol: '°Ré',
        toKelvin: (temp) => temp * 5/4 + 273.15,
        fromKelvin: (temp) => (temp - 273.15) * 4/5
    }
};

// DOM elements
let tempValueInput, resultValueInput, fromScaleSelect, toScaleSelect;
let convertBtn, clearBtn, copyBtn, swapBtn;
let temperatureResults;

// Initialize the converter
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateTemperatureDisplay();
});

function initializeElements() {
    tempValueInput = document.getElementById('tempValue');
    resultValueInput = document.getElementById('resultValue');
    fromScaleSelect = document.getElementById('fromScale');
    toScaleSelect = document.getElementById('toScale');
    convertBtn = document.getElementById('convertTemp');
    clearBtn = document.getElementById('clearTemp');
    copyBtn = document.getElementById('copyTemp');
    swapBtn = document.getElementById('swapScales');
    temperatureResults = document.getElementById('temperatureResults');
}

function initializeEventListeners() {
    // Input events
    tempValueInput.addEventListener('input', performConversion);
    fromScaleSelect.addEventListener('change', performConversion);
    toScaleSelect.addEventListener('change', performConversion);

    // Button events
    convertBtn.addEventListener('click', performConversion);
    clearBtn.addEventListener('click', clearInputs);
    copyBtn.addEventListener('click', copyResult);
    swapBtn.addEventListener('click', swapScales);

    // Quick conversion buttons
    document.querySelectorAll('.quick-temp-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const temp = parseFloat(this.getAttribute('data-temp'));
            const scale = this.getAttribute('data-scale');
            
            tempValueInput.value = temp;
            fromScaleSelect.value = scale;
            performConversion();
        });
    });
}

function performConversion() {
    const tempValue = parseFloat(tempValueInput.value);
    
    if (isNaN(tempValue) || tempValueInput.value === '') {
        resultValueInput.value = '';
        updateTemperatureDisplay();
        return;
    }
    
    const fromScale = fromScaleSelect.value;
    const toScale = toScaleSelect.value;
    
    if (!fromScale || !toScale) return;
    
    // Convert to Kelvin first, then to target scale
    const kelvinValue = temperatureScales[fromScale].toKelvin(tempValue);
    const convertedValue = temperatureScales[toScale].fromKelvin(kelvinValue);
    
    // Format the result
    resultValueInput.value = formatTemperature(convertedValue);
    
    updateTemperatureDisplay(tempValue, fromScale, convertedValue, toScale, kelvinValue);
}

function formatTemperature(temp) {
    if (Math.abs(temp) >= 1000000) {
        return temp.toExponential(4);
    } else if (Math.abs(temp) < 0.01 && temp !== 0) {
        return temp.toExponential(4);
    } else {
        return parseFloat(temp.toFixed(4)).toString();
    }
}

function updateTemperatureDisplay(inputTemp = null, inputScale = null, outputTemp = null, outputScale = null, kelvinTemp = null) {
    if (!inputTemp && inputTemp !== 0) {
        temperatureResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-thermometer-half"></i>
                <p>Enter a temperature value to see conversions across all scales</p>
            </div>
        `;
        return;
    }
    
    // Calculate all conversions
    const allConversions = {};
    Object.keys(temperatureScales).forEach(scale => {
        if (scale !== inputScale) {
            allConversions[scale] = temperatureScales[scale].fromKelvin(kelvinTemp);
        }
    });
    
    const inputScaleData = temperatureScales[inputScale];
    const outputScaleData = temperatureScales[outputScale];
    
    temperatureResults.innerHTML = `
        <div class="conversion-summary">
            <div class="conversion-header">
                <h4><i class="fas fa-thermometer-half"></i> Temperature Conversion</h4>
            </div>
            <div class="main-conversion">
                <div class="temp-from">
                    <span class="temp-value">${formatTemperature(inputTemp)}</span>
                    <span class="temp-scale">${inputScaleData.symbol}</span>
                </div>
                <div class="conversion-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="temp-to">
                    <span class="temp-value">${formatTemperature(outputTemp)}</span>
                    <span class="temp-scale">${outputScaleData.symbol}</span>
                </div>
            </div>
        </div>
        
        <div class="all-conversions">
            <h4><i class="fas fa-list"></i> All Temperature Scales</h4>
            <div class="temp-scale-grid">
                ${Object.keys(temperatureScales).map(scale => {
                    const scaleData = temperatureScales[scale];
                    const value = scale === inputScale ? inputTemp : allConversions[scale];
                    const isActive = scale === inputScale || scale === outputScale;
                    
                    return `
                        <div class="temp-scale-item ${isActive ? 'active' : ''}">
                            <div class="scale-name">${scaleData.name}</div>
                            <div class="scale-value">${formatTemperature(value)} ${scaleData.symbol}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="conversion-details">
            <h4><i class="fas fa-info-circle"></i> Conversion Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">From Scale:</span>
                    <span class="detail-value">${inputScaleData.name} (${inputScaleData.symbol})</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">To Scale:</span>
                    <span class="detail-value">${outputScaleData.name} (${outputScaleData.symbol})</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Kelvin Equivalent:</span>
                    <span class="detail-value">${formatTemperature(kelvinTemp)} K</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Precision:</span>
                    <span class="detail-value">Up to 4 decimal places</span>
                </div>
            </div>
        </div>
        
        <div class="temperature-context">
            <h4><i class="fas fa-thermometer-quarter"></i> Temperature Context</h4>
            <div class="context-info">
                ${getTemperatureContext(kelvinTemp)}
            </div>
        </div>
    `;
}

function getTemperatureContext(kelvinTemp) {
    const contexts = [
        { temp: 0, desc: "Absolute zero - theoretical lowest possible temperature" },
        { temp: 273.15, desc: "Water freezing point at standard pressure" },
        { temp: 293.15, desc: "Room temperature (20°C)" },
        { temp: 310.15, desc: "Human body temperature (37°C)" },
        { temp: 373.15, desc: "Water boiling point at standard pressure" },
        { temp: 773.15, desc: "Paper ignition temperature (~500°C)" },
        { temp: 1273.15, desc: "Lava temperature (~1000°C)" },
        { temp: 1811, desc: "Iron melting point" },
        { temp: 5778, desc: "Sun's surface temperature" }
    ];
    
    // Find the closest reference points
    const lower = contexts.filter(c => c.temp <= kelvinTemp).pop();
    const upper = contexts.find(c => c.temp > kelvinTemp);
    
    if (!lower && !upper) {
        return "<p>Temperature is outside common reference ranges.</p>";
    } else if (!lower) {
        return `<p>This temperature is below ${upper.desc}.</p>`;
    } else if (!upper) {
        return `<p>This temperature is above ${lower.desc}.</p>`;
    } else if (Math.abs(kelvinTemp - lower.temp) < Math.abs(kelvinTemp - upper.temp)) {
        return `<p>This temperature is close to ${lower.desc}.</p>`;
    } else {
        return `<p>This temperature is between ${lower.desc} and ${upper.desc}.</p>`;
    }
}

function clearInputs() {
    tempValueInput.value = '';
    resultValueInput.value = '';
    updateTemperatureDisplay();
}

function copyResult() {
    if (resultValueInput.value) {
        const fromScale = temperatureScales[fromScaleSelect.value];
        const toScale = temperatureScales[toScaleSelect.value];
        const copyText = `${tempValueInput.value}${fromScale.symbol} = ${resultValueInput.value}${toScale.symbol}`;
        
        navigator.clipboard.writeText(copyText).then(() => {
            // Show feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#00d4aa';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    }
}

function swapScales() {
    const fromScale = fromScaleSelect.value;
    const toScale = toScaleSelect.value;
    const fromValue = tempValueInput.value;
    const toValue = resultValueInput.value;
    
    // Swap scale selections
    fromScaleSelect.value = toScale;
    toScaleSelect.value = fromScale;
    
    // Swap values
    tempValueInput.value = toValue;
    resultValueInput.value = fromValue;
    
    // Perform conversion with new values
    performConversion();
}
