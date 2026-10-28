/* Full-flow smoke v2: real Clerk sign-in via Frontend API, then exercise the app API. */
import process from 'node:process';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const SECRET = process.env.CLERK_SECRET_KEY;
const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

function instanceDomain(pk) {
  const raw = pk.replace(/^pk_test_/, '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
  const decoded = Buffer.from(padded, 'base64url').toString('utf8');
  const m = decoded.match(/([a-z0-9-]+\.[a-z0-9.]+)\$/i);
  if (!m) throw new Error('cannot parse instance domain: ' + decoded.slice(0, 60));
  return m[1];
}

const DOMAIN = instanceDomain(PK);
const FAPI = `https://${DOMAIN}/v1`;

const frontend = async (path, body, cookie, tokenHeader) => {
  const res = await fetch(`${FAPI}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: tokenHeader ?? PK,
      Cookie: cookie ? `__client=${cookie}` : undefined,
    },
    body: body ? new URLSearchParams({ ...body, _is_native: 'true' }).toString() : undefined,
  });
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const json = await res.json().catch(() => null);
  return { status: res.status, json, setCookie };
};

const backend = async (path, body) => {
  const res = await fetch(`https://api.clerk.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

const appApi = async (path, init, jwt) => {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      Cookie: `__session=${jwt}`,
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text.slice(0, 120); }
  return { status: res.status, json };
};

const email = `syllabusos-smoke-${Date.now()}@dev.example.com`;
const password = 'Sy11abus-OS-sm0ke!pass';

const created = await backend('users', { email_address: [email], password });
if (created.status !== 200) { console.error('CREATE USER FAIL', created.json); process.exit(1); }
const userId = created.json.id;
console.log('USER', userId);

// Sign in (real client flow): touch client, then sign in with identifier+password.
const touch = await frontend('/client');
let clientCookie = (touch.setCookie.find((c) => c.startsWith('__client=')) ?? '').split(';')[0].split('=')[1];
if (!clientCookie) { console.error('CLIENT COOKIE FAIL'); process.exit(1); }

const si = await frontend('/client/sign_ins', { identifier: email, password }, clientCookie);
if (si.status !== 200) { console.error('SIGN IN FAIL', JSON.stringify(si.json).slice(0, 300)); process.exit(1); }
const session = si.json?.response?.created_session_id;
const sessionById = si.json?.client?.sessions?.find((s) => s.id === session);
const jwt = sessionById?.last_active_token?.jwt;
if (!jwt) { console.error('NO SESSION JWT', JSON.stringify(si.json).slice(0, 200)); process.exit(1); }
console.log('SIGNED IN, jwt len', jwt.length);

// --- App API flow ---
const flow = [];
flow.push(['AUTH-STATUS', await appApi('/api/auth-status', {}, jwt)]);
flow.push(['SELECT', await appApi('/api/state', { method: 'POST', body: JSON.stringify({ action: 'select_curriculum', curriculumId: 'btech-eng-phys-waves' }) }, jwt)]);
flow.push(['ANSWER-WRONG', await appApi('/api/assessment/answer', { method: 'POST', body: JSON.stringify({ questionId: 'q-yd-1', selectedOptionId: 'd' }) }, jwt)]);
flow.push(['PREREQ-WRONG', await appApi('/api/assessment/answer', { method: 'POST', body: JSON.stringify({ questionId: 'q-pp-1', selectedOptionId: 'a' }) }, jwt)]);
flow.push(['PREREQ-RIGHT', await appApi('/api/assessment/answer', { method: 'POST', body: JSON.stringify({ questionId: 'q-pp-1', selectedOptionId: 'b' }) }, jwt)]);
flow.push(['TARGET-RIGHT', await appApi('/api/assessment/answer', { method: 'POST', body: JSON.stringify({ questionId: 'q-yd-1', selectedOptionId: 'a' }) }, jwt)]);
flow.push(['TUTOR', await appApi('/api/tutor', { method: 'POST', body: JSON.stringify({ conceptId: 'superposition', message: 'One short analogy for superposition?', mode: 'explain' }) }, jwt)]);
flow.push(['TUTOR-HISTORY', await appApi('/api/tutor?conceptId=superposition', {}, jwt)]);

for (const [name, r] of flow) {
  const j = r.json ?? {};
  if (name === 'AUTH-STATUS') console.log(name, r.status, JSON.stringify(j).slice(0, 110));
  else if (name === 'SELECT') console.log(name, r.status, j?.curriculum?.subject);
  else if (name === 'ANSWER-WRONG') console.log(name, r.status, 'correct=', j?.isCorrect, 'opened=', j?.diagnosis?.opened, 'suggested=', j?.diagnosis?.suggestedPrerequisiteId, 'next=', j?.state?.nextQuestionId);
  else if (name === 'PREREQ-WRONG') console.log(name, r.status, 'stage=', j?.diagnosis?.stage);
  else if (name === 'PREREQ-RIGHT') console.log(name, r.status, 'msg=', (j?.diagnosis?.message ?? '').slice(0, 90));
  else if (name === 'TARGET-RIGHT') console.log(name, r.status, 'correct=', j?.isCorrect, 'mastery=', JSON.stringify(j?.state?.mastery?.['young-double-slit']));
  else if (name === 'TUTOR') console.log(name, r.status, 'model=', j?.model, 'reply=', (j?.reply ?? j?.message ?? '').slice(0, 110));
  else if (name === 'TUTOR-HISTORY') console.log(name, r.status, 'messages=', j?.messages?.length);
}

const cleanup = await backend(`users/${userId}/delete`);
console.log('CLEANUP', cleanup.status);
