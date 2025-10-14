# Creaciones Colibrí Development Handbook

This handbook captures the conventions and best practices for building and maintaining the Creaciones Colibrí Eleventy site. Share it with every new contributor so anyone can onboard quickly and ship changes confidently.

---

## 1. Getting Started

1. Install Node.js 20 (LTS) or newer and npm 9+.  
   _Check your version with `node --version` and `npm --version`._
2. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/sandgraal/creaciones-colibri.git
   cd creaciones-colibri
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Add your Snipcart public API key to `SNIPCART_PUBLIC_KEY`. Without it, cart buttons will fall back to “View details.”

4. Run the Eleventy dev server:

   ```bash
   npm start
   ```

   The site will be available at `http://localhost:8080/creaciones-colibri/`. Eleventy watches files and rebuilds on change.

5. Build for production when you need a static output:

   ```bash
   npm run build
   ```

   The generated site lives in `_site/`; do not commit this directory.

---

## 2. Repository Layout

| Path | Purpose |
| ---- | ------- |
| `.eleventy.js` | Eleventy configuration (path prefix, passthrough copy, directories). |
| `src/` | Source content and templates. |
| `src/_includes/` | Layouts, partials, and reusable components. |
| `src/_data/` | Global data files (e.g., `products.js`) shared across templates and collections. |
| `src/products/` | Product catalog listing and the paginated detail template. |
| `src/blog/` | Journal index and long-form posts living under `src/blog/posts/`. |
| `src/css/` | Global stylesheets; `main.css` defines design tokens and shared components. |
| `src/img/` | Optimized site imagery (logo, product photos, etc.). |
| `docs/` | Documentation for developers and stakeholders (this handbook, design references). |
| `.github/workflows/pages.yml` | GitHub Actions workflow that builds and deploys the site to GitHub Pages. |

---

## 3. Workflow & Branching

1. Create a feature branch from `main` for every change. Use descriptive names such as `feature/product-cards` or `fix/cart-spacing`.
2. Keep commits focused. Reference the task you are addressing in the commit message (e.g., `Add product listing collection`).
3. Run `npm run build` locally before opening a pull request to catch template or path issues.
4. Open a pull request targeting `main`. Summaries should cover:
   - What changed and why.
   - Any manual steps required after merging (e.g., update environment secrets).
   - Testing performed (`npm run build`, Lighthouse report, etc.).
5. Require at least one review before merging (self-review acceptable for small housekeeping tasks).
6. After merge, GitHub Actions will rebuild and deploy automatically to GitHub Pages.

---

## 4. Eleventy Conventions

- **Layouts & partials:** Store layouts under `src/_includes/layouts/` and partials under `src/_includes/partials/`. Keep markup accessible (semantic HTML, ARIA only when necessary).
- **Data sources:** Use Eleventy data files in `src/_data/` (JSON, JS, or YAML) for product metadata, navigation, and site-wide settings. This keeps templates clean and makes localization easier.
- **Collections:** Register Eleventy collections in `.eleventy.js` when you need custom sorting or grouping (e.g., products by category). Accompany each collection with inline comments or a short doc entry.
- **Front matter:** Prefer YAML front matter for pages and posts. Include `title`, `layout`, and any page-specific metadata.
- **Filters & shortcodes:** Define reusable filters/shortcodes in `.eleventy.js`. Document the purpose and usage in this handbook so others can adopt them without spelunking through templates.
- **Path prefix:** Because we deploy to GitHub Pages under `/creaciones-colibri`, always reference assets via the Eleventy `url` filter (e.g., `{{ '/css/main.css' | url }}`) to keep paths correct in every environment.
- **Static assets:** Register new static directories with `addPassthroughCopy` in `.eleventy.js`. Keep the source tree organized (e.g., `src/fonts`, `src/js`).

---

## 5. Styling & Design System

- Use the design tokens defined in `:root` within `src/css/main.css` (`--color-`, `--radius-`, etc.). Introduce new tokens sparingly and document them.
- Favor component-oriented CSS. Group related rules in logical blocks with comments, and keep selectors specific enough to avoid collisions.
- Maintain responsiveness with CSS grid/flexbox and clamp-based typography where possible.
- Test color contrast and button accessibility; target WCAG AA minimum.
- When adding large features, create visual references (Figma links, screenshots) and store them under `docs/design/`.

---

## 6. Content & Localization

- Draft content in Markdown (English by default). When localization begins, add translated files in language-specific directories (e.g., `src/es/`) or leverage Eleventy’s i18n plugin.
- Keep a glossary of key product terms in `docs/localization.md` (to be created) so translations stay consistent.
- For long-form posts, place assets next to the entry (`src/blog/post-slug/`).
- Follow `docs/catalog-playbook.md` when editing product data to keep copy, pricing, and imagery standards consistent.

---

## 7. Testing & Quality

- **Functional:** Manually verify key flows (navigation, forms, checkout) in the dev server.
- **Accessibility:** Use browser extensions or Lighthouse to run quick audits. Fix issues before merging.
- **Performance:** Keep bundle sizes small; optimize images (use `.webp` where appropriate). Document any build tooling added for optimization.
- **Automated checks:** When the project grows, consider adding formatting or linting scripts (`npm run lint`). Document how to run them here.

---

## 8. Deployment & Environments

- GitHub Pages + Actions handle continuous deployment. No manual steps required unless secrets change.
- Deployment workflow:
  1. Push to `main`.
  2. GitHub Actions installs dependencies, runs `npm run build`, and publishes `_site` to the `gh-pages` environment.
  3. Monitor the Action run for failures. If a build breaks, fix on a branch and merge again; avoid force-pushing to history.
- Keep environment variables (API keys, form endpoints) in repository or organization secrets. Update this handbook whenever new secrets are introduced.

---

## 9. Onboarding Checklist for New Contributors

1. Read the project vision in `README.md`.
2. Review this handbook and the current `implementation_plan.md` to understand priorities.
3. Run the project locally (`npm install`, `npm start`) and verify the home page renders with brand styling.
4. Skim recent pull requests to understand coding style and commit patterns.
5. Pick an unchecked item from the implementation plan or open issues and coordinate with the team before starting.
6. Join the team communication channel (Slack/Teams/Discord) and request access to any third-party services (analytics, email marketing) you may need.

---

## 10. Continuous Improvement

- Update this handbook whenever you introduce a new tool, workflow, or convention.
- Capture lessons learned after launches or retrospectives in `docs/notes/` so context is never lost.
- Encourage documentation-first thinking: every feature should leave breadcrumbs for the next developer.
