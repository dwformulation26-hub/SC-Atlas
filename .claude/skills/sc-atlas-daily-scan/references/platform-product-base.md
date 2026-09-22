# Marketed product base of the tracked platforms

A platform row in `technologies_db.py` is not only a licensing story. Each
licensed platform has a **marketed installed base** -- the approved products
actually built on it -- and that base is the competitive fact a reader needs
most. A tracker that logs only new licensing deals systematically flatters
the challenger and understates the incumbent.

This file is the mapping the scan needs to recognise an installed-base event.
It answers one question: **when a regulator approves or expands a product,
which tracked platform row does it belong to?**

## Why this file exists

Until 2026-09-22 the `enhanze` row carried 7 deals, all 2025-2026 licensing
and litigation, and none of its marketed products. `alt-b4_hybrozyme` carried
11, with per-country Keytruda SC approvals itemised. Read off the dashboard,
that said *Alteogen leads Halozyme* -- which the market does not support. The
backfill on 2026-09-22 added the ten ENHANZE molecule families below.

## How to use it

1. **Tier 5 molecule scan.** Every brand name here is a term to look for in a
   regulator's own approvals list or meeting highlights, whether or not the
   listing says "subcutaneous."
2. **Attribution.** An approval of any product here is logged against the
   platform row named in its section -- not as a new technology row.
3. **Dating and the digest.** See "Installed-base events" in SKILL.md
   Step 1.5.2. A *newly issued* approval is ordinary fresh news. A
   *historical* product added to complete the base is a backfill: prefix the
   summary `BACKFILL:`, and set `new_in_digest: False` so a 2014-dated row
   never surfaces in the email as though it happened this week.

## ENHANZE (rHuPH20) -- row id `enhanze` (Halozyme)

Ten molecule families, all logged as of 2026-09-22. Brand names differ by
region for the same molecule; the anchor date is the US approval.

| Molecule | US brand | Ex-US / other brands | Partner | FDA approval |
|---|---|---|---|---|
| Immune globulin 10% | HYQVIA | -- | Takeda | 2014-09-12 |
| Rituximab | Rituxan Hycela | MabThera SC | Roche / Genentech | 2017-06-22 |
| Trastuzumab | Herceptin Hylecta | Herceptin SC | Roche / Genentech | 2019-02-28 |
| Daratumumab | Darzalex Faspro | Darzalex SC; Darzquro (JP) | Janssen / J&J | 2020-05-01 |
| Pertuzumab + trastuzumab | Phesgo | -- | Roche / Genentech | 2020-06-29 |
| Efgartigimod alfa | Vyvgart Hytrulo | Vyvgart SC (EU); Vyvdura (JP) | argenx | 2023-06-20 |
| Atezolizumab | Tecentriq Hybreza | Tecentriq SC | Roche / Genentech | 2024-09-12 |
| Ocrelizumab | Ocrevus Zunovo | Ocrevus SC (EU) | Roche / Genentech | 2024-09-13 |
| Nivolumab | Opdivo Qvantig | -- | Bristol Myers Squibb | 2024-12-27 |
| Amivantamab | Rybrevant Faspro | Rybrevant SC (EU); Rybrofaz (JP) | Janssen / J&J | 2025-12-17 |

Source of record for the list: Halozyme's own ENHANZE partnered-products page
(`halozyme.com/drug-delivery-technologies/enhanze/partners.php`). **Re-read
that page rather than trusting this table to stay current** -- it is the
cheapest way to detect an eleventh product, and it names products before some
trade press does.

## ALT-B4 / Hybrozyme -- row id `alt-b4_hybrozyme` (Alteogen)

| Molecule | Brand | Partner | Status |
|---|---|---|---|
| Pembrolizumab | Keytruda SC; Kiject (JP) | MSD / Merck | Approved in multiple regions; see the row's own deals |

The Keytruda SC approvals are already itemised per country on this row. Note
the head-to-head: **Opdivo Qvantig (rHuPH20) vs Keytruda SC (ALT-B4)** is the
single clearest platform comparison in the tracker -- an approval or label
expansion on either side is high-relevance for both rows.

## Other tracked platforms

No marketed SC product base confirmed as of 2026-09-22. If one appears, add a
section here in the same shape rather than leaving the mapping implicit:

- Hypercon / ex-Elektrofi (`hypercon_elektrofi`), Halozyme
- HyDiffuse (`huonslab_hydiffuze`), Huons Lab
- Samsung Bioepis PH20-based SC (`samsungbioepis_ph20_sc`)
- Amicogen hyaluronidase (`amicogen_hyaluronidase`)

A hyaluronidase-enabled SC approval whose enabling platform is **not stated**
is not automatically an ENHANZE event -- several programs use their own or a
third-party enzyme. Confirm the enabling technology before attributing it, and
if it cannot be confirmed, log it with `flagged: True` rather than guessing.
