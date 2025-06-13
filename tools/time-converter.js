// Time Converter JavaScript

// Time zone data (simplified for demo)
const timeZones = {
    'UTC': { name: 'UTC (Coordinated Universal Time)', offset: 0 },
    'GMT': { name: 'GMT (Greenwich Mean Time)', offset: 0 },
    'EST': { name: 'EST (Eastern Standard Time)', offset: -5 },
    'CST': { name: 'CST (Central Standard Time)', offset: -6 },
    'MST': { name: 'MST (Mountain Standard Time)', offset: -7 },
    'PST': { name: 'PST (Pacific Standard Time)', offset: -8 },
    'CET': { name: 'CET (Central European Time)', offset: 1 },
    'JST': { name: 'JST (Japan Standard Time)', offset: 9 },
    'AEST': { name: 'AEST (Australian Eastern Standard Time)', offset: 10 },
    'IST': { name: 'IST (India Standard Time)', offset: 5.5 }
};

// Time unit conversion factors (to seconds)
const timeUnits = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2629746, // Average month
    years: 31556952  // Average year
};

// DOM elements
let currentMode = 'format';
let timeResults;

// Initialize the converter
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    populateTimeZones();
    updateTimeDisplay();
});

function initializeElements() {
    timeResults = document.getElementById('timeResults');
}

function initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            switchMode(mode);
        });
    });

    // Format conversion
    document.getElementById('convertFormat').addEventListener('click', convertTimeFormat);
    document.getElementById('useManual').addEventListener('click', toggleManualEntry);
    document.getElementById('currentTime').addEventListener('click', setCurrentTime);
    document.getElementById('timeInput').addEventListener('change', convertTimeFormat);
    document.getElementById('manualTime').addEventListener('input', convertManualTime);

    // Time zone conversion
    document.getElementById('convertTimezone').addEventListener('click', convertTimeZone);
    document.getElementById('detectTimezone').addEventListener('click', detectUserTimezone);
    document.getElementById('sourceTime').addEventListener('change', convertTimeZone);
    document.getElementById('sourceTimezone').addEventListener('change', convertTimeZone);
    document.getElementById('targetTimezone').addEventListener('change', convertTimeZone);

    // Time units conversion
    document.getElementById('convertUnits').addEventListener('click', convertTimeUnits);
    document.getElementById('clearUnits').addEventListener('click', clearTimeUnits);
    document.getElementById('timeValue').addEventListener('input', convertTimeUnits);
    document.getElementById('fromTimeUnit').addEventListener('change', convertTimeUnits);
    document.getElementById('toTimeUnit').addEventListener('change', convertTimeUnits);
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(mode + 'Tab').classList.add('active');
    
    updateTimeDisplay();
}

function populateTimeZones() {
    const sourceSelect = document.getElementById('sourceTimezone');
    const targetSelect = document.getElementById('targetTimezone');
    
    Object.keys(timeZones).forEach(tz => {
        const option1 = document.createElement('option');
        option1.value = tz;
        option1.textContent = timeZones[tz].name;
        sourceSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = tz;
        option2.textContent = timeZones[tz].name;
        targetSelect.appendChild(option2);
    });
    
    // Set defaults
    sourceSelect.value = 'UTC';
    targetSelect.value = 'EST';
}

function convertTimeFormat() {
    const timeInput = document.getElementById('timeInput');
    const formatType = document.getElementById('formatType');
    
    if (!timeInput.value) {
        updateTimeDisplay();
        return;
    }
    
    const time = timeInput.value;
    const [hours, minutes] = time.split(':').map(Number);
    
    const format12h = convertTo12Hour(hours, minutes);
    const format24h = convertTo24Hour(hours, minutes);
    
    updateTimeDisplay({
        type: 'format',
        input: time,
        inputFormat: formatType.value,
        format12h: format12h,
        format24h: format24h,
        hours: hours,
        minutes: minutes
    });
}

function convertTo12Hour(hours, minutes) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function convertTo24Hour(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function toggleManualEntry() {
    const manualInput = document.querySelector('.manual-input');
    const timeInput = document.getElementById('timeInput');
    
    if (manualInput.style.display === 'none') {
        manualInput.style.display = 'block';
        timeInput.style.display = 'none';
    } else {
        manualInput.style.display = 'none';
        timeInput.style.display = 'block';
    }
}

function convertManualTime() {
    const manualTime = document.getElementById('manualTime').value;
    if (!manualTime) {
        updateTimeDisplay();
        return;
    }
    
    const parsed = parseTimeString(manualTime);
    if (parsed) {
        const format12h = convertTo12Hour(parsed.hours, parsed.minutes);
        const format24h = convertTo24Hour(parsed.hours, parsed.minutes);
        
        updateTimeDisplay({
            type: 'format',
            input: manualTime,
            inputFormat: 'manual',
            format12h: format12h,
            format24h: format24h,
            hours: parsed.hours,
            minutes: parsed.minutes
        });
    }
}

function parseTimeString(timeStr) {
    // Parse various time formats
    const patterns = [
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
        /^(\d{1,2}):(\d{2})$/,
        /^(\d{1,2})(\d{2})$/
    ];
    
    for (let pattern of patterns) {
        const match = timeStr.trim().match(pattern);
        if (match) {
            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const period = match[3];
            
            if (period) {
                if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
                if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
            }
            
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                return { hours, minutes };
            }
        }
    }
    return null;
}

