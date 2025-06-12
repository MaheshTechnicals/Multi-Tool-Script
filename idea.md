# Multi-Tool Website (HTML/CSS/JS Only)

## Project Overview

Create a **modern multi-tool utility website** using only HTML, CSS, and JavaScript (no backend). The site should have a **dark theme** with gradient accent colors, smooth animations, and be fully responsive on all devices. Use a clean, professional sans-serif font (e.g. a Google Font like Roboto or Montserrat). All content and functionality should run client-side; you may include CDN-hosted libraries or frameworks as long as they require no secret API keys.

## Homepage Layout

* **Header:** A sticky top header containing the site logo (which links to home) and clear navigation. Keep navigation simple (ideally ≤7 links) to avoid clutter. Include a *search/filter bar* in the header or just below it so users can quickly find a tool by name. A responsive filter interface helps users quickly and effectively refine what they’re looking for.
* **Hero Section:** A full-width hero banner at the top of the homepage. It should use a high-quality, relevant image or graphic (with a dark overlay or gradient) and a bold headline explaining the site’s purpose. Include a prominent call-to-action button here (e.g. “Explore Tools”).
* **Tools Search/Filter:** Below the hero (or within it), provide a search box or dropdown filter so users can type or select to find a tool by name or category. For example, typing “image” would filter the list to show only image-related tools.
* **Tools Listing:** Present all tools (see list below) as cards or list items in an “All Tools” section. Arrange them in logical categories (for instance **Image Tools**, **Text Tools**, **Calculators**, **Converters**). Each tool card should have an icon or image, the tool name, and a brief description. Clicking a card opens that tool’s page.
* **Footer:** A site-wide footer with copyright info, links (e.g. “Contact”, “About”), and any legal notices.

## Included Tools

Implement each tool in JavaScript on a separate page (or modal) that matches the site theme. Examples of tools to include:

* **Image Utilities:** Compress Image, Resize Image, Crop Image, Convert to JPG, Convert from JPG, HTML to Image, Image to PDF, Image to Base64, Color Picker from Image.
* **Text/Conversion Utilities:** Fancy Text Generator, Word Counter, Case Converter, Binary↔Text Converter, Lorem Ipsum Generator, Find-and-Replace Text, Random Password Generator.
* **Calculators:** Age Calculator, Percentage Calculator, BMI Calculator, Loan EMI Calculator, Simple Interest Calculator, Compound Interest Calculator, Discount Calculator, Tip Calculator, Days Between Dates, Unit Converter (Length, Weight, etc.), Temperature Converter (Celsius↔Fahrenheit), Time Converter (12h↔24h), Speed/Distance/Time, Calorie Calculator, Pregnancy Due Date, Body Fat Calculator.

Each tool page should have a consistent dark-themed layout. For example, the “Image Resize” page could let the user upload an image file and enter new dimensions; when the user confirms, the resized image appears below. Include clear input labels, a visible “Apply” button, and a “Reset/Clear” option. Provide immediate visual feedback (e.g. update results instantly or show a subtle loading indicator). Always include navigation back to the main tools list or header menu.

## User Flow

* **Tool Selection:** From the homepage, clicking any tool’s card or link opens that tool’s page. This page loads smoothly (consider a slide or fade animation).
* **Interactions:** Users enter inputs (e.g. upload a file, type text, select values) and the tool automatically processes or uses a button to execute the function. The result should display prominently.
* **Navigation:** Each tool page includes a way to go back to the list of tools (e.g. a “Tools” link or logo in the header). Use breadcrumb navigation or a back arrow if preferred. Ensure all links and buttons are easily tappable on mobile.

## UI/UX Design Guidelines

* **Dark Theme Colors:** Use dark gray backgrounds (#121212 or similar) rather than pure black. Text should be a light color (off-white or light gray). Avoid pure white text on pure black to reduce eye strain.
* **Contrast & Readability:** Maintain high contrast (WCAG AA level) between text and background. For primary buttons or highlights, use a muted accent color (e.g. a desaturated blue or teal) so it pops against dark gray. You can use subtle gradients in backgrounds or buttons to add depth.
* **Typography:** Pick a modern sans-serif (e.g. Roboto, Montserrat). Use generous line-height and spacing. In dark mode, avoid ultra-thin fonts; medium or bold weights for headings and buttons improve readability. Ensure headings are noticeably larger/bolder than body text to create hierarchy.
* **Animations:** Incorporate smooth CSS animations for transitions and interactive elements. For instance, use a subtle fade or slide when the tool page loads, and a slight scale/opacity change on button hover. Use `transition` or `keyframes` in CSS for hover states on buttons/links and for revealing content. Keep animations quick and non-distracting.
* **Responsiveness:** Design mobile-first. Use CSS Flexbox/Grid and media queries to adapt layouts. On smaller screens, collapse the navigation into a hamburger menu, stack elements vertically, and ensure touch targets are large enough. Tool cards should reflow into a single column on phones. The site should look good on any screen.
* **Navigation Clarity:** Keep navigation visible and descriptive. Place the main menu where users expect (top of page) and use high-contrast text for links. Use clear labels (e.g. “Image Tools”, “Text Tools”, “Calculators”) so users know what to expect.
* **Visual Polish:** Use enough spacing (padding/margins) to avoid clutter. Maintain visual separation between header, hero, content sections, and footer. Buttons for primary actions should stand out with the accent color and possibly a gradient. Limit the number of fonts/colors to create a cohesive look.

## Technical Constraints

* Use **only HTML, CSS, and vanilla JavaScript**. All tool functions must be implemented in JS.
* You *may* use CDN-hosted helper libraries (like a date library or math library) or a CSS framework via CDN (e.g. Bootstrap or Tailwind), but do not use any service that requires an API key. The site should work entirely offline once loaded.
* The code should be well-organized into separate pages or components (e.g. one HTML/JS file per tool). Ensure consistent styling across pages (consider a shared CSS file).
* Use dummy/sample data where needed. For instance, for the color picker, you can preload a sample image if needed. For the Lorem Ipsum generator, use any placeholder text.

## Example Prompt Summary

Build a multi-tool utility website using only HTML, CSS, and JavaScript. **Homepage:** dark-themed layout with fixed header (logo + nav), full-width hero section (dark overlay + headline), a tool search/filter, and a tool grid. Clicking any tool card opens the respective page. Each tool must be functional in JavaScript with a consistent UI/UX. Use a modern font and dark theme with high contrast and smooth animations. Design mobile-first and ensure responsiveness across all devices. Maintain consistency and clarity in design, and use gradients and spacing for visual polish.
