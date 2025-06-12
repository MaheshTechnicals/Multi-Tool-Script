// Case Converter Tool JavaScript

class CaseConverter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.resultsContainer = document.getElementById('conversionResults');
        
        this.conversions = [
            {
                id: 'uppercase',
                name: 'UPPERCASE',
                description: 'All letters in uppercase',
                icon: 'fas fa-arrow-up',
                convert: (text) => text.toUpperCase()
            },
            {
                id: 'lowercase',
                name: 'lowercase',
                description: 'All letters in lowercase',
                icon: 'fas fa-arrow-down',
                convert: (text) => text.toLowerCase()
            },
            {
                id: 'titlecase',
                name: 'Title Case',
                description: 'First letter of each word capitalized',
                icon: 'fas fa-heading',
                convert: (text) => this.toTitleCase(text)
            },
            {
                id: 'sentencecase',
                name: 'Sentence case',
                description: 'First letter of each sentence capitalized',
                icon: 'fas fa-paragraph',
                convert: (text) => this.toSentenceCase(text)
            },
            {
                id: 'camelcase',
                name: 'camelCase',
                description: 'First word lowercase, subsequent words capitalized',
                icon: 'fas fa-code',
                convert: (text) => this.toCamelCase(text)
            },
            {
                id: 'pascalcase',
                name: 'PascalCase',
                description: 'All words capitalized, no spaces',
                icon: 'fas fa-code',
                convert: (text) => this.toPascalCase(text)
            },
            {
                id: 'snakecase',
                name: 'snake_case',
                description: 'Words separated by underscores',
                icon: 'fas fa-minus',
                convert: (text) => this.toSnakeCase(text)
            },
            {
                id: 'kebabcase',
                name: 'kebab-case',
                description: 'Words separated by hyphens',
                icon: 'fas fa-minus',
                convert: (text) => this.toKebabCase(text)
            },
            {
                id: 'constantcase',
                name: 'CONSTANT_CASE',
                description: 'All uppercase with underscores',
                icon: 'fas fa-exclamation',
                convert: (text) => this.toConstantCase(text)
            },
            {
                id: 'dotcase',
                name: 'dot.case',
                description: 'Words separated by dots',
                icon: 'fas fa-circle',
                convert: (text) => this.toDotCase(text)
            },
            {
                id: 'pathcase',
                name: 'path/case',
                description: 'Words separated by forward slashes',
                icon: 'fas fa-folder',
                convert: (text) => this.toPathCase(text)
            },
            {
                id: 'alternatingcase',
                name: 'aLtErNaTiNg CaSe',
                description: 'Alternating uppercase and lowercase letters',
                icon: 'fas fa-random',
                convert: (text) => this.toAlternatingCase(text)
            }
        ];
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.textInput.addEventListener('input', () => this.updateConversions());
        this.textInput.addEventListener('paste', () => {
            setTimeout(() => this.updateConversions(), 10);
        });
        
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        
        // Initial conversion update
        this.updateConversions();
        
        // Focus on text input
        this.textInput.focus();
    }
    
    updateConversions() {
        const text = this.textInput.value;
        
        if (!text.trim()) {
            this.showEmptyState();
            return;
        }
        
        this.renderConversions(text);
    }
    
    showEmptyState() {
        this.resultsContainer.innerHTML = `
            <div class="no-content">
                <i class="fas fa-font"></i>
                <p>Enter some text to see conversions</p>
            </div>
        `;
    }
    
    renderConversions(text) {
        const conversionsHTML = this.conversions.map(conversion => {
            const convertedText = conversion.convert(text);
            return `
                <div class="conversion-card">
                    <div class="conversion-header">
                        <div class="conversion-icon">
                            <i class="${conversion.icon}"></i>
                        </div>
                        <div class="conversion-info">
                            <h4 class="conversion-name">${conversion.name}</h4>
                            <p class="conversion-description">${conversion.description}</p>
                        </div>
                        <button class="copy-btn" onclick="copyToClipboard('${conversion.id}', this)" title="Copy to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="conversion-result" id="${conversion.id}-result">
                        ${this.escapeHtml(convertedText)}
                    </div>
                </div>
            `;
        }).join('');
        
        this.resultsContainer.innerHTML = conversionsHTML;
    }
    
    // Conversion methods
    toTitleCase(text) {
        return text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
    
    toSentenceCase(text) {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    }
    
    toCamelCase(text) {
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
                index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '');
    }
    
    toPascalCase(text) {
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, '');
    }
    
    toSnakeCase(text) {
        return text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
    }
    
    toKebabCase(text) {
        return text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('-');
    }
    
    toConstantCase(text) {
        return this.toSnakeCase(text).toUpperCase();
    }
    
    toDotCase(text) {
        return text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('.');
    }
    
    toPathCase(text) {
        return text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('/');
    }
    
    toAlternatingCase(text) {
        return text
            .split('')
            .map((char, index) => 
                index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
            )
            .join('');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    clearText() {
        this.textInput.value = '';
        this.textInput.focus();
        this.updateConversions();
        
        // Add clear animation
        this.textInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.textInput.style.transform = 'scale(1)';
        }, 150);
    }
    
    loadSample() {
        const sampleText = "Hello World! This is a Sample Text for Case Conversion. It includes UPPERCASE, lowercase, and Mixed Case words.";
        
        this.textInput.value = sampleText;
        this.updateConversions();
        
        // Add load animation
        this.textInput.style.opacity = '0.5';
        setTimeout(() => {
            this.textInput.style.opacity = '1';
        }, 200);
    }
}

// Copy to clipboard function
function copyToClipboard(conversionId, button) {
    const resultElement = document.getElementById(conversionId + '-result');
    const text = resultElement.textContent;
    
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

// Initialize the Case Converter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CaseConverter();
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
