# SC Atlas Korean glossary

Standing vocabulary for the `_ko` mirrors (SKILL.md Step 1.7). The point is
consistency across runs: without a fixed table the same term drifts across
three renderings in three weeks, and a reader cannot tell whether two
findings are about the same thing.

English is the field of record. Everything here is about how to say the
English faithfully in Korean, never about what to say.

## Non-negotiables

1. **Numbers, dates, percentages, money and identifiers are copied, not
   translated.** `750 mg/mL`, `2026-07-14`, `~113-170%`, `$365M`,
   `KRW 4.4165 trillion`, `ALT-B4`, `rHuPH20`, `PH20`, `WO2026/142299`,
   `PGR2025-00003`, `US Pat. 11,952,600`, `JSKN033-301`, `CT-P6`, `ORKA-001`,
   `INCA033989`. `scripts/ko_check.py` enforces this.
2. **Money keeps the English notation**, with the Korean reading added when
   it helps: `최대 $365M(약 5,219억 원)`, `KRW 98.5 billion(985억 원)`. Never
   replace `$365M` with `3억 6,500만 달러` alone -- the original figure has to
   stay findable in the text.
3. **Hedges are load-bearing.** Translate them; never upgrade a hedged claim
   into a confident one.

## Hedging and provenance

| English | Korean |
|---|---|
| Not disclosed | 비공개 |
| Not disclosed numerically | 수치는 비공개 |
| N/A | 해당 없음 |
| Undated | 날짜 미상 |
| FLAGGED | 검토 필요 |
| NEW | 신규 |
| CORRECTED 2026-07-13: | 2026-07-13 정정: |
| UPDATED 2026-07-12: | 2026-07-12 갱신: |
| BACKFILL: | 백필: |
| ORIGINAL / ORIGINAL SUMMARY RETAINED | 기존 내용 / 기존 요약 유지 |
| CONFLICTING: | 상충: |
| CAVEAT | 유의 사항 |
| reported / reportedly | 보고됨 / 보고된 바에 따르면 |
| company claims / company states | 회사 주장 / 회사는 ~라고 밝혔다 |
| described qualitatively as | ~로 정성적으로 설명됨 |
| primary source | 1차 출처 |
| secondary source | 2차 출처 |
| unconfirmed | 미확인 |
| corroborated by | ~로 교차 확인됨 |
| out-of-window | 조사 기간 밖 |
| placeholder date | 임시 날짜 |
| terms not disclosed | 조건 비공개 |

## Domain terms

| English | Korean |
|---|---|
| subcutaneous (SC) | 피하주사 (SC) |
| intravenous (IV) | 정맥주사 (IV) |
| IV-to-SC conversion | 정맥주사-피하주사 전환 |
| high-concentration | 고농도 |
| large-volume | 대용량 |
| formulation / reformulation | 제형 / 재제형 |
| co-formulation | 복합 제형 |
| excipient | 부형제 |
| viscosity | 점도 |
| suspension | 현탁액 |
| microparticle / microsphere | 미립자 / 마이크로스피어 |
| spray-dried | 분무건조 |
| crystalline | 결정형 |
| hydrogel | 하이드로젤 |
| depot | 데포 |
| glide force | 활주력 |
| prefilled syringe | 프리필드 시린지 |
| autoinjector | 오토인젝터 |
| on-body injector | 온바디 인젝터 |
| gauge (needle) | 게이지 |
| hyaluronidase | 히알루로니다제 |
| hyaluronan / hyaluronic acid | 히알루로난 / 히알루론산 |
| monoclonal antibody (mAb) | 단클론항체 |
| bispecific | 이중특이 |
| antibody-drug conjugate (ADC) | 항체-약물 접합체 (ADC) |
| biosimilar | 바이오시밀러 |
| originator / reference product | 오리지네이터 / 기준 제품 |
| drug substance | 원료의약품 |
| nonclinical / preclinical | 비임상 / 전임상 |
| pharmacokinetics (PK) | 약동학 |
| Phase 1 / 2 / 3 | 1상 / 2상 / 3상 |
| pivotal trial | 핵심 임상시험 |
| priority review | 우선심사 |
| milestone | 마일스톤 |
| upfront payment | 선급금 |
| royalties | 로열티 |
| exclusive / non-exclusive license | 독점 / 비독점 라이선스 |
| option agreement | 옵션 계약 |
| Material Transfer Agreement (MTA) | 물질이전계약 (MTA) |
| prior art | 선행기술 |
| novelty / inventive step | 신규성 / 진보성 |
| claim (patent) | 청구항 |
| composition-of-matter patent | 물질 특허 |
| post-grant review (PGR) | 등록후재심사 |
| inter partes review (IPR) | 당사자계 재심사 |

## Stage buckets

These are rendered by `assets/i18n.js`, not by a `_ko` field. Listed so a
summary uses the same wording as the badge next to it.

| Bucket | Korean |
|---|---|
| Research / Academic | 연구 / 학술 |
| Preclinical | 전임상 |
| Platform / Feasibility | 플랫폼 / 타당성 검증 |
| Pre-registration / Late-stage | 허가 준비 / 후기 단계 |
| Approved / Marketed | 승인 / 시판 |
| Varies by Program | 프로그램별 상이 |

## Entity names

Korean-native entities take the Korean name; everyone else keeps the English.
On first mention of a Korean company whose English name carries an
identifier-like token, give both -- `지투지바이오(G2G Bio)` -- so the English
token stays in the text.

| Entity | In Korean text |
|---|---|
| Alteogen | 알테오젠 |
| Celltrion | 셀트리온 |
| Samsung Bioepis | 삼성바이오에피스 |
| Samsung Biologics | 삼성바이오로직스 |
| Huons Lab | 휴온스랩 |
| InventageLab | 인벤티지랩 |
| G2G Bio | 지투지바이오(G2G Bio) |
| Prestige Biopharma | 프레스티지바이오파마 |
| Halozyme, Elektrofi, Surf Bio, Nanoform, Xeris, Lindy Biosciences | English as-is |
| ENHANZE, Hypercon, XeriJect, InnoBioLAMP, S-HiCon, HyDiffuse | English as-is |
| MFDS | 식품의약품안전처 (식약처) |
| DART | DART(금융감독원 전자공시시스템) |
