// Percentage Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePercentageCalculator();
});

function initializePercentageCalculator() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculatePercentBtn');
    const clearBtn = document.getElementById('clearPercentBtn');
    const resultsContainer = document.getElementById('percentageResults');
    
    let currentTab = 'basic';

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculatePercentage);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Auto-calculate on input change
    const inputs = document.querySelectorAll('.number-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateFormula();
            if (hasValidInputs()) {
                calculatePercentage();
            }
        });
    });

    // Initialize formulas
    updateFormula();

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
        updateFormula();
    }

    function hasValidInputs() {
        switch (currentTab) {
            case 'basic':
                const basicPercent = parseFloat(document.getElementById('basicPercent').value);
                const basicValue = parseFloat(document.getElementById('basicValue').value);
                return !isNaN(basicPercent) && !isNaN(basicValue);
                
            case 'increase':
                const increaseOriginal = parseFloat(document.getElementById('increaseOriginal').value);
                const increasePercent = parseFloat(document.getElementById('increasePercent').value);
                return !isNaN(increaseOriginal) && !isNaN(increasePercent);
                
            case 'decrease':
                const decreaseOriginal = parseFloat(document.getElementById('decreaseOriginal').value);
                const decreasePercent = parseFloat(document.getElementById('decreasePercent').value);
                return !isNaN(decreaseOriginal) && !isNaN(decreasePercent);
                
            case 'change':
                const changeOriginal = parseFloat(document.getElementById('changeOriginal').value);
                const changeNew = parseFloat(document.getElementById('changeNew').value);
                return !isNaN(changeOriginal) && !isNaN(changeNew) && changeOriginal !== 0;
                
            default:
                return false;
        }
    }

    function updateFormula() {
        switch (currentTab) {
            case 'basic':
                const basicPercent = document.getElementById('basicPercent').value || 'X';
                const basicValue = document.getElementById('basicValue').value || 'Y';
                document.getElementById('basicFormula').textContent = `${basicPercent}% of ${basicValue} = ?`;
                break;
                
            case 'increase':
                const increaseOriginal = document.getElementById('increaseOriginal').value || 'X';
                const increasePercent = document.getElementById('increasePercent').value || 'Y';
                document.getElementById('increaseFormula').textContent = `${increaseOriginal} + ${increasePercent}% = ?`;
                break;
                
            case 'decrease':
                const decreaseOriginal = document.getElementById('decreaseOriginal').value || 'X';
                const decreasePercent = document.getElementById('decreasePercent').value || 'Y';
                document.getElementById('decreaseFormula').textContent = `${decreaseOriginal} - ${decreasePercent}% = ?`;
                break;
                
            case 'change':
                const changeOriginal = document.getElementById('changeOriginal').value || 'X';
                const changeNew = document.getElementById('changeNew').value || 'Y';
                document.getElementById('changeFormula').textContent = `Change from ${changeOriginal} to ${changeNew} = ?`;
                break;
        }
    }

    function calculatePercentage() {
        let result;
        
        switch (currentTab) {
            case 'basic':
                result = calculateBasicPercentage();
                break;
            case 'increase':
                result = calculatePercentageIncrease();
                break;
            case 'decrease':
                result = calculatePercentageDecrease();
                break;
            case 'change':
                result = calculatePercentageChange();
                break;
            default:
                showError('Invalid calculation type');
                return;
        }

        if (result) {
            displayResults(result);
        }
    }

    function calculateBasicPercentage() {
        const percent = parseFloat(document.getElementById('basicPercent').value);
        const value = parseFloat(document.getElementById('basicValue').value);
        
        if (isNaN(percent) || isNaN(value)) {
            showError('Please enter valid numbers');
            return null;
        }

        const result = (percent / 100) * value;
        
        return {
            type: 'Basic Percentage',
            formula: `${percent}% of ${value}`,
            calculation: `(${percent} ÷ 100) × ${value}`,
            result: result,
            explanation: `${percent}% of ${value} equals ${result.toFixed(2)}`
        };
    }

    function calculatePercentageIncrease() {
        const original = parseFloat(document.getElementById('increaseOriginal').value);
        const percent = parseFloat(document.getElementById('increasePercent').value);
        
        if (isNaN(original) || isNaN(percent)) {
            showError('Please enter valid numbers');
            return null;
        }

        const increase = (percent / 100) * original;
        const result = original + increase;
        
        return {
            type: 'Percentage Increase',
            formula: `${original} + ${percent}%`,
            calculation: `${original} + (${original} × ${percent} ÷ 100)`,
            result: result,
            increase: increase,
            explanation: `${original} increased by ${percent}% equals ${result.toFixed(2)}`
        };
    }

    function calculatePercentageDecrease() {
        const original = parseFloat(document.getElementById('decreaseOriginal').value);
        const percent = parseFloat(document.getElementById('decreasePercent').value);
        
        if (isNaN(original) || isNaN(percent)) {
            showError('Please enter valid numbers');
            return null;
        }

        const decrease = (percent / 100) * original;
        const result = original - decrease;
        
        return {
            type: 'Percentage Decrease',
            formula: `${original} - ${percent}%`,
            calculation: `${original} - (${original} × ${percent} ÷ 100)`,
            result: result,
            decrease: decrease,
            explanation: `${original} decreased by ${percent}% equals ${result.toFixed(2)}`
        };
    }

    function calculatePercentageChange() {
        const original = parseFloat(document.getElementById('changeOriginal').value);
        const newValue = parseFloat(document.getElementById('changeNew').value);
        
        if (isNaN(original) || isNaN(newValue)) {
            showError('Please enter valid numbers');
            return null;
        }

        if (original === 0) {
            showError('Original value cannot be zero for percentage change calculation');
            return null;
        }

        const change = newValue - original;
        const percentChange = (change / original) * 100;
        const isIncrease = change > 0;
        
        return {
            type: 'Percentage Change',
            formula: `From ${original} to ${newValue}`,
            calculation: `((${newValue} - ${original}) ÷ ${original}) × 100`,
            result: Math.abs(percentChange),
            change: change,
            isIncrease: isIncrease,
            explanation: `Change from ${original} to ${newValue} is ${isIncrease ? 'an increase' : 'a decrease'} of ${Math.abs(percentChange).toFixed(2)}%`
        };
    }

    function displayResults(data) {
        let resultsHTML = `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>${data.type}</h3>
                    <div class="result-formula">${data.formula}</div>
                </div>
                <div class="main-result">
                    <div class="result-number">${data.result.toFixed(2)}</div>
                    <div class="result-label">${data.type === 'Percentage Change' ? '%' : 'Result'}</div>
                </div>
            </div>

            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-calculator"></i> Calculation Steps</h4>
                    <div class="calculation-step">
                        <div class="step-formula">${data.calculation}</div>
                        <div class="step-result">= ${data.result.toFixed(2)}${data.type === 'Percentage Change' ? '%' : ''}</div>
                    </div>
                    <div class="explanation">${data.explanation}</div>
                </div>
            </div>

            <div class="stats-grid">
        `;

        // Add specific stats based on calculation type
        switch (data.type) {
            case 'Basic Percentage':
                resultsHTML += `
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-percent"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.result.toFixed(2)}</div>
                            <div class="stat-label">Result</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${(data.result / parseFloat(document.getElementById('basicValue').value) * 100).toFixed(1)}%</div>
                            <div class="stat-label">Percentage of Total</div>
                        </div>
                    </div>
                `;
                break;
                
            case 'Percentage Increase':
                resultsHTML += `
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-plus"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.increase.toFixed(2)}</div>
                            <div class="stat-label">Amount Increased</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.result.toFixed(2)}</div>
                            <div class="stat-label">Final Value</div>
                        </div>
                    </div>
                `;
                break;
                
            case 'Percentage Decrease':
                resultsHTML += `
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-minus"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.decrease.toFixed(2)}</div>
                            <div class="stat-label">Amount Decreased</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.result.toFixed(2)}</div>
                            <div class="stat-label">Final Value</div>
                        </div>
                    </div>
                `;
                break;
                
            case 'Percentage Change':
                resultsHTML += `
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-${data.isIncrease ? 'arrow-up' : 'arrow-down'}"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${Math.abs(data.change).toFixed(2)}</div>
                            <div class="stat-label">Absolute Change</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-percent"></i></div>
                        <div class="stat-content">
                            <div class="stat-number">${data.result.toFixed(2)}%</div>
                            <div class="stat-label">${data.isIncrease ? 'Increase' : 'Decrease'}</div>
                        </div>
                    </div>
                `;
                break;
        }

        resultsHTML += `
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
    }

    function clearAll() {
        // Clear all inputs
        document.querySelectorAll('.number-input').forEach(input => {
            input.value = '';
        });
        
        // Show no content
        showNoContent();
        
        // Update formulas
        updateFormula();
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
                <i class="fas fa-percent"></i>
                <p>Select a calculation type and enter values to see results</p>
            </div>
        `;
    }
}
