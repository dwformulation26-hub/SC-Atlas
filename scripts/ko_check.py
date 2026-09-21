#!/usr/bin/env python3
"""
Korean copy checks for the SC Atlas prose fields.

    python scripts/ko_check.py

English is the working language and the field of record. Every English prose
field carries a Korean mirror under the same name plus a "_ko" suffix, and
the mirror is a translation of the English -- never independently researched
copy. That makes one class of bug possible that a human reviewer will not
reliably catch: a translation that quietly drops or alters a number or an
identifier. This script exists for exactly that, so the facts a translation
can silently corrupt must survive character for character:

  * every English prose field has a non-empty Korean mirror
  * every identifier in the English (rHuPH20, INCA033989, NCT0..., PH20)
    appears in the Korean unchanged
  * every number in the English appears in the Korean
  * anything longer than a few words actually contains Hangul, which catches
    an English string pasted into a _ko field

Exits non-zero with a per-field report if anything fails, so it can gate a
build. Stdlib only, same as scripts/build_data.py.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
INTERNAL_JSON = DATA_DIR / "internal_targets.json"

sys.path.insert(0, str(DATA_DIR))
from technologies_db import TECHNOLOGIES  # noqa: E402
from deals_db import DEALS  # noqa: E402

TECH_FIELDS = ["concentration_text", "needle_size", "mechanism"]
DEAL_FIELDS = ["summary"]

HANGUL_RE = re.compile(r"[가-힣]")
# Fiscal/quarter shorthand reads as prose in Korean (FY25 -> 2025 회계연도),
# so it is not held to character-for-character survival.
EXEMPT_CODE_RE = re.compile(r"^(?:FY\d{2,4}|Q[1-4]\d*|[12]H|H[12])$", re.IGNORECASE)
TOKEN_RE = re.compile(r"\b[A-Za-z][A-Za-z0-9]*(?:[-_/][A-Za-z0-9]+)*\b")
NUMBER_RE = re.compile(r"\d+(?:\.\d+)?")
ORDINAL_RE = re.compile(r"^(?:st|nd|rd|th)\b", re.IGNORECASE)


def strip_thousands(text):
    """1,200 and 1200 are the same number; Korean may write either."""
    return re.sub(r"(\d),(?=\d{3}(?!\d))", r"\1", str(text or ""))


def code_core(token):
    """The part of a token that is actually the identifier.

    English glues grammar onto identifiers with a hyphen -- "PH20-based",
    "CB1-targeting" -- and Korean renders those as "PH20 기반", "CB1 표적".
    The identifier is PH20 and CB1; the trailing lowercase word is English
    syntax and is not expected to survive. Segments that carry digits or
    capitals (ALT-B4, WO2026/142299, PGR2025-00003, ORKA-001) are part of the
    identifier and are kept."""
    segments = re.split(r"[-_/]", token)
    while len(segments) > 1 and segments[-1].isalpha() and segments[-1].islower():
        segments.pop()
    return token if len(segments) == len(re.split(r"[-_/]", token)) else "-".join(segments)


def is_code(token):
    """A code carries an uppercase letter alongside its digits (PH20, ALT-B4,
    INCA033989). Lowercase prose like "end-2025" is not a code -- its digits
    are still checked as a number."""
    if EXEMPT_CODE_RE.match(token):
        return False
    return bool(re.search(r"\d", token)) and bool(re.search(r"[A-Z]", token))


def number_value(token):
    """Leading zeros carry no meaning: 2026-06-03 is 2026년 6월 3일."""
    stripped = token.lstrip("0")
    return stripped if stripped else "0"


def numbers_in(text):
    """Digits inside a word, like the 20 in rHuPH20, belong to a name rather
    than to a quantity and are covered by the code check instead. An ordinal
    ("2nd asset") reads naturally in Korean without its digit."""
    found = []
    for match in NUMBER_RE.finditer(text):
        start, end = match.start(), match.end()
        before = text[start - 1] if start > 0 else ""
        after = text[end] if end < len(text) else ""
        if before.isalpha() and after.isalpha():
            continue
        if ORDINAL_RE.match(text[end:]):
            continue
        found.append(number_value(match.group(0)))
    return found


def protected_tokens(english):
    text = strip_thousands(english)
    codes = [code_core(t) for t in TOKEN_RE.findall(text) if is_code(t)]
    numbers = numbers_in(re.sub(r"\b(?:[12]H|H[12])\b", "", text))
    return list(dict.fromkeys(codes)), list(dict.fromkeys(numbers))


def check_pair(english, korean):
    """Problems with one Korean field against its English source. An empty
    list means it passes."""
    en = str(english or "").strip()
    if not en:
        return []
    ko = strip_thousands(korean).strip()
    if not ko:
        return ["Korean mirror is missing"]

    problems = []
    codes, numbers = protected_tokens(en)

    missing_codes = [c for c in codes if c not in ko]
    korean_numbers = {number_value(m.group(0)) for m in NUMBER_RE.finditer(ko)}
    missing_numbers = [n for n in numbers if n not in korean_numbers]

    if missing_codes:
        problems.append(f"identifiers missing from Korean: {', '.join(missing_codes)}")
    if missing_numbers:
        problems.append(f"numbers missing from Korean: {', '.join(missing_numbers)}")
    if len(en.split()) >= 4 and not HANGUL_RE.search(ko):
        problems.append("Korean mirror contains no Hangul (English pasted into a _ko field?)")
    return problems


def korean_pairs():
    """Every English/Korean pair the dashboard shows, with a label for error
    messages."""
    pairs = []
    for record in TECHNOLOGIES:
        for field in TECH_FIELDS:
            pairs.append((f"technologies_db.py :: {record.get('id')} :: {field}",
                          record.get(field), record.get(f"{field}_ko")))
    for deal in DEALS:
        label = deal.get("deal_id") or f"{deal.get('technology_id')} ({deal.get('date')})"
        for field in DEAL_FIELDS:
            pairs.append((f"deals_db.py :: {label} :: {field}",
                          deal.get(field), deal.get(f"{field}_ko")))

    config = json.loads(INTERNAL_JSON.read_text(encoding="utf-8"))
    for group in ("internal_targets", "reference_products"):
        for record in config.get(group, []):
            for field in TECH_FIELDS:
                pairs.append((f"internal_targets.json :: {group} :: {record.get('id')} :: {field}",
                              record.get(field), record.get(f"{field}_ko")))
    return pairs


def main():
    pairs = korean_pairs()
    failures = []
    checked = 0
    for label, english, korean in pairs:
        if not str(english or "").strip():
            continue
        checked += 1
        problems = check_pair(english, korean)
        if problems:
            failures.append((label, problems))

    if failures:
        print(f"Korean copy check FAILED -- {len(failures)} of {checked} prose "
              f"fields have problems:\n", file=sys.stderr)
        for label, problems in failures:
            print(f"  {label}", file=sys.stderr)
            for problem in problems:
                print(f"      - {problem}", file=sys.stderr)
        print("\nEnglish is the field of record: fix the Korean mirror to match "
              "it, never the other way round.", file=sys.stderr)
        sys.exit(1)

    print(f"Korean copy check passed -- {checked} prose fields, each with a "
          f"Korean mirror carrying every identifier and number intact.")


if __name__ == "__main__":
    main()
