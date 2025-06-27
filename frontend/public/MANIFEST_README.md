# Palace of Quests - PWA Manifest Documentation

## Overview
This document provides comprehensive documentation for the `manifest.json` file, optimized for modern PWAs with full Pi Browser compatibility.

## Manifest Structure

### Core Application Identity
- **name**: Full application name "Palace of Quests"
- **short_name**: Optimized for limited display space
- **description**: Enhanced for store discoverability with keywords like "Pi Network", "gaming adventure", "quests", and "rewards"

### Internationalization & Accessibility
- **lang**: Set to "en-US" for English (United States)
- **dir**: Left-to-right text direction ("ltr")

### PWA Navigation & Display
- **start_url**: Includes tracking parameter "/?source=pwa"
- **scope**: Root scope "/" for full app control
- **display**: "standalone" for app-like experience
- **orientation**: "portrait" optimized for mobile gaming

### Visual Branding & Theme
- **background_color**: "#1e1e30" - Matches app's dark gaming theme
- **theme_color**: "#865DFF" - Primary purple brand color from app CSS

### App Store Categories
Comprehensive categorization for maximum discoverability:
- **games**: Primary category
- **entertainment**: Broad appeal
- **adventure**: Genre-specific
- **education**: Learning aspects
- **role-playing**: Gaming subgenre
- **strategy**: Gameplay type
- **social**: Community features
- **productivity**: Quest management
- **utilities**: Tool-like features
- **finance**: Pi Network integration

### Icon Requirements
Complete icon set covering all PWA standards:

#### Standard Icons
- 72x72: Android small icon
- 96x96: Android medium icon
- 128x128: Chrome Web Store
- 144x144: Windows tile
- 152x152: iOS Safari
- 192x192: Android large icon
- 384x384: Splash screen
- 512x512: High-resolution displays

#### Maskable Icons
- 192x192: Adaptive icon support
- 512x512: High-res adaptive icon

### Screenshots
Three promotional screenshots optimized for app stores:
1. **Narrow form factor** (540x720): Mobile gameplay interface
2. **Narrow form factor** (540x720): Pi Network marketplace
3. **Wide form factor** (1280x720): Desktop experience

### Platform Integration
- **related_applications**: Placeholder for Play Store and App Store
- **prefer_related_applications**: Set to `false` to prioritize PWA

### Advanced PWA Features

#### Edge Side Panel
- **preferred_width**: 400px for enhanced desktop experience

#### Launch Handler
- **client_mode**: "focus-existing" prevents multiple instances

#### Protocol Handlers
- **web+palaceofquests**: Custom protocol for deep linking to quests

## Pi Browser Compatibility

This manifest is specifically optimized for Pi Browser with:
- Dark theme colors matching Pi Network branding
- Standalone display mode for immersive experience
- Portrait orientation for mobile-first design
- Comprehensive icon set for all device types
- Custom protocol handlers for Pi ecosystem integration

## Maintenance Guidelines

### Color Updates
When updating brand colors:
1. Update `theme_color` for browser UI elements
2. Update `background_color` for app launch screen
3. Ensure colors match CSS variables in `ui.css`

### Icon Updates
When updating icons:
1. Maintain all specified sizes
2. Include both standard and maskable versions
3. Use PNG format for best compatibility
4. Ensure icons work on light and dark backgrounds

### Screenshot Updates
When updating screenshots:
1. Include both narrow (mobile) and wide (desktop) formats
2. Use descriptive labels for accessibility
3. Showcase key features and Pi Network integration
4. Maintain consistent branding across images

## Validation
Always validate manifest.json using:
```bash
python3 -m json.tool manifest.json
```

For PWA compliance testing, use:
- Chrome DevTools > Application > Manifest
- Lighthouse PWA audit
- Web App Manifest validator tools

## Best Practices
1. Keep descriptions under 300 characters for store compatibility
2. Use consistent naming across all platforms
3. Ensure all icon sizes are provided
4. Test on multiple devices and orientations
5. Validate JSON syntax before deployment
6. Monitor PWA installation metrics