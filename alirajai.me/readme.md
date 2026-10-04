# Ali Rajai Premium Portfolio Website

A static single page portfolio and service website for Ali Rajai. It uses a dark luxury visual style, desktop GSAP-powered motion, custom cursor effects, responsive layouts, and direct email and social contact links.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Locally hosted GSAP 3.12.5 and ScrollTrigger, loaded on the first desktop scroll only when reduced motion is not requested
- Locally hosted Outfit and Playfair Display variable WOFF2 fonts
- Static hosting on Netlify, GitHub Pages, Vercel, Cloudflare Pages, cPanel, or similar providers

## Local Preview

From the repository root, run `netlify dev --port 8889` and open `http://localhost:8889`. No build step is required. The root Netlify configuration publishes only `alirajai.me/`.

## Performance

The page displays immediately without a loading overlay or an entrance animation hiding the hero. Fonts are preloaded from the same origin, and the high-priority hero uses responsive WebP images instead of the original large PNG. The header and favicon use small dedicated images, and project placeholders are local lazy-loaded SVGs rather than requests to another service. The original PNG remains available for social metadata.

Mobile devices skip animation-library downloads and expensive decorative filters. Desktop scroll and pointer interactions remain available, and reduced-motion preferences disable them. The page content and native cursor remain usable when JavaScript or the optional animation libraries are unavailable.

Images, fonts, and versioned animation libraries use long-lived cache headers. Rename an asset and update its references whenever its contents change to avoid stale caches. HTML, site CSS, and application JavaScript revalidate so new deployments can update them immediately.

Lighthouse scores depend on the tested URL, device profile, network, and server response time. Local comparisons verify the code improvements; a fresh Lighthouse audit of the deployed URL is still needed to confirm its production score.

## Contact Details

- WhatsApp: `+92 344 9511190`
- Email: `alirajai.dev@gmail.com`
