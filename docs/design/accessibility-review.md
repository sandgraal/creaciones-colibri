# Accessibility Review — July 2024

This audit documents the first pass at verifying Creaciones Colibrí’s color contrast, typography, and focus states. The review focused on the core marketing and catalog pages rendered from the Eleventy build.

## Color & Typography

- Evaluated primary text colors against the light background (`#fdf8f3`). Body copy (`#2f2b28`) and muted text (`#5c4a4a`) both exceed WCAG AA 4.5:1 contrast, and the secondary accent (`#1f8a70`) reaches a 4.26:1 ratio on white elements.
- Confirmed hero headings and CTA buttons use the display font with sufficient size (≥2rem) to pass large text guidelines even when over gradient backgrounds.
- Verified form labels and card metadata reuse the secondary palette to keep contrast consistent with surrounding copy.

## Interactive States

- Navigation links, locale toggles, cart controls, and primary buttons now include visible focus outlines that meet the 3:1 contrast recommendation for focus indicators.
- Product, search, and blog cards expose consistent focus rings so keyboard users can see which card is active while tabbing.
- Contact form inputs already provided a 4px highlight; no additional changes required beyond documenting the behavior.

## Remaining Follow-ups

- Capture future Lighthouse accessibility scores inside `docs/operations/qa-checklist.md` once automated testing begins.
- Re-test color contrast if the palette shifts or new imagery introduces transparency that could reduce readability.
