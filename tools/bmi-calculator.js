// BMI Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBmiCalculator();
});

function initializeBmiCalculator() {
    const unitRadios = document.querySelectorAll('input[name="units"]');
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');
    const calculateBtn = document.getElementById('calculateBmiBtn');
    const clearBtn = document.getElementById('clearBmiBtn');
    const resultsContainer = document.getElementById('bmiResults');

    // Unit system toggle
    unitRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'metric') {
                metricInputs.style.display = 'block';
                imperialInputs.style.display = 'none';
            } else {
                metricInputs.style.display = 'none';
                imperialInputs.style.display = 'block';
            }
            clearInputs();
        });
    });

    // Calculate BMI on button click
    calculateBtn.addEventListener('click', calculateBmi);

    // Clear inputs
    clearBtn.addEventListener('click', function() {
        clearInputs();
        showNoContent();
    });

    // Auto-calculate on input change
    const inputs = document.querySelectorAll('.number-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (hasValidInputs()) {
                calculateBmi();
            }
        });
    });

    function hasValidInputs() {
        const isMetric = document.querySelector('input[name="units"]:checked').value === 'metric';
        
        if (isMetric) {
            const weight = parseFloat(document.getElementById('weightKg').value);
            const height = parseFloat(document.getElementById('heightCm').value);
            return weight > 0 && height > 0;
        } else {
            const weight = parseFloat(document.getElementById('weightLbs').value);
            const heightFt = parseFloat(document.getElementById('heightFt').value);
            const heightIn = parseFloat(document.getElementById('heightIn').value) || 0;
            return weight > 0 && heightFt > 0;
        }
    }

    function calculateBmi() {
        const isMetric = document.querySelector('input[name="units"]:checked').value === 'metric';
        let weightKg, heightM;

        if (isMetric) {
            weightKg = parseFloat(document.getElementById('weightKg').value);
            const heightCm = parseFloat(document.getElementById('heightCm').value);
            
            if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
                showError('Please enter valid weight and height values');
                return;
            }
            
            heightM = heightCm / 100;
        } else {
            const weightLbs = parseFloat(document.getElementById('weightLbs').value);
            const heightFt = parseFloat(document.getElementById('heightFt').value);
            const heightIn = parseFloat(document.getElementById('heightIn').value) || 0;
            
            if (!weightLbs || !heightFt || weightLbs <= 0 || heightFt <= 0) {
                showError('Please enter valid weight and height values');
                return;
            }
            
            // Convert to metric
            weightKg = weightLbs * 0.453592;
            const totalInches = (heightFt * 12) + heightIn;
            heightM = totalInches * 0.0254;
        }

        const bmi = weightKg / (heightM * heightM);
        const bmiData = analyzeBmi(bmi, weightKg, heightM);
        
        // Get optional data
        const age = parseInt(document.getElementById('age').value) || null;
        const gender = document.querySelector('input[name="gender"]:checked')?.value || null;
        
        displayBmiResults(bmiData, age, gender, isMetric);
    }

    function analyzeBmi(bmi, weightKg, heightM) {
        let category, color, description, healthRisk;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3498db';
            description = 'Below normal weight range';
            healthRisk = 'May indicate malnutrition or other health issues';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            color = '#27ae60';
            description = 'Healthy weight range';
            healthRisk = 'Lowest risk of weight-related health problems';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f39c12';
            description = 'Above normal weight range';
            healthRisk = 'Increased risk of health problems';
        } else if (bmi < 35) {
            category = 'Obese Class I';
            color = '#e74c3c';
            description = 'Moderately obese';
            healthRisk = 'High risk of health problems';
        } else if (bmi < 40) {
            category = 'Obese Class II';
            color = '#c0392b';
            description = 'Severely obese';
            healthRisk = 'Very high risk of health problems';
        } else {
            category = 'Obese Class III';
            color = '#8e44ad';
            description = 'Very severely obese';
            healthRisk = 'Extremely high risk of health problems';
        }

        // Calculate ideal weight range (BMI 18.5-24.9)
        const minIdealWeight = 18.5 * (heightM * heightM);
        const maxIdealWeight = 24.9 * (heightM * heightM);
        
        return {
            bmi: bmi.toFixed(1),
            category,
            color,
            description,
            healthRisk,
            idealWeightRange: {
                min: minIdealWeight,
                max: maxIdealWeight
            },
            currentWeight: weightKg
        };
    }

    function displayBmiResults(bmiData, age, gender, isMetric) {
        const weightUnit = isMetric ? 'kg' : 'lbs';
        const minIdealDisplay = isMetric ? bmiData.idealWeightRange.min.toFixed(1) : (bmiData.idealWeightRange.min * 2.20462).toFixed(1);
        const maxIdealDisplay = isMetric ? bmiData.idealWeightRange.max.toFixed(1) : (bmiData.idealWeightRange.max * 2.20462).toFixed(1);
        const currentWeightDisplay = isMetric ? bmiData.currentWeight.toFixed(1) : (bmiData.currentWeight * 2.20462).toFixed(1);

        const resultsHTML = `
            <div class="bmi-summary">
                <div class="bmi-score" style="border-color: ${bmiData.color}">
                    <div class="bmi-number" style="color: ${bmiData.color}">${bmiData.bmi}</div>
                    <div class="bmi-unit">BMI</div>
                </div>
                <div class="bmi-category">
                    <h3 style="color: ${bmiData.color}">${bmiData.category}</h3>
                    <p>${bmiData.description}</p>
                </div>
            </div>

            <div class="bmi-analysis">
                <div class="analysis-card">
                    <h4><i class="fas fa-heartbeat"></i> Health Assessment</h4>
                    <p>${bmiData.healthRisk}</p>
                    <div class="bmi-scale">
                        <div class="scale-bar">
                            <div class="scale-segment underweight" style="width: 18.5%"></div>
                            <div class="scale-segment normal" style="width: 24.9%"></div>
                            <div class="scale-segment overweight" style="width: 29.9%"></div>
                            <div class="scale-segment obese" style="width: 26.7%"></div>
                        </div>
                        <div class="scale-marker" style="left: ${Math.min(parseFloat(bmiData.bmi) * 2.5, 95)}%"></div>
                        <div class="scale-labels">
                            <span>18.5</span>
                            <span>25</span>
                            <span>30</span>
                            <span>40+</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-weight"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${currentWeightDisplay}</div>
                        <div class="stat-label">Current Weight (${weightUnit})</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${minIdealDisplay} - ${maxIdealDisplay}</div>
                        <div class="stat-label">Ideal Weight Range (${weightUnit})</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${calculateWeightDifference(bmiData, isMetric)}</div>
                        <div class="stat-label">Weight Difference</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${getRiskLevel(parseFloat(bmiData.bmi))}</div>
                        <div class="stat-label">Health Risk Level</div>
                    </div>
                </div>
            </div>

            <div class="recommendations">
                <div class="recommendation-card">
                    <h4><i class="fas fa-lightbulb"></i> Recommendations</h4>
                    <div class="recommendation-content">
                        ${getRecommendations(bmiData.category, age, gender)}
                    </div>
                </div>
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
    }

    function calculateWeightDifference(bmiData, isMetric) {
        const currentWeight = bmiData.currentWeight;
        const minIdeal = bmiData.idealWeightRange.min;
        const maxIdeal = bmiData.idealWeightRange.max;
        
        let difference, direction;
        
        if (currentWeight < minIdeal) {
            difference = minIdeal - currentWeight;
            direction = 'gain';
        } else if (currentWeight > maxIdeal) {
            difference = currentWeight - maxIdeal;
            direction = 'lose';
        } else {
            return 'Within ideal range';
        }
        
        const displayDiff = isMetric ? difference.toFixed(1) : (difference * 2.20462).toFixed(1);
        const unit = isMetric ? 'kg' : 'lbs';
        
        return `${displayDiff} ${unit} to ${direction}`;
    }

    function getRiskLevel(bmi) {
        if (bmi < 18.5) return 'Moderate';
        if (bmi < 25) return 'Low';
        if (bmi < 30) return 'Moderate';
        if (bmi < 35) return 'High';
        if (bmi < 40) return 'Very High';
        return 'Extreme';
    }

    function getRecommendations(category, age, gender) {
        const baseRecommendations = {
            'Underweight': [
                'Consult with a healthcare provider to rule out underlying conditions',
                'Focus on nutrient-dense, calorie-rich foods',
                'Consider strength training to build muscle mass',
                'Eat frequent, smaller meals throughout the day'
            ],
            'Normal Weight': [
                'Maintain current weight through balanced diet and regular exercise',
                'Aim for 150 minutes of moderate aerobic activity per week',
                'Include strength training exercises twice per week',
                'Continue monitoring your weight regularly'
            ],
            'Overweight': [
                'Aim for gradual weight loss of 1-2 pounds per week',
                'Reduce caloric intake by 500-750 calories per day',
                'Increase physical activity to 300 minutes per week',
                'Focus on whole foods and reduce processed foods'
            ],
            'Obese Class I': [
                'Consult with a healthcare provider for a weight management plan',
                'Target 5-10% weight loss as an initial goal',
                'Combine diet modifications with regular physical activity',
                'Consider working with a registered dietitian'
            ],
            'Obese Class II': [
                'Seek professional medical guidance immediately',
                'Consider comprehensive weight management programs',
                'Evaluate potential underlying medical conditions',
                'Discuss various treatment options with healthcare providers'
            ],
            'Obese Class III': [
                'Immediate medical consultation is strongly recommended',
                'Consider medically supervised weight loss programs',
                'Evaluate eligibility for bariatric surgery',
                'Address any obesity-related health complications'
            ]
        };

        const recommendations = baseRecommendations[category] || baseRecommendations['Normal Weight'];
        
        return recommendations.map(rec => `<div class="recommendation-item"><i class="fas fa-check-circle"></i> ${rec}</div>`).join('');
    }

    function clearInputs() {
        document.getElementById('weightKg').value = '';
        document.getElementById('heightCm').value = '';
        document.getElementById('weightLbs').value = '';
        document.getElementById('heightFt').value = '';
        document.getElementById('heightIn').value = '';
        document.getElementById('age').value = '';
        document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
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
                <i class="fas fa-weight"></i>
                <p>Enter your weight and height to calculate your BMI</p>
            </div>
        `;
    }
}
