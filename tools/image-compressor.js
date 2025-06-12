// Image Compressor Tool
class ImageCompressor {
    constructor() {
        this.originalFile = null;
        this.compressedBlob = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.compressionControls = document.getElementById('compressionControls');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        this.actionButtons = document.getElementById('actionButtons');
        this.compressBtn = document.getElementById('compressBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.noImageMessage = document.getElementById('noImageMessage');
        this.resultsContent = document.getElementById('resultsContent');
        this.originalPreview = document.getElementById('originalPreview');
        this.compressedPreview = document.getElementById('compressedPreview');
        this.originalSize = document.getElementById('originalSize');
        this.compressedSize = document.getElementById('compressedSize');
        this.compressionRatio = document.getElementById('compressionRatio');
        this.sizeSaved = document.getElementById('sizeSaved');
        this.downloadSection = document.getElementById('downloadSection');
        this.downloadBtn = document.getElementById('downloadBtn');
    }

    bindEvents() {
        // File upload events
        this.fileUploadArea.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
        this.fileUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileUploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileUploadArea.addEventListener('dragenter', () => this.fileUploadArea.classList.add('drag-over'));
        this.fileUploadArea.addEventListener('dragleave', () => this.fileUploadArea.classList.remove('drag-over'));

        // Quality slider
        this.qualitySlider.addEventListener('input', (e) => {
            this.qualityValue.textContent = e.target.value;
        });

        // Action buttons
        this.compressBtn.addEventListener('click', () => this.compressImage());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.fileUploadArea.classList.remove('drag-over');
        
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

        this.originalFile = file;
        this.loadOriginalImage();
        this.showControls();
    }

    loadOriginalImage() {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalPreview.src = e.target.result;
            this.originalSize.textContent = this.formatFileSize(this.originalFile.size);
            this.showResults();
        };
        reader.readAsDataURL(this.originalFile);
    }

    showControls() {
        this.compressionControls.style.display = 'block';
        this.actionButtons.style.display = 'flex';
    }

    showResults() {
        this.noImageMessage.style.display = 'none';
        this.resultsContent.style.display = 'block';
    }

    async compressImage() {
        if (!this.originalFile) return;

        this.compressBtn.disabled = true;
        this.compressBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing...';

        try {
            const quality = this.qualitySlider.value / 100;
            const compressedBlob = await this.compressImageFile(this.originalFile, quality);
            
            this.compressedBlob = compressedBlob;
            this.displayCompressedImage(compressedBlob);
            this.updateStats();
            this.downloadSection.style.display = 'block';
        } catch (error) {
            this.showError('Error compressing image: ' + error.message);
        } finally {
            this.compressBtn.disabled = false;
            this.compressBtn.innerHTML = '<i class="fas fa-compress"></i> Compress Image';
        }
    }

    compressImageFile(file, quality) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                }, 'image/jpeg', quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    displayCompressedImage(blob) {
        const url = URL.createObjectURL(blob);
        this.compressedPreview.src = url;
        this.compressedSize.textContent = this.formatFileSize(blob.size);
    }

    updateStats() {
        if (!this.originalFile || !this.compressedBlob) return;

        const originalSize = this.originalFile.size;
        const compressedSize = this.compressedBlob.size;
        const ratio = (originalSize / compressedSize).toFixed(1);
        const savedPercentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        this.compressionRatio.textContent = `${ratio}:1`;
        this.sizeSaved.textContent = `${savedPercentage}%`;
    }

    downloadImage() {
        if (!this.compressedBlob) return;

        const url = URL.createObjectURL(this.compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${this.originalFile.name.replace(/\.[^/.]+$/, '')}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    reset() {
        this.originalFile = null;
        this.compressedBlob = null;
        this.imageInput.value = '';
        this.compressionControls.style.display = 'none';
        this.actionButtons.style.display = 'none';
        this.noImageMessage.style.display = 'block';
        this.resultsContent.style.display = 'none';
        this.downloadSection.style.display = 'none';
        this.qualitySlider.value = 80;
        this.qualityValue.textContent = '80';
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
});

// Navigation functionality (copied from main script)
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}
