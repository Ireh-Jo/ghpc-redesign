# Design — 04. 아이콘

> **lucide-react 단독.** 두께 1.5px. 단색 라인. 이모지·유니콘 금지.

## 원칙

- 라이브러리: `lucide-react`
- stroke-width: **1.5**
- 단색 라인 only (필 아이콘 사용 시 `fill` prop 명시)
- 같은 기능 → 같은 아이콘 (재사용 강제)

## 크기 체계

| 크기 | 클래스 | 용도 |
|---|---|---|
| 12px | `h-3 w-3` | 매우 작은 UI (정렬·확장 화살표·meta 칩 내부) |
| 14px | `h-3.5 w-3.5` | 작은 버튼·배지 내부·인라인 |
| **16px** | `h-4 w-4` | **기본** — 일반 버튼·네비·표준 UI |
| 18px | `h-[18px] w-[18px]` | 중요 액션·헤더 버튼·테마 토글 |
| 20px | `h-5 w-5` | 강조 요소·작은 카드 헤더 |
| 24px | `h-6 w-6` | 프로필·대형 UI·메인 카드 헤더 |

> 버튼 내부 표준은 **16px**.

## 색상 매핑

| 토큰 | 의미 | 클래스 예 |
|---|---|---|
| `foreground` | 기본 아이콘 색 | `text-brand-ink` |
| `muted-foreground` | 보조·비활성 | `text-brand-ink-muted` |
| `primary` | 강조·활성 | `text-brand-accent` |
| `primary-foreground` | primary 배경 위 | `text-white` |
| `destructive` | 삭제·에러 | `text-brand-accent` (현재 destructive와 accent 통합) |
| `background` | 다크 배경 위 반전 | `text-white` |

## 컴포넌트별 아이콘 매핑

### Header / Footer / Layout
| 위치 | 아이콘 | 크기 | 색 |
|---|---|---|---|
| 햄버거 (모바일) | `Menu` | 24 | `foreground` |
| 햄버거 닫기 | `X` | 24 | `foreground` |
| 드롭다운 화살표 | `ChevronDown` | 16 | `muted-foreground` |
| 생방송 LIVE 도트 | `Circle` (fill) | 8 (h-2 w-2) | `primary` |

### Card / Content
| 위치 | 아이콘 | 크기 | 색 |
|---|---|---|---|
| 외부 링크 | `ExternalLink` | 14 | `muted-foreground` |
| 다운로드 (주보 PDF) | `Download` | 16 | `foreground` |
| 재생 (영상) | `Play` (fill) | 16~24 | `foreground` |
| 날짜 메타 | `Calendar` | 14 | `muted-foreground` |
| 시간 메타 | `Clock` | 14 | `muted-foreground` |
| 위치 메타 | `MapPin` | 14 | `muted-foreground` |

### Form
| 위치 | 아이콘 | 크기 | 색 |
|---|---|---|---|
| 성공 | `CheckCircle2` | 16 | `primary` |
| 에러 | `AlertCircle` | 16 | `primary` (destructive 통합) |
| 정보 툴팁 | `Info` | 14 | `muted-foreground` |
| 전송 버튼 | `Send` 또는 `ArrowRight` | 16 | `primary-foreground` |

### Navigation / 페이지네이션
| 위치 | 아이콘 | 크기 |
|---|---|---|
| 이전 | `ChevronLeft` | 16 |
| 다음 | `ChevronRight` | 16 |
| 첫 / 끝 | `ChevronsLeft` / `ChevronsRight` | 16 |
| 위로 | `ArrowUp` | 16 |

### Social (Footer)
| 위치 | 아이콘 | 비고 |
|---|---|---|
| 유튜브 | `Youtube` | brand-accent 사용 금지, foreground |
| 인스타 | `Instagram` | foreground |
| 페이스북 | `Facebook` | foreground |

## 사용 예

```tsx
import { Calendar, ChevronRight } from 'lucide-react';

<button className="inline-flex items-center gap-2 text-brand-ink">
  <Calendar className="h-4 w-4 text-brand-ink-muted" strokeWidth={1.5} />
  <span>일정 보기</span>
  <ChevronRight className="h-4 w-4 text-brand-ink-muted" strokeWidth={1.5} />
</button>
```

> strokeWidth는 lucide-react 전역 prop으로 통일 가능. `<Icon strokeWidth={1.5} />` 매번 쓰기 싫으면 wrapper 만들기.

## 금지

- 이모지로 UI 아이콘 대체 (✅ 🎉 ⛪ 등)
- Material Icons / Font Awesome / Hero Icons 혼용
- 같은 의미에 서로 다른 아이콘 (예: 닫기에 `X`와 `XCircle` 혼용)
- stroke-width 2px (모던/얇은 인상 깨짐)
- 컬러풀 아이콘 (multi-tone) — 단색 라인만
