// Binary Converter Tool JavaScript

class BinaryConverter {
    constructor() {
        this.modeButtons = document.querySelectorAll('.tab-btn');
        this.inputText = document.getElementById('inputText');
        this.inputLabel = document.getElementById('inputLabel');
        this.includeSpaces = document.getElementById('includeSpaces');
        this.showAscii = document.getElementById('showAscii');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.binaryResults = document.getElementById('binaryResults');
        
        this.currentMode = 'text-to-binary';
        
        this.init();
    }
    
    init() {
        // Mode switching
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => this.switchMode(button.dataset.mode));
        });
        
        // Real-time conversion
        this.inputText.addEventListener('input', () => this.performConversion());
        this.includeSpaces.addEventListener('change', () => this.performConversion());
        this.showAscii.addEventListener('change', () => this.performConversion());
        
        // Button events
        this.convertBtn.addEventListener('click', () => this.performConversion());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        
        // Focus on input
        this.inputText.focus();
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active tab
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Update UI based on mode
        if (mode === 'text-to-binary') {
            this.inputLabel.innerHTML = '<i class="fas fa-edit"></i> Enter text to convert to binary';
            this.inputText.placeholder = 'Type your text here...';
            this.includeSpaces.parentElement.style.display = 'flex';
        } else {
            this.inputLabel.innerHTML = '<i class="fas fa-code"></i> Enter binary code to convert to text';
            this.inputText.placeholder = 'Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)...';
            this.includeSpaces.parentElement.style.display = 'none';
        }
        
        // Clear input and results
        this.inputText.value = '';
        this.showEmptyState();
    }
    
    performConversion() {
        const input = this.inputText.value.trim();
        
        if (!input) {
            this.showEmptyState();
            return;
        }
        
        try {
            if (this.currentMode === 'text-to-binary') {
                this.convertTextToBinary(input);
            } else {
                this.convertBinaryToText(input);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    convertTextToBinary(text) {
        let binaryResult = '';
        let asciiValues = [];
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const ascii = char.charCodeAt(0);
            const binary = ascii.toString(2).padStart(8, '0');
            
            asciiValues.push({
                char: char === ' ' ? 'Space' : char,
                ascii: ascii,
                binary: binary
            });
            
            if (this.includeSpaces.checked) {
                binaryResult += (i > 0 ? ' ' : '') + binary;
            } else {
                binaryResult += binary;
            }
        }
        
        this.displayResult(binaryResult, asciiValues, 'binary');
    }
    
    convertBinaryToText(binary) {
        // Clean the binary input (remove spaces and validate)
        const cleanBinary = binary.replace(/\s/g, '');
        
        // Validate binary input
        if (!/^[01]+$/.test(cleanBinary)) {
            throw new Error('Invalid binary input. Please use only 0s and 1s.');
        }
        
        if (cleanBinary.length % 8 !== 0) {
            throw new Error('Binary input must be in groups of 8 bits (bytes).');
        }
        
        let textResult = '';
        let asciiValues = [];
        
        // Process 8 bits at a time
        for (let i = 0; i < cleanBinary.length; i += 8) {
            const binaryByte = cleanBinary.substr(i, 8);
            const ascii = parseInt(binaryByte, 2);
            const char = String.fromCharCode(ascii);
            
            textResult += char;
            asciiValues.push({
                char: char === ' ' ? 'Space' : (char.charCodeAt(0) < 32 ? `[${ascii}]` : char),
                ascii: ascii,
                binary: binaryByte
            });
        }
        
        this.displayResult(textResult, asciiValues, 'text');
    }
    
    displayResult(result, asciiValues, resultType) {
        const resultTypeLabel = resultType === 'binary' ? 'Binary Code' : 'Decoded Text';
        const resultIcon = resultType === 'binary' ? 'fas fa-code' : 'fas fa-font';
        
        let asciiTable = '';
        if (this.showAscii.checked && asciiValues.length > 0) {
            asciiTable = `
                <div class="ascii-table">
                    <h4>Character Breakdown</h4>
                    <div class="ascii-grid">
                        ${asciiValues.map(item => `
                            <div class="ascii-item">
                                <div class="ascii-char">${this.escapeHtml(item.char)}</div>
                                <div class="ascii-value">ASCII: ${item.ascii}</div>
                                <div class="ascii-binary">${item.binary}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        this.binaryResults.innerHTML = `
            <div class="conversion-output">
                <div class="output-header">
                    <h4><i class="${resultIcon}"></i> ${resultTypeLabel}</h4>
                    <button class="copy-btn" onclick="copyBinaryResult(this)" title="Copy to clipboard">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="output-text" id="conversionResult">${this.formatResult(result, resultType)}</div>
                <div class="output-stats">
                    <span class="stat-item">Characters: ${resultType === 'text' ? result.length : result.replace(/\s/g, '').length / 8}</span>
                    <span class="stat-item">Bytes: ${resultType === 'text' ? result.length : result.replace(/\s/g, '').length / 8}</span>
                    ${resultType === 'binary' ? `<span class="stat-item">Bits: ${result.replace(/\s/g, '').length}</span>` : ''}
                </div>
                ${asciiTable}
            </div>
        `;
    }
    
    formatResult(result, resultType) {
        if (resultType === 'binary') {
            // Format binary with syntax highlighting
            return `<code class="binary-code">${this.escapeHtml(result)}</code>`;
        } else {
            // Format text with proper escaping
            return `<div class="text-result">${this.escapeHtml(result)}</div>`;
        }
    }
    
    showEmptyState() {
        this.binaryResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-code"></i>
                <p>Enter ${this.currentMode === 'text-to-binary' ? 'text' : 'binary code'} to see the conversion</p>
            </div>
        `;
    }
    
    showError(message) {
        this.binaryResults.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Conversion Error</h4>
                <p>${message}</p>
            </div>
        `;
    }
    
    clearInput() {
        this.inputText.value = '';
        this.inputText.focus();
        this.showEmptyState();
        
        // Add clear animation
        this.inputText.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.inputText.style.transform = 'scale(1)';
        }, 150);
    }
    
    loadSample() {
        let sampleText;
        
        if (this.currentMode === 'text-to-binary') {
            sampleText = 'Hello World!';
        } else {
            // Binary for "Hello World!"
            sampleText = '01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100 00100001';
        }
        
        this.inputText.value = sampleText;
        this.performConversion();
        
        // Add load animation
        this.inputText.style.opacity = '0.5';
        setTimeout(() => {
            this.inputText.style.opacity = '1';
        }, 200);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Copy function for conversion results
function copyBinaryResult(button) {
    const resultElement = document.getElementById('conversionResult');
    const text = resultElement.textContent || resultElement.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
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
        textArea.value = text;
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

// Initialize the Binary Converter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new BinaryConverter();
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
