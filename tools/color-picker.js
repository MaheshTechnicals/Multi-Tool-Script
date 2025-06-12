// Color Picker Tool JavaScript

class ColorPicker {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.currentColor = { r: 0, g: 0, b: 0 };
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // File input elements
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        
        // Canvas elements
        this.canvas = document.getElementById('colorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasContainer = document.getElementById('canvasContainer');
        this.colorCrosshair = document.getElementById('colorCrosshair');
        
        // Action buttons
        this.extractPaletteBtn = document.getElementById('extractPaletteBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Display elements
        this.noImageState = document.getElementById('noImageState');
        this.colorInfoContainer = document.getElementById('colorInfoContainer');
        this.currentColorPreview = document.getElementById('currentColorPreview');
        this.rgbColorPreview = document.getElementById('rgbColorPreview');
        this.hslColorPreview = document.getElementById('hslColorPreview');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.colorPalette = document.getElementById('colorPalette');
        this.paletteColors = document.getElementById('paletteColors');
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.imageInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.imageInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Canvas events
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleCanvasMouseLeave.bind(this));

        // Action buttons
        this.extractPaletteBtn.addEventListener('click', this.extractColorPalette.bind(this));
        this.resetBtn.addEventListener('click', this.resetTool.bind(this));
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
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    loadImage(src) {
        const img = new Image();
        img.onload = () => {
            this.drawImageToCanvas(img);
            this.showCanvas();
        };
        img.src = src;
    }

    drawImageToCanvas(img) {
        // Calculate canvas size to fit image while maintaining aspect ratio
        const maxWidth = 600;
        const maxHeight = 400;
        
        let { width, height } = img;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Draw image to canvas
        this.ctx.drawImage(img, 0, 0, width, height);
        
        // Store image data for color picking
        this.imageData = this.ctx.getImageData(0, 0, width, height);
    }

    showCanvas() {
        this.noImageState.style.display = 'none';
        this.canvasContainer.style.display = 'block';
        this.colorInfoContainer.style.display = 'block';
        this.extractPaletteBtn.disabled = false;
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) * (this.canvas.width / rect.width));
        const y = Math.floor((e.clientY - rect.top) * (this.canvas.height / rect.height));
        
        this.pickColor(x, y);
    }

    handleCanvasMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) * (this.canvas.width / rect.width));
        const y = Math.floor((e.clientY - rect.top) * (this.canvas.height / rect.height));
        
        // Show crosshair
        this.colorCrosshair.style.display = 'block';
        this.colorCrosshair.style.left = (e.clientX - rect.left) + 'px';
        this.colorCrosshair.style.top = (e.clientY - rect.top) + 'px';
        
        // Preview color
        this.previewColor(x, y);
    }

    handleCanvasMouseLeave() {
        this.colorCrosshair.style.display = 'none';
    }

    pickColor(x, y) {
        if (!this.imageData) return;
        
        const index = (y * this.imageData.width + x) * 4;
        const r = this.imageData.data[index];
        const g = this.imageData.data[index + 1];
        const b = this.imageData.data[index + 2];
        
        this.currentColor = { r, g, b };
        this.updateColorDisplay();
    }

    previewColor(x, y) {
        if (!this.imageData || x < 0 || y < 0 || x >= this.imageData.width || y >= this.imageData.height) return;
        
        const index = (y * this.imageData.width + x) * 4;
        const r = this.imageData.data[index];
        const g = this.imageData.data[index + 1];
        const b = this.imageData.data[index + 2];
        
        // Update crosshair color to contrast with current pixel
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        this.colorCrosshair.style.borderColor = brightness > 128 ? '#000000' : '#ffffff';
    }

    updateColorDisplay() {
        const { r, g, b } = this.currentColor;
        
        // Convert to different formats
        const hex = this.rgbToHex(r, g, b);
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const hsl = this.rgbToHsl(r, g, b);
        
        // Update color previews
        const colorStyle = `rgb(${r}, ${g}, ${b})`;
        this.currentColorPreview.style.backgroundColor = colorStyle;
        this.rgbColorPreview.style.backgroundColor = colorStyle;
        this.hslColorPreview.style.backgroundColor = colorStyle;
        
        // Update color values
        this.hexValue.textContent = hex;
        this.rgbValue.textContent = rgb;
        this.hslValue.textContent = hsl;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    extractColorPalette() {
        if (!this.imageData) return;
        
        this.extractPaletteBtn.disabled = true;
        this.extractPaletteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting...';
        
        // Use a simplified color quantization algorithm
        setTimeout(() => {
            const colors = this.getImageColors();
            this.displayColorPalette(colors);
            
            this.extractPaletteBtn.disabled = false;
            this.extractPaletteBtn.innerHTML = '<i class="fas fa-palette"></i> Extract Color Palette';
        }, 100);
    }

    getImageColors() {
        const colors = new Map();
        const data = this.imageData.data;
        const step = 4; // Sample every 4th pixel for performance
        
        for (let i = 0; i < data.length; i += step * 4) {
            const r = Math.floor(data[i] / 32) * 32;
            const g = Math.floor(data[i + 1] / 32) * 32;
            const b = Math.floor(data[i + 2] / 32) * 32;
            
            const key = `${r},${g},${b}`;
            colors.set(key, (colors.get(key) || 0) + 1);
        }
        
        // Sort by frequency and take top colors
        return Array.from(colors.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return { r, g, b };
            });
    }

    displayColorPalette(colors) {
        this.paletteColors.innerHTML = '';
        
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            colorDiv.dataset.color = this.rgbToHex(color.r, color.g, color.b);
            
            colorDiv.addEventListener('click', () => {
                this.currentColor = color;
                this.updateColorDisplay();
            });
            
            this.paletteColors.appendChild(colorDiv);
        });
        
        this.colorPalette.style.display = 'block';
    }

    resetTool() {
        this.imageInput.value = '';
        this.imageData = null;
        this.currentColor = { r: 0, g: 0, b: 0 };
        
        this.noImageState.style.display = 'block';
        this.canvasContainer.style.display = 'none';
        this.colorInfoContainer.style.display = 'none';
        this.colorPalette.style.display = 'none';
        
        this.extractPaletteBtn.disabled = true;
        
        // Reset color displays
        this.hexValue.textContent = '#000000';
        this.rgbValue.textContent = 'rgb(0, 0, 0)';
        this.hslValue.textContent = 'hsl(0, 0%, 0%)';
        
        const blackColor = '#000000';
        this.currentColorPreview.style.backgroundColor = blackColor;
        this.rgbColorPreview.style.backgroundColor = blackColor;
        this.hslColorPreview.style.backgroundColor = blackColor;
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

// Initialize the color picker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});
