/* DB smoke test — run: node scripts/db-smoke.mjs */
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
try {
  const tables = await p.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
  );
  console.log(
    'TABLES:',
    tables.map((r) => r.table_name).join(', '),
  );

  const u = await p.userProfile.upsert({
    where: { clerkUserId: 'smoke-test-user' },
    update: {},
    create: { clerkUserId: 'smoke-test-user', displayName: 'Smoke' },
  });
  const m = await p.conceptMastery.upsert({
    where: {
      userId_curriculumId_conceptId: {
        userId: u.id,
        curriculumId: 'btech-eng-phys-waves',
        conceptId: 'wave-fundamentals',
      },
    },
    update: { evidenceScore: 50 },
    create: {
      userId: u.id,
      curriculumId: 'btech-eng-phys-waves',
      conceptId: 'wave-fundamentals',
      evidenceScore: 50,
    },
  });
  console.log('UPSERT OK:', m.id, m.evidenceScore);

  const attempts = await p.assessmentAttempt.count({ where: { userId: u.id } });
  await p.assessmentAttempt.create({
    data: {
      userId: u.id,
      curriculumId: 'btech-eng-phys-waves',
      questionId: 'smoke-q',
      conceptId: 'wave-fundamentals',
      selectedOptionId: 'b',
      isCorrect: true,
      source: 'DIAGNOSTIC',
    },
  });
  console.log('ATTEMPT COUNT BEFORE:', attempts, 'AFTER:', await p.assessmentAttempt.count({ where: { userId: u.id } }));

  const c = await p.tutorConversation.create({
    data: {
      userId: u.id,
      curriculumId: 'btech-eng-phys-waves',
      conceptId: 'wave-fundamentals',
      messages: { create: [{ role: 'USER', content: 'smoke' }] },
    },
    include: { messages: true },
  });
  console.log('CONVERSATION OK, messages:', c.messages.length);

  await p.userProfile.delete({ where: { id: u.id } });
  console.log('DELETE OK (cascade) — remaining attempts:', await p.assessmentAttempt.count({ where: { userId: u.id } }));
  console.log('DB SMOKE PASS');
} catch (e) {
  console.error('DB SMOKE FAIL:', e.message);
  process.exit(1);
} finally {
  await p.$disconnect();
}
