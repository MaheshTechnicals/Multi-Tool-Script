# Footer Component System

This directory contains the reusable footer component that eliminates code duplication across the Multi-Tool Hub website.

## Overview

Previously, the footer HTML was manually copied and pasted across all pages (home page and tool pages), resulting in significant code duplication and maintenance challenges. The footer component system centralizes the footer implementation into reusable components.

## Files

### `footer.html`
The HTML template for the footer containing:
- SVG wave animation with gradients
- Brand section with statistics
- Quick links section (dynamically populated)
- Tool categories section (dynamically populated)
- Features section with social links
- Bottom section with copyright and legal links (dynamically populated)

### `footer.js`
The JavaScript component that:
- Loads the footer HTML template
- Configures links based on page type (home vs tool pages)
- Handles different base paths for navigation
- Provides fallback inline template if external loading fails
- Supports dynamic tool count updates

## Usage

### Home Page
```html
<!-- Replace footer HTML with -->
<div id="footer-container"></div>

<!-- Add before closing body tag -->
<script src="components/footer.js"></script>
<script>
    FooterComponent.init({
        isHomePage: true
    });
</script>
```

### Tool Pages
```html
<!-- Replace footer HTML with -->
<div id="footer-container"></div>

<!-- Add before closing body tag -->
<script src="../components/footer.js"></script>
<script>
    FooterComponent.init({
        isHomePage: false
    });
</script>
```

## Configuration Options

The `FooterComponent.init()` method accepts the following options:

- `isHomePage` (boolean): Whether this is the home page (affects link paths)
- `basePath` (string): Custom base path for links (auto-detected if not provided)
- `toolCounts` (object): Custom tool counts for categories

### Example with Custom Configuration
```javascript
FooterComponent.init({
    isHomePage: false,
    basePath: '../',
    toolCounts: {
        image: 8,
        text: 7,
        calculators: 10,
        converters: 5
    }
});
```

## Link Handling

The component automatically handles different link patterns:

### Home Page Links
- `#home`, `#tools`, `#about` - Anchor links within the same page
- `#image-tools`, `#calculators` - Category anchor links

### Tool Page Links
- `../index.html` - Link back to home page
- `../index.html#tools` - Link to home page sections
- `../index.html#image-tools` - Link to home page categories

## Dynamic Updates

You can update tool counts after initialization:

```javascript
// Get the footer instance and update tool counts
const footer = await FooterComponent.init({ isHomePage: false });
footer.updateToolCounts({
    calculators: 12,
    converters: 6
});
```

## Fallback System

If the external `footer.html` template cannot be loaded (e.g., network issues), the component automatically falls back to an inline template to ensure the footer always renders.

## Benefits

1. **Eliminates Code Duplication**: Single source of truth for footer content
2. **Easy Maintenance**: Update footer in one place, changes reflect everywhere
3. **Consistent UI**: Ensures footer consistency across all pages
4. **Dynamic Configuration**: Adapts to different page types automatically
5. **Robust Loading**: Fallback system ensures footer always renders
6. **SEO Friendly**: Maintains proper HTML structure and links

## Migration

All pages have been updated to use the footer component:

- ✅ `index.html` - Home page
- ✅ All tool pages in `/tools/` directory

The migration process:
1. Replaced footer HTML with `<div id="footer-container"></div>`
2. Added footer component script loading
3. Added initialization script with appropriate configuration

## Maintenance

To update the footer:
1. Edit `components/footer.html` for HTML/structure changes
2. Edit `components/footer.js` for functionality changes
3. Changes automatically apply to all pages using the component

## Testing

Test the footer component by:
1. Starting a local server: `python3 -m http.server 8000`
2. Opening `http://localhost:8000` (home page)
3. Opening `http://localhost:8000/tools/age-calculator.html` (tool page)
4. Verifying footer renders correctly with appropriate links
5. Testing responsive design on different screen sizes
