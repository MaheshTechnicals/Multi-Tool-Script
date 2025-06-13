// Tip Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTipCalculator();
});

function initializeTipCalculator() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculateTipBtn');
    const clearBtn = document.getElementById('clearTipBtn');
    const resultsContainer = document.getElementById('tipResults');
    
    let currentTab = 'basic';

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculateTip);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Preset tip buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tipPercent = this.getAttribute('data-tip');
            document.getElementById('tipPercentage').value = tipPercent;
            if (hasValidInputs()) {
                calculateTip();
            }
        });
    });

    // Tax checkbox functionality
    const includeTaxCheckbox = document.getElementById('includeTax');
    const taxInputGroup = document.getElementById('taxInputGroup');
    includeTaxCheckbox.addEventListener('change', function() {
        taxInputGroup.style.display = this.checked ? 'block' : 'none';
        if (hasValidInputs()) {
            calculateTip();
        }
    });

    // Split method change
    const splitMethodSelect = document.getElementById('splitMethod');
    const customSplitSection = document.getElementById('customSplitSection');
    splitMethodSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSplitSection.style.display = 'block';
            generateCustomSplitInputs();
        } else {
            customSplitSection.style.display = 'none';
        }
        if (hasValidInputs()) {
            calculateTip();
        }
    });

    // Service quality change
    const serviceQualitySelect = document.getElementById('serviceQuality');
    const customTipGroup = document.getElementById('customTipGroup');
    serviceQualitySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customTipGroup.style.display = 'block';
        } else {
            customTipGroup.style.display = 'none';
            // Auto-set tip percentage based on quality
            const customTipInput = document.getElementById('customTipPercentage');
            switch (this.value) {
                case 'excellent':
                    customTipInput.value = 22.5;
                    break;
                case 'good':
                    customTipInput.value = 19;
                    break;
                case 'average':
                    customTipInput.value = 16.5;
                    break;
                case 'poor':
                    customTipInput.value = 12.5;
                    break;
            }
        }
        if (hasValidInputs()) {
            calculateTip();
        }
    });

    // Number of people change
    const numberOfPeopleInput = document.getElementById('numberOfPeople');
    numberOfPeopleInput.addEventListener('input', function() {
        if (splitMethodSelect.value === 'custom') {
            generateCustomSplitInputs();
        }
        if (hasValidInputs()) {
            calculateTip();
        }
    });

    // Auto-calculate on input change
    const inputs = document.querySelectorAll('.number-input, .select-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (hasValidInputs()) {
                calculateTip();
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
            case 'basic':
                const billAmount = parseFloat(document.getElementById('billAmount').value);
                const tipPercentage = parseFloat(document.getElementById('tipPercentage').value);
                return !isNaN(billAmount) && !isNaN(tipPercentage) && billAmount > 0 && tipPercentage >= 0;
                
            case 'split':
                const splitBillAmount = parseFloat(document.getElementById('splitBillAmount').value);
                const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);
                const splitTipPercentage = parseFloat(document.getElementById('splitTipPercentage').value);
                return !isNaN(splitBillAmount) && !isNaN(numberOfPeople) && !isNaN(splitTipPercentage) &&
                       splitBillAmount > 0 && numberOfPeople > 0 && splitTipPercentage >= 0;
                
            case 'custom':
                const serviceAmount = parseFloat(document.getElementById('serviceAmount').value);
                const serviceQuality = document.getElementById('serviceQuality').value;
                if (serviceQuality === 'custom') {
                    const customTipPercentage = parseFloat(document.getElementById('customTipPercentage').value);
                    return !isNaN(serviceAmount) && !isNaN(customTipPercentage) && serviceAmount > 0 && customTipPercentage >= 0;
                }
                return !isNaN(serviceAmount) && serviceAmount > 0;
                
            default:
                return false;
        }
    }

    function generateCustomSplitInputs() {
        const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value) || 0;
        const customSplitInputs = document.getElementById('customSplitInputs');
        
        if (numberOfPeople <= 0 || numberOfPeople > 20) {
            customSplitInputs.innerHTML = '<p>Please enter a valid number of people (1-20)</p>';
            return;
        }
        
        let inputsHTML = '';
        for (let i = 1; i <= numberOfPeople; i++) {
            inputsHTML += `
                <div class="input-group">
                    <label>Person ${i} Amount ($)</label>
                    <input type="number" id="person${i}Amount" class="number-input custom-split-input" placeholder="0.00" step="0.01" min="0">
                </div>
            `;
        }
        customSplitInputs.innerHTML = inputsHTML;
        
        // Add event listeners to new inputs
        const customInputs = customSplitInputs.querySelectorAll('.custom-split-input');
        customInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (hasValidInputs()) {
                    calculateTip();
                }
            });
        });
    }

    function calculateTip() {
        let result;
        
        switch (currentTab) {
            case 'basic':
                result = calculateBasicTip();
                break;
            case 'split':
                result = calculateSplitBill();
                break;
            case 'custom':
                result = calculateCustomService();
                break;
            default:
                showError('Invalid calculation type');
                return;
        }

        if (result) {
            displayResults(result);
        }
    }

    function calculateBasicTip() {
        const billAmount = parseFloat(document.getElementById('billAmount').value);
        const tipPercentage = parseFloat(document.getElementById('tipPercentage').value);
        const includeTax = document.getElementById('includeTax').checked;
        const taxAmount = parseFloat(document.getElementById('taxAmount').value) || 0;
        
        if (isNaN(billAmount) || isNaN(tipPercentage)) {
            showError('Please enter valid numbers');
            return null;
        }

        let tipBase = billAmount;
        if (includeTax && taxAmount > 0) {
            tipBase = billAmount - taxAmount;
        }
        
        const tipAmount = (tipBase * tipPercentage) / 100;
        const totalAmount = billAmount + tipAmount;
        
        return {
            type: 'Basic Tip',
            billAmount: billAmount,
            tipPercentage: tipPercentage,
            tipAmount: tipAmount,
            totalAmount: totalAmount,
            tipBase: tipBase,
            taxAmount: includeTax ? taxAmount : 0,
            includeTax: includeTax
        };
    }

    function calculateSplitBill() {
        const splitBillAmount = parseFloat(document.getElementById('splitBillAmount').value);
        const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);
        const splitTipPercentage = parseFloat(document.getElementById('splitTipPercentage').value);
        const splitMethod = document.getElementById('splitMethod').value;
        
        if (isNaN(splitBillAmount) || isNaN(numberOfPeople) || isNaN(splitTipPercentage)) {
            showError('Please enter valid numbers');
            return null;
        }

        const tipAmount = (splitBillAmount * splitTipPercentage) / 100;
        const totalAmount = splitBillAmount + tipAmount;
        
        let splitDetails = [];
        
        if (splitMethod === 'equal') {
            const perPersonAmount = totalAmount / numberOfPeople;
            const perPersonTip = tipAmount / numberOfPeople;
            const perPersonBill = splitBillAmount / numberOfPeople;
            
            for (let i = 1; i <= numberOfPeople; i++) {
                splitDetails.push({
                    person: i,
                    billAmount: perPersonBill,
                    tipAmount: perPersonTip,
                    totalAmount: perPersonAmount
                });
            }
        } else {
            // Custom split
            let customTotal = 0;
            for (let i = 1; i <= numberOfPeople; i++) {
                const personAmount = parseFloat(document.getElementById(`person${i}Amount`).value) || 0;
                customTotal += personAmount;
            }
            
            if (customTotal === 0) {
                showError('Please enter amounts for custom split');
                return null;
            }
            
            for (let i = 1; i <= numberOfPeople; i++) {
                const personBillAmount = parseFloat(document.getElementById(`person${i}Amount`).value) || 0;
                const personTipAmount = (personBillAmount * splitTipPercentage) / 100;
                const personTotalAmount = personBillAmount + personTipAmount;
                
                splitDetails.push({
                    person: i,
                    billAmount: personBillAmount,
                    tipAmount: personTipAmount,
                    totalAmount: personTotalAmount
                });
            }
        }
        
        return {
            type: 'Split Bill',
            billAmount: splitBillAmount,
            tipPercentage: splitTipPercentage,
            tipAmount: tipAmount,
            totalAmount: totalAmount,
            numberOfPeople: numberOfPeople,
            splitMethod: splitMethod,
            splitDetails: splitDetails
        };
    }

    function calculateCustomService() {
        const serviceAmount = parseFloat(document.getElementById('serviceAmount').value);
        const serviceType = document.getElementById('serviceType').value;
        const serviceQuality = document.getElementById('serviceQuality').value;
        
        if (isNaN(serviceAmount)) {
            showError('Please enter a valid service amount');
            return null;
        }

        let tipPercentage;
        if (serviceQuality === 'custom') {
            tipPercentage = parseFloat(document.getElementById('customTipPercentage').value);
            if (isNaN(tipPercentage)) {
                showError('Please enter a valid tip percentage');
                return null;
            }
        } else {
            // Get tip percentage based on quality
            switch (serviceQuality) {
                case 'excellent':
                    tipPercentage = 22.5;
                    break;
                case 'good':
                    tipPercentage = 19;
                    break;
                case 'average':
                    tipPercentage = 16.5;
                    break;
                case 'poor':
                    tipPercentage = 12.5;
                    break;
                default:
                    tipPercentage = 18;
            }
        }
        
        const tipAmount = (serviceAmount * tipPercentage) / 100;
        const totalAmount = serviceAmount + tipAmount;
        
        return {
            type: 'Custom Service',
            serviceType: serviceType,
            serviceQuality: serviceQuality,
            serviceAmount: serviceAmount,
            tipPercentage: tipPercentage,
            tipAmount: tipAmount,
            totalAmount: totalAmount
        };
    }

    function displayResults(data) {
        let resultsHTML = '';
        
        switch (data.type) {
            case 'Basic Tip':
                resultsHTML = displayBasicTipResults(data);
                break;
            case 'Split Bill':
                resultsHTML = displaySplitBillResults(data);
                break;
            case 'Custom Service':
                resultsHTML = displayCustomServiceResults(data);
                break;
        }
        
        resultsContainer.innerHTML = resultsHTML;
    }

    function displayBasicTipResults(data) {
        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Tip Calculation</h3>
                    <div class="result-formula">Bill: $${formatNumber(data.billAmount)} | Tip: ${data.tipPercentage}%</div>
                </div>
                <div class="main-result">
                    <div class="result-number">$${formatNumber(data.totalAmount)}</div>
                    <div class="result-label">Total Amount</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-receipt"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.billAmount)}</div>
                        <div class="stat-label">Bill Amount</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.tipAmount)}</div>
                        <div class="stat-label">Tip Amount</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.tipPercentage}%</div>
                        <div class="stat-label">Tip Percentage</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalAmount)}</div>
                        <div class="stat-label">Total to Pay</div>
                    </div>
                </div>
            </div>

            ${data.includeTax ? `
            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-info-circle"></i> Tax Information</h4>
                    <div class="breakdown-item">
                        <span>Tax Amount:</span>
                        <span>$${formatNumber(data.taxAmount)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tip Base (Pre-tax):</span>
                        <span>$${formatNumber(data.tipBase)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Tip on Pre-tax Amount:</span>
                        <span>$${formatNumber(data.tipAmount)}</span>
                    </div>
                </div>
            </div>
            ` : ''}
        `;
    }

    function displaySplitBillResults(data) {
        let splitDetailsHTML = '';
        data.splitDetails.forEach(person => {
            splitDetailsHTML += `
                <div class="person-split">
                    <h5>Person ${person.person}</h5>
                    <div class="person-breakdown">
                        <div class="breakdown-item">
                            <span>Bill:</span>
                            <span>$${formatNumber(person.billAmount)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Tip:</span>
                            <span>$${formatNumber(person.tipAmount)}</span>
                        </div>
                        <div class="breakdown-item total-item">
                            <span>Total:</span>
                            <span>$${formatNumber(person.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Bill Split (${data.numberOfPeople} people)</h3>
                    <div class="result-formula">Total: $${formatNumber(data.totalAmount)} | Tip: ${data.tipPercentage}%</div>
                </div>
                <div class="main-result">
                    <div class="result-number">$${formatNumber(data.totalAmount / data.numberOfPeople)}</div>
                    <div class="result-label">Per Person (Average)</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-receipt"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.billAmount)}</div>
                        <div class="stat-label">Total Bill</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.tipAmount)}</div>
                        <div class="stat-label">Total Tip</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.numberOfPeople}</div>
                        <div class="stat-label">People</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalAmount)}</div>
                        <div class="stat-label">Grand Total</div>
                    </div>
                </div>
            </div>

            <div class="split-breakdown">
                <h4><i class="fas fa-list"></i> Individual Breakdown</h4>
                <div class="split-details">
                    ${splitDetailsHTML}
                </div>
            </div>
        `;
    }

    function displayCustomServiceResults(data) {
        const serviceTypeNames = {
            restaurant: 'Restaurant Dining',
            delivery: 'Food Delivery',
            taxi: 'Taxi/Rideshare',
            hotel: 'Hotel Services',
            salon: 'Hair/Beauty Salon',
            bartender: 'Bar Service',
            custom: 'Custom Service'
        };

        const qualityNames = {
            excellent: 'Excellent Service',
            good: 'Good Service',
            average: 'Average Service',
            poor: 'Poor Service',
            custom: 'Custom Percentage'
        };

        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>${serviceTypeNames[data.serviceType]}</h3>
                    <div class="result-formula">${qualityNames[data.serviceQuality]} | ${data.tipPercentage}% tip</div>
                </div>
                <div class="main-result">
                    <div class="result-number">$${formatNumber(data.totalAmount)}</div>
                    <div class="result-label">Total Amount</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-concierge-bell"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.serviceAmount)}</div>
                        <div class="stat-label">Service Cost</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.tipAmount)}</div>
                        <div class="stat-label">Tip Amount</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.tipPercentage}%</div>
                        <div class="stat-label">Tip Rate</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalAmount)}</div>
                        <div class="stat-label">Total to Pay</div>
                    </div>
                </div>
            </div>
        `;
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    function clearAll() {
        // Clear all inputs
        document.querySelectorAll('.number-input, .select-input').forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
        
        // Reset checkboxes
        document.querySelectorAll('.checkbox-input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Hide conditional sections
        document.getElementById('taxInputGroup').style.display = 'none';
        document.getElementById('customSplitSection').style.display = 'none';
        document.getElementById('customTipGroup').style.display = 'none';
        
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
                <i class="fas fa-receipt"></i>
                <p>Enter bill details to calculate tip and total amounts</p>
            </div>
        `;
    }
}
