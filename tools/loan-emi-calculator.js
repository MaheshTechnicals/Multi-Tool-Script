// Loan EMI Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLoanCalculator();
});

function initializeLoanCalculator() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculateLoanBtn');
    const clearBtn = document.getElementById('clearLoanBtn');
    const resultsContainer = document.getElementById('loanResults');
    
    let currentTab = 'emi';

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculateLoan);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Auto-calculate on input change
    const inputs = document.querySelectorAll('.number-input, .select-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (hasValidInputs()) {
                calculateLoan();
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
            case 'emi':
                const loanAmount = parseFloat(document.getElementById('loanAmount').value);
                const interestRate = parseFloat(document.getElementById('interestRate').value);
                const loanTenure = parseFloat(document.getElementById('loanTenure').value);
                return !isNaN(loanAmount) && !isNaN(interestRate) && !isNaN(loanTenure) && 
                       loanAmount > 0 && interestRate > 0 && loanTenure > 0;
                
            case 'affordability':
                const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
                const emiRatio = parseFloat(document.getElementById('emiRatio').value);
                const affordabilityRate = parseFloat(document.getElementById('affordabilityRate').value);
                const affordabilityTenure = parseFloat(document.getElementById('affordabilityTenure').value);
                return !isNaN(monthlyIncome) && !isNaN(emiRatio) && !isNaN(affordabilityRate) && !isNaN(affordabilityTenure) &&
                       monthlyIncome > 0 && emiRatio > 0 && affordabilityRate > 0 && affordabilityTenure > 0;
                
            case 'comparison':
                const loan1Amount = parseFloat(document.getElementById('loan1Amount').value);
                const loan1Rate = parseFloat(document.getElementById('loan1Rate').value);
                const loan1Tenure = parseFloat(document.getElementById('loan1Tenure').value);
                const loan2Amount = parseFloat(document.getElementById('loan2Amount').value);
                const loan2Rate = parseFloat(document.getElementById('loan2Rate').value);
                const loan2Tenure = parseFloat(document.getElementById('loan2Tenure').value);
                return !isNaN(loan1Amount) && !isNaN(loan1Rate) && !isNaN(loan1Tenure) &&
                       !isNaN(loan2Amount) && !isNaN(loan2Rate) && !isNaN(loan2Tenure) &&
                       loan1Amount > 0 && loan1Rate > 0 && loan1Tenure > 0 &&
                       loan2Amount > 0 && loan2Rate > 0 && loan2Tenure > 0;
                
            default:
                return false;
        }
    }

    function calculateLoan() {
        let result;
        
        switch (currentTab) {
            case 'emi':
                result = calculateEMI();
                break;
            case 'affordability':
                result = calculateAffordability();
                break;
            case 'comparison':
                result = calculateComparison();
                break;
            default:
                showError('Invalid calculation type');
                return;
        }

        if (result) {
            displayResults(result);
        }
    }

    function calculateEMI() {
        const principal = parseFloat(document.getElementById('loanAmount').value);
        const annualRate = parseFloat(document.getElementById('interestRate').value);
        const tenureValue = parseFloat(document.getElementById('loanTenure').value);
        const tenureType = document.getElementById('tenureType').value;
        
        if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureValue)) {
            showError('Please enter valid numbers');
            return null;
        }

        if (principal <= 0 || annualRate <= 0 || tenureValue <= 0) {
            showError('All values must be greater than zero');
            return null;
        }

        // Convert to months
        const months = tenureType === 'years' ? tenureValue * 12 : tenureValue;
        const monthlyRate = annualRate / 12 / 100;
        
        // EMI calculation using the standard formula
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;
        
        return {
            type: 'EMI Calculation',
            principal: principal,
            emi: emi,
            totalAmount: totalAmount,
            totalInterest: totalInterest,
            months: months,
            annualRate: annualRate,
            monthlyRate: monthlyRate
        };
    }

    function calculateAffordability() {
        const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
        const emiRatio = parseFloat(document.getElementById('emiRatio').value);
        const annualRate = parseFloat(document.getElementById('affordabilityRate').value);
        const tenureYears = parseFloat(document.getElementById('affordabilityTenure').value);
        
        if (isNaN(monthlyIncome) || isNaN(emiRatio) || isNaN(annualRate) || isNaN(tenureYears)) {
            showError('Please enter valid numbers');
            return null;
        }

        const affordableEMI = monthlyIncome * emiRatio / 100;
        const months = tenureYears * 12;
        const monthlyRate = annualRate / 12 / 100;
        
        // Calculate maximum loan amount
        const maxLoanAmount = affordableEMI * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
        const totalAmount = affordableEMI * months;
        const totalInterest = totalAmount - maxLoanAmount;
        
        return {
            type: 'Affordability Analysis',
            monthlyIncome: monthlyIncome,
            emiRatio: emiRatio,
            affordableEMI: affordableEMI,
            maxLoanAmount: maxLoanAmount,
            totalAmount: totalAmount,
            totalInterest: totalInterest,
            months: months,
            annualRate: annualRate
        };
    }

    function calculateComparison() {
        // Loan 1
        const loan1 = calculateLoanDetails(
            parseFloat(document.getElementById('loan1Amount').value),
            parseFloat(document.getElementById('loan1Rate').value),
            parseFloat(document.getElementById('loan1Tenure').value)
        );
        
        // Loan 2
        const loan2 = calculateLoanDetails(
            parseFloat(document.getElementById('loan2Amount').value),
            parseFloat(document.getElementById('loan2Rate').value),
            parseFloat(document.getElementById('loan2Tenure').value)
        );
        
        if (!loan1 || !loan2) {
            showError('Please enter valid numbers for both loans');
            return null;
        }
        
        return {
            type: 'Loan Comparison',
            loan1: loan1,
            loan2: loan2,
            savings: {
                emi: Math.abs(loan1.emi - loan2.emi),
                totalInterest: Math.abs(loan1.totalInterest - loan2.totalInterest),
                totalAmount: Math.abs(loan1.totalAmount - loan2.totalAmount),
                betterOption: loan1.totalAmount < loan2.totalAmount ? 1 : 2
            }
        };
    }

    function calculateLoanDetails(principal, annualRate, tenureYears) {
        if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureYears) ||
            principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
            return null;
        }
        
        const months = tenureYears * 12;
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;
        
        return {
            principal: principal,
            emi: emi,
            totalAmount: totalAmount,
            totalInterest: totalInterest,
            months: months,
            annualRate: annualRate
        };
    }

    function displayResults(data) {
        let resultsHTML = '';
        
        switch (data.type) {
            case 'EMI Calculation':
                resultsHTML = displayEMIResults(data);
                break;
            case 'Affordability Analysis':
                resultsHTML = displayAffordabilityResults(data);
                break;
            case 'Loan Comparison':
                resultsHTML = displayComparisonResults(data);
                break;
        }
        
        resultsContainer.innerHTML = resultsHTML;
    }

    function displayEMIResults(data) {
        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Monthly EMI</h3>
                    <div class="result-formula">Loan: $${formatNumber(data.principal)} at ${data.annualRate}% for ${data.months/12} years</div>
                </div>
                <div class="main-result">
                    <div class="result-number">$${formatNumber(data.emi)}</div>
                    <div class="result-label">Monthly Payment</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.principal)}</div>
                        <div class="stat-label">Principal Amount</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalInterest)}</div>
                        <div class="stat-label">Total Interest</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalAmount)}</div>
                        <div class="stat-label">Total Amount</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.months}</div>
                        <div class="stat-label">Total Payments</div>
                    </div>
                </div>
            </div>

            <div class="calculation-details">
                <div class="detail-card">
                    <h4><i class="fas fa-info-circle"></i> Loan Breakdown</h4>
                    <div class="breakdown-item">
                        <span>Interest Rate (Monthly):</span>
                        <span>${(data.monthlyRate * 100).toFixed(4)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Interest Percentage:</span>
                        <span>${((data.totalInterest / data.totalAmount) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Principal Percentage:</span>
                        <span>${((data.principal / data.totalAmount) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    function displayAffordabilityResults(data) {
        return `
            <div class="calculation-summary">
                <div class="result-header">
                    <h3>Maximum Loan Amount</h3>
                    <div class="result-formula">Income: $${formatNumber(data.monthlyIncome)} | EMI Ratio: ${data.emiRatio}%</div>
                </div>
                <div class="main-result">
                    <div class="result-number">$${formatNumber(data.maxLoanAmount)}</div>
                    <div class="result-label">Max Loan</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.affordableEMI)}</div>
                        <div class="stat-label">Affordable EMI</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalInterest)}</div>
                        <div class="stat-label">Total Interest</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">$${formatNumber(data.totalAmount)}</div>
                        <div class="stat-label">Total Payment</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-content">
                        <div class="stat-number">${data.emiRatio}%</div>
                        <div class="stat-label">EMI to Income</div>
                    </div>
                </div>
            </div>
        `;
    }

    function displayComparisonResults(data) {
        const betterLoan = data.savings.betterOption === 1 ? data.loan1 : data.loan2;
        const worseLoan = data.savings.betterOption === 1 ? data.loan2 : data.loan1;
        
        return `
            <div class="comparison-summary">
                <h3>Loan Comparison Results</h3>
                <div class="comparison-winner">
                    <i class="fas fa-trophy"></i>
                    <span>Option ${data.savings.betterOption} is better by $${formatNumber(data.savings.totalAmount)}</span>
                </div>
            </div>

            <div class="comparison-grid">
                <div class="loan-comparison-card ${data.savings.betterOption === 1 ? 'better' : ''}">
                    <h4>Loan Option 1</h4>
                    <div class="comparison-stats">
                        <div class="comp-stat">
                            <span>EMI:</span>
                            <span>$${formatNumber(data.loan1.emi)}</span>
                        </div>
                        <div class="comp-stat">
                            <span>Total Interest:</span>
                            <span>$${formatNumber(data.loan1.totalInterest)}</span>
                        </div>
                        <div class="comp-stat">
                            <span>Total Amount:</span>
                            <span>$${formatNumber(data.loan1.totalAmount)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="loan-comparison-card ${data.savings.betterOption === 2 ? 'better' : ''}">
                    <h4>Loan Option 2</h4>
                    <div class="comparison-stats">
                        <div class="comp-stat">
                            <span>EMI:</span>
                            <span>$${formatNumber(data.loan2.emi)}</span>
                        </div>
                        <div class="comp-stat">
                            <span>Total Interest:</span>
                            <span>$${formatNumber(data.loan2.totalInterest)}</span>
                        </div>
                        <div class="comp-stat">
                            <span>Total Amount:</span>
                            <span>$${formatNumber(data.loan2.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="savings-summary">
                <h4><i class="fas fa-piggy-bank"></i> Potential Savings</h4>
                <div class="savings-grid">
                    <div class="savings-item">
                        <span>EMI Difference:</span>
                        <span>$${formatNumber(data.savings.emi)}</span>
                    </div>
                    <div class="savings-item">
                        <span>Interest Savings:</span>
                        <span>$${formatNumber(data.savings.totalInterest)}</span>
                    </div>
                    <div class="savings-item">
                        <span>Total Savings:</span>
                        <span>$${formatNumber(data.savings.totalAmount)}</span>
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
                <i class="fas fa-calculator"></i>
                <p>Enter loan details to calculate EMI and view payment breakdown</p>
            </div>
        `;
    }
}
