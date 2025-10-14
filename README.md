# Creaciones Colibrí

Creaciones Colibrí is a small‑batch food brand and online shop run by my wife and me.  Our focus is on **flavorful, handcrafted products** inspired by the biodiversity of Central America and our home gardens in Florida and Costa Rica.  The site is built with [Eleventy](https://www.11ty.dev/), a fast static‑site generator that outputs clean HTML from Markdown and templating.

## Vision

We want Creaciones Colibrí to feel like a modern farmers’ market: personal, transparent and rooted in nature.  Our catalog will start with the items we already make—**hot sauces**, **granola** and other natural pantry goods—but will expand into new categories as we develop recipes.  Key principles guiding this project:

* **Culinary storytelling** – each product page will include the story behind the item (e.g., how we source chiles for our *salsa picante chocolate habanero*, or why our granola uses local honey rather than refined sugar).
* **Sustainability** – we prefer compostable or reusable packaging and work with suppliers that practice regenerative agriculture【258269947385758†L165-L176】.  Upcycled ingredients such as spent grains or fruit pulp may be incorporated when possible【977856422785389†L266-L269】.
* **Health & functionality** – besides being delicious, many products will highlight functional ingredients: adaptogens like lion’s mane or ashwagandha【205801555446144†L58-L63】, anti‑inflammatory herbs like turmeric and ginger【977856422785389†L232-L239】, and protein‑rich inclusions when appropriate【258269947385758†L242-L249】.
* **Bold flavors** – consumers increasingly crave smoky ferments, fruit crossovers (mango‑habanero, pineapple‑chili) and regional sauces【363091106628353†L111-L117】.  Expect our lineup to feature both traditional recipes (e.g. salsa verde, peri‑peri, harissa) and creative blends.

## Proposed Product Categories

The following categories represent both our current offerings and ideas for future product lines based on 2025 food trends:

### Hot Sauces & Condiments

* **Classic sauces** – house salsa roja, salsa verde and our signature *salsa picante chocolate habanero*.
* **Fruit‑infused sauces** – mango‑habanero, pineapple‑chili and other tropical blends inspired by market demand for fruit crossovers【363091106628353†L111-L117】.
* **Regional/traditional** – peri‑peri (African), gochujang (Korean) and harissa (North African) to showcase global chile traditions【363091106628353†L95-L101】【363091106628353†L213-L218】.
* **Fermented condiments** – chili crisp or kimchi‑style sauces to satisfy the high‑heat and fermented foods trend【977856422785389†L241-L248】.

### Granola & Crunchy Snacks

* **Granola blends** – gluten‑free and low‑sugar mixes featuring oats, sprouted nuts and seeds, dried tropical fruits and adaptogenic herbs.  Consumers are looking for crunchy textures and unique flavors in breakfast products【258269947385758†L95-L104】.
* **Snack clusters** – roasted chickpeas, puffed quinoa clusters, dehydrated fruit chips and savory granola bars to play into the “Crunch: texture of the moment” trend【258269947385758†L95-L104】.

### Natural Foods & Pantry Staples

* **Nut & seed butters** – almond‑cacao butter, tahini with adaptogens or flavored peanut butters.
* **Dry spice mixes** – Mexican mole blend, Caribbean jerk seasoning, and a versatile vegetable seasoning.
* **Functional teas & beverages** – chai‑spiced granola and teas infused with adaptogens and electrolytes【258269947385758†L140-L155】【977856422785389†L250-L254】.
* **Fermented & pickled goods** – pickled vegetables (escabeche), sauerkraut with turmeric, and kombucha.
* **Upcycled and regenerative** – crackers made from spent grain, cookies using fruit pulp, and other products that reduce waste【977856422785389†L266-L269】.

### Gift Sets & Subscriptions

* **Sauce sampler packs** – sets of three or six sauces in small bottles to encourage customers to explore different flavors.
* **Granola of the month club** – a subscription delivering a new granola flavor each month, with recipe cards.
* **Wellness bundles** – curated boxes combining snacks, teas and functional foods aligned with themes like anti‑inflammatory, cognitive health or hydration【977856422785389†L203-L207】【977856422785389†L250-L254】.

## Features & User Experience

* **Product pages** – include ingredient lists, nutrition facts, usage suggestions and the product story.  Transparent sourcing and fair trade details build trust【363091106628353†L137-L140】.
* **Shopping cart & checkout** – integrate Snipcart (with Stripe/PayPal gateways) for secure payments while supporting multiple currencies and shipping to the US and Costa Rica.
* **Search & filter** – allow users to filter products by category (sauce, granola, etc.), dietary preferences (gluten‑free, vegan) or benefits (anti‑inflammatory, protein‑rich).
* **Blog & recipes** – publish blog posts about food trends, product origin stories and recipes using our products.  Tie posts to trending topics like spicy foods, upcycled ingredients or farm‑to‑table cooking.
* **Newsletter & social integration** – capture emails for promotional offers and integrate our Instagram feed to showcase behind‑the‑scenes content.
* **Localization** – support both English and Spanish to better serve customers in the US and Costa Rica.
* **Accessibility & performance** – ensure semantic HTML, alt text for images and optimized assets.  Eleventy produces static files that are inherently performant.

## Installation

```bash
# clone the repository
git clone https://github.com/sandgraal/creaciones-colibri.git
cd creaciones-colibri

# install dependencies
npm install

# configure environment variables (Snipcart public key)
cp .env.example .env
# then edit .env and set SNIPCART_PUBLIC_KEY

# run the development server
npx eleventy --serve

# build the static site for production
npx eleventy
```

## Deployment

Deployments are handled by GitHub Pages. The workflow in `.github/workflows/pages.yml` builds the Eleventy site and publishes the `_site` output whenever you push to `main`. Make sure the repository’s Pages settings are set to “GitHub Actions,” then the site will update automatically after each successful run.

## Project Structure

```
creaciones-colibri/
├── .eleventy.js           # Eleventy configuration
├── package.json           # project metadata and scripts
├── src/
│   ├── index.md           # home page
│   ├── img/               # product and logo images
│   └── ...                # additional pages, posts and data
└── README.md              # project overview (this file)
```

## Contributing

Contributions are welcome!  Review `docs/development-handbook.md` for workflow conventions, consult `docs/catalog-playbook.md` when touching product data, and check the live status in `implementation_plan.md`.  Feel free to open issues or submit pull requests for bug fixes, new features or documentation improvements.  Please keep commit messages clear and descriptive.

## License

This project is licensed under the MIT License.  See `LICENSE` for details (to be added).
