// Image to Base64 Converter Tool JavaScript

class ImageToBase64Converter {
    constructor() {
        this.originalImage = null;
        this.base64String = '';
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // File input elements
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        
        // Options
        this.includeDataUri = document.getElementById('includeDataUri');
        this.addLineBreaks = document.getElementById('addLineBreaks');
        
        // Action buttons
        this.convertBtn = document.getElementById('convertBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.copyBtn = document.getElementById('copyBtn');
        
        // Display elements
        this.noImageState = document.getElementById('noImageState');
        this.outputContainer = document.getElementById('outputContainer');
        this.previewImage = document.getElementById('previewImage');
        this.imageInfo = document.getElementById('imageInfo');
        this.base64Output = document.getElementById('base64Output');
        this.htmlExample = document.getElementById('htmlExample');
        this.cssExample = document.getElementById('cssExample');
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.imageInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.imageInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Option changes
        this.includeDataUri.addEventListener('change', this.updateOutput.bind(this));
        this.addLineBreaks.addEventListener('change', this.updateOutput.bind(this));

        // Action buttons
        this.convertBtn.addEventListener('click', this.convertToBase64.bind(this));
        this.resetBtn.addEventListener('click', this.resetTool.bind(this));
        this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (5MB limit for Base64)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('File size must be less than 5MB for Base64 conversion.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result, file);
        };
        reader.readAsDataURL(file);
    }

    loadImage(src, file) {
        const img = new Image();
        img.onload = () => {
            this.originalImage = {
                element: img,
                file: file,
                src: src,
                width: img.naturalWidth,
                height: img.naturalHeight,
                size: file.size,
                type: file.type
            };
            
            this.displayImage();
            this.convertBtn.disabled = false;
        };
        img.src = src;
    }

    displayImage() {
        this.previewImage.src = this.originalImage.src;
        this.imageInfo.textContent = this.formatImageInfo();
        
        this.noImageState.style.display = 'none';
        this.outputContainer.style.display = 'block';
    }

    formatImageInfo() {
        const formatName = this.getFormatName(this.originalImage.type);
        const sizeKB = Math.round(this.originalImage.size / 1024);
        return `${formatName} • ${this.originalImage.width}×${this.originalImage.height} • ${sizeKB} KB`;
    }

    getFormatName(mimeType) {
        const formats = {
            'image/jpeg': 'JPG',
            'image/png': 'PNG',
            'image/webp': 'WebP',
            'image/gif': 'GIF'
        };
        return formats[mimeType] || 'Unknown';
    }

    convertToBase64() {
        if (!this.originalImage) return;

        this.convertBtn.disabled = true;
        this.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

        try {
            // Extract base64 data from data URL
            this.base64String = this.originalImage.src.split(',')[1];
            
            this.updateOutput();
            this.updateExamples();
            
        } catch (error) {
            this.showError('Conversion failed. Please try again.');
            console.error('Conversion error:', error);
        } finally {
            this.convertBtn.disabled = false;
            this.convertBtn.innerHTML = '<i class="fas fa-code"></i> Convert to Base64';
        }
    }

    updateOutput() {
        if (!this.base64String) return;

        let output = this.base64String;

        // Add data URI prefix if requested
        if (this.includeDataUri.checked) {
            output = `data:${this.originalImage.type};base64,${output}`;
        }

        // Add line breaks if requested
        if (this.addLineBreaks.checked) {
            output = this.addLineBreaksToString(output, 76);
        }

        this.base64Output.value = output;
    }

    addLineBreaksToString(str, lineLength) {
        const lines = [];
        for (let i = 0; i < str.length; i += lineLength) {
            lines.push(str.substring(i, i + lineLength));
        }
        return lines.join('\n');
    }

    updateExamples() {
        const dataUri = `data:${this.originalImage.type};base64,${this.base64String}`;
        
        this.htmlExample.textContent = `<img src="${dataUri}" alt="Image">`;
        this.cssExample.textContent = `background-image: url('${dataUri}');`;
    }

    copyToClipboard() {
        if (!this.base64Output.value) return;

        navigator.clipboard.writeText(this.base64Output.value).then(() => {
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            this.base64Output.select();
            document.execCommand('copy');
            
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.classList.remove('copied');
            }, 2000);
        });
    }

    resetTool() {
        this.originalImage = null;
        this.base64String = '';
        
        this.imageInput.value = '';
        this.includeDataUri.checked = true;
        this.addLineBreaks.checked = false;
        
        this.noImageState.style.display = 'block';
        this.outputContainer.style.display = 'none';
        this.base64Output.value = '';
        
        this.convertBtn.disabled = true;
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageToBase64Converter();
});
