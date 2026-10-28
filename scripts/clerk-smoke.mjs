/* Clerk session test: create user + session token via Backend API.
   Requires NEXT_PUBLIC/CLERK keys in env; see package.json script. */
import process from 'node:process';

const cfg = {
  secret: process.env.CLERK_SECRET_KEY,
  tokenPath: process.env.CLERK_TEST_SESSION_TOKEN_PATH,
};

const post = async (path, body) => {
  const res = await fetch(`https://api.clerk.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

const create = async () => {
  const email = `syllabusos-smoke-${Date.now()}@dev.example.com`;
  const u = await post('users', {
    email_address: [email],
    password: 'Sy11abus-OS-sm0ke!pass',
  });
  console.log('CREATE USER', u.status, u.json?.id ?? JSON.stringify(u.json).slice(0, 200));
};
await create();
