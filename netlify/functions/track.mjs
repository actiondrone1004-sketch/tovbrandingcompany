// 방문 집계: 날짜별 페이지뷰 · 방문자 · 페이지별 조회수 (개인을 알아볼 수 있는 정보는 저장하지 않는다)
import { kstDate, statsStore } from '../lib/common.mjs';

export const config = { path: '/api/track' };

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;

export default async req => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (BOT.test(req.headers.get('user-agent') || '')) return new Response(null, { status: 204 });

  let body = {};
  try { body = JSON.parse(await req.text()); } catch { /* 빈 요청은 무시 */ }
  const page = String(body.page || '');
  if (!/^[a-z0-9-]{1,60}$/.test(page) || page === 'admin') return new Response(null, { status: 204 });

  const store = statsStore();
  const key = `daily/${kstDate()}`;
  const day = (await store.get(key, { type: 'json' })) || { views: 0, visitors: 0, pages: {} };
  day.views += 1;
  if (body.isNew === true) day.visitors += 1;
  day.pages[page] = (day.pages[page] || 0) + 1;
  await store.setJSON(key, day);
  return new Response(null, { status: 204 });
};
