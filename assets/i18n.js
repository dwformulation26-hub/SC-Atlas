/* SC Atlas — EN/KO string tables.
 *
 * Same method as the LAI Tracker's src/i18n.js: one flat key -> string table
 * per language, a t(lang, key, vars) lookup with {name} interpolation, and
 * separate label maps for the controlled vocabulary that arrives inside
 * dashboard_data.json (stage buckets, technology types, concentration
 * buckets, deal types).
 *
 * Two rules keep this safe to extend:
 *
 *  1. Raw English values stay the identity of a record. Filters, the donut,
 *     the colour maps and the CSV export all compare and emit the raw
 *     `stage_bucket` / `type` / `concentration_bucket` strings that
 *     build_data.py wrote. Translation happens at render time only -- never
 *     in state. That is why nothing in scripts/build_data.py or the two
 *     _db.py files has to change for a language to be added.
 *  2. A missing translation falls back to English rather than showing a key.
 *     For the label maps that means an unmapped value (a new technology type,
 *     one of the free-text deal_type strings) renders as its English self.
 *
 * Loaded as a plain script before app.js and exposed as window.SCAtlasI18n,
 * because the dashboard is deliberately buildless -- index.html is opened
 * over any static file server with no module bundling step.
 */
(function (global) {
  "use strict";

  var LANGS = ["en", "ko"];
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "sc-atlas-lang";

  var STRINGS = {
    en: {
      "meta.title": "SC Atlas — Subcutaneous Advanced Tracking and Landscape Analysis System",
      "nav.aria": "Primary",
      "nav.dashboard": "Dashboard",
      "lang.toggleAria": "Switch language",

      "page.subtitle": "Subcutaneous Advanced Tracking and Landscape Analysis System — benchmarks Dupixent and our internal platforms (H-Cure, Thermicra) against tracked high-concentration and large-volume subcutaneous delivery technologies.",
      "page.lastUpdated": "Last updated: {date}",
      "sidebar.sourceFallback": "Source: internal technology + deals database.",
      "sidebar.source": "Source: {tech} + {deals}. Generated {generated}.",
      "actions.exportCsv": "Export CSV",
      "actions.reset": "Reset",

      "stats.aria": "Summary statistics",
      "stats.tracked.label": "Technologies tracked",
      "stats.tracked.sub": "External + internal targets",
      "stats.comparable.label": "With a comparable mg/mL",
      "stats.comparable.sub": "Numeric concentration disclosed",
      "stats.commercial.label": "Already commercial",
      "stats.commercial.sub": "Approved / marketed",
      "stats.deals.label": "Deals & news tracked",
      "stats.deals.sub": "{count} flagged for review",

      "chart.title": "Concentration vs. development stage",
      "chart.caption": "Internal targets and reference product included",
      "chart.internalTarget": "Internal target",
      "chart.aria": "Scatter chart of concentration by development stage",
      "chart.pointTitle": "{name}: {value} mg/mL",

      "filters.aria": "Filters",
      "filters.search": "Search",
      "filters.searchPlaceholder": "Name, company, mechanism…",
      "filters.company": "Company",
      "filters.type": "Technology type",
      "filters.stage": "Development stage",
      "filters.concentration": "Concentration range",
      "filters.all": "All",

      "table.count": "Showing {shown} of {total} technologies",
      "table.col.technology": "Technology",
      "table.col.company": "Company",
      "table.col.type": "Type",
      "table.col.concentration": "Concentration",
      "table.col.stage": "Stage",
      "table.col.reviewed": "Reviewed",
      "table.col.details": "Details",
      "table.empty": "No technologies match the current filters.",
      "table.toggleAria": "Toggle details for {name}",
      "tag.internal": "Internal",
      "tag.reference": "Reference",

      "detail.concentration": "Concentration (reported)",
      "detail.needle": "Needle size",
      "detail.mechanism": "Mechanism",
      "detail.noMechanism": "No mechanism summary on file.",
      "detail.deals": "Deal / news activity (newest first)",
      "detail.notes": "Notes",
      "detail.source": "Source",

      "deal.readMore": "Read more",
      "deal.showLess": "Show less",
      "deal.flagged": "FLAGGED",
      "deal.new": "NEW",
      "deal.source": "source",

      "panel.recentlyReviewed": "Recently reviewed",
      "panel.recentActivity": "Recent deal & news activity",
      "panel.byApproach": "Technologies by approach",
      "recent.meta": "{company} · {date}",
      "recent.empty": "No review dates on file.",
      "activity.empty": "No deal or news activity tracked yet.",
      "donut.centerLabel": "Types",
      "donut.caption": "Click a segment to filter the table. Source: data/dashboard_data.json.",
      "donut.segmentTitle": "{type}: {count} ({pct}%)",
      "donut.legendValue": "{count} ({pct}%)",

      "value.none": "—",
      "value.notDisclosed": "Not disclosed",
      "value.notDisclosedSentence": "Not disclosed.",
      "content.englishOriginal": "English original",
      "app.loadError": "Could not load dashboard data: {message}. If you opened this file directly, serve it over a local HTTP server instead -- see README.md."
    },

    ko: {
      "meta.title": "SC Atlas — 피하주사 전달기술 추적·분석 시스템",
      "nav.aria": "주 메뉴",
      "nav.dashboard": "대시보드",
      "lang.toggleAria": "언어 전환",

      "page.subtitle": "피하주사(SC) 전달기술 추적·분석 시스템 — Dupixent와 자사 내부 플랫폼(H-Cure, Thermicra)을 추적 중인 고농도·대용량 피하주사 전달기술과 비교합니다.",
      "page.lastUpdated": "최종 업데이트: {date}",
      "sidebar.sourceFallback": "출처: 내부 기술 및 딜 데이터베이스.",
      "sidebar.source": "출처: {tech} + {deals}. 생성 시각 {generated}.",
      "actions.exportCsv": "CSV 내보내기",
      "actions.reset": "초기화",

      "stats.aria": "요약 통계",
      "stats.tracked.label": "추적 중인 기술",
      "stats.tracked.sub": "외부 기술 + 내부 목표",
      "stats.comparable.label": "비교 가능한 mg/mL 보유",
      "stats.comparable.sub": "수치 농도가 공개된 기술",
      "stats.commercial.label": "이미 상업화됨",
      "stats.commercial.sub": "승인 / 시판",
      "stats.deals.label": "추적 중인 딜·뉴스",
      "stats.deals.sub": "{count}건 검토 필요 표시",

      "chart.title": "농도 대비 개발 단계",
      "chart.caption": "내부 목표 및 기준 제품 포함",
      "chart.internalTarget": "내부 목표",
      "chart.aria": "개발 단계별 농도 산점도",
      "chart.pointTitle": "{name}: {value} mg/mL",

      "filters.aria": "필터",
      "filters.search": "검색",
      "filters.searchPlaceholder": "기술명, 회사, 작용 기전…",
      "filters.company": "회사",
      "filters.type": "기술 유형",
      "filters.stage": "개발 단계",
      "filters.concentration": "농도 구간",
      "filters.all": "전체",

      "table.count": "전체 {total}건 중 {shown}건 표시",
      "table.col.technology": "기술",
      "table.col.company": "회사",
      "table.col.type": "유형",
      "table.col.concentration": "농도",
      "table.col.stage": "단계",
      "table.col.reviewed": "검토일",
      "table.col.details": "상세",
      "table.empty": "현재 필터 조건에 맞는 기술이 없습니다.",
      "table.toggleAria": "{name} 상세 정보 펼치기·접기",
      "tag.internal": "내부",
      "tag.reference": "기준",

      "detail.concentration": "농도 (보고값)",
      "detail.needle": "니들 규격",
      "detail.mechanism": "작용 기전",
      "detail.noMechanism": "기록된 작용 기전 요약이 없습니다.",
      "detail.deals": "딜·뉴스 활동 (최신순)",
      "detail.notes": "비고",
      "detail.source": "출처",

      "deal.readMore": "더 보기",
      "deal.showLess": "접기",
      "deal.flagged": "검토 필요",
      "deal.new": "신규",
      "deal.source": "출처",

      "panel.recentlyReviewed": "최근 검토된 기술",
      "panel.recentActivity": "최근 딜·뉴스 활동",
      "panel.byApproach": "접근 방식별 기술 분포",
      "recent.meta": "{company} · {date}",
      "recent.empty": "기록된 검토일이 없습니다.",
      "activity.empty": "아직 추적된 딜이나 뉴스가 없습니다.",
      "donut.centerLabel": "유형",
      "donut.caption": "세그먼트를 클릭하면 표가 필터링됩니다. 출처: data/dashboard_data.json.",
      "donut.segmentTitle": "{type}: {count}건 ({pct}%)",
      "donut.legendValue": "{count}건 ({pct}%)",

      "value.none": "—",
      "value.notDisclosed": "비공개",
      "value.notDisclosedSentence": "비공개.",
      "content.englishOriginal": "영문 원문",
      "app.loadError": "대시보드 데이터를 불러오지 못했습니다: {message}. 파일을 직접 열었다면 로컬 HTTP 서버로 서빙하세요 — README.md를 참고하세요."
    }
  };

  function t(lang, key, vars) {
    var table = STRINGS[lang] || STRINGS[DEFAULT_LANG];
    var str = table[key];
    if (str === undefined) str = STRINGS[DEFAULT_LANG][key];
    if (str === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        str = str.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return str;
  }

  // ---------- controlled vocabulary ----------
  //
  // The keys below are the exact strings build_data.py emits. A value that is
  // missing here renders as its English self, so a newly-introduced bucket or
  // type shows up readable rather than blank -- and shows up visibly English,
  // which is the signal that it needs a line adding.

  // STAGE_BUCKETS + STAGE_OTHER in scripts/build_data.py.
  var STAGE_LABELS = {
    ko: {
      "Research / Academic": "연구 / 학술",
      "Preclinical": "전임상",
      "Platform / Feasibility": "플랫폼 / 타당성 검증",
      "Pre-registration / Late-stage": "허가 준비 / 후기 단계",
      "Approved / Marketed": "승인 / 시판",
      "Varies by Program": "프로그램별 상이"
    }
  };

  // `type` values in data/technologies_db.py, as ordered by payload.type_order.
  var TYPE_LABELS = {
    ko: {
      "Suspension/particle": "현탁액/입자",
      "Enzyme-assisted": "효소 보조",
      "Co-formulation": "복합 제형",
      "Crystalline": "결정형",
      "Other": "기타"
    }
  };

  // CONCENTRATION_BUCKETS in scripts/build_data.py. The numeric ranges are
  // identical in both languages -- only the "not disclosed" sentinel differs.
  var CONCENTRATION_LABELS = {
    ko: {
      "Not disclosed": "비공개"
    }
  };

  // deal_type is free text in data/deals_db.py, so this covers the recurring
  // phrasings and lets anything else through in English.
  var DEAL_TYPE_LABELS = {
    ko: {
      "Licensing": "라이선싱",
      "Licensing/Collaboration": "라이선싱/협업",
      "Licensing (global)": "라이선싱 (글로벌)",
      "Exclusive License": "독점 라이선스",
      "Exclusive Global License": "글로벌 독점 라이선스",
      "Option and Exclusive License Agreement": "옵션 및 독점 라이선스 계약",
      "Option/Collaboration": "옵션/협업",
      "Exclusivity Agreement": "독점 계약",
      "Acquisition": "인수",
      "Funding/Investment": "투자/자금 조달",
      "Manufacturing/CDMO": "생산/CDMO",
      "Regulatory filing": "규제 신청",
      "Regulatory approval": "규제 승인",
      "Research publication": "연구 논문",
      "Patent filing": "특허 출원",
      "Patent registration": "특허 등록",
      "IP/Patent litigation": "지식재산/특허 소송",
      "Company statement/guidance": "기업 발표/가이던스",
      "Platform launch": "플랫폼 출시",
      "Platform coverage": "플랫폼 보도",
      "Unverified / Flagged": "미검증 / 검토 필요",
      "N/A": "해당 없음"
    }
  };

  function mapped(table, value, lang) {
    if (value === null || value === undefined || value === "") return value;
    var forLang = table[lang];
    if (forLang && forLang[value] !== undefined) return forLang[value];
    return value;
  }

  function stageLabelText(stage, lang) { return mapped(STAGE_LABELS, stage, lang); }
  function typeLabelText(type, lang) { return mapped(TYPE_LABELS, type, lang); }
  function concentrationLabelText(bucket, lang) { return mapped(CONCENTRATION_LABELS, bucket, lang); }
  function dealTypeLabelText(dealType, lang) { return mapped(DEAL_TYPE_LABELS, dealType, lang); }

  // Literals build_data.py substitutes for an empty field. Translated at
  // render time so the generated JSON stays language-neutral.
  function placeholderText(value, lang) {
    if (lang !== "ko") return value;
    if (value === "N/A") return "해당 없음";
    if (value === "Undated") return "날짜 미상";
    return value;
  }

  // Record-level prose (mechanism, concentration_text, needle_size, a deal
  // summary). Korean mode prefers `<field>_ko` and otherwise shows the English
  // with `fallback` set, which the caller marks visibly -- an untranslated
  // record should look untranslated, not silently pass as Korean copy. No
  // _ko field is written by the pipeline yet, so today every prose field
  // takes this path.
  function localized(source, field, lang) {
    var english = (source && source[field]) || "";
    if (lang !== "ko") return { text: english, fallback: false };
    var korean = source && source[field + "_ko"];
    if (korean) return { text: korean, fallback: false };
    return { text: english, fallback: Boolean(english) };
  }

  function getStoredLang() {
    try {
      var stored = global.localStorage.getItem(STORAGE_KEY);
      return LANGS.indexOf(stored) === -1 ? DEFAULT_LANG : stored;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function storeLang(lang) {
    try {
      global.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* private mode or blocked storage -- the toggle still works for the session */
    }
  }

  global.SCAtlasI18n = {
    LANGS: LANGS,
    DEFAULT_LANG: DEFAULT_LANG,
    t: t,
    stageLabelText: stageLabelText,
    typeLabelText: typeLabelText,
    concentrationLabelText: concentrationLabelText,
    dealTypeLabelText: dealTypeLabelText,
    placeholderText: placeholderText,
    localized: localized,
    getStoredLang: getStoredLang,
    storeLang: storeLang
  };
})(window);
