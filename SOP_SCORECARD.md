# May 2026 SOP Scorecard

## Current Improvement Targets

- `itemprop` microdata: add visible HTML microdata across all 70 pages, with service/location pages using `name`, `description`, `telephone`, `address`, `areaServed`, `url`, and `serviceType` where applicable.
- Decision fit mapping: prioritize San Antonio, Marietta, Garage Door Repair, Garage Door Spring Repair, and Emergency Garage Door Repair first, then generated city-service pages through the page generator.
- Observed detail: tie local pages to climate, housing stock, or dispatch realities instead of generic garage door language.
- Feature to use case: use “matters when” or “matters for” prose for springs, cables, openers, sensors, tracks, tune-ups, and emergency stabilization.
- Quantified differentiation: use defensible numbers only, such as 10-15 minute diagnosis, 30-45 minute tune-ups, 60-90 minute common repairs, 10,000-cycle standard springs, and 15,000-20,000-cycle upgrades.
- Skim markup: generated city-service pages should stay at 1-5 `<strong>`, `<b>`, or `<em>` tags.

## Off-Page Operating Track

- Brand mention target: keep building plain-text mentions of `Garage Door Repair Genie` on indexed third-party domains.
- Priority sources: Trustpilot, Reddit, Quora, LinkedIn articles, X/Twitter posts that index, Google Sites/Docs, local citations, and distributed press releases.
- Anchor mix: use mostly branded or naked URL anchors; keep exact-match money anchors very low on Tier 1.
- Referral tracking: once GA4 access is available, track referral sessions to the five priority money pages separately from organic sessions.

## Verification

- Run `node scripts\validate-site.mjs` for sitemap, canonical, H1, title, schema, and internal-link validation.
- Run `node scripts\audit-sop.mjs` after generation and upgrades.
- Required audit gates: `itemprop_pages=70`, `schema_description_pages=70`, `schema_description_mismatches=0`, and `generated_pages_over_5_bold=0`.
