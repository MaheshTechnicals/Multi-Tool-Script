// Word Counter Tool JavaScript

class WordCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        
        // Stat elements
        this.wordCountEl = document.getElementById('wordCount');
        this.charCountEl = document.getElementById('charCount');
        this.charCountNoSpacesEl = document.getElementById('charCountNoSpaces');
        this.paragraphCountEl = document.getElementById('paragraphCount');
        this.sentenceCountEl = document.getElementById('sentenceCount');
        this.readingTimeEl = document.getElementById('readingTime');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.textInput.addEventListener('input', () => this.updateStats());
        this.textInput.addEventListener('paste', () => {
            // Small delay to allow paste to complete
            setTimeout(() => this.updateStats(), 10);
        });
        
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        
        // Initial stats update
        this.updateStats();
        
        // Focus on text input
        this.textInput.focus();
    }
    
    updateStats() {
        const text = this.textInput.value;
        
        // Calculate statistics
        const stats = this.calculateStats(text);
        
        // Update UI with animation
        this.animateStatUpdate(this.wordCountEl, stats.words);
        this.animateStatUpdate(this.charCountEl, stats.characters);
        this.animateStatUpdate(this.charCountNoSpacesEl, stats.charactersNoSpaces);
        this.animateStatUpdate(this.paragraphCountEl, stats.paragraphs);
        this.animateStatUpdate(this.sentenceCountEl, stats.sentences);
        this.animateStatUpdate(this.readingTimeEl, stats.readingTime);
    }
    
    calculateStats(text) {
        // Words count
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        // Characters count
        const characters = text.length;
        
        // Characters without spaces
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        
        // Paragraphs count
        const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
        
        // Sentences count
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
        
        // Reading time (average 200 words per minute)
        const readingTime = Math.ceil(words / 200);
        
        return {
            words,
            characters,
            charactersNoSpaces,
            paragraphs,
            sentences,
            readingTime
        };
    }
    
    animateStatUpdate(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue === newValue) return;
        
        // Add animation class
        element.parentElement.parentElement.classList.add('stat-updating');
        
        // Animate the number change
        const duration = 300;
        const steps = 20;
        const stepValue = (newValue - currentValue) / steps;
        let currentStep = 0;
        
        const animation = setInterval(() => {
            currentStep++;
            const value = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = value;
            
            if (currentStep >= steps) {
                clearInterval(animation);
                element.textContent = newValue;
                element.parentElement.parentElement.classList.remove('stat-updating');
            }
        }, duration / steps);
    }
    
    clearText() {
        this.textInput.value = '';
        this.textInput.focus();
        this.updateStats();
        
        // Add clear animation
        this.textInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.textInput.style.transform = 'scale(1)';
        }, 150);
    }
    
    loadSample() {
        const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`;
        
        this.textInput.value = sampleText;
        this.updateStats();
        
        // Add load animation
        this.textInput.style.opacity = '0.5';
        setTimeout(() => {
            this.textInput.style.opacity = '1';
        }, 200);
    }
}

// Additional CSS for animations
const additionalStyles = `
.stat-updating {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

.text-input {
    transition: transform 0.15s ease, opacity 0.2s ease;
}
`;

// Add the additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the Word Counter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new WordCounter();
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
