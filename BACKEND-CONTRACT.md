# SyllabusOS — Backend API contract (for the frontend agent)

Owner: backend agent. Everything under `app/api/**`, `lib/server/**`, `prisma/**`,
`middleware.ts` is real Clerk auth + Neon Postgres (Prisma 6.16) + Gemini.
Do not modify `lib/server/**` or the routes without syncing with the backend agent.

## Status
- Clerk: **configured** (test keys in `.env.local`). Unauthenticated calls to data APIs return **401**.
- Data APIs require a Clerk session (server-verified `userId`). Ownership is enforced
  server-side; never send a user id from the browser.
- DB: Neon Postgres via `DATABASE_URL` (channel_binding was removed from the URL —
  Prisma's TLS stack cannot negotiate it; keep it out).
- Gemini: `GEMINI_API_KEY` in `.env.local`, only used server-side.

## LocalStorage
Do not treat LocalStorage as the source of truth for mastery — the server DB is.
Client-side caching is fine for snappy UI, but always re-sync from `GET /api/state`.

## Endpoints

### `GET /api/auth-status`
`200 { authenticated: true, demoMode: false, user: { id, displayName } }`
`401 { authenticated: false, demoMode: false }` → show sign-in UI.

### `GET /api/state` → `LearnerStateDTO`
Everything the UI needs for the signed-in student:

```ts
{
  user: { id, displayName, demoMode },
  curriculum: { curriculumId, university, degree, branch, academicYear, semester, subject, unitId, unitTitle } | null,
  diagnosticCompleted: boolean,
  mastery: { [conceptId]: { status: 'not_assessed'|'needs_review'|'developing'|'demonstrated', evidenceScore, questionsAttempted, questionsCorrect, lastAssessedAt } },
  history: [{ id, questionId, conceptId, selectedOptionId, isCorrect, source: 'diagnostic'|'practice'|'remediation', createdAt }],
  investigation: { targetConceptId, suspectedPrerequisiteId, hypothesis, stage: 'diagnosing'|'remediating'|'resolved', outcome? } | null,
  nextQuestionId: string | null,   // suspected prereq's question when an investigation is open
  recommendations: [{ conceptId, priority, badge, reason }],  // top 6, sorted
  learningPath: [{ conceptId, status }],                       // curriculum walk order
  recentStudied: [{ conceptId, completed, lastStudiedAt }],
}
```

Errors: `401` unauthenticated (Clerk session missing/expired), `503 { error: 'state_unavailable' }` DB down.

### `POST /api/state`
Body (validated, else `422`):
- `{ "action": "select_curriculum", "curriculumId": "btech-eng-phys-waves" }` — saves the onboarding selection (`404` unknown id). Other fields are filled on the server from the registry.
- `{ "action": "mark_studied", "conceptId": "...", "completed"?: boolean }`
Both return the updated `LearnerStateDTO` (same shape as GET) — just replace state.

### `GET /api/questions` (diagnostic set) / `GET /api/questions?conceptId=<id>`
One concept's practice pool or all 5 diagnostic MCQs. Questions are **client-safe** —
no answer keys exist anywhere in shared data. `lib/curriculum.ts` is also safe to
import client-side for lesson content, diagram keys, relations.

```ts
{ curriculumId, curriculumLabel, isSample: true, questions: [{ id, conceptId, prompt, options: [{id,text,explanation}], prerequisiteHintId?, difficulty }] }
```

### `POST /api/assessment/answer` — deterministic (never an AI judgment)
Body: `{ questionId, selectedOptionId }` → `AnswerResultDTO`

```ts
{
  isCorrect: boolean,
  explanation: string,                  // of the chosen option
  diagnosis: null | {
    opened: boolean, stage: string, message: string,
    suggestedPrerequisiteId?: string    // when true → show that prereq's targeted check next
  },
  state: LearnerStateDTO                // fresh, includes updated mastery + recommendations
}
```
Scoring rules: correct beginner +50, correct intermediate +75, wrong −25 (clamped 0-100); ≥80 → demonstrated, <50 → needs_review. Two beginner corrects ⇒ demonstrated. A single answer never marks a concept mastered or failed.

**Diagnosis flow (the showcase):** wrong answer on, e.g., `q-yd-1` (young-double-slit) →
`diagnosis.opened=true`, `suggestedPrerequisiteId=phase-path-difference`,
`nextQuestionId` in state points at that prereq's check. Correct prereq answer →
`outcome prereq_ok` (concept-level gap; rereview target). Wrong prereq answer → stage
`remediating` (show targeted lesson + exercise); later correct → gap remediated, retry
target. When the target question is later answered correctly the investigation closes.

### `POST /api/tutor` — Gemini (AI never grades)
Body (validated, else `422`): `{ message, conceptId?, mode?: 'explain'|'different'|'practice', reset?: boolean }`
- Send only the **new** user message; the server loads prior turns from Neon.
- `reset: true` clears that conversation → `{ messages: [], reset: true }`.

Response: `{ reply, message: {id, role:'assistant', content, createdAt}, userMessage: {...}, model }`
Errors: `503` no `GEMINI_API_KEY` configured; `502` Gemini failed/rejected — both
`{ error: 'tutor_unavailable', message }` — the rest of the app keeps working.

### `GET /api/tutor?conceptId=<id>`
`{ messages: [{ id, role: 'user'|'assistant', content, createdAt }] }`

## Frontend integration checklist
1. Fetch `/api/state` on app mount; render demo banner only if `user.demoMode`.
2. 401 anywhere → redirect/`<SignIn/>`.
3. Submit answers via `/api/assessment/answer` only; read `result.state` and update UI from it.
4. Only call tutor after `diagnosticCompleted` ideally, but it works anytime.
5. `lib/curriculum.ts` (client-safe sample curriculum, 10 concepts w/ stories, formulas, examples, relations) + `lib/graph.ts` (helpers) + `lib/recommendations.ts` types for DTOs are import-safe.
6. Never import `lib/server/**` in client components (build enforces `server-only`).
7. Answer keys: the old `lib/curriculum.with-keys.ts.bak` is a pre-stripping backup for reference — delete it once the frontend is final; it must never ship.

## Verified (backend agent, real runs)
- `npm run build` passes (TypeScript + prerender) with all routes dynamic.
- Neon migration `init` applied; tables: UserProfile, StudentCurriculum, ConceptMastery, AssessmentAttempt, TutorConversation (unique per user+concept, message history capped), TutorMessage, LearningProgress; FK cascade deletes verified.
- `scripts/db-smoke.mjs` (upsert/update/count/delete cascade) — PASS.
