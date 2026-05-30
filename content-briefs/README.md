# Authority Content Briefs

This folder implements the AI Content Authority Building SOP for Garage Door Repair Genie.

The machine-readable source is `authority-clusters.json`. Each active cluster must define:

- the hub URL and whether city pages exist,
- the primary user intent,
- SERP evidence status,
- entities and facts with context,
- supporting queries and support URLs,
- the next SERP refresh question.

Use this workflow before creating or expanding a page:

1. Google the primary query and close variants from a neutral location.
2. Compare SERP overlap to decide whether the terms belong on one page or separate pages.
3. Extract entities, facts with context, and user goals from top results.
4. Update `authority-clusters.json`.
5. Generate or edit content from the refined brief, not from raw competitor copy.
6. Run `npm run audit:authority`.

Do not add new city-service families until the planned cluster has either live SERP evidence or Search Console demand.
