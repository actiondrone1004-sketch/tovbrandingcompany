// 관리자: 비밀번호 로그인 → 통계 · 문의 목록
import { json, kstDate, lastDays, adminConfigured, passwordMatches, makeToken, tokenValid, inquiriesStore, statsStore } from '../lib/common.mjs';

export const config = { path: ['/api/admin/login', '/api/admin/data'] };

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async req => {
  const { pathname } = new URL(req.url);

  if (pathname.endsWith('/login')) {
    if (req.method !== 'POST') return json({ error: 'method' }, 405);
    if (!adminConfigured()) return json({ error: 'not-configured' }, 503);
    let body = {};
    try { body = await req.json(); } catch { /* 아래에서 실패 처리 */ }
    if (!passwordMatches(body.password)) { await sleep(800); return json({ error: 'wrong-password' }, 401); }
    return json({ token: makeToken() });
  }

  if (req.method !== 'GET') return json({ error: 'method' }, 405);
  if (!tokenValid(req)) return json({ error: 'unauthorized' }, 401);

  // 문의 목록 (최신순)
  const inq = inquiriesStore();
  const { blobs } = await inq.list();
  const inquiries = (await Promise.all(blobs.map(b => inq.get(b.key, { type: 'json' }))))
    .filter(Boolean)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // 최근 30일 통계 (한국 시간)
  const stats = statsStore();
  const days = lastDays(30);
  const rows = await Promise.all(days.map(d => stats.get(`daily/${d}`, { type: 'json' })));
  const inqByDay = {};
  for (const q of inquiries) { const d = kstDate(new Date(q.createdAt)); inqByDay[d] = (inqByDay[d] || 0) + 1; }
  const daily = days.map((date, i) => ({
    date,
    views: rows[i]?.views || 0,
    visitors: rows[i]?.visitors || 0,
    inquiries: inqByDay[date] || 0
  }));
  const pages = {};
  for (const r of rows) for (const [p, n] of Object.entries(r?.pages || {})) pages[p] = (pages[p] || 0) + n;

  return json({
    generatedAt: new Date().toISOString(),
    daily,
    pages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10),
    inquiries
  });
};
