// Unit Converter JavaScript

// Unit conversion data
const unitData = {
    length: {
        name: 'Length',
        units: {
            mm: { name: 'Millimeters', factor: 0.001 },
            cm: { name: 'Centimeters', factor: 0.01 },
            m: { name: 'Meters', factor: 1 },
            km: { name: 'Kilometers', factor: 1000 },
            in: { name: 'Inches', factor: 0.0254 },
            ft: { name: 'Feet', factor: 0.3048 },
            yd: { name: 'Yards', factor: 0.9144 },
            mi: { name: 'Miles', factor: 1609.344 },
            nm: { name: 'Nautical Miles', factor: 1852 }
        }
    },
    weight: {
        name: 'Weight',
        units: {
            mg: { name: 'Milligrams', factor: 0.000001 },
            g: { name: 'Grams', factor: 0.001 },
            kg: { name: 'Kilograms', factor: 1 },
            t: { name: 'Metric Tons', factor: 1000 },
            oz: { name: 'Ounces', factor: 0.0283495 },
            lb: { name: 'Pounds', factor: 0.453592 },
            st: { name: 'Stones', factor: 6.35029 },
            ton: { name: 'Tons (US)', factor: 907.185 }
        }
    },
    volume: {
        name: 'Volume',
        units: {
            ml: { name: 'Milliliters', factor: 0.001 },
            l: { name: 'Liters', factor: 1 },
            m3: { name: 'Cubic Meters', factor: 1000 },
            tsp: { name: 'Teaspoons', factor: 0.00492892 },
            tbsp: { name: 'Tablespoons', factor: 0.0147868 },
            floz: { name: 'Fluid Ounces', factor: 0.0295735 },
            cup: { name: 'Cups', factor: 0.236588 },
            pt: { name: 'Pints', factor: 0.473176 },
            qt: { name: 'Quarts', factor: 0.946353 },
            gal: { name: 'Gallons', factor: 3.78541 }
        }
    },
    area: {
        name: 'Area',
        units: {
            mm2: { name: 'Square Millimeters', factor: 0.000001 },
            cm2: { name: 'Square Centimeters', factor: 0.0001 },
            m2: { name: 'Square Meters', factor: 1 },
            km2: { name: 'Square Kilometers', factor: 1000000 },
            in2: { name: 'Square Inches', factor: 0.00064516 },
            ft2: { name: 'Square Feet', factor: 0.092903 },
            yd2: { name: 'Square Yards', factor: 0.836127 },
            ac: { name: 'Acres', factor: 4046.86 },
            ha: { name: 'Hectares', factor: 10000 }
        }
    }
};

// DOM elements
let currentCategory = 'length';
let fromValueInput, toValueInput, fromUnitSelect, toUnitSelect;
let convertBtn, clearBtn, copyBtn, swapBtn;
let conversionResults;

// Initialize the converter
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    populateUnitSelects();
    updateConversionDisplay();
});

function initializeElements() {
    fromValueInput = document.getElementById('fromValue');
    toValueInput = document.getElementById('toValue');
    fromUnitSelect = document.getElementById('fromUnit');
    toUnitSelect = document.getElementById('toUnit');
    convertBtn = document.getElementById('convertBtn');
    clearBtn = document.getElementById('clearBtn');
    copyBtn = document.getElementById('copyBtn');
    swapBtn = document.getElementById('swapUnits');
    conversionResults = document.getElementById('conversionResults');
}

function initializeEventListeners() {
    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            populateUnitSelects();
            clearInputs();
        });
    });

    // Input events
    fromValueInput.addEventListener('input', performConversion);
    fromUnitSelect.addEventListener('change', performConversion);
    toUnitSelect.addEventListener('change', performConversion);

    // Button events
    convertBtn.addEventListener('click', performConversion);
    clearBtn.addEventListener('click', clearInputs);
    copyBtn.addEventListener('click', copyResult);
    swapBtn.addEventListener('click', swapUnits);
}

function populateUnitSelects() {
    const units = unitData[currentCategory].units;
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Populate options
    Object.keys(units).forEach(unitKey => {
        const unit = units[unitKey];
        
        const fromOption = document.createElement('option');
        fromOption.value = unitKey;
        fromOption.textContent = unit.name;
        fromUnitSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unitKey;
        toOption.textContent = unit.name;
        toUnitSelect.appendChild(toOption);
    });
    
    // Set default selections
    const unitKeys = Object.keys(units);
    if (unitKeys.length > 1) {
        fromUnitSelect.value = unitKeys[0];
        toUnitSelect.value = unitKeys[1];
    }
}

function performConversion() {
    const fromValue = parseFloat(fromValueInput.value);
    
    if (isNaN(fromValue) || fromValue === '') {
        toValueInput.value = '';
        updateConversionDisplay();
        return;
    }
    
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    if (!fromUnit || !toUnit) return;
    
    // Convert to base unit first, then to target unit
    const fromFactor = unitData[currentCategory].units[fromUnit].factor;
    const toFactor = unitData[currentCategory].units[toUnit].factor;
    
    const baseValue = fromValue * fromFactor;
    const convertedValue = baseValue / toFactor;
    
    // Format the result
    toValueInput.value = formatNumber(convertedValue);
    
    updateConversionDisplay(fromValue, fromUnit, convertedValue, toUnit);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1000000) {
        return num.toExponential(6);
    } else if (Math.abs(num) < 0.001 && num !== 0) {
        return num.toExponential(6);
    } else {
        return parseFloat(num.toFixed(10)).toString();
    }
}

function updateConversionDisplay(fromValue = null, fromUnit = null, toValue = null, toUnit = null) {
    if (!fromValue || !toValue) {
        conversionResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-ruler"></i>
                <p>Enter a value and select units to see conversion results</p>
            </div>
        `;
        return;
    }
    
    const fromUnitName = unitData[currentCategory].units[fromUnit].name;
    const toUnitName = unitData[currentCategory].units[toUnit].name;
    
    conversionResults.innerHTML = `
        <div class="conversion-summary">
            <div class="conversion-header">
                <h4><i class="fas fa-exchange-alt"></i> Conversion Result</h4>
            </div>
            <div class="conversion-display">
                <div class="conversion-from">
                    <span class="value">${formatNumber(fromValue)}</span>
                    <span class="unit">${fromUnitName}</span>
                </div>
                <div class="conversion-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="conversion-to">
                    <span class="value">${formatNumber(toValue)}</span>
                    <span class="unit">${toUnitName}</span>
                </div>
            </div>
        </div>
        
        <div class="conversion-details">
            <h4><i class="fas fa-info-circle"></i> Conversion Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${unitData[currentCategory].name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Formula:</span>
                    <span class="detail-value">1 ${fromUnitName} = ${formatNumber(unitData[currentCategory].units[fromUnit].factor / unitData[currentCategory].units[toUnit].factor)} ${toUnitName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Precision:</span>
                    <span class="detail-value">Up to 10 decimal places</span>
                </div>
            </div>
        </div>
    `;
}

function clearInputs() {
    fromValueInput.value = '';
    toValueInput.value = '';
    updateConversionDisplay();
}

function copyResult() {
    if (toValueInput.value) {
        navigator.clipboard.writeText(toValueInput.value).then(() => {
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

function swapUnits() {
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const fromValue = fromValueInput.value;
    const toValue = toValueInput.value;
    
    // Swap unit selections
    fromUnitSelect.value = toUnit;
    toUnitSelect.value = fromUnit;
    
    // Swap values
    fromValueInput.value = toValue;
    toValueInput.value = fromValue;
    
    // Perform conversion with new values
    performConversion();
}
