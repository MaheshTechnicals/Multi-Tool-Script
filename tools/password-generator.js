// Password Generator Tool JavaScript

class PasswordGenerator {
    constructor() {
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        this.generateBtn = document.getElementById('generateBtn');
        this.generateMultipleBtn = document.getElementById('generateMultipleBtn');
        this.passwordResults = document.getElementById('passwordResults');
        this.passwordStrength = document.getElementById('passwordStrength');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthInfo = document.getElementById('strengthInfo');
        
        // Character sets
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            similar: '0O1lI'
        };
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.passwordLength.addEventListener('input', () => this.updateLengthValue());
        this.generateBtn.addEventListener('click', () => this.generateSinglePassword());
        this.generateMultipleBtn.addEventListener('click', () => this.generateMultiplePasswords());
        
        // Update length value initially
        this.updateLengthValue();
    }
    
    updateLengthValue() {
        this.lengthValue.textContent = this.passwordLength.value;
    }
    
    getCharacterSet() {
        let charset = '';
        
        if (this.includeUppercase.checked) {
            charset += this.charSets.uppercase;
        }
        if (this.includeLowercase.checked) {
            charset += this.charSets.lowercase;
        }
        if (this.includeNumbers.checked) {
            charset += this.charSets.numbers;
        }
        if (this.includeSymbols.checked) {
            charset += this.charSets.symbols;
        }
        
        // Remove similar characters if option is checked
        if (this.excludeSimilar.checked) {
            for (let char of this.charSets.similar) {
                charset = charset.replace(new RegExp(char, 'g'), '');
            }
        }
        
        return charset;
    }
    
    generatePassword(length, charset) {
        if (!charset) {
            throw new Error('No character types selected');
        }
        
        let password = '';
        
        // Use crypto.getRandomValues for better randomness
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        // Ensure password contains at least one character from each selected type
        password = this.ensureComplexity(password, charset);
        
        return password;
    }
    
    ensureComplexity(password, charset) {
        const length = password.length;
        let hasUpper = false, hasLower = false, hasNumber = false, hasSymbol = false;
        
        // Check what the password currently has
        for (let char of password) {
            if (this.includeUppercase.checked && this.charSets.uppercase.includes(char)) hasUpper = true;
            if (this.includeLowercase.checked && this.charSets.lowercase.includes(char)) hasLower = true;
            if (this.includeNumbers.checked && this.charSets.numbers.includes(char)) hasNumber = true;
            if (this.includeSymbols.checked && this.charSets.symbols.includes(char)) hasSymbol = true;
        }
        
        // Replace characters to ensure complexity
        let passwordArray = password.split('');
        let replacements = [];
        
        if (this.includeUppercase.checked && !hasUpper) {
            replacements.push(this.getRandomChar(this.charSets.uppercase));
        }
        if (this.includeLowercase.checked && !hasLower) {
            replacements.push(this.getRandomChar(this.charSets.lowercase));
        }
        if (this.includeNumbers.checked && !hasNumber) {
            replacements.push(this.getRandomChar(this.charSets.numbers));
        }
        if (this.includeSymbols.checked && !hasSymbol) {
            replacements.push(this.getRandomChar(this.charSets.symbols));
        }
        
        // Replace random positions with required characters
        for (let i = 0; i < replacements.length && i < length; i++) {
            const randomIndex = Math.floor(Math.random() * length);
            passwordArray[randomIndex] = replacements[i];
        }
        
        return passwordArray.join('');
    }
    
    getRandomChar(charset) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return charset[array[0] % charset.length];
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        // Length scoring
        if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else if (password.length >= 6) score += 10;
        else score += 5;
        
        // Character variety scoring
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        
        // Additional complexity
        if (password.length >= 16) score += 10;
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) score += 10;
        
        // Determine strength level
        let level, color, description;
        if (score >= 80) {
            level = 'Very Strong';
            color = '#00d4aa';
            description = 'Excellent! This password is very secure.';
        } else if (score >= 60) {
            level = 'Strong';
            color = '#4a9eff';
            description = 'Good! This password is quite secure.';
        } else if (score >= 40) {
            level = 'Medium';
            color = '#ffa500';
            description = 'Fair. Consider making it longer or more complex.';
        } else if (score >= 20) {
            level = 'Weak';
            color = '#ff6b6b';
            description = 'Weak. This password needs improvement.';
        } else {
            level = 'Very Weak';
            color = '#ff4757';
            description = 'Very weak. This password is not secure.';
        }
        
        return { score, level, color, description };
    }
    
    generateSinglePassword() {
        try {
            const charset = this.getCharacterSet();
            const length = parseInt(this.passwordLength.value);
            const password = this.generatePassword(length, charset);
            
            this.displaySinglePassword(password);
            this.showPasswordStrength(password);
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    generateMultiplePasswords() {
        try {
            const charset = this.getCharacterSet();
            const length = parseInt(this.passwordLength.value);
            const passwords = [];
            
            for (let i = 0; i < 5; i++) {
                passwords.push(this.generatePassword(length, charset));
            }
            
            this.displayMultiplePasswords(passwords);
            this.passwordStrength.style.display = 'none';
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    displaySinglePassword(password) {
        this.passwordResults.innerHTML = `
            <div class="password-item">
                <div class="password-text" id="generatedPassword">${password}</div>
                <div class="password-actions">
                    <button class="copy-btn" onclick="copyPassword('generatedPassword', this)" title="Copy password">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="regenerate-btn" onclick="passwordGenerator.generateSinglePassword()" title="Generate new password">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    displayMultiplePasswords(passwords) {
        const passwordsHTML = passwords.map((password, index) => `
            <div class="password-item">
                <div class="password-text" id="password-${index}">${password}</div>
                <div class="password-actions">
                    <button class="copy-btn" onclick="copyPassword('password-${index}', this)" title="Copy password">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        this.passwordResults.innerHTML = passwordsHTML;
    }
    
    showPasswordStrength(password) {
        const strength = this.calculatePasswordStrength(password);
        
        this.strengthBar.style.width = `${strength.score}%`;
        this.strengthBar.style.backgroundColor = strength.color;
        
        this.strengthInfo.innerHTML = `
            <div class="strength-level" style="color: ${strength.color}">
                <strong>${strength.level}</strong> (${strength.score}/100)
            </div>
            <div class="strength-description">${strength.description}</div>
        `;
        
        this.passwordStrength.style.display = 'block';
    }
    
    showError(message) {
        this.passwordResults.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <small>Please select at least one character type.</small>
            </div>
        `;
        this.passwordStrength.style.display = 'none';
    }
}

// Copy password function
function copyPassword(passwordId, button) {
    const passwordElement = document.getElementById(passwordId);
    const password = passwordElement.textContent;
    
    navigator.clipboard.writeText(password).then(() => {
        // Show success feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#00d4aa';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#00d4aa';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    });
}

// Global variable for access from HTML
let passwordGenerator;

// Initialize the Password Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    passwordGenerator = new PasswordGenerator();
});

// Navigation functionality for tool pages
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});
