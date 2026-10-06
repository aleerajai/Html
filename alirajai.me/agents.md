# Project Notes

This is a pure static single page website. There is no framework, package build, database, or server-side runtime.

## Architecture

- `index.html` contains the full page structure, SEO metadata, contact links, and CDN references for GSAP.
- `css/style.css` owns the full responsive dark luxury visual system, glass panels, layout, cursor styles, and mobile behavior.
- `js/app.js` owns loading state dismissal, mobile navigation, custom cursor interactions, magnetic hover movement, tilt cards, and GSAP scroll reveals.
- `assets/images/og-preview.svg` is the social sharing preview image.
- `netlify.toml` publishes the repository root as the static site.

## Conventions

- Keep the site static and upload-ready.
- Use semantic sections and anchor navigation for all page areas.
- Prefer small, focused JavaScript interactions over framework code.
- Keep contact links synchronized across hero, contact, footer, and floating WhatsApp button when details change.
- Respect reduced-motion preferences for animation-heavy edits.
