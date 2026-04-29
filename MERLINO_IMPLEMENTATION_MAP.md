# Garage Door Repair Genie Merlino/MAD Implementation Map

This document adapts the Merlino Method to Garage Door Repair Genie without polluting the money-page architecture. The site now has two clear layers:

- Transactional layer: root-level city/service pages that target `service + city + state` calls.
- PAA syndication layer: Garage Door Tips/Resources assets that answer People Also Ask questions and syndicate the same exact topic across images, video, audio, GBP, and social.

## Entity Rules

- One bucket equals one service plus one city.
- Do not mix spring, cable, opener, off-track, and emergency content in the same bucket.
- Every image, short video, audio episode, GBP post, social post, review prompt, owner response, and internal link in a bucket must match that bucket's service and city.
- Every PAA title should include the geo, for example: `How much does garage door spring repair cost in Atlanta GA?`
- The website page linked from a syndicated asset should be the exact matching city/service page, not the homepage.
- Do not rely on manual GBP Q&A seeding. The Q&A API was discontinued on November 3, 2025, so Ask Maps/Gemini should be fed from website FAQs, GBP fields, reviews, and citations.

## Money Page Bucket Structure

| Bucket | Website Page Pattern | Primary Conversion |
| --- | --- | --- |
| Garage Door Repair - City | `/garage-door-repair-[city-state]/` | Call for general diagnosis |
| Garage Door Spring Repair - City | `/garage-door-spring-repair-[city-state]/` | Call for broken spring service |
| Garage Door Torsion Spring Repair - City | `/garage-door-torsion-spring-repair-[city-state]/` | Call for torsion spring replacement |
| Garage Door Opener Repair - City | `/garage-door-opener-repair-[city-state]/` | Call for opener, remote, keypad, or sensor help |
| Emergency Garage Door Repair - City | `/emergency-garage-door-repair-[city-state]/` | Call now for urgent dispatch |
| Off-Track Garage Door Repair - City | `/off-track-garage-door-repair-[city-state]/` | Call before forcing the door |
| Garage Door Cable Repair - City | `/garage-door-cable-repair-[city-state]/` | Call for snapped or loose cable repair |

## Seed PAA Topics

These are seed questions for manual geo-targeted verification. Before publishing a full PAA article or social campaign, confirm the actual PAA list in a geo-targeted browser for the city.

| Service Bucket | PAA Title Pattern | Matching Page |
| --- | --- | --- |
| Garage Door Repair | Why won't my garage door open in [City State]? | `/garage-door-repair-[city-state]/` |
| Garage Door Repair | Why won't my garage door close in [City State]? | `/garage-door-repair-[city-state]/` |
| Garage Door Repair | Who fixes stuck garage doors in [City State]? | `/garage-door-repair-[city-state]/` |
| Garage Door Spring Repair | How do I know if my garage door spring broke in [City State]? | `/garage-door-spring-repair-[city-state]/` |
| Garage Door Spring Repair | How much does garage door spring repair cost in [City State]? | `/garage-door-spring-repair-[city-state]/` |
| Garage Door Spring Repair | Can I open my garage door with a broken spring in [City State]? | `/garage-door-spring-repair-[city-state]/` |
| Torsion Spring Repair | What happens when a torsion spring breaks in [City State]? | `/garage-door-torsion-spring-repair-[city-state]/` |
| Torsion Spring Repair | Should both torsion springs be replaced in [City State]? | `/garage-door-torsion-spring-repair-[city-state]/` |
| Opener Repair | Why is my garage door opener not working in [City State]? | `/garage-door-opener-repair-[city-state]/` |
| Opener Repair | Why does my garage door opener hum but not move in [City State]? | `/garage-door-opener-repair-[city-state]/` |
| Opener Repair | Why are my garage door sensors blinking in [City State]? | `/garage-door-opener-repair-[city-state]/` |
| Emergency Repair | What should I do if my garage door is stuck open in [City State]? | `/emergency-garage-door-repair-[city-state]/` |
| Emergency Repair | Who offers emergency garage door repair in [City State]? | `/emergency-garage-door-repair-[city-state]/` |
| Off-Track Repair | What should I do when my garage door comes off track in [City State]? | `/off-track-garage-door-repair-[city-state]/` |
| Off-Track Repair | Is it safe to close an off-track garage door in [City State]? | `/off-track-garage-door-repair-[city-state]/` |
| Cable Repair | What happens when a garage door cable snaps in [City State]? | `/garage-door-cable-repair-[city-state]/` |
| Cable Repair | Can I use my garage door if the cable came off in [City State]? | `/garage-door-cable-repair-[city-state]/` |

