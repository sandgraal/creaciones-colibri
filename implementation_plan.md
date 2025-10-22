# Implementation Plan for Creaciones Colibrí

This plan tracks the work required to turn our Eleventy-powered repository into a fully featured online store. Phases build on one another so we can launch quickly and iterate with confidence. Checkboxes reflect current status; update them as work progresses or as scope changes.

_Status legend_

- [x] Completed
- [ ] Not started (or in progress — see notes)

---

## Phase 1 — Foundation & Content (Week 1–2)

- [ ] **Define product catalog**
  - [x] Collect and finalize the initial product list based on the categories described in the README (`src/_data/products.js`).
  - [x] Draft product copy: descriptions, ingredient lists, nutrition information, usage tips, and brand story.
  - [x] Organize product imagery in `src/img/` with descriptive filenames (SVG placeholders for now) and document workflow in `docs/design/image-workflow.md`.
  - [x] Capture pricing and packaging sizes in product data entries.
  - [x] Research shipping options (domestic vs. international) and compostable/regenerative packaging costs; document recommendations (`docs/operations/shipping.md`).

- [ ] **Eleventy structure** _(in progress)_
  - [x] Create `src/_includes` for layouts/partials and establish a base layout (header, navigation, footer).
  - [x] Generate product listing and detail templates from shared data sources.
  - [x] Implement a blog section under `src/blog/` for storytelling, recipes, and market updates.
  - [x] Add Eleventy collections/tags to group products by category, dietary preference, and benefits.

- [x] **Visual design**
  - [x] Establish color palette, typography, and foundational styling (`src/css/main.css`).
  - [x] Produce SVG favicon/logo variants; wire them into the base layout without adding binary assets to the repo.
  - [x] Document an image optimization workflow (responsive `srcset`, compression, naming).
  - [x] Conduct accessibility review of typography, color contrast, and interactive states (see `docs/design/accessibility-review.md`).

---

## Phase 2 — E-Commerce & Interactivity (Week 3–4)

- [ ] **Select a checkout solution**
  - [x] Evaluate Shopify Buy Button, Snipcart, Stripe Checkout, and PayPal for fees, currency support, integration effort, and subscription readiness (`docs/operations/checkout-evaluation.md`).
  - [x] Record the decision, onboarding requirements, and sandbox credentials in team documentation (`docs/operations/checkout-evaluation.md`).

- [ ] **Integrate cart & checkout**
  - [x] Add cart triggers to product cards/detail pages, including quantity selectors.
  - [x] Ensure cart persistence between page loads via local storage or platform-provided scripts (handled by Snipcart).
  - [ ] Configure tax, shipping rules, and payment methods; test end-to-end purchase flow in sandbox mode (`docs/operations/snipcart-setup.md`).

- [ ] **Search & filtering**
  - [x] Decide on search strategy: client-side fuzzy search (Fuse.js) with Eleventy-generated JSON index.
  - [x] Provide filters for categories (sauce, granola, etc.), dietary tags (vegan, gluten-free), and functional benefits (protein-rich, anti-inflammatory).
  - [x] Build accessible UI controls for search results with empty/error states.

- [ ] **Contact & newsletter forms**
  - [x] Implement contact form via Formspree (toggle via `FORMSPREE_ENDPOINT`), capturing name, email, and message.
  - [x] Add newsletter signup form with provider action configurable by `NEWSLETTER_ACTION`.
  - [x] Store API endpoints via environment variables and document setup in `.env.example` and handbook.

---

## Phase 3 — Enhancements & Marketing (Week 5–6)

- [ ] **Localization**
  - [ ] Add Spanish translations for all content using Eleventy’s i18n plugin or custom data files. _(Home, catálogo, detalle de producto, blog y contacto listos; formularios y metadatos actualizados. Falta revisión nativa.)_
  - [x] Provide language toggle in navigation; ensure URLs and metadata localize correctly.
  - [ ] Recruit native speakers to review translations for tone and accuracy.

- [ ] **Subscriptions & bundles**
  - [ ] Define subscription offerings (e.g., monthly sauce trio, granola of the month).
  - [ ] Configure recurring payments via chosen e-commerce solution; verify renewal flows.
  - [ ] Build bundle product templates that dynamically render from shared product data.

- [ ] **Analytics & SEO**
  - [ ] Configure SEO fundamentals: meta tags, Open Graph, structured data (JSON-LD).
  - [ ] Generate sitemap and robots.txt during the Eleventy build.
  - [x] Draft analytics plan and integrate Plausible toggle (requires `PLAUSIBLE_DOMAIN` to activate). Final hookup pending account creation and domain configuration.

- [ ] **Performance & accessibility audit**
  - [ ] Run Lighthouse audits for performance, accessibility, best practices, and SEO; document remediation tasks.
  - [ ] Optimize build times, asset sizes, and caching strategy.
  - [ ] Verify keyboard navigation, focus states, and semantic markup across pages.

- [ ] **Deployment & CI** _(in progress)_
  - [x] Choose hosting provider (GitHub Pages) and configure automated deployment (`.github/workflows/pages.yml`).
  - [x] Ensure Eleventy copies static assets and respects `pathPrefix` for GitHub Pages URLs.
  - [ ] Add secrets management guidance for future API keys or environment variables needed during build.
  - [ ] Document rollback/redeployment procedures and monitoring expectations.

- [ ] **Post-launch marketing**
  - [ ] Plan social media campaigns for product launches and seasonal events.
  - [ ] Collaborate with partners (chefs, influencers) to generate recipe or storytelling content.
  - [ ] Monitor market trends—sauce innovation, adaptogens, sustainable packaging—and capture customer feedback loops.

---

## Phase 4 — Long-Term Growth (Month 2+)

- [ ] **Wholesale & private label** — explore co-packing or private-label opportunities as demand grows; assess market fit for hot sauce wholesale.
- [ ] **Community & events** — host pop-up tastings or partner with local markets in Florida and Costa Rica; feature collaborators on the blog.
- [ ] **New product development** — experiment with recipes aligned with emerging trends such as cognitive health nutrition, functional desserts, and plant-based aquatic ingredients.

---

## Cross-Cutting Practices

- Keep the Eleventy development workflow documented in `docs/development-handbook.md` (setup, preferred commands, coding standards, review expectations).
- For every new feature, add or update acceptance criteria and testing notes so incoming contributors can see what “done” looks like.
- Maintain up-to-date screenshots or design references in the repository (e.g., `docs/design/`) to guide developers and designers.
- When adding new tasks or changing scope, update this plan so the checkbox status accurately reflects reality.
