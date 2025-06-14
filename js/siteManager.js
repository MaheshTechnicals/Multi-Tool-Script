/**
 * Global Site Information Manager
 * Loads site configuration from JSON and provides it globally across the website
 */

class SiteManager {
    constructor() {
        this.siteInfo = null;
        this.isLoaded = false;
        this.loadPromise = null;
        this.callbacks = [];
    }

    /**
     * Initialize the site manager and load site information
     * @param {string} jsonPath - Path to the siteInfo.json file
     * @param {boolean} forceReload - Force reload even if already loaded
     * @returns {Promise<Object>} Site information object
     */
    async init(jsonPath = './siteInfo.json', forceReload = false) {
        // Force reload if requested
        if (forceReload) {
            this.siteInfo = null;
            this.isLoaded = false;
            this.loadPromise = null;
        }

        // Return existing promise if already loading
        if (this.loadPromise) {
            return this.loadPromise;
        }

        // Return cached data if already loaded
        if (this.isLoaded && this.siteInfo) {
            return this.siteInfo;
        }

        // Create and cache the load promise
        this.loadPromise = this.loadSiteInfo(jsonPath);
        
        try {
            this.siteInfo = await this.loadPromise;
            this.isLoaded = true;
            
            // Execute any pending callbacks
            this.executeCallbacks();
            
            return this.siteInfo;
        } catch (error) {
            console.error('Failed to load site information:', error);
            this.loadPromise = null; // Reset to allow retry
            throw error;
        }
    }

    /**
     * Load site information from JSON file
     * @param {string} jsonPath - Path to the JSON file
     * @returns {Promise<Object>} Parsed JSON data
     */
    async loadSiteInfo(jsonPath) {
        try {
            // Add cache-busting parameter to prevent browser caching
            const cacheBuster = Date.now();
            const urlWithCacheBuster = jsonPath + (jsonPath.includes('?') ? '&' : '?') + 't=' + cacheBuster;
            
            const response = await fetch(urlWithCacheBuster, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Validate required fields
            this.validateSiteInfo(data);
            
            return data;
        } catch (error) {
            console.error('Error loading site information:', error);
            
            // Return fallback data if JSON fails to load
            return this.getFallbackSiteInfo();
        }
    }

    /**
     * Validate that required site information fields are present
     * @param {Object} data - Site information data
     */
    validateSiteInfo(data) {
        const requiredFields = ['site', 'social', 'contact'];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                console.warn(`Missing required field in site info: ${field}`);
            }
        }
    }

    /**
     * Get fallback site information if JSON loading fails
     * @returns {Object} Fallback site data
     */
    getFallbackSiteInfo() {
        return {
            site: {
                title: "Multi-Tool Hub",
                tagline: "Your Ultimate Digital Toolkit",
                description: "Powerful utilities for images, text, calculations, and conversions",
                domain: "multi-tool-hub.com",
                email: "contact@multi-tool-hub.com"
            },
            social: {
                twitter: { url: "#", handle: "@multitoolhub", icon: "fab fa-twitter" },
                github: { url: "#", username: "multitoolhub", icon: "fab fa-github" }
            },
            contact: {
                email: "contact@multi-tool-hub.com"
            },
            stats: {
                totalTools: 20,
                categories: { image: 6, text: 6, calculators: 6, converters: 4 }
            }
        };
    }

    /**
     * Get site information (async)
     * @returns {Promise<Object>} Site information
     */
    async getSiteInfo() {
        if (!this.isLoaded) {
            await this.init();
        }
        return this.siteInfo;
    }

    /**
     * Get site information synchronously (returns null if not loaded)
     * @returns {Object|null} Site information or null
     */
    getSiteInfoSync() {
        return this.isLoaded ? this.siteInfo : null;
    }

    /**
     * Get specific site data by path (e.g., 'site.title', 'social.twitter.url')
     * @param {string} path - Dot notation path to the data
     * @param {*} defaultValue - Default value if path not found
     * @returns {*} The requested data or default value
     */
    get(path, defaultValue = null) {
        if (!this.isLoaded || !this.siteInfo) {
            return defaultValue;
        }

        return this.getNestedValue(this.siteInfo, path, defaultValue);
    }

    /**
     * Get nested value from object using dot notation
     * @param {Object} obj - Object to search
     * @param {string} path - Dot notation path
     * @param {*} defaultValue - Default value
     * @returns {*} Found value or default
     */
    getNestedValue(obj, path, defaultValue) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : defaultValue;
        }, obj);
    }

    /**
     * Execute callback when site info is loaded
     * @param {Function} callback - Callback function to execute
     */
    onReady(callback) {
        if (this.isLoaded) {
            callback(this.siteInfo);
        } else {
            this.callbacks.push(callback);
        }
    }

    /**
     * Execute all pending callbacks
     */
    executeCallbacks() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.siteInfo);
            } catch (error) {
                console.error('Error executing site manager callback:', error);
            }
        });
        this.callbacks = [];
    }

    /**
     * Update site information (useful for dynamic updates)
     * @param {Object} updates - Object with updates to merge
     */
    updateSiteInfo(updates) {
        if (this.siteInfo) {
            this.siteInfo = this.deepMerge(this.siteInfo, updates);
        }
    }

    /**
     * Force reload site information from JSON file
     * @param {string} jsonPath - Path to the siteInfo.json file
     * @returns {Promise<Object>} Site information object
     */
    async reload(jsonPath = './siteInfo.json') {
        console.log('🔄 Force reloading site information...');
        return await this.init(jsonPath, true);
    }

    /**
     * Clear cached data and force next init to reload
     */
    clearCache() {
        console.log('🗑️ Clearing site manager cache...');
        this.siteInfo = null;
        this.isLoaded = false;
        this.loadPromise = null;
        this.callbacks = [];
    }

    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * Generate social media links HTML
     * @param {Array} platforms - Array of platform names to include
     * @returns {string} HTML string for social links
     */
    generateSocialLinks(platforms = ['twitter', 'github', 'linkedin']) {
        if (!this.isLoaded) return '';

        const social = this.get('social', {});
        
        return platforms
            .filter(platform => social[platform])
            .map(platform => {
                const data = social[platform];
                return `
                    <a href="${data.url}" target="_blank" rel="noopener noreferrer" 
                       title="${platform.charAt(0).toUpperCase() + platform.slice(1)}"
                       aria-label="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
                        <i class="${data.icon}"></i>
                    </a>
                `;
            })
            .join('');
    }

    /**
     * Generate navigation links HTML
     * @param {string} type - Type of navigation ('main' or 'footer')
     * @param {string} basePath - Base path for links
     * @returns {string} HTML string for navigation
     */
    generateNavigation(type = 'main', basePath = '') {
        if (!this.isLoaded) return '';

        const navData = this.get(`navigation.${type}`, []);
        
        if (Array.isArray(navData)) {
            return navData
                .map(item => `
                    <li>
                        <a href="${basePath}${item.href}" class="nav-link">
                            ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                            <span>${item.label}</span>
                        </a>
                    </li>
                `)
                .join('');
        }
        
        return '';
    }

    /**
     * Replace placeholders in HTML with site data
     * @param {string} html - HTML string with placeholders
     * @returns {string} HTML with replaced placeholders
     */
    replacePlaceholders(html) {
        if (!this.isLoaded) return html;

        // Replace {{path.to.data}} placeholders
        return html.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
            const value = this.get(path.trim());
            return value !== null ? value : match;
        });
    }
}

// Create global instance
window.siteManager = new SiteManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.siteManager.init().catch(console.error);
    });
} else {
    window.siteManager.init().catch(console.error);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteManager;
} 