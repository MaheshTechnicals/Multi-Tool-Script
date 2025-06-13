/**
 * Footer Component
 * Reusable footer component that can be dynamically loaded and configured
 * for different pages (home page vs tool pages)
 */
class FooterComponent {
    constructor() {
        this.config = {
            isHomePage: false,
            basePath: '',
            toolCounts: {
                image: 6,
                text: 6,
                calculators: 6,
                converters: 4
            }
        };
    }

    /**
     * Initialize the footer component
     * @param {Object} options - Configuration options
     * @param {boolean} options.isHomePage - Whether this is the home page
     * @param {string} options.basePath - Base path for links (e.g., '../' for tool pages)
     */
    static async init(options = {}) {
        const instance = new FooterComponent();
        await instance.load(options);
        return instance;
    }

    /**
     * Load and render the footer component
     * @param {Object} options - Configuration options
     */
    async load(options = {}) {
        // Update configuration
        this.config = {
            ...this.config,
            ...options
        };

        // Set base path based on page type
        if (!this.config.basePath) {
            this.config.basePath = this.config.isHomePage ? '' : '../';
        }

        try {
            // Load footer HTML template
            const footerHtml = await this.loadFooterTemplate();
            
            // Insert footer into container
            const container = document.getElementById('footer-container');
            if (container) {
                container.innerHTML = footerHtml;
                
                // Configure links after insertion
                this.configureLinks();
            } else {
                console.error('Footer container not found. Make sure to include <div id="footer-container"></div> in your HTML.');
            }
        } catch (error) {
            console.error('Failed to load footer component:', error);
        }
    }

