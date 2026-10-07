// 상담 신청 저장: 회사명 · 대표자명 · 연락처
import { randomUUID } from 'node:crypto';
import { json, clean, inquiriesStore } from '../lib/common.mjs';

export const config = { path: '/api/contact' };

export default async req => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'bad-request' }, 400); }

  // 스팸 방지 칸이 채워졌으면 저장하지 않고 성공처럼 응답한다
  if (clean(body.bot, 200)) return json({ ok: true });

  const company = clean(body.company, 100);
  const name = clean(body.name, 50);
  const phone = clean(body.phone, 30);
  if (!company || !name || phone.replace(/\D/g, '').length < 9 || body.agree !== true) {
    return json({ error: 'invalid' }, 400);
  }

  const createdAt = new Date().toISOString();
  const id = `${createdAt.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
  await inquiriesStore().setJSON(id, { id, company, name, phone, createdAt });
  return json({ ok: true });
};
