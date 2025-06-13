// Age Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAgeCalculator();
});

function initializeAgeCalculator() {
    const birthDateInput = document.getElementById('birthDate');
    const birthTimeInput = document.getElementById('birthTime');
    const includeTimeCheckbox = document.getElementById('includeTime');
    const timeInputGroup = document.querySelector('.time-input-group');
    const calculateBtn = document.getElementById('calculateAgeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('ageResults');

    // Toggle time input visibility
    includeTimeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            timeInputGroup.style.display = 'block';
        } else {
            timeInputGroup.style.display = 'none';
            birthTimeInput.value = '';
        }
    });

    // Calculate age on button click
    calculateBtn.addEventListener('click', calculateAge);

    // Clear inputs
    clearBtn.addEventListener('click', function() {
        birthDateInput.value = '';
        birthTimeInput.value = '';
        includeTimeCheckbox.checked = false;
        timeInputGroup.style.display = 'none';
        showNoContent();
    });

    // Auto-calculate on date change
    birthDateInput.addEventListener('change', function() {
        if (this.value) {
            calculateAge();
        }
    });

    function calculateAge() {
        const birthDate = birthDateInput.value;
        if (!birthDate) {
            showError('Please enter your birth date');
            return;
        }

        const birthTime = includeTimeCheckbox.checked ? birthTimeInput.value : '00:00';
        const birthDateTime = new Date(birthDate + 'T' + (birthTime || '00:00'));
        const now = new Date();

        if (birthDateTime > now) {
            showError('Birth date cannot be in the future');
            return;
        }

        const ageData = calculateDetailedAge(birthDateTime, now);
        displayResults(ageData, birthDateTime);
    }

    function calculateDetailedAge(birthDate, currentDate) {
        const totalMs = currentDate - birthDate;
        
        // Calculate exact age
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total units
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(totalMs / (1000 * 60));
        const totalSeconds = Math.floor(totalMs / 1000);

        // Calculate next birthday
        const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(currentDate.getFullYear() + 1);
        }
        const daysToNextBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));

        // Get zodiac sign
        const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());

        // Get day of week born
        const dayOfWeekBorn = birthDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Calculate approximate life statistics
        const heartbeats = Math.floor(totalMinutes * 70); // Average 70 beats per minute
        const breaths = Math.floor(totalMinutes * 16); // Average 16 breaths per minute

        return {
            exact: { years, months, days },
            total: {
                days: totalDays,
                hours: totalHours,
                minutes: totalMinutes,
                seconds: totalSeconds
            },
            nextBirthday: {
                date: nextBirthday,
                daysUntil: daysToNextBirthday
            },
            zodiac: zodiacSign,
            dayOfWeekBorn,
            lifeStats: {
                heartbeats,
                breaths
            }
        };
    }

    function getZodiacSign(month, day) {
        const signs = [
            { name: 'Capricorn', start: [12, 22], end: [1, 19], symbol: '♑', element: 'Earth' },
            { name: 'Aquarius', start: [1, 20], end: [2, 18], symbol: '♒', element: 'Air' },
            { name: 'Pisces', start: [2, 19], end: [3, 20], symbol: '♓', element: 'Water' },
            { name: 'Aries', start: [3, 21], end: [4, 19], symbol: '♈', element: 'Fire' },
            { name: 'Taurus', start: [4, 20], end: [5, 20], symbol: '♉', element: 'Earth' },
            { name: 'Gemini', start: [5, 21], end: [6, 20], symbol: '♊', element: 'Air' },
            { name: 'Cancer', start: [6, 21], end: [7, 22], symbol: '♋', element: 'Water' },
            { name: 'Leo', start: [7, 23], end: [8, 22], symbol: '♌', element: 'Fire' },
            { name: 'Virgo', start: [8, 23], end: [9, 22], symbol: '♍', element: 'Earth' },
            { name: 'Libra', start: [9, 23], end: [10, 22], symbol: '♎', element: 'Air' },
            { name: 'Scorpio', start: [10, 23], end: [11, 21], symbol: '♏', element: 'Water' },
            { name: 'Sagittarius', start: [11, 22], end: [12, 21], symbol: '♐', element: 'Fire' }
        ];

        for (const sign of signs) {
            const [startMonth, startDay] = sign.start;
            const [endMonth, endDay] = sign.end;
            
            if ((month === startMonth && day >= startDay) || 
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        }
        
        return signs[0]; // Default to Capricorn
    }

    function displayResults(ageData, birthDate) {
        const resultsHTML = `
            <div class="age-summary">
                <div class="main-age">
                    <h3>You are</h3>
                    <div class="age-display">
                        <span class="age-number">${ageData.exact.years}</span>
                        <span class="age-unit">years</span>
                        <span class="age-number">${ageData.exact.months}</span>
                        <span class="age-unit">months</span>
                        <span class="age-number">${ageData.exact.days}</span>
                        <span class="age-unit">days</span>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${ageData.total.days.toLocaleString()}</div>
                        <div class="stat-label">Total Days Lived</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${ageData.total.hours.toLocaleString()}</div>
                        <div class="stat-label">Total Hours</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${(ageData.lifeStats.heartbeats / 1000000).toFixed(1)}M</div>
                        <div class="stat-label">Approximate Heartbeats</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-wind"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${(ageData.lifeStats.breaths / 1000000).toFixed(1)}M</div>
                        <div class="stat-label">Approximate Breaths</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-birthday-cake"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${ageData.nextBirthday.daysUntil}</div>
                        <div class="stat-label">Days to Next Birthday</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${ageData.zodiac.symbol}</div>
                        <div class="stat-label">${ageData.zodiac.name}</div>
                    </div>
                </div>
            </div>

            <div class="additional-info">
                <div class="info-card">
                    <h4><i class="fas fa-info-circle"></i> Birth Information</h4>
                    <div class="info-details">
                        <div class="detail-row">
                            <span class="detail-label">Born on:</span>
                            <span class="detail-value">${ageData.dayOfWeekBorn}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Zodiac Sign:</span>
                            <span class="detail-value">${ageData.zodiac.name} (${ageData.zodiac.element})</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Next Birthday:</span>
                            <span class="detail-value">${ageData.nextBirthday.date.toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    function showNoContent() {
        resultsContainer.innerHTML = `
            <div class="no-content">
                <i class="fas fa-birthday-cake"></i>
                <p>Enter your birth date to calculate your age and life statistics</p>
            </div>
        `;
    }
}

// Copy functionality for results
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy to clipboard');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