    /**
     * Load the footer HTML template
     * @returns {Promise<string>} Footer HTML content
     */
    async loadFooterTemplate() {
        const templatePath = this.config.basePath + 'components/footer.html';
        
        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Failed to load footer template: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading footer template:', error);
            // Fallback to inline template if fetch fails
            return this.getInlineFooterTemplate();
        }
    }

    /**
     * Configure footer links based on page type
     */
    configureLinks() {
        this.configureQuickLinks();
        this.configureToolCategories();
        this.configureBottomLinks();
    }

    /**
     * Configure quick navigation links
     */
    configureQuickLinks() {
        const quickLinksContainer = document.getElementById('footer-quick-links');
        if (!quickLinksContainer) return;

        const links = this.config.isHomePage ? [
            { href: '#home', icon: 'fas fa-home', text: 'Home' },
            { href: '#tools', icon: 'fas fa-tools', text: 'All Tools' },
            { href: '#about', icon: 'fas fa-info-circle', text: 'About Us' },
            { href: '#contact', icon: 'fas fa-envelope', text: 'Contact' },
            { href: '#privacy', icon: 'fas fa-shield-alt', text: 'Privacy Policy' }
        ] : [
            { href: this.config.basePath + 'index.html', icon: 'fas fa-home', text: 'Home' },
            { href: this.config.basePath + 'index.html#tools', icon: 'fas fa-tools', text: 'All Tools' },
            { href: this.config.basePath + 'index.html#about', icon: 'fas fa-info-circle', text: 'About Us' },
            { href: this.config.basePath + 'index.html#contact', icon: 'fas fa-envelope', text: 'Contact' },
            { href: this.config.basePath + 'index.html#privacy', icon: 'fas fa-shield-alt', text: 'Privacy Policy' }
        ];

        quickLinksContainer.innerHTML = links.map(link => 
            `<li><a href="${link.href}"><i class="${link.icon}"></i> ${link.text}</a></li>`
        ).join('');
    }

    /**
     * Configure tool category links
     */
    configureToolCategories() {
        const categoriesContainer = document.getElementById('footer-tool-categories');
        if (!categoriesContainer) return;

        const baseHref = this.config.isHomePage ? '#' : this.config.basePath + 'index.html#';
        
        const categories = [
            { href: baseHref + 'image-tools', icon: 'fas fa-image', text: 'Image Tools', count: this.config.toolCounts.image },
            { href: baseHref + 'text-tools', icon: 'fas fa-font', text: 'Text Tools', count: this.config.toolCounts.text },
            { href: baseHref + 'calculators', icon: 'fas fa-calculator', text: 'Calculators', count: this.config.toolCounts.calculators },
            { href: baseHref + 'converters', icon: 'fas fa-exchange-alt', text: 'Converters', count: this.config.toolCounts.converters }
        ];

        categoriesContainer.innerHTML = categories.map(category => 
            `<li><a href="${category.href}"><i class="${category.icon}"></i> ${category.text} <span class="tool-count">${category.count}</span></a></li>`
        ).join('');
    }

    /**
     * Configure bottom footer links
     */
    configureBottomLinks() {
        const bottomLinksContainer = document.getElementById('footer-bottom-links');
        if (!bottomLinksContainer) return;

        const links = this.config.isHomePage ? [
            { href: '#terms', text: 'Terms of Service' },
            { href: '#privacy', text: 'Privacy Policy' },
            { href: '#cookies', text: 'Cookie Policy' }
        ] : [
            { href: this.config.basePath + 'index.html#terms', text: 'Terms of Service' },
            { href: this.config.basePath + 'index.html#privacy', text: 'Privacy Policy' },
            { href: this.config.basePath + 'index.html#cookies', text: 'Cookie Policy' }
        ];

        bottomLinksContainer.innerHTML = links.map((link, index) => 
            `${index > 0 ? '<span class="separator">•</span>' : ''}<a href="${link.href}">${link.text}</a>`
        ).join('');
    }

    /**
     * Fallback inline footer template
     * Used when the external template file cannot be loaded
     */
    getInlineFooterTemplate() {
        return `
        <!-- Footer -->
        <footer class="footer">
            <div class="footer-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="url(#footerGradient1)"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="url(#footerGradient2)"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="url(#footerGradient3)"></path>
                    <defs>
                        <linearGradient id="footerGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#4a9eff;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#00d4aa;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="footerGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#00d4aa;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#4a9eff;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="footerGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#4a9eff;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#00d4aa;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#4a9eff;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div class="container">
                <div class="footer-content">
                    <div class="footer-section footer-brand-section">
                        <div class="footer-brand">
                            <i class="fas fa-tools"></i>
                            <span>Multi-Tool Hub</span>
                        </div>
                        <p class="footer-description">Your ultimate collection of digital utilities and tools. Simplify your workflow with our comprehensive suite of web-based tools - all free, fast, and secure.</p>
                        <div class="footer-stats">
                            <div class="stat-item">
                                <span class="stat-number">20+</span>
                                <span class="stat-label">Tools</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">100%</span>
                                <span class="stat-label">Free</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">0</span>
                                <span class="stat-label">Ads</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-link"></i> Quick Links</h4>
                        <ul class="footer-links" id="footer-quick-links">
                            <!-- Links will be dynamically populated -->
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-layer-group"></i> Tool Categories</h4>
                        <ul class="footer-links" id="footer-tool-categories">
                            <!-- Tool categories will be dynamically populated -->
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-rocket"></i> Features</h4>
                        <ul class="footer-features">
                            <li><i class="fas fa-check-circle"></i> No Registration Required</li>
                            <li><i class="fas fa-check-circle"></i> Works Offline</li>
                            <li><i class="fas fa-check-circle"></i> Mobile Responsive</li>
                            <li><i class="fas fa-check-circle"></i> Privacy Focused</li>
                            <li><i class="fas fa-check-circle"></i> Fast & Secure</li>
                        </ul>

                        <div class="social-section">
                            <h5>Connect With Us</h5>
                            <div class="social-links">
                                <a href="#" aria-label="GitHub" title="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                                <a href="#" aria-label="Twitter" title="Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" aria-label="LinkedIn" title="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="#" aria-label="Discord" title="Discord">
                                    <i class="fab fa-discord"></i>
                                </a>
                                <a href="#" aria-label="Reddit" title="Reddit">
                                    <i class="fab fa-reddit"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="copyright">
                            <p>&copy; 2024 Multi-Tool Hub. All rights reserved.</p>
                            <p class="made-with">Made with <i class="fas fa-heart"></i> for developers and creators</p>
                        </div>
                        <div class="footer-bottom-links" id="footer-bottom-links">
                            <!-- Bottom links will be dynamically populated -->
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
    }

    /**
     * Update tool counts dynamically
     * @param {Object} counts - New tool counts
     */
    updateToolCounts(counts) {
        this.config.toolCounts = { ...this.config.toolCounts, ...counts };
        this.configureToolCategories();
    }
}

// Make FooterComponent available globally
window.FooterComponent = FooterComponent;
