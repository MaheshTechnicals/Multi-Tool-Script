// Lorem Ipsum Generator Tool JavaScript

class LoremGenerator {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.paragraphCount = document.getElementById('paragraphCount');
        this.wordCount = document.getElementById('wordCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.paragraphValue = document.getElementById('paragraphValue');
        this.wordValue = document.getElementById('wordValue');
        this.sentenceValue = document.getElementById('sentenceValue');
        this.startWithLorem = document.getElementById('startWithLorem');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.loremResults = document.getElementById('loremResults');
        
        this.currentType = 'paragraphs';
        
        // Lorem Ipsum word bank
        this.loremWords = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
            'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
            'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
            'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
            'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
            'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
            'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
            'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
            'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
            'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos',
            'qui', 'ratione', 'voluptatem', 'sequi', 'nesciunt', 'neque', 'porro',
            'quisquam', 'est', 'qui', 'dolorem', 'ipsum', 'quia', 'dolor', 'sit',
            'amet', 'consectetur', 'adipisci', 'velit', 'sed', 'quia', 'non', 'numquam',
            'eius', 'modi', 'tempora', 'incidunt', 'ut', 'labore', 'et', 'dolore',
            'magnam', 'aliquam', 'quaerat', 'voluptatem'
        ];
        
        this.classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        
        this.init();
    }
    
    init() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.type));
        });
        
        // Slider updates
        this.paragraphCount.addEventListener('input', () => this.updateValue('paragraph'));
        this.wordCount.addEventListener('input', () => this.updateValue('word'));
        this.sentenceCount.addEventListener('input', () => this.updateValue('sentence'));
        
        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateLorem());
        
        // Copy all button
        this.copyAllBtn.addEventListener('click', () => this.copyAllText());
        
        // Initial value updates
        this.updateValue('paragraph');
        this.updateValue('word');
        this.updateValue('sentence');
    }
    
    switchTab(type) {
        this.currentType = type;
        
        // Update active tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Show/hide option groups
        document.getElementById('paragraphsOption').style.display = type === 'paragraphs' ? 'block' : 'none';
        document.getElementById('wordsOption').style.display = type === 'words' ? 'block' : 'none';
        document.getElementById('sentencesOption').style.display = type === 'sentences' ? 'block' : 'none';
    }
    
    updateValue(type) {
        switch(type) {
            case 'paragraph':
                this.paragraphValue.textContent = this.paragraphCount.value;
                break;
            case 'word':
                this.wordValue.textContent = this.wordCount.value;
                break;
            case 'sentence':
                this.sentenceValue.textContent = this.sentenceCount.value;
                break;
        }
    }
    
    generateRandomWord() {
        return this.loremWords[Math.floor(Math.random() * this.loremWords.length)];
    }
    
    generateSentence(minWords = 8, maxWords = 20) {
        const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
        let sentence = [];
        
        for (let i = 0; i < wordCount; i++) {
            sentence.push(this.generateRandomWord());
        }
        
        // Capitalize first word and add period
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        return sentence.join(' ') + '.';
    }
    
    generateParagraph(sentenceCount = null) {
        const sentences = sentenceCount || Math.floor(Math.random() * 5) + 3; // 3-7 sentences
        let paragraph = [];
        
        for (let i = 0; i < sentences; i++) {
            paragraph.push(this.generateSentence());
        }
        
        return paragraph.join(' ');
    }
    
    generateWords(count) {
        let words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.generateRandomWord());
        }
        return words.join(' ');
    }
    
    generateSentences(count) {
        let sentences = [];
        for (let i = 0; i < count; i++) {
            sentences.push(this.generateSentence());
        }
        return sentences.join(' ');
    }
    
    generateLorem() {
        let result = '';
        const startWithClassic = this.startWithLorem.checked;
        
        switch(this.currentType) {
            case 'paragraphs':
                const paragraphCount = parseInt(this.paragraphCount.value);
                let paragraphs = [];
                
                for (let i = 0; i < paragraphCount; i++) {
                    if (i === 0 && startWithClassic) {
                        // Start with classic Lorem Ipsum
                        let firstParagraph = this.classicStart;
                        // Add more sentences to complete the paragraph
                        const additionalSentences = Math.floor(Math.random() * 3) + 2;
                        for (let j = 0; j < additionalSentences; j++) {
                            firstParagraph += ' ' + this.generateSentence();
                        }
                        paragraphs.push(firstParagraph);
                    } else {
                        paragraphs.push(this.generateParagraph());
                    }
                }
                result = paragraphs.join('\n\n');
                break;
                
            case 'words':
                const wordCount = parseInt(this.wordCount.value);
                if (startWithClassic && wordCount > 10) {
                    const classicWords = this.classicStart.split(' ').slice(0, Math.min(10, wordCount));
                    const remainingWords = wordCount - classicWords.length;
                    result = classicWords.join(' ');
                    if (remainingWords > 0) {
                        result += ' ' + this.generateWords(remainingWords);
                    }
                } else {
                    result = this.generateWords(wordCount);
                }
                break;
                
            case 'sentences':
                const sentenceCount = parseInt(this.sentenceCount.value);
                let sentences = [];
                
                if (startWithClassic && sentenceCount > 0) {
                    sentences.push(this.classicStart);
                    for (let i = 1; i < sentenceCount; i++) {
                        sentences.push(this.generateSentence());
                    }
                } else {
                    for (let i = 0; i < sentenceCount; i++) {
                        sentences.push(this.generateSentence());
                    }
                }
                result = sentences.join(' ');
                break;
        }
        
        this.displayResult(result);
    }
    
    displayResult(text) {
        this.loremResults.innerHTML = `
            <div class="lorem-output">
                <div class="output-header">
                    <h4>Generated Lorem Ipsum</h4>
                    <button class="copy-btn" onclick="copyLoremText(this)" title="Copy to clipboard">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="output-text" id="generatedText">${this.formatText(text)}</div>
                <div class="output-stats">
                    <span class="stat-item">Words: ${this.countWords(text)}</span>
                    <span class="stat-item">Characters: ${text.length}</span>
                    <span class="stat-item">Paragraphs: ${this.countParagraphs(text)}</span>
                </div>
            </div>
        `;
        
        this.copyAllBtn.style.display = 'inline-flex';
    }
    
    formatText(text) {
        // Convert line breaks to paragraphs for HTML display
        return text.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
    }
    
    countWords(text) {
        return text.trim().split(/\s+/).length;
    }
    
    countParagraphs(text) {
        return text.split('\n\n').length;
    }
    
    copyAllText() {
        const textElement = document.getElementById('generatedText');
        const text = textElement.textContent || textElement.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showCopyFeedback(this.copyAllBtn);
        }).catch(() => {
            this.fallbackCopy(text);
            this.showCopyFeedback(this.copyAllBtn);
        });
    }
    
    showCopyFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.color = '#00d4aa';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
        }, 2000);
    }
    
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Copy function for individual text blocks
function copyLoremText(button) {
    const textElement = button.parentElement.nextElementSibling;
    const text = textElement.textContent || textElement.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
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
        
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#00d4aa';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    });
}

// Initialize the Lorem Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LoremGenerator();
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
