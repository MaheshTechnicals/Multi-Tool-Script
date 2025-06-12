// Image Resizer Tool
class ImageResizer {
    constructor() {
        this.originalFile = null;
        this.originalImage = null;
        this.resizedBlob = null;
        this.aspectRatioLocked = true;
        this.originalAspectRatio = 1;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.resizeControls = document.getElementById('resizeControls');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.aspectRatioBtn = document.getElementById('aspectRatioBtn');
        this.originalDimensions = document.getElementById('originalDimensions');
        this.actionButtons = document.getElementById('actionButtons');
        this.resizeBtn = document.getElementById('resizeBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.noImageMessage = document.getElementById('noImageMessage');
        this.resultsContent = document.getElementById('resultsContent');
        this.originalPreview = document.getElementById('originalPreview');
        this.resizedPreview = document.getElementById('resizedPreview');
        this.originalInfo = document.getElementById('originalInfo');
        this.resizedInfo = document.getElementById('resizedInfo');
        this.scaleRatio = document.getElementById('scaleRatio');
        this.fileSizeChange = document.getElementById('fileSizeChange');
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

        // Preset buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => this.applyPreset(btn));
        });

        // Dimension inputs
        this.widthInput.addEventListener('input', () => this.handleWidthChange());
        this.heightInput.addEventListener('input', () => this.handleHeightChange());
        this.aspectRatioBtn.addEventListener('click', () => this.toggleAspectRatio());

        // Action buttons
        this.resizeBtn.addEventListener('click', () => this.resizeImage());
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
    }

    loadOriginalImage() {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.originalAspectRatio = img.width / img.height;
                this.setupDimensions(img.width, img.height);
                this.displayOriginalImage(e.target.result);
                this.showControls();
                this.showResults();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(this.originalFile);
    }

    setupDimensions(width, height) {
        this.widthInput.value = width;
        this.heightInput.value = height;
        this.originalDimensions.textContent = `${width} × ${height}`;
    }

    displayOriginalImage(src) {
        this.originalPreview.src = src;
        const info = `${this.originalImage.width} × ${this.originalImage.height} • ${this.formatFileSize(this.originalFile.size)}`;
        this.originalInfo.textContent = info;
    }

    showControls() {
        this.resizeControls.style.display = 'block';
        this.actionButtons.style.display = 'flex';
    }

    showResults() {
        this.noImageMessage.style.display = 'none';
        this.resultsContent.style.display = 'block';
    }

    applyPreset(btn) {
        // Remove active class from all preset buttons
        this.presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const width = parseInt(btn.dataset.width);
        const height = parseInt(btn.dataset.height);
        
        this.widthInput.value = width;
        this.heightInput.value = height;
        
        // Temporarily disable aspect ratio lock for presets
        this.aspectRatioLocked = false;
        this.aspectRatioBtn.classList.remove('active');
    }

    handleWidthChange() {
        if (this.aspectRatioLocked && this.originalImage) {
            const width = parseInt(this.widthInput.value);
            if (width > 0) {
                const height = Math.round(width / this.originalAspectRatio);
                this.heightInput.value = height;
            }
        }
        this.clearPresetSelection();
    }

    handleHeightChange() {
        if (this.aspectRatioLocked && this.originalImage) {
            const height = parseInt(this.heightInput.value);
            if (height > 0) {
                const width = Math.round(height * this.originalAspectRatio);
                this.widthInput.value = width;
            }
        }
        this.clearPresetSelection();
    }

    toggleAspectRatio() {
        this.aspectRatioLocked = !this.aspectRatioLocked;
        this.aspectRatioBtn.classList.toggle('active', this.aspectRatioLocked);
        
        const icon = this.aspectRatioBtn.querySelector('i');
        icon.className = this.aspectRatioLocked ? 'fas fa-link' : 'fas fa-unlink';
    }

    clearPresetSelection() {
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
    }

    async resizeImage() {
        if (!this.originalImage) return;

        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);

        if (!width || !height || width <= 0 || height <= 0) {
            this.showError('Please enter valid dimensions.');
            return;
        }

        this.resizeBtn.disabled = true;
        this.resizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resizing...';

        try {
            const resizedBlob = await this.resizeImageToBlob(this.originalImage, width, height);
            this.resizedBlob = resizedBlob;
            this.displayResizedImage(resizedBlob, width, height);
            this.updateStats(width, height);
            this.downloadSection.style.display = 'block';
        } catch (error) {
            this.showError('Error resizing image: ' + error.message);
        } finally {
            this.resizeBtn.disabled = false;
            this.resizeBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> Resize Image';
        }
    }

    resizeImageToBlob(img, width, height) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    }

    displayResizedImage(blob, width, height) {
        const url = URL.createObjectURL(blob);
        this.resizedPreview.src = url;
        const info = `${width} × ${height} • ${this.formatFileSize(blob.size)}`;
        this.resizedInfo.textContent = info;
    }

    updateStats(newWidth, newHeight) {
        if (!this.originalImage || !this.resizedBlob) return;

        const originalArea = this.originalImage.width * this.originalImage.height;
        const newArea = newWidth * newHeight;
        const scaleRatio = Math.sqrt(newArea / originalArea);
        
        const originalSize = this.originalFile.size;
        const newSize = this.resizedBlob.size;
        const sizeChange = ((newSize - originalSize) / originalSize * 100);

        this.scaleRatio.textContent = `${scaleRatio.toFixed(2)}x`;
        this.fileSizeChange.textContent = sizeChange >= 0 
            ? `+${sizeChange.toFixed(1)}%` 
            : `${sizeChange.toFixed(1)}%`;
    }

    downloadImage() {
        if (!this.resizedBlob) return;

        const url = URL.createObjectURL(this.resizedBlob);
        const a = document.createElement('a');
        a.href = url;
        const width = this.widthInput.value;
        const height = this.heightInput.value;
        a.download = `resized_${width}x${height}_${this.originalFile.name}`;
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
        this.originalImage = null;
        this.resizedBlob = null;
        this.imageInput.value = '';
        this.resizeControls.style.display = 'none';
        this.actionButtons.style.display = 'none';
        this.noImageMessage.style.display = 'block';
        this.resultsContent.style.display = 'none';
        this.downloadSection.style.display = 'none';
        this.aspectRatioLocked = true;
        this.aspectRatioBtn.classList.add('active');
        this.aspectRatioBtn.querySelector('i').className = 'fas fa-link';
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageResizer();
});

// Navigation functionality
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
