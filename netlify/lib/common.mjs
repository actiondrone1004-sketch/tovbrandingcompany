// 서버 함수 공통: 응답, 날짜(한국 시간), 관리자 인증
// 관리자 비밀번호는 코드에 넣지 않는다. Netlify 환경 변수 ADMIN_PASSWORD 에서만 읽는다.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

export const inquiriesStore = () => getStore({ name: 'inquiries', consistency: 'strong' });
export const statsStore = () => getStore({ name: 'stats', consistency: 'strong' });

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

// 한국 시간 기준 날짜 'YYYY-MM-DD'
export const kstDate = (d = new Date()) => d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
export const lastDays = n => Array.from({ length: n }, (_, i) => kstDate(new Date(Date.now() - (n - 1 - i) * 864e5)));

export const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

const password = () => process.env.ADMIN_PASSWORD || '';
export const adminConfigured = () => password().length > 0;

export function passwordMatches(input) {
  if (!adminConfigured()) return false;
  const a = createHash('sha256').update(String(input ?? '')).digest();
  const b = createHash('sha256').update(password()).digest();
  return timingSafeEqual(a, b);
}

// 로그인 토큰: "만료시각.서명" (비밀번호를 바꾸면 기존 토큰은 모두 무효)
const sign = exp => createHmac('sha256', 'tov-admin:' + password()).update(String(exp)).digest('base64url');
export const makeToken = (hours = 12) => { const exp = Date.now() + hours * 3600e3; return `${exp}.${sign(exp)}`; };
export function tokenValid(req) {
  if (!adminConfigured()) return false;
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
