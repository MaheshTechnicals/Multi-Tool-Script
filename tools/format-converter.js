// Format Converter Tool JavaScript

class FormatConverter {
    constructor() {
        this.originalImage = null;
        this.selectedFormat = null;
        this.quality = 90;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // File input elements
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        
        // Format selection
        this.formatButtons = document.querySelectorAll('.format-btn');
        
        // Quality control
        this.qualityControl = document.getElementById('qualityControl');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        
        // Action buttons
        this.convertBtn = document.getElementById('convertBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Display elements
        this.noImageState = document.getElementById('noImageState');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.downloadSection = document.getElementById('downloadSection');
        this.originalImageEl = document.getElementById('originalImage');
        this.convertedImageEl = document.getElementById('convertedImage');
        this.originalInfo = document.getElementById('originalInfo');
        this.convertedInfo = document.getElementById('convertedInfo');
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.imageInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.imageInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Format selection
        this.formatButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectFormat(btn.dataset.format));
        });

        // Quality control
        this.qualitySlider.addEventListener('input', this.updateQuality.bind(this));

        // Action buttons
        this.convertBtn.addEventListener('click', this.convertImage.bind(this));
        this.resetBtn.addEventListener('click', this.resetTool.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));
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

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
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
            
            this.displayOriginalImage();
            this.updateConvertButton();
        };
        img.src = src;
    }

    displayOriginalImage() {
        this.originalImageEl.src = this.originalImage.src;
        this.originalInfo.textContent = this.formatImageInfo(this.originalImage);
        
        this.noImageState.style.display = 'none';
        this.imagePreviewContainer.style.display = 'grid';
    }

    formatImageInfo(imageData) {
        const formatName = this.getFormatName(imageData.type);
        const sizeKB = Math.round(imageData.size / 1024);
        return `${formatName} • ${imageData.width}×${imageData.height} • ${sizeKB} KB`;
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

    selectFormat(format) {
        this.selectedFormat = format;
        
        // Update button states
        this.formatButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.format === format);
        });

        // Show/hide quality control
        const showQuality = format === 'jpeg' || format === 'webp';
        this.qualityControl.style.display = showQuality ? 'block' : 'none';

        this.updateConvertButton();
    }

    updateQuality() {
        this.quality = parseInt(this.qualitySlider.value);
        this.qualityValue.textContent = this.quality;
    }

    updateConvertButton() {
        const canConvert = this.originalImage && this.selectedFormat;
        this.convertBtn.disabled = !canConvert;
    }

    async convertImage() {
        if (!this.originalImage || !this.selectedFormat) return;

        this.convertBtn.disabled = true;
        this.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.originalImage.width;
            canvas.height = this.originalImage.height;
            
            ctx.drawImage(this.originalImage.element, 0, 0);
            
            const mimeType = this.getMimeType(this.selectedFormat);
            const quality = (this.selectedFormat === 'jpeg' || this.selectedFormat === 'webp') 
                ? this.quality / 100 
                : undefined;
            
            const convertedDataUrl = canvas.toDataURL(mimeType, quality);
            
            // Calculate converted file size (approximate)
            const base64Length = convertedDataUrl.split(',')[1].length;
            const convertedSize = Math.round(base64Length * 0.75); // Base64 to bytes approximation
            
            this.convertedImage = {
                dataUrl: convertedDataUrl,
                size: convertedSize,
                type: mimeType,
                width: this.originalImage.width,
                height: this.originalImage.height
            };
            
            this.displayConvertedImage();
            
        } catch (error) {
            this.showError('Conversion failed. Please try again.');
            console.error('Conversion error:', error);
        } finally {
            this.convertBtn.disabled = false;
            this.convertBtn.innerHTML = '<i class="fas fa-magic"></i> Convert Image';
        }
    }

    getMimeType(format) {
        const mimeTypes = {
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif'
        };
        return mimeTypes[format];
    }

    displayConvertedImage() {
        this.convertedImageEl.src = this.convertedImage.dataUrl;
        this.convertedInfo.textContent = this.formatConvertedInfo();
        this.downloadSection.style.display = 'block';
    }

    formatConvertedInfo() {
        const formatName = this.getFormatName(this.convertedImage.type);
        const sizeKB = Math.round(this.convertedImage.size / 1024);
        const sizeDiff = this.convertedImage.size - this.originalImage.size;
        const sizeChange = sizeDiff > 0 ? `+${Math.round(sizeDiff / 1024)}KB` : `${Math.round(sizeDiff / 1024)}KB`;
        
        return `${formatName} • ${this.convertedImage.width}×${this.convertedImage.height} • ${sizeKB} KB (${sizeChange})`;
    }

    downloadImage() {
        if (!this.convertedImage) return;

        const link = document.createElement('a');
        link.download = `converted-image.${this.selectedFormat === 'jpeg' ? 'jpg' : this.selectedFormat}`;
        link.href = this.convertedImage.dataUrl;
        link.click();
    }

    resetTool() {
        this.originalImage = null;
        this.convertedImage = null;
        this.selectedFormat = null;
        
        this.imageInput.value = '';
        this.formatButtons.forEach(btn => btn.classList.remove('active'));
        this.qualityControl.style.display = 'none';
        this.qualitySlider.value = 90;
        this.qualityValue.textContent = '90';
        
        this.noImageState.style.display = 'block';
        this.imagePreviewContainer.style.display = 'none';
        this.downloadSection.style.display = 'none';
        
        this.updateConvertButton();
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

// Initialize the format converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FormatConverter();
});
