/* Probe: native sign-in with a +clerk_test email (auto-verified in dev instances). */
import fs from 'node:fs';

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/"/g, '');
}
const pk = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const SECRET = env.CLERK_SECRET_KEY;
const DOMAIN = 'still-honeybee-6677.clerk.accounts.dev';

const backend = async (path, method = 'POST', body = undefined) => {
  const res = await fetch(`https://api.clerk.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

const email = `syllabusos-smoke+clerk_test-${Date.now()}@dev.example.com`;
const user = await backend('users', 'POST', {
  email_address: [email],
  password: 'Sy11abus-OS-sm0ke!pass',
});
console.log('user', user.status, user.json?.id, 'verified=', user.json?.email_addresses?.[0]?.verification?.status);
const userId = user.json.id;

const touch = await fetch(`https://${DOMAIN}/v1/client`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: pk },
  body: '_is_native=true',
});
const client = (await touch.json())?.response;
console.log('client', client?.id);

const si = await fetch(`https://${DOMAIN}/v1/client/sign_ins`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: pk,
    'Clerk-Client-Id': client.id,
  },
  body: new URLSearchParams({
    identifier: email,
    password: 'Sy11abus-OS-sm0ke!pass',
    strategy: 'password',
    _is_native: 'true',
  }).toString(),
});
const j = await si.json().catch(() => null);
const sessionId = j?.response?.created_session_id ?? j?.client?.last_active_session_id;
console.log('sign_in', si.status, 'status=', j?.response?.status, 'session=', sessionId);

let jwt = null;
if (sessionId) {
  const tok = await fetch(`https://${DOMAIN}/v1/client/sessions/${sessionId}/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: pk,
      'Clerk-Client-Id': client.id,
    },
    body: '_is_native=true',
  });
  const tj = await tok.json().catch(() => null);
  jwt = tj?.jwt ?? null;
  console.log('token', tok.status, 'jwtlen=', jwt?.length ?? 0, 'err=', JSON.stringify(tj?.errors?.[0]?.long_message ?? '').slice(0, 150));
}

if (jwt) {
  console.log('SUCCESS_JWT_LEN', jwt.length);
  // Try hitting the app API with it right here.
  const st = await fetch('http://localhost:3000/api/auth-status', {
    headers: { Cookie: `__session=${jwt}` },
  });
  console.log('APP AUTH-STATUS', st.status, JSON.stringify(await st.json().catch(() => null)).slice(0, 160));
} else {
  console.log('NO_JWT', JSON.stringify(j?.response ?? j).slice(0, 400));
}

const del = await backend(`users/${userId}`, 'DELETE');
console.log('cleanup', del.status);
