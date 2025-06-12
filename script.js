// Tools data
const toolsData = [
    // Image Tools
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Reduce image file size while maintaining quality',
        category: 'image',
        icon: 'fas fa-compress-alt',
        page: 'tools/image-compressor.html'
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize images to custom dimensions',
        category: 'image',
        icon: 'fas fa-expand-arrows-alt',
        page: 'tools/image-resizer.html'
    },
    {
        id: 'image-cropper',
        name: 'Image Cropper',
        description: 'Crop images to focus on specific areas',
        category: 'image',
        icon: 'fas fa-crop-alt',
        page: 'tools/image-cropper.html'
    },
    {
        id: 'format-converter',
        name: 'Format Converter',
        description: 'Convert between JPG, PNG, WebP formats',
        category: 'image',
        icon: 'fas fa-exchange-alt',
        page: 'tools/format-converter.html'
    },
    {
        id: 'image-to-base64',
        name: 'Image to Base64',
        description: 'Convert images to Base64 encoded strings',
        category: 'image',
        icon: 'fas fa-code',
        page: 'tools/image-to-base64.html'
    },
    {
        id: 'color-picker',
        name: 'Color Picker',
        description: 'Extract colors from images',
        category: 'image',
        icon: 'fas fa-palette',
        page: 'tools/color-picker.html'
    },

    // Text Tools
    {
        id: 'word-counter',
        name: 'Word Counter',
        description: 'Count words, characters, and paragraphs',
        category: 'text',
        icon: 'fas fa-calculator',
        page: 'tools/word-counter.html'
    },
    {
        id: 'case-converter',
        name: 'Case Converter',
        description: 'Convert text between different cases',
        category: 'text',
        icon: 'fas fa-font',
        page: 'tools/case-converter.html'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure random passwords',
        category: 'text',
        icon: 'fas fa-key',
        page: 'tools/password-generator.html'
    },
    {
        id: 'lorem-generator',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for designs',
        category: 'text',
        icon: 'fas fa-paragraph',
        page: 'tools/lorem-generator.html'
    },
    {
        id: 'binary-converter',
        name: 'Binary Converter',
        description: 'Convert between text and binary',
        category: 'text',
        icon: 'fas fa-binary',
        page: 'tools/binary-converter.html'
    },
    {
        id: 'find-replace',
        name: 'Find & Replace',
        description: 'Find and replace text in bulk',
        category: 'text',
        icon: 'fas fa-search-plus',
        page: 'tools/find-replace.html'
    },

    // Calculators
    {
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate age from birth date',
        category: 'calculator',
        icon: 'fas fa-birthday-cake',
        page: 'tools/age-calculator.html'
    },
    {
        id: 'bmi-calculator',
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index',
        category: 'calculator',
        icon: 'fas fa-weight',
        page: 'tools/bmi-calculator.html'
    },
    {
        id: 'percentage-calculator',
        name: 'Percentage Calculator',
        description: 'Calculate percentages and ratios',
        category: 'calculator',
        icon: 'fas fa-percent',
        page: 'tools/percentage-calculator.html'
    },
    {
        id: 'loan-calculator',
        name: 'Loan EMI Calculator',
        description: 'Calculate loan EMI and interest',
        category: 'calculator',
        icon: 'fas fa-money-bill-wave',
        page: 'tools/loan-calculator.html'
    },
    {
        id: 'tip-calculator',
        name: 'Tip Calculator',
        description: 'Calculate tips and split bills',
        category: 'calculator',
        icon: 'fas fa-receipt',
        page: 'tools/tip-calculator.html'
    },
    {
        id: 'date-calculator',
        name: 'Date Calculator',
        description: 'Calculate days between dates',
        category: 'calculator',
        icon: 'fas fa-calendar-alt',
        page: 'tools/date-calculator.html'
    },

    // Converters
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert length, weight, volume units',
        category: 'converter',
        icon: 'fas fa-ruler',
        page: 'tools/unit-converter.html'
    },
    {
        id: 'temperature-converter',
        name: 'Temperature Converter',
        description: 'Convert between Celsius, Fahrenheit, Kelvin',
        category: 'converter',
        icon: 'fas fa-thermometer-half',
        page: 'tools/temperature-converter.html'
    },
    {
        id: 'time-converter',
        name: 'Time Converter',
        description: 'Convert between 12h and 24h formats',
        category: 'converter',
        icon: 'fas fa-clock',
        page: 'tools/time-converter.html'
    },
    {
        id: 'speed-calculator',
        name: 'Speed Calculator',
        description: 'Calculate speed, distance, and time',
        category: 'converter',
        icon: 'fas fa-tachometer-alt',
        page: 'tools/speed-calculator.html'
    }
];

// DOM elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const toolSearch = document.getElementById('toolSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const toolsGrid = document.getElementById('toolsGrid');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    renderTools(toolsData);
    initializeSearch();
    initializeFilters();
    initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
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

// Render tools grid
function renderTools(tools) {
    toolsGrid.innerHTML = '';
    
    tools.forEach((tool, index) => {
        const toolCard = createToolCard(tool);
        toolCard.style.animationDelay = `${index * 0.1}s`;
        toolsGrid.appendChild(toolCard);
    });
}

// Create individual tool card
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-category', tool.category);
    
    card.innerHTML = `
        <div class="tool-icon">
            <i class="${tool.icon}"></i>
        </div>
        <div class="tool-content">
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-category">${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</div>
        </div>
        <div class="tool-action">
            <button class="tool-btn" onclick="openTool('${tool.id}')">
                <i class="fas fa-arrow-right"></i>
                Use Tool
            </button>
        </div>
    `;
    
    return card;
}

// Search functionality
function initializeSearch() {
    toolSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTools = toolsData.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
        renderTools(filteredTools);
    });
}

// Filter functionality
function initializeFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tools
            const filter = this.getAttribute('data-filter');
            const filteredTools = filter === 'all' 
                ? toolsData 
                : toolsData.filter(tool => tool.category === filter);
            
            renderTools(filteredTools);
            
            // Clear search
            toolSearch.value = '';
        });
    });
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Open tool function
function openTool(toolId) {
    const tool = toolsData.find(t => t.id === toolId);
    if (tool) {
        // Check if the tool page exists, otherwise show coming soon message
        if (toolId === 'word-counter') {
            window.location.href = tool.page;
        } else {
            // Show coming soon modal for other tools
            showComingSoonModal(tool.name);
        }
    }
}

// Show coming soon modal
function showComingSoonModal(toolName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-hammer"></i> Coming Soon</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>${toolName}</strong> is currently under development and will be available soon!</p>
                <p>We're working hard to bring you the best tools. Check back later for updates.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-check"></i> Got it
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(18, 18, 18, 0.98)';
    } else {
        header.style.background = 'rgba(18, 18, 18, 0.95)';
    }
});