function setCurrentTime() {
    const now = new Date();
    const timeInput = document.getElementById('timeInput');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    timeInput.value = `${hours}:${minutes}`;
    convertTimeFormat();
}

function convertTimeZone() {
    const sourceTime = document.getElementById('sourceTime').value;
    const sourceTimezone = document.getElementById('sourceTimezone').value;
    const targetTimezone = document.getElementById('targetTimezone').value;
    
    if (!sourceTime || !sourceTimezone || !targetTimezone) {
        updateTimeDisplay();
        return;
    }
    
    const [hours, minutes] = sourceTime.split(':').map(Number);
    const sourceOffset = timeZones[sourceTimezone].offset;
    const targetOffset = timeZones[targetTimezone].offset;
    
    // Convert to UTC first, then to target timezone
    const utcHours = hours - sourceOffset;
    const targetHours = utcHours + targetOffset;
    
    // Handle day overflow/underflow
    let finalHours = targetHours;
    let dayDiff = 0;
    
    if (finalHours >= 24) {
        dayDiff = Math.floor(finalHours / 24);
        finalHours = finalHours % 24;
    } else if (finalHours < 0) {
        dayDiff = Math.ceil(finalHours / 24) - 1;
        finalHours = 24 + (finalHours % 24);
    }
    
    const targetTime = `${finalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    updateTimeDisplay({
        type: 'timezone',
        sourceTime: sourceTime,
        targetTime: targetTime,
        sourceTimezone: timeZones[sourceTimezone].name,
        targetTimezone: timeZones[targetTimezone].name,
        dayDiff: dayDiff
    });
}

function detectUserTimezone() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sourceSelect = document.getElementById('sourceTimezone');
    
    // Try to match with our simplified timezone list
    // This is a basic implementation - in a real app you'd have a more comprehensive mapping
    const offset = new Date().getTimezoneOffset() / -60;
    
    for (let tz in timeZones) {
        if (Math.abs(timeZones[tz].offset - offset) < 0.5) {
            sourceSelect.value = tz;
            break;
        }
    }
    
    convertTimeZone();
}

function convertTimeUnits() {
    const timeValue = parseFloat(document.getElementById('timeValue').value);
    const fromUnit = document.getElementById('fromTimeUnit').value;
    const toUnit = document.getElementById('toTimeUnit').value;
    
    if (isNaN(timeValue) || !fromUnit || !toUnit) {
        updateTimeDisplay();
        return;
    }
    
    // Convert to seconds first, then to target unit
    const seconds = timeValue * timeUnits[fromUnit];
    const result = seconds / timeUnits[toUnit];
    
    updateTimeDisplay({
        type: 'units',
        inputValue: timeValue,
        inputUnit: fromUnit,
        outputValue: result,
        outputUnit: toUnit
    });
}

function clearTimeUnits() {
    document.getElementById('timeValue').value = '';
    updateTimeDisplay();
}

function updateTimeDisplay(data = null) {
    if (!data) {
        timeResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-clock"></i>
                <p>Select a conversion type and enter time values to see results</p>
            </div>
        `;
        return;
    }
    
    let content = '';
    
    if (data.type === 'format') {
        content = `
            <div class="format-results">
                <h4><i class="fas fa-clock"></i> Time Format Conversion</h4>
                <div class="format-display">
                    <div class="format-item">
                        <span class="format-label">12-Hour Format:</span>
                        <span class="format-value">${data.format12h}</span>
                    </div>
                    <div class="format-item">
                        <span class="format-label">24-Hour Format:</span>
                        <span class="format-value">${data.format24h}</span>
                    </div>
                    <div class="format-item">
                        <span class="format-label">Military Time:</span>
                        <span class="format-value">${data.format24h.replace(':', '')} hours</span>
                    </div>
                </div>
            </div>
        `;
    } else if (data.type === 'timezone') {
        const dayText = data.dayDiff === 0 ? 'Same day' : 
                       data.dayDiff === 1 ? 'Next day' : 
                       data.dayDiff === -1 ? 'Previous day' : 
                       `${Math.abs(data.dayDiff)} days ${data.dayDiff > 0 ? 'later' : 'earlier'}`;
        
        content = `
            <div class="timezone-results">
                <h4><i class="fas fa-globe"></i> Time Zone Conversion</h4>
                <div class="timezone-display">
                    <div class="timezone-item">
                        <span class="timezone-label">Source:</span>
                        <span class="timezone-value">${data.sourceTime} (${data.sourceTimezone})</span>
                    </div>
                    <div class="timezone-item">
                        <span class="timezone-label">Target:</span>
                        <span class="timezone-value">${data.targetTime} (${data.targetTimezone})</span>
                    </div>
                    <div class="timezone-item">
                        <span class="timezone-label">Day Difference:</span>
                        <span class="timezone-value">${dayText}</span>
                    </div>
                </div>
            </div>
        `;
    } else if (data.type === 'units') {
        content = `
            <div class="units-results">
                <h4><i class="fas fa-stopwatch"></i> Time Units Conversion</h4>
                <div class="units-display">
                    <div class="units-conversion">
                        <span class="units-from">${data.inputValue} ${data.inputUnit}</span>
                        <span class="units-arrow">→</span>
                        <span class="units-to">${formatNumber(data.outputValue)} ${data.outputUnit}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    timeResults.innerHTML = content;
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