## Asset Naming

Use the same exact PAA + geo string across every asset in the bucket.

| Asset | Naming Format |
| --- | --- |
| Image file | `paa-question-city-state.webp` |
| Image alt text | Exact PAA + brand |
| Short video title | Exact PAA + geo |
| SoundCloud episode | Exact PAA + geo |
| GBP post headline | Exact PAA + geo |
| Pinterest pin title | Exact PAA + geo |
| YouTube Short title | Exact PAA + geo |
| Internal anchor | Exact PAA or service + city keyword |

## On-Site PAA Page Rules

- Keep PAA pages under root-level slugs only, never nested folders.
- Use `Garage Door Tips` language, not `blog`.
- One PAA page should answer one core PAA plus 3-4 related PAAs.
- The page must link to the matching money page with service + city anchor text.
- If the PAA is cost-focused, use ranges and variables, not fixed pricing.
- If the PAA involves springs, cables, off-track doors, or emergency calls, include the safety warning.

## Trust And Validation Tasks

These are not code-only tasks, but the site should be ready to link to them once the profiles exist.

| Priority | Task | Site Integration |
| --- | --- | --- |
| 1 | CallRail or equivalent call tracking per channel/location | Replace placeholder phone numbers and add tracked organic numbers |
| 2 | Google Business Profiles per city | Add real NAP and GBP links to city pages |
| 3 | Patch.com profile and posts | Add to trust footer after profile exists |
| 4 | Crunchbase profile | Add to trust footer after profile exists |
| 5 | Chamber of Commerce profiles in each market | Add badges/links to relevant city pages |
| 6 | SoundCloud account | Embed PAA episodes on matching Garage Door Tips pages |
| 7 | YouTube Shorts / Instagram / TikTok | Embed or link from matching PAA pages only |
| 8 | Review collection via correct GBP/MID link | Ask for real service/city details that reinforce Ask Maps answers |
| 9 | Fact-dense GBP descriptions | Mirror the services and neighborhoods already covered on city pages |

## Launch Cadence

- Month 1: verify PAA questions manually for Portland, Atlanta, and San Antonio first.
- Month 1: publish 1 PAA page per highest-value service in each priority city.
- Month 1: syndicate each PAA page to GBP, YouTube Shorts, Instagram, TikTok, Pinterest, Facebook, LinkedIn, X, SoundCloud, Reddit, and Quora.
- Month 2: repeat for Vancouver, Savannah, Marietta, and Roswell.
- Ongoing: one verified PAA bucket per week, with all assets aligned to one service and one city.

## QA Checklist

- Title contains exact PAA + geo.
- H1 mirrors the PAA title.
- H2s are related PAAs, not repeated keywords.
- Image has logo, service visual, and readable PAA text.
- Video is UGC-style or real-job footage when available.
- SoundCloud episode title matches the PAA.
- GBP post links to the matching PAA page or money page.
- GBP description confirms the service, city, service areas, and urgency terms covered by the website.
- Customer review prompts ask for real service details, not keyword-stuffed copy.
- No tracking number appears in GBP image text unless it is the intended GBP primary number.
- City/service money page is internally linked from the PAA page.
- No asset from another service appears in the bucket.
