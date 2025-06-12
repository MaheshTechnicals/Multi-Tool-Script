// Image Cropper Tool
class ImageCropper {
    constructor() {
        this.originalFile = null;
        this.originalImage = null;
        this.croppedBlob = null;
        this.canvas = null;
        this.ctx = null;
        this.isDragging = false;
        this.dragHandle = null;
        this.cropArea = { x: 50, y: 50, width: 200, height: 200 };
        this.aspectRatio = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.cropControls = document.getElementById('cropControls');
        this.aspectButtons = document.querySelectorAll('.aspect-btn');
        this.showGrid = document.getElementById('showGrid');
        this.centerCrop = document.getElementById('centerCrop');
        this.actionButtons = document.getElementById('actionButtons');
        this.cropBtn = document.getElementById('cropBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.noImageMessage = document.getElementById('noImageMessage');
        this.resultsContent = document.getElementById('resultsContent');
        this.cropContainer = document.getElementById('cropContainer');
        this.canvas = document.getElementById('cropCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cropOverlay = document.getElementById('cropOverlay');
        this.cropSelection = document.getElementById('cropSelection');
        this.cropGrid = document.getElementById('cropGrid');
        this.selectionInfo = document.getElementById('selectionInfo');
        this.originalInfo = document.getElementById('originalInfo');
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

        // Aspect ratio buttons
        this.aspectButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setAspectRatio(btn));
        });

        // Crop options
        this.showGrid.addEventListener('change', () => this.toggleGrid());
        this.centerCrop.addEventListener('change', () => this.applyCenterCrop());

