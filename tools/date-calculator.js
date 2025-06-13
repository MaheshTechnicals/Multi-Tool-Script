// Date Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDateCalculator();
});

function initializeDateCalculator() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculateDateBtn');
    const clearBtn = document.getElementById('clearDateBtn');
    const todayBtn = document.getElementById('todayBtn');
    const resultsContainer = document.getElementById('dateResults');

    let currentTab = 'difference';

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ageAsOfDate').value = today;

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculateDate);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Today button
    todayBtn.addEventListener('click', function() {
        const activeInputs = document.querySelectorAll(`#${currentTab}-tab .date-input`);
        if (activeInputs.length > 0) {
            activeInputs[0].value = today;
            if (hasValidInputs()) {
                calculateDate();
            }
        }
    });

    // Auto-calculate on input change
    const inputs = document.querySelectorAll('.date-input, .number-input, .select-input, .checkbox-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (hasValidInputs()) {
                calculateDate();
            }
        });
        input.addEventListener('change', function() {
            if (hasValidInputs()) {
                calculateDate();
            }
        });
    });

    function switchTab(tabId) {
        currentTab = tabId;

        // Update tab buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });

        // Update tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId + '-tab') {
                content.classList.add('active');
            }
        });

        clearAll();
    }

    function hasValidInputs() {
        switch (currentTab) {
            case 'difference':
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                return startDate && endDate;

            case 'add-subtract':
                const baseDate = document.getElementById('baseDate').value;
                const daysToAddSubtract = document.getElementById('daysToAddSubtract').value;
                return baseDate && daysToAddSubtract && parseInt(daysToAddSubtract) >= 0;

            case 'business':
                const businessStartDate = document.getElementById('businessStartDate').value;
                const businessEndDate = document.getElementById('businessEndDate').value;
                return businessStartDate && businessEndDate;

            case 'age':
                const birthDate = document.getElementById('birthDate').value;
                const ageAsOfDate = document.getElementById('ageAsOfDate').value;
                return birthDate && ageAsOfDate;

            default:
                return false;
        }
    }

    function calculateDate() {
        let result;

        switch (currentTab) {
            case 'difference':
                result = calculateDateDifference();
                break;
            case 'add-subtract':
                result = calculateAddSubtract();
                break;
            case 'business':
                result = calculateBusinessDays();
                break;
            case 'age':
                result = calculateAge();
                break;
            default:
                showError('Invalid calculation type');
                return;
        }

        if (result) {
            displayResults(result);
        }
    }

    function calculateDateDifference() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const includeEndDate = document.getElementById('includeEndDate').checked;

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            showError('Please enter valid dates');
            return null;
        }

        if (startDate > endDate) {
            showError('Start date must be before end date');
            return null;
        }

        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + (includeEndDate ? 1 : 0);

        // Calculate years, months, days
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth();
        const days = endDate.getDate() - startDate.getDate();

        let adjustedYears = years;
        let adjustedMonths = months;
        let adjustedDays = days;

        if (adjustedDays < 0) {
            adjustedMonths--;
            const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            adjustedDays += lastMonth.getDate();
        }

        if (adjustedMonths < 0) {
            adjustedYears--;
            adjustedMonths += 12;
        }

        const weeks = Math.floor(daysDiff / 7);
        const hours = daysDiff * 24;
        const minutes = hours * 60;
        const seconds = minutes * 60;

        return {
            type: 'Date Difference',
            startDate: startDate,
            endDate: endDate,
            includeEndDate: includeEndDate,
            totalDays: daysDiff,
            years: adjustedYears,
            months: adjustedMonths,
            days: adjustedDays,
            weeks: weeks,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    function calculateAddSubtract() {
        const baseDate = new Date(document.getElementById('baseDate').value);
        const operation = document.getElementById('operation').value;
        const amount = parseInt(document.getElementById('daysToAddSubtract').value);
        const unitType = document.getElementById('unitType').value;

        if (isNaN(baseDate.getTime()) || isNaN(amount)) {
            showError('Please enter valid date and number');
            return null;
        }

        let resultDate = new Date(baseDate);
        let daysToAdd = amount;

        // Convert units to days
        switch (unitType) {
            case 'weeks':
                daysToAdd = amount * 7;
                break;
            case 'months':
                if (operation === 'add') {
                    resultDate.setMonth(resultDate.getMonth() + amount);
                } else {
                    resultDate.setMonth(resultDate.getMonth() - amount);
                }
                daysToAdd = 0; // Already handled
                break;
            case 'years':
                if (operation === 'add') {
                    resultDate.setFullYear(resultDate.getFullYear() + amount);
                } else {
                    resultDate.setFullYear(resultDate.getFullYear() - amount);
                }
                daysToAdd = 0; // Already handled
                break;
        }

        // Add or subtract days
        if (daysToAdd > 0) {
            if (operation === 'add') {
                resultDate.setDate(resultDate.getDate() + daysToAdd);
            } else {
                resultDate.setDate(resultDate.getDate() - daysToAdd);
            }
        }

        const daysDifference = Math.abs(Math.floor((resultDate.getTime() - baseDate.getTime()) / (1000 * 3600 * 24)));

        return {
            type: 'Add/Subtract Days',
            baseDate: baseDate,
            resultDate: resultDate,
            operation: operation,
            amount: amount,
            unitType: unitType,
            daysDifference: daysDifference
        };
    }

    function calculateBusinessDays() {
        const startDate = new Date(document.getElementById('businessStartDate').value);
        const endDate = new Date(document.getElementById('businessEndDate').value);
        const excludeSaturday = document.getElementById('excludeSaturday').checked;
        const excludeSunday = document.getElementById('excludeSunday').checked;
        const excludeHolidays = document.getElementById('excludeHolidays').checked;

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            showError('Please enter valid dates');
            return null;
        }

        if (startDate > endDate) {
            showError('Start date must be before end date');
            return null;
        }

        let businessDays = 0;
        let totalDays = 0;
        let weekends = 0;
        let holidays = 0;

        const currentDate = new Date(startDate);
        const holidays2024 = getUSHolidays(startDate.getFullYear());

        while (currentDate <= endDate) {
            totalDays++;
            const dayOfWeek = currentDate.getDay();
            const isWeekend = (excludeSaturday && dayOfWeek === 6) || (excludeSunday && dayOfWeek === 0);
            const isHoliday = excludeHolidays && isUSHoliday(currentDate, holidays2024);

            if (isWeekend) {
                weekends++;
            } else if (isHoliday) {
                holidays++;
            } else {
                businessDays++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            type: 'Business Days',
            startDate: startDate,
            endDate: endDate,
            totalDays: totalDays,
            businessDays: businessDays,
            weekends: weekends,
            holidays: holidays,
            excludeSaturday: excludeSaturday,
            excludeSunday: excludeSunday,
            excludeHolidays: excludeHolidays
        };
    }

    function calculateAge() {
        const birthDate = new Date(document.getElementById('birthDate').value);
        const ageAsOfDate = new Date(document.getElementById('ageAsOfDate').value);
        const showLifeStats = document.getElementById('showLifeStats').checked;
        const showNextBirthday = document.getElementById('showNextBirthday').checked;
        const showZodiac = document.getElementById('showZodiac').checked;

        if (isNaN(birthDate.getTime()) || isNaN(ageAsOfDate.getTime())) {
            showError('Please enter valid dates');
            return null;
        }

        if (birthDate > ageAsOfDate) {
            showError('Birth date must be before the calculation date');
            return null;
        }

        // Calculate exact age
        const years = ageAsOfDate.getFullYear() - birthDate.getFullYear();
        const months = ageAsOfDate.getMonth() - birthDate.getMonth();
        const days = ageAsOfDate.getDate() - birthDate.getDate();

        let adjustedYears = years;
        let adjustedMonths = months;
        let adjustedDays = days;

        if (adjustedDays < 0) {
            adjustedMonths--;
            const lastMonth = new Date(ageAsOfDate.getFullYear(), ageAsOfDate.getMonth(), 0);
            adjustedDays += lastMonth.getDate();
        }

        if (adjustedMonths < 0) {
            adjustedYears--;
            adjustedMonths += 12;
        }

        const totalDays = Math.floor((ageAsOfDate.getTime() - birthDate.getTime()) / (1000 * 3600 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = adjustedYears * 12 + adjustedMonths;

        // Next birthday calculation
        let nextBirthday = new Date(ageAsOfDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday <= ageAsOfDate) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.floor((nextBirthday.getTime() - ageAsOfDate.getTime()) / (1000 * 3600 * 24));

        // Zodiac sign
        const zodiacSign = getZodiacSign(birthDate);

        // Life statistics
        const lifeStats = {
            totalHours: totalDays * 24,
            totalMinutes: totalDays * 24 * 60,
            totalSeconds: totalDays * 24 * 60 * 60,
            totalHeartbeats: Math.floor(totalDays * 24 * 60 * 70), // Average 70 bpm
            totalBreaths: Math.floor(totalDays * 24 * 60 * 15) // Average 15 breaths per minute
        };

        return {
            type: 'Age Calculation',
            birthDate: birthDate,
            ageAsOfDate: ageAsOfDate,
            years: adjustedYears,
            months: adjustedMonths,
            days: adjustedDays,
            totalDays: totalDays,
            totalWeeks: totalWeeks,
            totalMonths: totalMonths,
            nextBirthday: nextBirthday,
            daysUntilBirthday: daysUntilBirthday,
            zodiacSign: zodiacSign,
            lifeStats: lifeStats,
            showLifeStats: showLifeStats,
            showNextBirthday: showNextBirthday,
            showZodiac: showZodiac
        };
    }

    function getUSHolidays(year) {
        return [
            new Date(year, 0, 1),   // New Year's Day
            new Date(year, 6, 4),   // Independence Day
            new Date(year, 11, 25), // Christmas Day
            // Add more holidays as needed
        ];
    }

    function isUSHoliday(date, holidays) {
        return holidays.some(holiday =>
            holiday.getDate() === date.getDate() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getFullYear() === date.getFullYear()
        );
    }

    function getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';

        return 'Unknown';
    }

    function displayResults(data) {
        let resultsHTML = '';

        switch (data.type) {
            case 'Date Difference':
                resultsHTML = displayDateDifferenceResults(data);
                break;
            case 'Add/Subtract Days':
                resultsHTML = displayAddSubtractResults(data);
                break;
            case 'Business Days':
                resultsHTML = displayBusinessDaysResults(data);
                break;
            case 'Age Calculation':
                resultsHTML = displayAgeResults(data);
                break;
        }

        resultsContainer.innerHTML = resultsHTML;
    }

    function displayDateDifferenceResults(data) {
        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Date Difference</h3>
                    <div class="result-formula">${formatDate(data.startDate)} to ${formatDate(data.endDate)}</div>
                </div>
                <div class="main-result">
                    <div class="result-number">${data.totalDays}</div>
                    <div class="result-label">Total Days</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.years}</div>
                        <div class="stat-label">Years</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-alt"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.months}</div>
                        <div class="stat-label">Months</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.days}</div>
                        <div class="stat-label">Days</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-week"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.weeks}</div>
                        <div class="stat-label">Weeks</div>
                    </div>
                </div>
            </div>

            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-info-circle"></i> Detailed Breakdown</h4>
                    <div class="breakdown-item">
                        <span>Exact Duration:</span>
                        <span>${data.years} years, ${data.months} months, ${data.days} days</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Hours:</span>
                        <span>${formatNumber(data.hours)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Minutes:</span>
                        <span>${formatNumber(data.minutes)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Seconds:</span>
                        <span>${formatNumber(data.seconds)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function displayAddSubtractResults(data) {
        const operationText = data.operation === 'add' ? 'Added' : 'Subtracted';
        const unitText = data.unitType === 'days' ? 'day' : data.unitType.slice(0, -1);

        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>${operationText} ${data.amount} ${data.unitType}</h3>
                    <div class="result-formula">${formatDate(data.baseDate)} ${data.operation === 'add' ? '+' : '-'} ${data.amount} ${data.unitType}</div>
                </div>
                <div class="main-result">
                    <div class="result-number">${formatDate(data.resultDate)}</div>
                    <div class="result-label">Result Date</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-plus"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${formatDate(data.baseDate)}</div>
                        <div class="stat-label">Starting Date</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.amount}</div>
                        <div class="stat-label">${data.unitType.charAt(0).toUpperCase() + data.unitType.slice(1)}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${formatDate(data.resultDate)}</div>
                        <div class="stat-label">Result Date</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.daysDifference}</div>
                        <div class="stat-label">Days Difference</div>
                    </div>
                </div>
            </div>
        `;
    }

    function displayBusinessDaysResults(data) {
        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Business Days</h3>
                    <div class="result-formula">${formatDate(data.startDate)} to ${formatDate(data.endDate)}</div>
                </div>
                <div class="main-result">
                    <div class="result-number">${data.businessDays}</div>
                    <div class="result-label">Business Days</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.totalDays}</div>
                        <div class="stat-label">Total Days</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-briefcase"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.businessDays}</div>
                        <div class="stat-label">Business Days</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-times"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.weekends}</div>
                        <div class="stat-label">Weekend Days</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.holidays}</div>
                        <div class="stat-label">Holidays</div>
                    </div>
                </div>
            </div>

            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-info-circle"></i> Calculation Settings</h4>
                    <div class="breakdown-item">
                        <span>Exclude Saturdays:</span>
                        <span>${data.excludeSaturday ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Exclude Sundays:</span>
                        <span>${data.excludeSunday ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Exclude Holidays:</span>
                        <span>${data.excludeHolidays ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Business Day Percentage:</span>
                        <span>${((data.businessDays / data.totalDays) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    function displayAgeResults(data) {
        let resultsHTML = `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Age Calculation</h3>
                    <div class="result-formula">Born: ${formatDate(data.birthDate)} | As of: ${formatDate(data.ageAsOfDate)}</div>
                </div>
                <div class="main-result">
                    <div class="result-number">${data.years}</div>
                    <div class="result-label">Years Old</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-birthday-cake"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.years}</div>
                        <div class="stat-label">Years</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-alt"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.months}</div>
                        <div class="stat-label">Months</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.days}</div>
                        <div class="stat-label">Days</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.totalDays}</div>
                        <div class="stat-label">Total Days Lived</div>
                    </div>
                </div>
            </div>

            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-info-circle"></i> Exact Age</h4>
                    <div class="breakdown-item">
                        <span>Precise Age:</span>
                        <span>${data.years} years, ${data.months} months, ${data.days} days</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Weeks:</span>
                        <span>${formatNumber(data.totalWeeks)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Total Months:</span>
                        <span>${data.totalMonths}</span>
                    </div>
                </div>
            </div>
        `;

        if (data.showNextBirthday) {
            resultsHTML += `
                <div class="calculation-details">
                    <div class="detail-card">
                        <h4><i class="fas fa-gift"></i> Next Birthday</h4>
                        <div class="breakdown-item">
                            <span>Next Birthday:</span>
                            <span>${formatDate(data.nextBirthday)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Days Until Birthday:</span>
                            <span>${data.daysUntilBirthday}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Next Age:</span>
                            <span>${data.years + 1} years old</span>
                        </div>
                    </div>
                </div>
            `;
        }

        if (data.showZodiac) {
            resultsHTML += `
                <div class="calculation-details">
                    <div class="detail-card">
                        <h4><i class="fas fa-star"></i> Zodiac Information</h4>
                        <div class="breakdown-item">
                            <span>Zodiac Sign:</span>
                            <span>${data.zodiacSign}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        if (data.showLifeStats) {
            resultsHTML += `
                <div class="calculation-details">
                    <div class="detail-card">
                        <h4><i class="fas fa-heartbeat"></i> Life Statistics</h4>
                        <div class="breakdown-item">
                            <span>Hours Lived:</span>
                            <span>${formatNumber(data.lifeStats.totalHours)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Minutes Lived:</span>
                            <span>${formatNumber(data.lifeStats.totalMinutes)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Estimated Heartbeats:</span>
                            <span>${formatNumber(data.lifeStats.totalHeartbeats)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Estimated Breaths:</span>
                            <span>${formatNumber(data.lifeStats.totalBreaths)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        return resultsHTML;
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    function clearAll() {
        // Clear all inputs
        document.querySelectorAll('.date-input, .number-input, .select-input').forEach(input => {
            if (input.type === 'date' || input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });

        // Reset checkboxes to default states
        document.getElementById('includeEndDate').checked = false;
        document.getElementById('excludeSaturday').checked = true;
        document.getElementById('excludeSunday').checked = true;
        document.getElementById('excludeHolidays').checked = false;
        document.getElementById('showLifeStats').checked = true;
        document.getElementById('showNextBirthday').checked = true;
        document.getElementById('showZodiac').checked = false;

        // Reset age as of date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ageAsOfDate').value = today;

        // Show no content
        showNoContent();
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
                <i class="fas fa-calendar-alt"></i>
                <p>Select dates and calculation type to see detailed results</p>
            </div>
        `;
    }
}