/**
 * Footer Component
 * Reusable footer component that can be dynamically loaded and configured
 * for different pages (home page vs tool pages)
 * Now integrated with SiteManager for centralized site information
 */
class FooterComponent {
    constructor() {
        this.config = {
            isHomePage: false,
            basePath: '',
            toolCounts: null // Will be loaded from siteManager
        };
        this.siteManager = window.siteManager;
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
            // Ensure site manager is loaded
            await this.ensureSiteManagerLoaded();
            
            // Load footer HTML template
            const footerHtml = await this.loadFooterTemplate();
            
            // Insert footer into container
            const container = document.getElementById('footer-container');
            if (container) {
                // Replace placeholders with site data
                const processedHtml = this.siteManager.replacePlaceholders(footerHtml);
                container.innerHTML = processedHtml;
                
                // Configure dynamic content after insertion
                this.configureLinks();
                this.configureSocialLinks();
                this.updateStats();
            } else {
                console.error('Footer container not found. Make sure to include <div id="footer-container"></div> in your HTML.');
            }
        } catch (error) {
            console.error('Failed to load footer component:', error);
        }
    }

    /**
     * Ensure site manager is loaded before proceeding
     */
    async ensureSiteManagerLoaded() {
        if (!this.siteManager) {
            console.error('SiteManager not found. Make sure to include siteManager.js before footer.js');
            return;
        }

        // Wait for site manager to load if not already loaded
        if (!this.siteManager.isLoaded) {
            await this.siteManager.init();
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
     * Configure footer links based on page type and site data
     */
    configureLinks() {
        this.configureQuickLinks();
        this.configureToolCategories();
        this.configureBottomLinks();
    }

    /**
     * Configure quick navigation links using site data
     */
    configureQuickLinks() {
        const quickLinksContainer = document.getElementById('footer-quick-links');
        if (!quickLinksContainer) return;

        const quickLinks = this.siteManager.get('navigation.footer.quickLinks', []);
        
        const processedLinks = quickLinks.map(link => {
            let href = link.href;
            
            // Adjust links for tool pages
            if (!this.config.isHomePage && !href.startsWith('http') && !href.startsWith('mailto:')) {
                if (href.startsWith('#')) {
                    href = this.config.basePath + 'index.html' + href;
                } else if (!href.includes('index.html')) {
                    href = this.config.basePath + href;
                }
            }
            
            return {
                ...link,
                href: href
            };
        });

        quickLinksContainer.innerHTML = processedLinks.map(link => 
            `<li><a href="${link.href}">${link.label}</a></li>`
        ).join('');
    }

    /**
     * Configure tool category links using site data
     */
    configureToolCategories() {
        const categoriesContainer = document.getElementById('footer-tool-categories');
        if (!categoriesContainer) return;

        const baseHref = this.config.isHomePage ? '#' : this.config.basePath + 'index.html#';
        const toolCounts = this.siteManager.get('stats.categories', {});
        
        const categories = [
            { href: baseHref + 'image-tools', icon: 'fas fa-image', text: 'Image Tools', count: toolCounts.image || 0 },
            { href: baseHref + 'text-tools', icon: 'fas fa-font', text: 'Text Tools', count: toolCounts.text || 0 },
            { href: baseHref + 'calculators', icon: 'fas fa-calculator', text: 'Calculators', count: toolCounts.calculators || 0 },
            { href: baseHref + 'converters', icon: 'fas fa-exchange-alt', text: 'Converters', count: toolCounts.converters || 0 }
        ];

        categoriesContainer.innerHTML = categories.map(category => 
            `<li><a href="${category.href}"><i class="${category.icon}"></i> ${category.text} <span class="tool-count">${category.count}</span></a></li>`
        ).join('');
    }

    /**
     * Configure bottom footer links using site data
     */
    configureBottomLinks() {
        const bottomLinksContainer = document.getElementById('footer-bottom-links');
        if (!bottomLinksContainer) return;

        const legalLinks = this.siteManager.get('navigation.footer.legal', []);
        
        const processedLinks = legalLinks.map(link => {
            let href = link.href;
            
            // Adjust links for tool pages
            if (!this.config.isHomePage && !href.startsWith('http')) {
                if (href.startsWith('/')) {
                    href = this.config.basePath + href.substring(1);
                } else {
                    href = this.config.basePath + href;
                }
            }
            
            return {
                ...link,
                href: href
            };
        });

        bottomLinksContainer.innerHTML = processedLinks.map((link, index) => 
            `${index > 0 ? '<span class="separator">•</span>' : ''}<a href="${link.href}">${link.label}</a>`
        ).join('');
    }

    /**
     * Configure social media links using site data
     */
    configureSocialLinks() {
        const socialContainer = document.getElementById('footer-social-links');
        if (!socialContainer) return;

        const socialPlatforms = ['twitter', 'github', 'linkedin', 'facebook', 'instagram', 'youtube'];
        const socialHtml = this.siteManager.generateSocialLinks(socialPlatforms);
        
        socialContainer.innerHTML = socialHtml;
    }

    /**
     * Update footer statistics using site data
     */
    updateStats() {
        // Update tool count
        const toolCountElement = document.getElementById('footer-tool-count');
        if (toolCountElement) {
            const totalTools = this.siteManager.get('stats.totalTools', 20);
            toolCountElement.textContent = totalTools;
        }

        // Update user count
        const userCountElement = document.getElementById('footer-user-count');
        if (userCountElement) {
            const userCount = this.siteManager.get('stats.users', '1000+');
            userCountElement.textContent = userCount;
        }

        // Update satisfaction rate
        const satisfactionElement = document.getElementById('footer-satisfaction');
        if (satisfactionElement) {
            const satisfaction = this.siteManager.get('stats.satisfaction', '100%');
            satisfactionElement.textContent = satisfaction;
        }
    }

    /**
     * Fallback inline footer template with placeholders
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
                            <stop offset="0%" style="stop-color:{{branding.colors.primary}};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:{{branding.colors.secondary}};stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="footerGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:{{branding.colors.secondary}};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:{{branding.colors.primary}};stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="footerGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:{{branding.colors.primary}};stop-opacity:1" />
                            <stop offset="50%" style="stop-color:{{branding.colors.secondary}};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:{{branding.colors.primary}};stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div class="container">
                <div class="footer-content">
                    <div class="footer-section footer-brand-section">
                        <div class="footer-brand">
                            <i class="{{branding.logo.icon}}"></i>
                            <span>{{site.title}}</span>
                        </div>
                        <p class="footer-description">{{site.description}}</p>
                        <div class="footer-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="footer-tool-count">{{stats.totalTools}}</span>
                                <span class="stat-label">Tools</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="footer-satisfaction">{{stats.satisfaction}}</span>
                                <span class="stat-label">Free</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="footer-user-count">{{stats.users}}</span>
                                <span class="stat-label">Users</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-link"></i> Quick Links</h4>
                        <ul class="footer-links" id="footer-quick-links">
                            <!-- Links will be populated by JavaScript -->
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-tools"></i> Tool Categories</h4>
                        <ul class="footer-links" id="footer-tool-categories">
                            <!-- Categories will be populated by JavaScript -->
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4><i class="fas fa-heart"></i> Connect With Us</h4>
                        <div class="social-section">
                            <h5>Follow us on social media</h5>
                            <div class="social-links" id="footer-social-links">
                                <!-- Social links will be populated by JavaScript -->
                            </div>
                        </div>
                        <div class="footer-features">
                            <li><i class="fas fa-bolt"></i> Lightning Fast</li>
                            <li><i class="fas fa-shield-alt"></i> 100% Private</li>
                            <li><i class="fas fa-gift"></i> Always Free</li>
                            <li><i class="fas fa-mobile-alt"></i> Mobile Friendly</li>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="copyright">
                            <p>&copy; {{site.launchYear}} {{site.title}}. All rights reserved.</p>
                            <p class="made-with">Made with <i class="fas fa-heart"></i> for productivity enthusiasts</p>
                        </div>
                        <div class="footer-bottom-links" id="footer-bottom-links">
                            <!-- Legal links will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }

    /**
     * Update tool counts dynamically
     * @param {Object} counts - Object with category counts
     */
    updateToolCounts(counts) {
        // Update site manager data
        this.siteManager.updateSiteInfo({
            stats: {
                categories: counts
            }
        });
        
        // Reconfigure tool categories
        this.configureToolCategories();
    }
}

// Make FooterComponent available globally
window.FooterComponent = FooterComponent;
