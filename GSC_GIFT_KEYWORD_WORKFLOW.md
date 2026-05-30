# GSC Gift Keyword Workflow

The SOP's post-publish rule is simple: when Google tests a page on a query we did not target, answer that query before the test window closes.

## Weekly Export

Export from Google Search Console:

- Search results > Pages
- Date range: last 7 days and last 28 days
- Dimensions: Page, Query
- Metrics: Impressions, Clicks, CTR, Average position

Save the working sheet with these columns:

| Date | URL | Query | Impressions 7d | Impressions 28d | Avg position | Current page answers it? | Action | Owner | Due |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 2026-05-30 | /example/ | example query | 0 | 0 | 0 | yes/no/partial | update/create/ignore |  |  |

## Decision Rules

- `yes`: improve the existing section if CTR is weak or ranking is slipping.
- `partial`: add a direct answer block, FAQ, comparison, or internal link within 72 hours.
- `no`: create a new brief in `content-briefs/authority-clusters.json` before writing a new page.
- `wrong intent`: do not force the page to rank; create or map the correct page.

## Priority Order

1. Queries with impressions and average position 4-20.
2. Queries that imply emergency, stuck, spring, cable, opener, or city intent.
3. Queries where the page ranks but does not answer the exact question.
4. Queries appearing across multiple pages, because that can show cannibalization.

## Monthly Review

Run:

```powershell
npm run audit:authority
npm run audit:sop
npm run audit:human
node scripts\validate-site.mjs
```

Then update the `nextSerpRefresh` field for any cluster that needs live SERP verification.
