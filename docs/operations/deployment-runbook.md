# Deployment & Rollback Runbook

This runbook documents how the Creaciones Colibrí site deploys to GitHub Pages and the steps to recover quickly from failed releases.

## 1. Pipeline Overview
- **Source control:** GitHub repository `sandgraal/creaciones-colibri`.
- **CI/CD:** GitHub Actions workflow at `.github/workflows/pages.yml` builds the Eleventy project on every push to `main`.
- **Build output:** `npm run build` writes the static site to `_site-eleventy/`. The workflow hands that directory to `actions/jekyll-build-pages@v1`, which produces the final `_site` artifact required by GitHub Pages.
- **Hosting:** GitHub Pages serves the artifact at `https://sandgraal.github.io/creaciones-colibri/` with the repository’s `main` branch as the source.

### Required Secrets for CI
Make sure these secrets exist in the repository before triggering deployments:
- `SNIPCART_PUBLIC_KEY`
- `SITE_URL`
- Any optional integration values (`PLAUSIBLE_DOMAIN`, form endpoints) needed for production.

## 2. Standard Deployment Procedure
1. Merge the feature branch into `main` via pull request.
2. Monitor the **Pages** GitHub Actions workflow:
   - `setup-node` installs dependencies.
   - `npm run build` generates Eleventy output.
   - `actions/jekyll-build-pages@v1` and `actions/deploy-pages@v4` publish the site.
3. Verify the deployed site:
   - Smoke-test homepage, products, checkout, and blog sections.
   - Check the browser console for Snipcart or form configuration errors.
   - Confirm sitemap and robots endpoints respond (e.g., `/sitemap.xml`, `/robots.txt`).
4. If secrets changed, update `docs/operations/qa-checklist.md` with notes and notify stakeholders in the team channel.

## 3. Rollback Playbook
1. **Identify the bad release:** Locate the pull request or commit that introduced the regression.
2. **Revert in Git:**
   - Create a revert commit (`git revert <sha>`) on a hotfix branch.
   - Open a pull request titled “Rollback <feature>” explaining the issue and linking to the failing deployment or bug report.
   - Merge the revert PR once approved; GitHub Actions will redeploy the previous stable code.
3. **Hotfix alternative:** If the issue is configuration-only (e.g., wrong env secret), update the secret in GitHub settings and re-run the latest Pages workflow via the Actions UI (`Re-run jobs`).
4. **Confirm recovery:** After the redeploy finishes, verify the fix on production. Update incident notes in this document if the root cause reveals a new safeguard we should add.

## 4. Re-run / Redeploy Steps
- To redeploy without new commits, go to **Actions → Pages build and deployment**, select the most recent run, and click **Re-run all jobs**.
- For infrastructure-level incidents (Pages outage), prepare a static export by running `npm run build` locally and publishing the `_site-eleventy/` directory to an alternate host (Netlify, Cloudflare Pages). Document the temporary URL in the incident log.

## 5. Monitoring & Alerts
- Subscribe to [GitHub Status](https://www.githubstatus.com/) notifications for Pages incidents.
- Review the Lighthouse and accessibility action items in `docs/operations/qa-checklist.md` after major releases.
- Once Plausible is live, add an alert for drastic drops in traffic or conversions and log incidents here.

## 6. Incident Log
Record notable deployment issues to build institutional memory:

| Date | Incident | Resolution |
| ---- | -------- | ---------- |
| 2024-__-__ | _Example: Snipcart key misconfigured_ | _Updated GitHub secret and re-ran deployment._ |

Keep this runbook close during launches to reduce downtime and improve response time when issues appear.
