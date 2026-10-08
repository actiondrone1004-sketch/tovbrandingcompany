// 배포용 사이트 만들기: brandlab/ (미리보기 원본) → site/ (Netlify에 올리는 폴더)
// 실행: node build-site.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const srcDir = join(root, 'brandlab');
const outDir = join(root, 'site');

let html = readFileSync(join(srcDir, 'index.html'), 'utf8');

// 1) 숨김 처리한 사례(hidden: true)는 배포본 소스에서도 뺀다
const hiddenSlugs = [...html.matchAll(/\{ slug: '([^']+)', hidden: true,/g)].map(m => m[1]);
for (const slug of hiddenSlugs) {
  const re = new RegExp(`    \\{ slug: '${slug}', hidden: true,[\\s\\S]*?\\n(?=    \\{ slug: |  \\];)`);
  if (!re.test(html)) throw new Error(`숨김 사례를 찾지 못했습니다: ${slug}`);
  html = html.replace(re, '');
}

// 2) 완전한 HTML 문서로 감싸고, 검색 · 공유용 정보를 넣는다
if (!html.startsWith('<meta charset="utf-8">')) throw new Error('원본 첫 줄이 예상과 다릅니다');
html = html.replace('<meta charset="utf-8">\n', '');
const head = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="스타트업 · 중소기업을 위한 사업화 컨설팅. 사업기획 · 개발 · 마케팅 · 매출 · 투자까지, 사업을 직접 만들어 본 창업자가 함께합니다.">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta property="og:site_name" content="토브 파트너스">
<meta property="og:title" content="토브 파트너스">
<meta property="og:description" content="좋은 사업이 제대로 성장하도록 만듭니다.">
<meta name="theme-color" content="#071A2D">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
`;
html = head + html + '\n</html>\n';

// 3) 폴더 만들기 (이전 결과는 지운다)
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html);

// 4) 이미지 복사: 페이지에서 실제로 쓰는 이미지와 사진 출처(CREDITS.txt)만
const used = new Set([...html.matchAll(/img\/([\w.-]+\.(?:jpg|png|svg))/g)].map(m => m[1]));
for (const m of html.matchAll(/\['(p\d+)', '/g)) used.add(m[1] + '.jpg'); // 파트너 사진 (img/partners/${id}.jpg)
const skip = name => name !== 'CREDITS.txt' && !used.has(name);
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const a = join(from, name), b = join(to, name);
    if (statSync(a).isDirectory()) copyDir(a, b);
    else if (!skip(name)) copyFileSync(a, b);
  }
}
copyDir(join(srcDir, 'img'), join(outDir, 'img'));

// 5) 파비콘 · 검색 로봇 (보안 헤더는 firebase.json 에서 설정)
writeFileSync(join(outDir, 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#071A2D"/><text x="32" y="45" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#B99A63">T</text></svg>\n');
writeFileSync(join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');

console.log(`site/ 완료 · 숨김 사례 제외: ${hiddenSlugs.join(', ') || '없음'}`);
