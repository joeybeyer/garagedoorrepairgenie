# Garage Door Repair Genie Local SEO Entity Implementation

This adapts the Local SEO AI Agent SOP to a Cloudflare static site. The site is not WordPress, but the entity logic still applies: GBP categories, GBP services, website pages, schema, internal links, and local content should all tell the same story.

## Current Architecture

- Platform: Cloudflare Worker with static HTML assets.
- URL rule: flat root-level URLs only.
- Current page count: 68 pages.
- Core structure: homepage, service hubs, city GBP hubs, city-service money pages, Garage Door Tips, contact.
- Entity priority: garage door repair services by city, not generic national content.

## GBP Entity Data Needed

Before the final GBP mirror can be considered complete, each location needs real profile data.

| Field | Status | Action |
| --- | --- | --- |
| Primary GBP category | Needed | Likely `Garage door supplier` or closest available garage-door repair category; verify in GBP |
| Secondary GBP categories | Needed | Pull competitor categories per city before selecting |
| GBP services | Needed | Map every selected service to an existing page or planned page |
| Address/service area | Needed | Add real service-area data per city |
| Hours | Needed | Add real hours/special hours to LocalBusiness schema |
| GBP phone | Placeholder | Replace `(000) 000-0000` with tracked number strategy |
| GBP URL | Needed | Add each city GBP URL once profiles are live |
| Reviews/rating | Needed | Add only real aggregate ratings after verified |
| GBP business description | Needed | Use fact-dense service/city/neighborhood copy that matches the website |

## Service Entity Overlap Decisions

These are the current page/entity decisions. This can be refined after a real SERP/GBP overlap pass in each city.

| Entity | Dedicated Page? | Reason |
| --- | --- | --- |
| Garage door repair | Yes | Root transactional category and catch-all diagnosis intent |
| Garage door spring repair | Yes | Distinct high-value repair entity |
| Garage door torsion spring repair | Yes | Distinct enough from general spring intent and safety-sensitive |
| Garage door opener repair | Yes | Distinct service entity with opener/sensor/remote terms |
| Emergency garage door repair | Yes | Distinct urgency modifier and conversion path |
| Off-track garage door repair | Yes | Distinct symptom entity |
| Garage door cable repair | Yes | Distinct safety-sensitive service entity |
| Garage door wire broke | Tips page | User-language variant; should funnel into cable repair |
| Garage door spring snapped | Tips page | User-language variant; should funnel into spring repair |
| Cost to replace garage door spring | Tips page | Informational/commercial investigation intent |

## Core 30 Translation

The SOP's Core 30 concept is implemented here as a larger flat local-service grid rather than nested WordPress categories.

| SOP Page Type | Static Site Equivalent |
| --- | --- |
| Homepage: primary category + city | Homepage targets brand + broad garage door repair conversion |
| Secondary category page | Service hub pages such as `/garage-door-spring-repair/` |
| Service page | City-service pages such as `/garage-door-spring-repair-atlanta-ga/` |
| Location expansion page | City GBP hubs such as `/atlanta-ga/` plus future neighborhood pages if needed |

## Internal Linking Hierarchy

- Homepage links to all service hubs and all city hubs.
- Each city hub links to its seven city-service pages.
- Each service hub links to its seven city-service pages.
- Each city-service page links back to its city hub and related city-service pages.
- Tips pages should link to the matching service hub and, when geo-specific, the matching city-service page.

## Content Production Passes

Use this 8-pass checklist for any new city-service page, PAA page, or major rewrite.

1. Section outline: title, H1, H2s, FAQ, CTA, schema target.
2. First draft by section: answer one intent per section.
3. Burst edit: vary sentence length and remove repetitive phrasing.
4. Human edit: remove generic AI phrasing and add direct homeowner language.
5. Conversational bookends: make intro and close sound like a real local service brand.
6. Conversion pass: above-fold phone CTA, urgency, and safety where relevant.
7. Hyper-local pass: neighborhoods, climate, housing stock, roads, landmarks, or local constraints.
8. QA pass: schema, links, mobile layout, duplicate title/H1 check, no cannibalization.

