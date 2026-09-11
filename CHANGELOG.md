# Changelog

- 2026-08-24: Built by combining two prior prototypes (`SC-Atlas-Tracker`,
  `High-Concentration-SC`) into one dashboard: `SC-Atlas-Tracker`'s
  data/app separation (build script → single JSON → static page) plus
  `High-Concentration-SC`'s content (deal feed, internal benchmarks, four
  paths, concentration-vs-stage chart). Data pipeline:
  `data/Technologies_source.xlsx` + `data/Deals_News_Feed_source.xlsx` +
  `data/internal_targets.json` → `scripts/build_data.py` →
  `data/dashboard_data.json`. Verified locally (22 technologies, 2 internal
  targets, 1 reference product, 43 deals, 0 unmatched rows). Not yet
  deployed -- code only.
- 2026-08-24: Redesigned the UI after feedback that the first pass buried
  key info in long always-expanded cards. Replaced it with
  `SC-Atlas-Tracker`'s sidebar/table/donut layout: a compact table with
  expandable rows instead of cards, deal summaries truncated to ~190 chars
  with a "Read more" toggle (date/partner/source link always stay visible),
  and the donut chart made clickable to filter by type (replacing the old
  "four paths" text block). No changes to the data pipeline --
  `scripts/build_data.py` and `data/dashboard_data.json` are untouched.
  Re-verified all interactions (row expand, read-more, donut click-filter,
  search, CSV export) in-browser with no console errors.
- 2026-08-24: Renamed the app to "SC Atlas" (full name: "Subcutaneous
  Advanced Tracking and Landscape Analysis System") and removed the
  disabled "Companies" and "Methodology" sidebar nav items -- neither had
  a function behind it, so they were dead links rather than useful
  placeholders. Sidebar now shows just the "Dashboard" tab.
- 2026-08-24: Fixed two bugs reported from a screenshot of the expanded
  row detail: (1) a bare-year deal date read from Excel as a float was
  displaying literally as "2026.0" -- `display_date()` in
  `scripts/build_data.py` now formats a whole-number float as a plain year
  ("2026"); date sorting was already correct, only the display was wrong.
  (2) The expanded detail panel (and, at some window widths, the whole
  page) required horizontal scrolling to read the mechanism text. Root
  cause was a classic nested CSS Grid "blowout": `.app`, `.main`, and
  `.table-card` are each grid items sitting on top of a 900px-min-width
  table, and each one needed an explicit `min-width: 0` (plus the
  `.content-grid` responsive breakpoint, which had silently dropped back
  to a plain `1fr` track) before the intended `overflow-x: auto` on
  `.table-scroll` would actually contain the table instead of the item
  chain refusing to shrink. Also gave `.deal-link` `overflow-wrap` instead
  of `white-space: nowrap`, since one deal's multi-source citation was
  long enough to force page-width overflow on its own. Added
  `overflow-x: hidden` on `html`/`body`/`.app` as a hard backstop.
  Mechanism/needle/concentration now sit in a capped-width (640px) block
  instead of a cramped 3-column grid. Re-verified at 768px, 1040px, and
  desktop width: no page-level horizontal scroll, table's own internal
  scrollbar still works, mechanism text never clipped, all filters/CSV/
  read-more interactions still pass.
- 2026-08-24: Added a brand mark: `assets/icon.svg` (globe + orbit path +
  a single tracked point, white line-art on the existing blue-to-aqua
  gradient) -- three shapes, nothing more. Used as the sidebar's
  `.brand-mark` (inline SVG, so it renders crisply with no extra request)
  and wired up as the browser-tab favicon via `<link rel="icon">`.
- 2026-08-24: Replaced the two source spreadsheets with plain Python data
  modules so routine updates never require touching a binary file:
  `data/Technologies_source.xlsx` -> `data/technologies_db.py`,
  `data/Deals_News_Feed_source.xlsx` -> `data/deals_db.py` (both plain
  `list[dict]`, clean snake_case keys, booleans instead of "Y"/"N",
  editable directly with a text editor). `scripts/build_data.py` now
  imports these instead of parsing xlsx via openpyxl -- the build script
  has zero dependencies now, nothing to `pip install`. Verified the
  migration is exact: `dashboard_data.json` regenerated from the new
  pipeline is byte-identical to the previous xlsx-sourced output (aside
  from the intentionally-changed `generated_at`/`generated_from` fields).
  The original two xlsx files are kept under `data/archive/` for
  provenance only; nothing reads them anymore.
- 2026-09-11: Renamed the internal platform "Hyperion" to "H-Cure"
  throughout the live dashboard and database. Source of truth is
  `data/internal_targets.json` (`id` `hyperion` -> `h-cure`, `name`
  `Hyperion` -> `H-Cure`); the `id` had to change too because the
  dashboard table renders it as a visible `.tech-id` label under the
  name. Also updated the two places the old name appeared in prose: the
  Thermicra `mechanism` blurb in the same file, and the
  `thermicra_internal_2026-07` correction note in `data/deals_db.py`
  (both render on the dashboard). Regenerated
  `data/dashboard_data.json`; the only diff beyond the rename is
  `generated_at`. `index.html`'s page subtitle hardcoded the old name,
  so that was edited directly -- the one place this rename had to reach
  outside the data pipeline. README structure notes and both
  `.claude/skills/` SKILL.md files renamed to match, so a future daily
  scan still classifies the program as internal; the daily-scan skill
  also carries a line telling it to reject the legacy "Hyperion" name as
  an external entity. `data/audit_log/*.json` was deliberately left
  alone -- those are dated records of what past runs actually screened,
  not live data.
