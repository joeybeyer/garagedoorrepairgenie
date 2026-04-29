# Garage Door Repair Genie AI Search Domination Map

This adapts the Glean patent reverse-engineering notes into practical site rules. Treat the patent language as an implementation model, not proof that every AI search product works identically. The useful takeaway is clear: AI answer systems prefer fast, extractable, verified, entity-consistent answers from top-ranked accessible documents.

## Implementation Goal

Make Garage Door Repair Genie pages easy for AI systems to:

- identify as a local garage door repair entity,
- extract a short answer from,
- verify against schema and consistent business data,
- cite or summarize for service + city questions,
- route searchers to a phone call.

## Page Extraction Rules

Every money page should include:

| Element | Rule |
| --- | --- |
| Title | Primary service + city/state + conversion modifier |
| H1 | Mirrors the primary query naturally |
| First paragraph | Complete answer in 40-60 words |
| Quick Answer section | One concise paragraph plus 4-5 bullets |
| H2s | Secondary cluster terms, one intent per section |
| FAQ | 3+ direct questions with concise answers |
| Schema | LocalBusiness, Service, FAQPage, BreadcrumbList |
| Internal links | City hub, service hub, related city-service pages |
| CTA | Phone call above the fold and final CTA |

The generated city-service pages now follow this structure.

## Canonical Answer Pattern

Use this format for any future PAA or FAQ page:

```text
H1: [Exact question] in [City, State]

Short Answer: [Complete 40-60 word answer with the service, city, brand, and key action.]

Quick Answers:
- Cost/time/safety answer
- Most common cause
- What not to do
- When to call
- Local availability

H2: [Related PAA 1]
H2: [Related PAA 2]
H2: [Related PAA 3]
H2: [City-specific details]
FAQ schema
CTA
```

## Garage Door Canonical FAQ Targets

These are the first answer-first pages to build after the transactional grid.

| Cluster | Canonical Question | Target URL |
| --- | --- | --- |
| Spring repair | How do I know if my garage door spring broke in [City State]? | `/garage-door-spring-repair-[city-state]/` or future PAA page |
| Spring cost | How much does garage door spring repair cost in [City State]? | `/cost-to-replace-garage-door-spring/` plus city variants if needed |
| Cable repair | What happens when a garage door cable snaps in [City State]? | `/garage-door-cable-repair-[city-state]/` |
| Opener repair | Why is my garage door opener not working in [City State]? | `/garage-door-opener-repair-[city-state]/` |
| Emergency | What should I do if my garage door is stuck open in [City State]? | `/emergency-garage-door-repair-[city-state]/` |
| Off-track | Is it safe to close an off-track garage door in [City State]? | `/off-track-garage-door-repair-[city-state]/` |

## Verification Signals To Add

The current website has placeholder phone/entity data. AI trust improves when these become real and consistent.

| Signal | Status | Action |
| --- | --- | --- |
| Consistent NAP | Placeholder | Replace phone and add real location/service-area data |
| Verified GBP | Needed | Add each GBP URL to the matching city page |
| Author/business attribution | Partial | Add reviewed-by or published-by block after operator is finalized |
| Freshness | Needed | Add `dateModified` to schema when content maintenance starts |
| Third-party profiles | Needed | Add Patch, Crunchbase, Chamber, BBB, SoundCloud, YouTube when live |
| Reviews | Needed | Add only real aggregate ratings after verified |
| Engagement assets | Needed | Publish matching YouTube Shorts, GBP posts, and SoundCloud episodes |

## AI Overview / Answer Inclusion Checklist

- Page is publicly accessible with no login or heavy script dependency.
- Page loads fast and is in the sitemap.
- The first paragraph answers the query directly.
- The quick answer section can stand alone if copied into a prompt.
- FAQ answers are short, factual, and schema-backed.
- Claims are verifiable and not hype-based.
- The page avoids fake fixed pricing unless a real pricing model exists.
- Safety-sensitive pages warn users not to force the door.
- Internal anchor text matches the query cluster.

## Testing Protocol

Track manually before and after publishing each new FAQ/PAA asset:

- Does the query trigger an AI Overview?
- Which pages are cited or summarized?
- Does a PAA box appear?
- Which competitor pages are used as sources?
- Does Garage Door Repair Genie appear in top 10 organic results?
- Does Search Console show impressions for the exact PAA?
- Are phone calls attributed to organic/FAQ traffic once tracking is installed?

## Content Maintenance Rule

When a page is updated, update both:

- visible `Last updated` text if added to the page,
- schema `dateModified` if Article/FAQ content is used.

Do not add artificial freshness dates without making a real content improvement.
