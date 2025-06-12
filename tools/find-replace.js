// Find & Replace Tool JavaScript

class FindReplace {
    constructor() {
        this.findText = document.getElementById('findText');
        this.replaceText = document.getElementById('replaceText');
        this.inputText = document.getElementById('inputText');
        this.caseSensitive = document.getElementById('caseSensitive');
        this.wholeWords = document.getElementById('wholeWords');
        this.useRegex = document.getElementById('useRegex');
        this.findBtn = document.getElementById('findBtn');
        this.replaceBtn = document.getElementById('replaceBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.copyResultBtn = document.getElementById('copyResultBtn');
        this.findResults = document.getElementById('findResults');
        
        this.matches = [];
        this.processedText = '';
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.findBtn.addEventListener('click', () => this.findAll());
        this.replaceBtn.addEventListener('click', () => this.replaceAll());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        this.copyResultBtn.addEventListener('click', () => this.copyResult());
        
        // Real-time search on input change
        this.findText.addEventListener('input', () => {
            if (this.findText.value.trim()) {
                this.findAll();
            } else {
                this.showEmptyState();
            }
        });
        
        // Update search when options change
        this.caseSensitive.addEventListener('change', () => this.updateSearch());
        this.wholeWords.addEventListener('change', () => this.updateSearch());
        this.useRegex.addEventListener('change', () => this.updateSearch());
        
        // Focus on find input
        this.findText.focus();
    }
    
    updateSearch() {
        if (this.findText.value.trim()) {
            this.findAll();
        }
    }
    
    createSearchPattern() {
        let searchText = this.findText.value;
        
        if (!searchText.trim()) {
            throw new Error('Please enter text to find');
        }
        
        if (this.useRegex.checked) {
            try {
                const flags = this.caseSensitive.checked ? 'g' : 'gi';
                return new RegExp(searchText, flags);
            } catch (error) {
                throw new Error('Invalid regular expression: ' + error.message);
            }
        } else {
            // Escape special regex characters for literal search
            const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            let pattern = escapedText;
            if (this.wholeWords.checked) {
                pattern = '\\b' + pattern + '\\b';
            }
            
            const flags = this.caseSensitive.checked ? 'g' : 'gi';
            return new RegExp(pattern, flags);
        }
    }
    
    findAll() {
        try {
            const text = this.inputText.value;
            const pattern = this.createSearchPattern();
            
            this.matches = [];
            let match;
            
            // Find all matches
            while ((match = pattern.exec(text)) !== null) {
                this.matches.push({
                    text: match[0],
                    index: match.index,
                    length: match[0].length
                });
                
                // Prevent infinite loop with zero-length matches
                if (match.index === pattern.lastIndex) {
                    pattern.lastIndex++;
                }
            }
            
            this.displayMatches(text);
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    replaceAll() {
        try {
            const text = this.inputText.value;
            const pattern = this.createSearchPattern();
            const replacement = this.replaceText.value;
            
            // Perform replacement
            this.processedText = text.replace(pattern, replacement);
            
            // Update the input text with the result
            this.inputText.value = this.processedText;
            
            // Count replacements made
            const originalMatches = this.matches.length;
            
            // Update matches after replacement
            this.findAll();
            
            const replacementsMade = originalMatches - this.matches.length;
            
            this.displayReplacementResult(replacementsMade);
            this.copyResultBtn.style.display = 'inline-flex';
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    displayMatches(text) {
        if (this.matches.length === 0) {
            this.findResults.innerHTML = `
                <div class="no-matches">
                    <i class="fas fa-search"></i>
                    <h4>No matches found</h4>
                    <p>Try adjusting your search term or options</p>
                </div>
            `;
            return;
        }
        
        // Create highlighted text
        const highlightedText = this.highlightMatches(text);
        
        this.findResults.innerHTML = `
            <div class="search-summary">
                <div class="match-count">
                    <i class="fas fa-search"></i>
                    Found <strong>${this.matches.length}</strong> match${this.matches.length !== 1 ? 'es' : ''}
                </div>
                <div class="match-details">
                    <span class="detail-item">Search: "${this.escapeHtml(this.findText.value)}"</span>
                    ${this.caseSensitive.checked ? '<span class="option-tag">Case Sensitive</span>' : ''}
                    ${this.wholeWords.checked ? '<span class="option-tag">Whole Words</span>' : ''}
                    ${this.useRegex.checked ? '<span class="option-tag">Regex</span>' : ''}
                </div>
            </div>
            
            <div class="highlighted-text">
                <h4>Text with Matches Highlighted</h4>
                <div class="text-preview">${highlightedText}</div>
            </div>
            
            <div class="match-list">
                <h4>Match Details</h4>
                <div class="matches-container">
                    ${this.matches.map((match, index) => `
                        <div class="match-item">
                            <div class="match-info">
                                <span class="match-number">#${index + 1}</span>
                                <span class="match-text">"${this.escapeHtml(match.text)}"</span>
                                <span class="match-position">Position: ${match.index}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    highlightMatches(text) {
        if (this.matches.length === 0) return this.escapeHtml(text);
        
        let result = '';
        let lastIndex = 0;
        
        // Sort matches by index to process them in order
        const sortedMatches = [...this.matches].sort((a, b) => a.index - b.index);
        
        sortedMatches.forEach(match => {
            // Add text before the match
            result += this.escapeHtml(text.substring(lastIndex, match.index));
            
            // Add highlighted match
            result += `<mark class="highlight-match">${this.escapeHtml(match.text)}</mark>`;
            
            lastIndex = match.index + match.length;
        });
        
        // Add remaining text
        result += this.escapeHtml(text.substring(lastIndex));
        
        return result;
    }
    
    displayReplacementResult(replacementsMade) {
        this.findResults.innerHTML = `
            <div class="replacement-summary">
                <div class="replacement-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="replacement-info">
                    <h4>Replacement Complete</h4>
                    <p>Made <strong>${replacementsMade}</strong> replacement${replacementsMade !== 1 ? 's' : ''}</p>
                    <div class="replacement-details">
                        <div class="detail-row">
                            <span class="detail-label">Found:</span>
                            <span class="detail-value">"${this.escapeHtml(this.findText.value)}"</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Replaced with:</span>
                            <span class="detail-value">"${this.escapeHtml(this.replaceText.value)}"</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${this.matches.length > 0 ? `
                <div class="remaining-matches">
                    <h4>Remaining Matches</h4>
                    <p>${this.matches.length} match${this.matches.length !== 1 ? 'es' : ''} still found in the text</p>
                </div>
            ` : ''}
        `;
    }
    
    showEmptyState() {
        this.findResults.innerHTML = `
            <div class="no-content">
                <i class="fas fa-search-plus"></i>
                <p>Enter search text and click "Find All" to see matches</p>
            </div>
        `;
    }
    
    showError(message) {
        this.findResults.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Search Error</h4>
                <p>${message}</p>
            </div>
        `;
    }
    
    clearAll() {
        this.findText.value = '';
        this.replaceText.value = '';
        this.inputText.value = '';
        this.matches = [];
        this.processedText = '';
        this.copyResultBtn.style.display = 'none';
        this.showEmptyState();
        this.findText.focus();
        
        // Add clear animation
        this.inputText.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.inputText.style.transform = 'scale(1)';
        }, 150);
    }
    
    loadSample() {
        const sampleText = `Welcome to Multi-Tool Hub! This is a sample text for testing the find and replace functionality.

You can search for words like "sample", "text", or "find" to see how the tool works. The tool supports case-sensitive searches, whole word matching, and even regular expressions for advanced users.

For example, you could:
- Find all instances of "tool" and replace with "utility"
- Search for email patterns using regex: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
- Replace multiple spaces with single spaces using regex: \\s+ → (space)

This sample text contains various words and patterns to help you test different search and replace scenarios. Try different combinations of options to see how they affect the results!`;
        
        this.inputText.value = sampleText;
        this.findText.value = 'tool';
        this.replaceText.value = 'utility';
        
        // Automatically find matches
        this.findAll();
        
        // Add load animation
        this.inputText.style.opacity = '0.5';
        setTimeout(() => {
            this.inputText.style.opacity = '1';
        }, 200);
    }
    
    copyResult() {
        const textToCopy = this.inputText.value;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showCopyFeedback();
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyFeedback();
        });
    }
    
    showCopyFeedback() {
        const originalText = this.copyResultBtn.innerHTML;
        this.copyResultBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.copyResultBtn.style.color = '#00d4aa';
        
        setTimeout(() => {
            this.copyResultBtn.innerHTML = originalText;
            this.copyResultBtn.style.color = '';
        }, 2000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the Find & Replace tool when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new FindReplace();
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
