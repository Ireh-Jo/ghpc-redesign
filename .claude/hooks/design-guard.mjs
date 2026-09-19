#!/usr/bin/env node
/**
 * 디자인·모션 일관성 가드 (PostToolUse 훅).
 *
 * 파일을 쓴 직후에 돌면서 `guardrails/02-design-consistency.md`·`context/design/06-motion.md`·
 * CLAUDE.md 절대규칙 2(컴포넌트는 인벤토리 먼저)를 어겼는지 본다.
 * 위반이 있으면 **exit 2 + stderr** 로 알린다 — 파일은 이미 쓰였으므로 Claude가 바로 고치면 된다.
 *
 * 규칙을 늘릴 때: 오탐이 한 번이라도 나면 그 규칙은 지운다. 매번 뜨는 경고는 아무도 안 읽는다.
 */

import { readFileSync } from 'node:fs';
import { existsSync, readdirSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path;
if (!filePath || !existsSync(filePath)) process.exit(0);

const rel = relative(root, filePath);
const ext = extname(filePath);
if (!['.tsx', '.ts', '.css'].includes(ext)) process.exit(0);
if (!rel.startsWith('app/') && !rel.startsWith('components/') && !rel.startsWith('lib/')) {
  process.exit(0);
}

const src = readFileSync(filePath, 'utf8');
const problems = [];

/* ── 1. 색은 토큰만 (guardrails/02-design-consistency.md) ──
   토큰 정의 파일과 설정 파일은 예외. */
const isTokenFile = rel === 'app/globals.css' || rel === 'tailwind.config.ts';
if (!isTokenFile) {
  const hex = src.match(/(?:bg|text|border|fill|stroke|shadow|from|via|to)-\[#[0-9a-fA-F]{3,8}\]/g);
  if (hex) {
    problems.push(
      `임의 색상값 ${[...new Set(hex)].join(', ')} — brand 토큰(bg-brand-accent 등)만 쓴다. ` +
        `새 색이 필요하면 context/design/01-color.md 먼저.`,
    );
  }
}

/* ── 2. 삭제된 클래스 ── */
if (src.includes('btn-square')) {
  problems.push('`btn-square`는 2026-09-16에 `btn-round`(10px)로 바뀌었다. 남은 사용처를 고칠 것.');
}

/* ── 3. 움직이는 효과에는 모션 축소 대응 (context/design/06-motion.md) ──
   공용 유틸(fill-wipe, flip-card, link-wipe)은 globals.css가 이미 처리하므로 제외. */
if (ext === '.tsx') {
  // `animate-spin`(로딩 스피너)은 제외한다 — 상태 표시라 끄면 오히려 피드백이 사라지고,
  // 전역 `prefers-reduced-motion` 블록이 이미 duration을 0으로 만든다 (2026-09-19 오탐 1건 후 완화).
  const movesInline =
    /(group-)?(hover|focus)[^"'\s]*:(scale|translate|rotate)/.test(src) ||
    /\banimate-(?!none|spin)/.test(src);
  const usesSharedUtil = /(fill-wipe|flip-card|flip-scene|link-wipe)/.test(src);
  if (movesInline && !usesSharedUtil && !src.includes('motion-reduce')) {
    problems.push(
      '위치·크기가 바뀌는 호버/애니메이션이 있는데 `motion-reduce:` 대응이 없다. ' +
        '`motion-reduce:transform-none`을 붙이거나 공용 유틸(fill-wipe·flip-*)을 쓸 것.',
    );
  }
}

/* ── 4. 컴포넌트는 인벤토리·스펙 먼저 (CLAUDE.md 절대규칙 2) ── */
if (ext === '.tsx' && rel.startsWith('components/') && !rel.startsWith('components/ui/')) {
  const name = basename(filePath, '.tsx');
  const specDirs = ['primitives', 'layout', 'content', 'interactive']
    .map((c) => join(root, 'context/components', c))
    .filter((d) => existsSync(d));
  const hasSpec = specDirs.some((d) => readdirSync(d).includes(`${name}.md`));
  if (!hasSpec) {
    problems.push(
      `스펙 문서가 없다: context/components/<카테고리>/${name}.md. ` +
        'CLAUDE.md 절대규칙 2 — 인벤토리(00-inventory.md) 등록 → .md 작성 → 코드 순서.',
    );
  }
}

if (problems.length) {
  console.error(`⚠️ 디자인 가드 — ${rel}`);
  for (const p of problems) console.error(`  · ${p}`);
  console.error('규칙 출처: guardrails/02-design-consistency.md · context/design/06-motion.md · CLAUDE.md');
  process.exit(2);
}
process.exit(0);
