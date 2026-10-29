# Inbasekaran S — Research portfolio

A responsive portfolio with light pastel surfaces, locally hosted Inter, first-person copy, and supplied section illustrations.

Live site: https://bruce12-glitch.github.io/Inbasekaran/

## Structure

- `index.html`: research, biography, reading interests, recognition, experience, writing, updates, and contact.
- `assets/studio.css`: responsive layout, accessible states, color cards, and cursor styling.
- `assets/studio.js`: mobile navigation, clipboard copying, and an optional pointer effect.
- `assets/studio/`: supplied illustration images, a small cursor SVG, and the favicon.
- `assets/brand/`: the exact supplied website logo and browser icon exports.
- `assets/fonts/`: self-hosted Inter and its license.
- `brand-system/`: palette, type, spacing, voice, imagery, and contrast references.

GitHub Pages serves the root of `main`; no build step or external animation library is required. All asset paths are relative. The diagrams and layered mascot controls have been removed from the page. Illustrations are static images in normal layout flow, without pop-ups or canvases.

The plum cursor arrow has one trailing ring. It can be switched off in the header, and is disabled for touch/coarse pointers and reduced-motion preferences. The precise arrow is never delayed. The page also has keyboard focus indicators, native technical-note disclosures, a skip link, and a mobile menu that closes with Escape.

Contact actions use `mailto:inba.research.ilrl.labs@gmail.com`. Copy has a secure Clipboard API path and a selection fallback. Biographical interests were supplied by the owner; research measurements and achievements retain their existing source claims.

When updating the site, keep the complete asset directories with `index.html`. The page depends on its CSS, JavaScript, fonts, logo, and illustration files; publishing HTML alone leaves the layout and images broken.
