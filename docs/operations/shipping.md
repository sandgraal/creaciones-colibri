# Shipping & Packaging Strategy

This guide outlines recommendations for domestic and international fulfillment, sustainable packaging, and next steps. Revisit quarterly as rates or suppliers change.

## 1. Shipping Overview

### Domestic (United States)
- **Primary carrier: USPS** — Priority Mail Cubic for sauces/jars up to 20 lb (2–3 day average, tracking included). Estimated $8–$12 per parcel depending on zone.
- **Backup carrier: UPS Ground** — Better for larger wholesale orders (>10 lb) or multi-case shipments; integrates with Shopify/Snipcart easily.
- **Optional add-on:** Insure parcels valued over $50 (approx. $1.50 per $100 declared value).

### International (Costa Rica → US & US → International)
- **USPS Priority Mail International** — 6–10 day delivery with tracking; ~ $35 for 1 kg package. Good for occasional consumer orders.
- **DHL Express Worldwide** — Faster (3–5 days) with customs brokerage support; higher base cost (~$55 for 1 kg) but discounted via EasyShip/Shippo accounts.
- **Customs prep:** Include ingredient list with Spanish/English labeling; ensure sauces meet local regulations (declare vinegar-based shelf-stable products).

### Fulfillment Tools
- Use a shipping platform (Pirate Ship, Shippo) to compare carrier rates and generate labels.
- Configure dimensional weight templates: 9×6×3 in mailer for single sauce/jar; 12×9×4 in mailer for bundles; 14×10×6 in box for six-pack samplers.

## 2. Packaging & Sustainability

- **Primary container:** Compostable padded mailers (e.g., noissue, EcoEnclose) for single jars/sachets; cost ~$1.05 per unit at 100 quantity.
- **Box option:** Recycled corrugate boxes with compostable water-activated tape for larger bundles; expect ~$1.60 per box at 100 quantity.
- **Void fill:** Mushroom packaging or recycled paper crinkle; avoid plastic bubble wrap. Allocate ~$0.45 per shipment.
- **Insulation:** For heat-sensitive products, include plant-based insulated liners (temperatures >85°F). Approx. $1.80 each.
- **Labeling:** Soy-based inks, FSC-certified paper for stickers; ensure materials survive moisture during transit.

## 3. Cost Snapshot (per order)

| Shipment | Packaging | Carrier (avg) | Total Estimated |
| -------- | --------- | ------------- | ----------------|
| Single 5 oz sauce (US) | Compostable mailer + glass bottle protector (~$1.50) | USPS PM Cubic Zone 4 (~$8.75) | ~$10.25 |
| Sauce trio (US) | Recycled box + filler (~$2.20) | USPS PM Cubic Zone 7 (~$11.40) | ~$13.60 |
| Granola + tea kit (US) | Box + liner (~$2.60) | UPS Ground regional (~$9.85) | ~$12.45 |
| International 1 kg | Compostable box + filler (~$2.60) | USPS PMI (~$35.00) | ~$37.60 |

Adjust pricing as negotiated rates improve. Track actual spend per shipment to refine the model.

## 4. Snipcart Rate Configuration

Translate the strategy above into concrete rules inside Snipcart so checkout quotes match our pricing model.

### 4.1 Domestic Table Rates

Configure a **Custom table** under **Store settings → Shipping → Add new rate → Custom rates** with the following rows:

| Condition | Rate | Notes |
| --------- | ---- | ----- |
| Order total < $75.00 | Flat $8.00 | Covers USPS Priority Mail Cubic Zone 4–6 plus packaging. |
| Order total ≥ $75.00 | Free | Encourage bundle purchases; margin modeled in pricing worksheet. |

Enable the rate for United States + Puerto Rico. Keep “stack rates” disabled so only one row applies at a time.

### 4.2 International Rates

Add a second **Custom table** for international destinations (Canada, Costa Rica, EU pilot countries):

| Condition | Rate | Notes |
| --------- | ---- | ----- |
| Parcel weight ≤ 1.1 kg | $34.95 | Mirrors USPS Priority Mail International small parcel. |
| Parcel weight 1.1–2.5 kg | $44.95 | Covers heavier bundles or multi-pack granola orders. |
| Parcel weight > 2.5 kg | Live carrier quote | Fallback to DHL Express (requires carrier credentials). |

Activate dimensional weight and enter default parcel size `12 × 9 × 4 in` to align with bundle packaging. When DHL credentials are unavailable, temporarily disable the >2.5 kg row and add manual review instructions to the order confirmation email.

### 4.3 Taxes & Payment Methods

1. **Taxes:** Enable Stripe Tax in **Store settings → Taxes** with nexus set to Florida. Add manual override (7%) if Stripe Tax is unavailable.
2. **Payment gateways:** Connect Stripe (primary) and PayPal (secondary) under **Store settings → Payments** so buyers can choose either option. Confirm both are set to test mode while QA is in progress.
3. **Currency:** Keep USD as default; revisit multi-currency once Canadian demand increases.

### 4.4 QA Log

Document each configuration change in `docs/operations/snipcart-test-plan.md` so future releases know which rates/taxes are active. Include screenshots or exported CSVs from Snipcart when adjustments occur.

## 5. Action Items

1. Set up Pirate Ship or Shippo account and import product catalog dimensions.
2. Order packaging samples from EcoEnclose/noissue to validate fit and durability.
3. Implement the Snipcart tables above and capture screenshots in the test plan log.
4. Draft customs/compliance checklist for sauces entering Costa Rica, EU, and Canada.
5. Review sustainable packaging certifications (BPI, OK compost) for marketing claims.

Document updates in this file after each rate review or vendor change.
