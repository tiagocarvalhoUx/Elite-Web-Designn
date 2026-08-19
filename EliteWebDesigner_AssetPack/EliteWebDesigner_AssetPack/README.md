# Elite Web Designer — Extracted Asset Pack

This pack was created directly from the supplied raster artwork.

## Folder structure

- `00_REFERENCE/` — untouched original supplied compositions.
- `01_BRAND/` — WD logo and footer brand lockup, including transparent gold-only versions.
- `02_UI/buttons/` — exact raster crops of visible CTA buttons.
- `02_UI/dividers/` — extracted divider plus a clean scalable SVG reconstruction.
- `02_UI/sections/` — header, hero, services, portfolio, stats, contact, and footer reference crops.
- `03_HERO/` — main MRV laptop hero crop.
- `04_PORTFOLIO/cards/` — individual homepage portfolio cards.
- `04_PORTFOLIO/showcases/` — complete supplied project showcase images.
- `04_PORTFOLIO/mockups/` — isolated device-area crops for each project.
- `05_WEB_OPTIMIZED/` — WebP versions of major assets.
- `06_DEV/` — design tokens, manifest, and a minimal integration example.

## Production recommendation

The screenshots are raster composites, so the original source vectors, fonts, layers, and HTML/CSS cannot be recovered perfectly from the images alone.

For a production website:
1. Use the transparent WD logo and WebP project imagery as media assets.
2. Rebuild buttons, typography, navigation, forms, borders, and interactive states in HTML/CSS.
3. Keep the PNG button crops as visual references, not as the final clickable controls.
4. Use the SVG divider instead of the raster divider where scalability matters.
5. Add responsive `srcset`, lazy loading, width/height attributes, and descriptive `alt` text to content images.

No supplied source image was modified or overwritten.
