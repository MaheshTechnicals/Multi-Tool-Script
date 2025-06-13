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
        id: 'loan-emi-calculator',
        name: 'Loan EMI Calculator',
        description: 'Calculate loan EMI and interest',
        category: 'calculator',
        icon: 'fas fa-calculator',
        page: 'tools/loan-emi-calculator.html'
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
    initializeHeroAnimations();
    renderTools(toolsData);
    initializeSearch();
    initializeFilters();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeRippleEffect();
    initializeMobileOptimizations();
});

// Enhanced Navigation functionality
function initializeNavigation() {
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Hero animations
function initializeHeroAnimations() {
    // Typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.getAttribute('data-text');
        typingText.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        setTimeout(typeWriter, 500);
    }

    // Animated counters
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    };

    // Start counter animation after hero loads
    setTimeout(animateCounters, 2000);

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('#tools').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
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
    const searchClear = document.getElementById('searchClear');

    toolSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();

        // Show/hide clear button
        if (searchTerm.length > 0) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }

        // Filter tools
        const filteredTools = toolsData.filter(tool =>
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );

        // Show loading state briefly for better UX
        showLoadingState();
        setTimeout(() => {
            renderTools(filteredTools);
            hideLoadingState();

            // Show empty state if no results
            if (filteredTools.length === 0 && searchTerm.length > 0) {
                showEmptyState();
            } else {
                hideEmptyState();
            }
        }, 300);
    });

    // Clear search
    searchClear.addEventListener('click', function() {
        toolSearch.value = '';
        searchClear.style.display = 'none';
        renderTools(toolsData);
        hideEmptyState();
        toolSearch.focus();
    });

    // Search suggestions (basic implementation)
    toolSearch.addEventListener('focus', function() {
        // Could implement search suggestions here
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
        const implementedTools = ['word-counter', 'case-converter', 'password-generator', 'lorem-generator', 'binary-converter', 'find-replace', 'image-compressor', 'image-resizer', 'image-cropper', 'format-converter', 'image-to-base64', 'color-picker', 'age-calculator', 'bmi-calculator', 'percentage-calculator', 'loan-emi-calculator', 'tip-calculator', 'date-calculator', 'unit-converter', 'temperature-converter', 'time-converter', 'speed-calculator'];
        if (implementedTools.includes(toolId)) {
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

// Utility functions
function showLoadingState() {
    const loadingElement = document.getElementById('toolsLoading');
    const gridElement = document.getElementById('toolsGrid');
    if (loadingElement && gridElement) {
        loadingElement.style.display = 'block';
        gridElement.style.display = 'none';
    }
}

function hideLoadingState() {
    const loadingElement = document.getElementById('toolsLoading');
    const gridElement = document.getElementById('toolsGrid');
    if (loadingElement && gridElement) {
        loadingElement.style.display = 'none';
        gridElement.style.display = 'grid';
    }
}

function showEmptyState() {
    const emptyElement = document.getElementById('toolsEmpty');
    if (emptyElement) {
        emptyElement.style.display = 'block';
    }
}

function hideEmptyState() {
    const emptyElement = document.getElementById('toolsEmpty');
    if (emptyElement) {
        emptyElement.style.display = 'none';
    }
}

function resetFilters() {
    // Reset search
    toolSearch.value = '';
    document.getElementById('searchClear').style.display = 'none';

    // Reset filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');

    // Show all tools
    renderTools(toolsData);
    hideEmptyState();
}

// Ripple effect for buttons
function initializeRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.cta-button.primary')) {
            const button = e.target.closest('.cta-button.primary');
            const ripple = button.querySelector('.ripple');

            if (ripple) {
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                ripple.classList.add('animate');
                setTimeout(() => ripple.classList.remove('animate'), 600);
            }
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

// Mobile optimizations
function initializeMobileOptimizations() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');

        // Optimize touch interactions
        document.addEventListener('touchstart', function() {}, { passive: true });

        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });

            input.addEventListener('blur', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            });
        });

        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('button, .tool-card, .feature-card, .filter-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });

            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        });
    }

    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY);
        }, 500);
    });

    // Optimize scroll performance
    let ticking = false;
    function updateHeader() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(18, 18, 18, 0.98)';
        } else {
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

// Enhanced header scroll effect with performance optimization
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(18, 18, 18, 0.98)';
    } else {
        header.style.background = 'rgba(18, 18, 18, 0.95)';
    }
}, { passive: true });
