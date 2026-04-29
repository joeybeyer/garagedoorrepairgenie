# Universal AI Search Playbook

Adapted for Garage Door Repair Genie and future local lead-gen properties.

Core formula:

```text
Answer-first content + schema markup + entity consistency + verification signals = stronger AI answer eligibility
```

This playbook treats patent analysis as a useful model for how AI answer systems may choose and cache sources. It does not assume one patent maps perfectly to Google AI Overviews, Ask Maps, ChatGPT, Perplexity, or every AI surface. The operating principle is still sound: make the answer easy to extract, easy to verify, and consistent everywhere.

## 1. Research Phase

Build a question inventory before writing.

Sources:

- Google People Also Ask.
- Competitor FAQ and service pages.
- Google Search Console queries once the site has data.
- Reddit, Quora, homeowner forums, and local community threads.
- Sales calls, form submissions, and call-tracking transcripts.
- Review language from customers.
- Ask Maps questions observed manually.

Do not rely on Google Business Profile manual Q&A seeding. Google discontinued the My Business Q&A API on November 3, 2025, and Maps is moving toward AI-generated answers from GBP fields, websites, reviews, and other sources.

## 2. Question Prioritization

Attack questions in this order.

| Tier | Question Type | Why It Matters |
| --- | --- | --- |
| Tier 1 | Cost, emergency, stuck, broken, unsafe, near-me equivalents | Highest call intent |
| Tier 2 | How it works, signs, causes, timeline, repair vs replace | Builds trust and supports service pages |
| Tier 3 | Long-tail, neighborhood, weather, material, special cases | Captures easier queries and strengthens topical depth |

For Garage Door Repair Genie, Tier 1 is already represented by the new PAA pages:

- `/how-much-does-garage-door-repair-cost/`
- `/what-to-do-if-garage-door-spring-breaks/`
- `/how-to-know-if-garage-door-spring-is-broken/`
- `/why-is-my-garage-door-stuck-open/`
- `/why-is-my-garage-door-stuck-closed/`
- `/why-is-my-garage-door-opener-not-working/`
- `/why-did-my-garage-door-cable-snap/`
- `/what-is-the-wire-on-my-garage-door-called/`
- `/why-did-my-garage-door-come-off-track/`

## 3. Answer-First Page Formula

Every answer page should follow this order:

1. Unique title tag with the exact question.
2. Unique meta description with a direct answer and CTA.
3. Canonical root-level URL.
4. Above-fold call CTA.
5. H1 matching the question.
6. First paragraph answering the question in 50-100 words.
7. Quick Answer box that can stand alone.
8. Supporting sections with homeowner-safe details.
9. Related questions with internal links.
10. Related service links to money pages.
11. Final call CTA.
12. FAQPage schema and BreadcrumbList schema.

Use short, extractable answers. Avoid vague openings like "it depends" unless followed immediately by a useful range or decision rule.

## 4. Schema Rules

Use schema to reinforce the page type and entity.

| Page Type | Required Schema |
| --- | --- |
| PAA / Garage Door Tips page | FAQPage, BreadcrumbList |
| Service hub | Service, FAQPage, BreadcrumbList |
| City hub | LocalBusiness, Service, FAQPage, BreadcrumbList |
| City-service page | LocalBusiness, Service, FAQPage, BreadcrumbList |
| Homepage | Organization, FAQPage |

Rules:

- FAQPage answers should match visible on-page answers.
- Do not add fake ratings, fake reviews, or fake author credentials.
- Add `dateModified` only when the page is actually improved.
- Validate schema after any template change.

## 5. Verification Signals

AI systems need corroboration. The website is the source of truth, but other properties should confirm it.

| Signal | Garage Door Repair Genie Implementation |
| --- | --- |
| GBP fields | Services, description, service areas, hours, phone, and website URL must match the site |
| Reviews | Ask customers to mention real service details, city/neighborhood, and speed when natural |
| Owner responses | Reinforce the actual service and city without keyword stuffing |
| Citations | Patch, Crunchbase, Chamber, BBB, and other profiles should use consistent NAP/service language |
| Video/audio | YouTube Shorts and SoundCloud titles should mirror the PAA/service topic |
| Internal links | Homepage, city hubs, service hubs, PAA pages, and city-service pages must reinforce each other |

## 6. Ask Maps Replacement For GBP Q&A

Deprecated instruction:

- "Set up GBP Q&A and mirror website FAQs."

Replacement instruction:

- Put the answer on a public website page.
- Add the service to GBP if it is real and offered.
- Rewrite the GBP business description with concrete services, city, service areas, and urgency terms.
- Request real reviews that mention the service and city naturally.
- Use owner responses to reinforce what happened.
- Keep citations and social profiles consistent.

Ask Maps/Gemini should be taught through structured website answers plus corroborating business data, not manually seeded Q&A.

## 7. Amplification Workflow

For each Tier 1 page:

1. Publish the website PAA page.
2. Link it from the Garage Door Tips navigation if it is top priority.
3. Link it from related service and city pages where natural.
4. Create a short video with the exact question as the title.
5. Create a SoundCloud/audio answer with the exact question as the title.
6. Publish a GBP post linking to the answer or matching service page.
7. Syndicate to social platforms using the same question and answer.
8. Add review prompts for real customers who experienced that issue.

## 8. Measurement

Weekly checks:

- Does the page index?
- Does the query trigger a PAA box?
- Does the query trigger an AI Overview or Ask Maps response?
- Which competitors are cited or summarized?
- Is the Garage Door Repair Genie URL in the top 10?
- Is Search Console showing impressions for the exact question?

Monthly checks:

- Refresh pages only when new facts, better answers, or real local data are added.
- Add internal links from newly relevant pages.
- Review calls/forms for new question language.
- Expand the PAA inventory only where there is distinct intent.

## 9. Current Project Status

Implemented:

- 77 sitemap URLs.
- 49 city-service pages.
- 9 answer-first PAA pages.
- Header/footer Garage Door Tips navigation to the top 5 PAA pages.
- Local answer blocks on all 7 city pages.
- FAQPage schema and BreadcrumbList schema on PAA pages.
- Validation script that checks page inventory, H1/title/canonical, schema, sitemap coverage, and internal links.

Still needed:

- Real GBP URLs and business descriptions.
- Real phone/call tracking.
- Real review strategy and owner response workflow.
- Real visual/video/audio assets per bucket.
- Search Console / GA / call tracking measurement.
- Schema validation through Google Rich Results Test after deployment.