        // Action buttons
        this.cropBtn.addEventListener('click', () => this.cropImage());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());

        // Crop selection events
        this.cropSelection.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
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
                this.setupCanvas();
                this.showControls();
                this.showResults();
                this.updateInfo();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(this.originalFile);
    }

    setupCanvas() {
        const maxWidth = 500;
        const maxHeight = 400;
        
        let { width, height } = this.originalImage;
        
        // Scale down if too large
        if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Draw image
        this.ctx.drawImage(this.originalImage, 0, 0, width, height);
        
        // Initialize crop area
        this.cropArea = {
            x: width * 0.1,
            y: height * 0.1,
            width: width * 0.8,
            height: height * 0.8
        };
        
        this.updateCropSelection();
    }

    updateCropSelection() {
        const { x, y, width, height } = this.cropArea;
        this.cropSelection.style.left = x + 'px';
        this.cropSelection.style.top = y + 'px';
        this.cropSelection.style.width = width + 'px';
        this.cropSelection.style.height = height + 'px';
        this.updateInfo();
    }

    setAspectRatio(btn) {
        // Remove active class from all buttons
        this.aspectButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const ratio = btn.dataset.ratio;
        if (ratio === 'free') {
            this.aspectRatio = null;
        } else {
            const [w, h] = ratio.split(':').map(Number);
            this.aspectRatio = w / h;
            this.adjustCropToAspectRatio();
        }
    }

    adjustCropToAspectRatio() {
        if (!this.aspectRatio) return;

        const { x, y, width, height } = this.cropArea;
        const currentRatio = width / height;

        if (currentRatio > this.aspectRatio) {
            // Too wide, adjust width
            const newWidth = height * this.aspectRatio;
            this.cropArea.width = newWidth;
            this.cropArea.x = x + (width - newWidth) / 2;
        } else {
            // Too tall, adjust height
            const newHeight = width / this.aspectRatio;
            this.cropArea.height = newHeight;
            this.cropArea.y = y + (height - newHeight) / 2;
        }

        this.updateCropSelection();
    }

    toggleGrid() {
        this.cropGrid.style.display = this.showGrid.checked ? 'block' : 'none';
    }

    applyCenterCrop() {
        if (this.centerCrop.checked) {
            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;
            
            this.cropArea.x = (canvasWidth - this.cropArea.width) / 2;
            this.cropArea.y = (canvasHeight - this.cropArea.height) / 2;
            
            this.updateCropSelection();
        }
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        
        const rect = this.cropSelection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Determine which handle or area is being dragged
        if (e.target.classList.contains('crop-handle')) {
            this.dragHandle = e.target.classList[1]; // Get the direction class
        } else {
            this.dragHandle = 'move';
        }
        
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.cropStart = { ...this.cropArea };
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        
        if (this.dragHandle === 'move') {
            // Move the entire crop area
            this.cropArea.x = Math.max(0, Math.min(this.canvas.width - this.cropArea.width, this.cropStart.x + dx));
            this.cropArea.y = Math.max(0, Math.min(this.canvas.height - this.cropArea.height, this.cropStart.y + dy));
        } else {
            // Resize based on handle
            this.resizeCropArea(dx, dy);
        }
        
        this.updateCropSelection();
    }

    resizeCropArea(dx, dy) {
        const minSize = 20;
        let { x, y, width, height } = this.cropStart;
        
        switch (this.dragHandle) {
            case 'nw':
                width = Math.max(minSize, width - dx);
                height = Math.max(minSize, height - dy);
                x = this.cropStart.x + (this.cropStart.width - width);
                y = this.cropStart.y + (this.cropStart.height - height);
                break;
            case 'ne':
                width = Math.max(minSize, width + dx);
                height = Math.max(minSize, height - dy);
                y = this.cropStart.y + (this.cropStart.height - height);
                break;
            case 'sw':
                width = Math.max(minSize, width - dx);
                height = Math.max(minSize, height + dy);
                x = this.cropStart.x + (this.cropStart.width - width);
                break;
            case 'se':
                width = Math.max(minSize, width + dx);
                height = Math.max(minSize, height + dy);
                break;
            case 'n':
                height = Math.max(minSize, height - dy);
                y = this.cropStart.y + (this.cropStart.height - height);
                break;
            case 's':
                height = Math.max(minSize, height + dy);
                break;
            case 'w':
                width = Math.max(minSize, width - dx);
                x = this.cropStart.x + (this.cropStart.width - width);
                break;
            case 'e':
                width = Math.max(minSize, width + dx);
                break;
        }
        
        // Apply aspect ratio constraint if set
        if (this.aspectRatio && this.dragHandle !== 'move') {
            if (this.dragHandle.includes('w') || this.dragHandle.includes('e')) {
                height = width / this.aspectRatio;
            } else {
                width = height * this.aspectRatio;
            }
        }
        
        // Ensure crop area stays within canvas bounds
        x = Math.max(0, Math.min(this.canvas.width - width, x));
        y = Math.max(0, Math.min(this.canvas.height - height, y));
        width = Math.min(width, this.canvas.width - x);
        height = Math.min(height, this.canvas.height - y);
        
        this.cropArea = { x, y, width, height };
    }

    endDrag() {
        this.isDragging = false;
        this.dragHandle = null;
    }

    updateInfo() {
        if (!this.originalImage) return;
        
        const scaleX = this.originalImage.width / this.canvas.width;
        const scaleY = this.originalImage.height / this.canvas.height;
        
        const actualWidth = Math.round(this.cropArea.width * scaleX);
        const actualHeight = Math.round(this.cropArea.height * scaleY);
        
        this.selectionInfo.textContent = `${actualWidth} × ${actualHeight}`;
        this.originalInfo.textContent = `${this.originalImage.width} × ${this.originalImage.height}`;
    }

    showControls() {
        this.cropControls.style.display = 'block';
        this.actionButtons.style.display = 'flex';
    }

    showResults() {
        this.noImageMessage.style.display = 'none';
        this.resultsContent.style.display = 'block';
    }

    async cropImage() {
        if (!this.originalImage) return;

        this.cropBtn.disabled = true;
        this.cropBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cropping...';

        try {
            const scaleX = this.originalImage.width / this.canvas.width;
            const scaleY = this.originalImage.height / this.canvas.height;
            
            const cropX = this.cropArea.x * scaleX;
            const cropY = this.cropArea.y * scaleY;
            const cropWidth = this.cropArea.width * scaleX;
            const cropHeight = this.cropArea.height * scaleY;
            
            const croppedBlob = await this.cropImageToBlob(cropX, cropY, cropWidth, cropHeight);
            this.croppedBlob = croppedBlob;
            this.downloadSection.style.display = 'block';
        } catch (error) {
            this.showError('Error cropping image: ' + error.message);
        } finally {
            this.cropBtn.disabled = false;
            this.cropBtn.innerHTML = '<i class="fas fa-crop-alt"></i> Crop Image';
        }
    }

    cropImageToBlob(x, y, width, height) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(this.originalImage, x, y, width, height, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    }

    downloadImage() {
        if (!this.croppedBlob) return;

        const url = URL.createObjectURL(this.croppedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cropped_${this.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
        this.croppedBlob = null;
        this.imageInput.value = '';
        this.cropControls.style.display = 'none';
        this.actionButtons.style.display = 'none';
        this.noImageMessage.style.display = 'block';
        this.resultsContent.style.display = 'none';
        this.downloadSection.style.display = 'none';
        this.aspectRatio = null;
        this.aspectButtons.forEach(btn => btn.classList.remove('active'));
        this.aspectButtons[0].classList.add('active'); // Reset to "Free"
        this.showGrid.checked = true;
        this.centerCrop.checked = false;
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageCropper();
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