For the human edit and conversational bookend passes, use `HUMAN_CONTENT_SOP.md`. Keep the voice natural, but do not fabricate personal experience, technician stories, reviews, or exact response times.

## Schema Requirements

| Page Type | Required Schema |
| --- | --- |
| Homepage | Organization, FAQPage |
| Service hub | Service, FAQPage, BreadcrumbList |
| City hub | LocalBusiness, Service, FAQPage, BreadcrumbList |
| City-service page | LocalBusiness, Service, FAQPage, BreadcrumbList |
| Tips/PAA page | Article or BlogPosting equivalent, FAQPage, BreadcrumbList, Service link target |
| Contact | Organization or ContactPage, BreadcrumbList |

Notes:

- Add real `openingHoursSpecification` once hours are known.
- Add real `sameAs` profiles only after profiles are created and verified.
- Do not add fake ratings, fake reviews, or fake local addresses.

## Image And Video Requirements

The current site is intentionally lightweight and has no stock image dependency. For the next content layer, add assets bucket-by-bucket.

| Asset | Requirement |
| --- | --- |
| Logo | Already optimized as WebP and used globally |
| City-service image | Real/UGC preferred: tech, garage door, tool, branded logo overlay |
| PAA image | PAA text + logo + service-specific visual |
| Short video | 15 seconds, exact PAA + geo title, real person/real job when available |
| YouTube embed | Only embed on the matching service/PAA page |
| Image alt text | Match asset topic, not generic keyword stuffing |

## Gap Analysis Workflow

1. Export GBP categories and services for each city.
2. Crawl current pages from `public/sitemap.xml`.
3. Match every GBP service to one URL.
4. Mark any GBP service without a URL as a gap.
5. Mark any URL without matching GBP service/category as either a valid SEO expansion or a low-priority orphan.
6. Add missing pages only when they represent distinct entities or meaningful local search intent.

## Ask Maps / GBP Q&A Replacement

Manual GBP Q&A seeding should no longer be part of the operating plan. Google discontinued the My Business Q&A API on November 3, 2025, and the public Q&A experience is being replaced by AI-generated Maps answers.

The replacement strategy is:

- Put answer-first FAQ content on the website.
- Make GBP descriptions, categories, services, service areas, and hours complete and fact-dense.
- Ask real customers to mention concrete service details in reviews.
- Keep review responses aligned with the service, city, and problem solved.
- Link the GBP profile to the strongest matching city page, not a generic homepage when a city profile exists.

## Current Known Gaps

| Gap | Impact | Fix |
| --- | --- | --- |
| Real GBP category/service data missing | Cannot fully mirror GBP entity structure | Export each GBP and update this map |
| Real NAP/tracked phone missing | Conversion attribution and LocalBusiness schema incomplete | Implement CallRail/approved tracking strategy |
| Trust profiles missing | Entity validation weaker | Add Patch, Crunchbase, Chamber, BBB, SoundCloud, YouTube when live |
| PAA pages not yet built | Missing AI Overview/social syndication layer | Build verified PAA pages from geo-targeted PAA extraction |
| Real local images/videos missing | Weak visual/entity trust | Produce service-specific UGC assets per city |
| GBP descriptions and reviews not mapped | Ask Maps/Gemini has weaker source data | Use `ASK_MAPS_STRATEGY.md` to align descriptions, reviews, and owner responses |

## QA Targets

- Every page has one unique title tag.
- Every page has one H1.
- Every canonical URL matches its clean root-level URL.
- Every sitemap URL returns 200.
- Every city/service page contains LocalBusiness, Service, FAQPage, and BreadcrumbList schema.
- No page has a duplicate city-service primary target.
- Mobile layout has no overlapping cards, text, header, or CTA.
- PageSpeed stays lightweight: no external fonts, no heavy libraries, no unnecessary scripts.
