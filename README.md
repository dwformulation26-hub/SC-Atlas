# SC Atlas

Subcutaneous Advanced Tracking and Landscape Analysis System

A static, no-build dashboard tracking high-concentration subcutaneous (SC)
injection technologies: who owns them, what stage they're at, what
concentration they've demonstrated, how they work, and the deal/news
activity behind each one -- benchmarked against our internal target
platforms (H-Cure, Thermicra) and the marketed reference product
(Dupixent).

This repo merges two earlier prototypes: the clean data/app separation and
sidebar/table/donut layout from `SC-Atlas-Tracker`, plus the richer content
(deal feed, internal benchmarks, concentration-vs-stage chart) from
`High-Concentration-SC`. Everything is condensed into a compact table with
expandable rows and short deal summaries with a "Read more" toggle, rather
than always-expanded cards -- so the page stays scannable at a glance
without hiding anything.

## Structure

```
index.html                    the dashboard page (no build step, no framework)
assets/styles.css             all styling
assets/app.js                 fetches data/dashboard_data.json and renders everything
assets/icon.svg               brand mark / favicon

data/technologies_db.py       EDIT THIS to add/update a technology
data/deals_db.py              EDIT THIS to log a new deal or news finding
data/internal_targets.json    hand-maintained: H-Cure, Thermicra, Dupixent
data/dashboard_data.json      generated -- the only data file the dashboard reads
data/archive/                 the original two source spreadsheets, kept for
                               provenance only -- nothing reads them anymore

scripts/build_data.py         regenerates dashboard_data.json from the *_db.py
                               files + internal_targets.json. Stdlib only, no
                               pip install needed.
```

**The app and the database are two completely separate things.**
`assets/app.js` never touches technology/deal data directly -- it only
fetches and renders `data/dashboard_data.json`. Adding a finding never
means editing `index.html`, `assets/app.js`, or `assets/styles.css`; it
means editing `data/technologies_db.py` or `data/deals_db.py` (plain
Python, safe for Claude or a human to edit with a text editor) and running
one script.

## Viewing it locally

Any static file server works, e.g.:

```
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly via `file://` will *not* work -- the browser
blocks the `fetch()` call that loads `data/dashboard_data.json`. A local
server (or any real static host, e.g. GitHub Pages) is required.

## Updating the data

This is the entire routine update loop -- intended to be run by a scheduled
task (human or Claude) without touching any other file, and without
installing anything:

1. **New technology, or a change to an existing one:** open
   `data/technologies_db.py` and add/edit a dict in `TECHNOLOGIES`. Copy an
   existing entry as a template; give a new one a unique `id` (lowercase,
   underscore-separated -- that's what deals join against).
2. **New deal or news finding:** open `data/deals_db.py` and add a dict to
   `DEALS`. Its `technology_id` must match an `id` in `technologies_db.py`
   (or a `deal_id_aliases` entry in `internal_targets.json` if it's about
   an internal target rather than an external technology). Give it a
   unique `deal_id`.
3. If an internal target or the reference product's numbers changed
   (rare), edit `data/internal_targets.json` directly -- it's hand-written,
   not generated, since it doesn't come from either database file.
4. Run:
   ```
   python scripts/build_data.py
   ```
5. Commit the regenerated `data/dashboard_data.json` along with whichever
   `*_db.py` file(s) or `internal_targets.json` changed.

The script prints a `WARNING` to stderr for anything it can't confidently
place -- a `stage_raw` value that doesn't match any bucketing rule, or a
deal whose `technology_id` doesn't match a known technology or
internal-target alias. Don't ignore these; either add a rule
(`STAGE_RULES` in `scripts/build_data.py`) or fix the entry that triggered it.

### Fields the script normalizes

- **`stage_bucket`** -- the raw "Development Stage" text is messy free text;
  the script buckets it into six categories (Research / Academic →
  Preclinical → Platform / Feasibility → Pre-registration / Late-stage →
  Approved / Marketed, plus a "Varies by Program" catch-all) that drive both
  the stage filter and the scatter chart's x-axis.
- **`concentration_bucket`** -- the numeric mg/mL column bucketed into
  ranges for the concentration filter. Rows without a numeric value show as
  "Not disclosed," not zero.
- **deal dates** -- a deal's `date` field is often free text ("2022-11
  (option); converted to exclusive worldwide license") rather than a clean
  date -- that's fine, don't force it into ISO format. The script extracts
  the latest year/month/day mentioned anywhere in the text to sort deals
  newest-first; the original text is preserved for display.
- **`thermicra_unconfirmed` deal** -- one entry in `deals_db.py` was
  originally logged against an external company before being corrected to
  an internal target. `data/internal_targets.json`'s `deal_id_aliases`
  field redirects any deal with that `technology_id` onto the Thermicra
  internal target as a note, instead of showing it as an unmatched or
  external entry.

## Design notes

- **No fabricated "verified sources" stat.** Confidence/relevance/conflict
  flags from the deals sheet are surfaced as-is (FLAGGED / NEW badges,
  Relevance and Confidence values in the raw JSON) rather than rolled into
  an invented aggregate score.
- **Colors carry a text label everywhere.** Stage, type, and flag badges are
  never color-only.
- **Table, not cards.** The technology list is one compact table (name,
  company, type, concentration, stage, last reviewed); clicking a row
  expands it in place to show mechanism, needle size, and that
  technology's deal/news activity. Internal targets and the reference
  product appear as rows too (tinted, tagged "Internal"/"Reference"), so
  they're filterable and searchable alongside everything else.
- **Deal summaries are short by default.** Anything over ~190 characters is
  truncated with a "Read more" toggle that expands it in place -- the date,
  partner, deal type, flag/new badges, and source link are never hidden
  behind that toggle, only the long narrative text is.
- **The donut ("Technologies by approach") is clickable.** Clicking a
  segment or legend row filters the table by that type -- the same
  grouping the old "four paths" panel showed, but as an interactive chart
  instead of a block of always-visible text.
- **CSV export** exports whatever the current filters show, not the full
  set.

## Data caveats worth knowing before you present this

- Several technologies' `stage_raw` text describes a mix of statuses in one
  string (e.g. "Commercial (lead product approved); platform extension in
  Phase III"). The bucketing picks the most senior/leading status -- check
  `stage_raw` in `data/technologies_db.py` (or expand the row on the
  dashboard) before citing a specific stage in a deck.
- A meaningful share of technologies have no disclosed numeric
  concentration. They show as "Not disclosed," not zero.
- Several deals are explicitly flagged (`flagged: True` in `deals_db.py`)
  as based on conflicting or unconfirmed secondary sources -- these carry a
  visible FLAGGED badge in both the recent-activity feed and the per-tech
  deal list. Don't cite a flagged item as confirmed without checking its
  summary text.
