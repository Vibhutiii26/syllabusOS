import type {
  MasteryStatus,
  ServerDiagnosticQuestion,
  LearnerState,
  ConceptMasteryRecord
} from '@/types/learning';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';

// ---------------------------------------------------------------------------
// Deterministic mastery engine. No DB, no AI, no client code.
// A "demonstrated" label is only ever earned through accumulated evidence —
// never from a single correct answer — and the initial profile is always an
// estimate that sharpens with further practice.
// ---------------------------------------------------------------------------

export type { MasteryStatus };

export interface MasteryRecord {
  status: MasteryStatus;
  evidenceScore: number;
  questionsAttempted: number;
  questionsCorrect: number;
  lastUpdated: string | null;
}

export function initialMastery(): MasteryRecord {
  return {
    status: 'not_assessed',
    evidenceScore: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    lastUpdated: null,
  };
}

export function applyAttempt(
  prev: MasteryRecord | undefined,
  question: ServerDiagnosticQuestion,
  isCorrect: boolean,
): MasteryRecord {
  const record: MasteryRecord = prev
    ? { ...prev, lastUpdated: null }
    : initialMastery();

  record.questionsAttempted += 1;
  if (isCorrect) record.questionsCorrect += 1;

  const delta = isCorrect
    ? question.difficulty === 'intermediate'
      ? 75
      : 50
    : -25;
  record.evidenceScore = Math.min(
    100,
    Math.max(0, record.evidenceScore + delta),
  );
  record.lastUpdated = new Date().toISOString();
  record.status = statusFrom(record);
  return record;
}

export function statusFrom(record: {
  questionsAttempted: number;
  evidenceScore: number;
}): MasteryStatus {
  if (record.questionsAttempted === 0) return 'not_assessed';
  if (record.evidenceScore >= 80) return 'demonstrated';
  if (record.evidenceScore < 50) return 'needs_review';
  return 'developing';
}

export const STATUS_LABELS: Record<MasteryStatus, string> = {
  not_assessed: 'Not assessed',
  needs_review: 'Needs review',
  developing: 'Developing',
  demonstrated: 'Demonstrated',
};

// ---------------------------------------------------------------------------
// Client-side LocalStorage state persistence and helpers
// ---------------------------------------------------------------------------

export const STORAGE_KEY = 'syllabus_os_learner_state_v1';
export const CHAT_STORAGE_KEY = 'syllabus_os_chat_history_v1';

export function getDefaultLearnerState(): LearnerState {
  const mastery: Record<string, ConceptMasteryRecord> = {};

  SAMPLE_CURRICULUM.concepts.forEach((concept) => {
    mastery[concept.id] = {
      status: 'not_assessed',
      evidenceScore: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      lastUpdated: '', // no evidence yet — deterministic for SSR prerender
    };
  });

  return {
    curriculumId: SAMPLE_CURRICULUM.id,
    mastery,
    assessmentHistory: [],
    activeInvestigation: null,
    recentStudiedConceptIds: ['wave-fundamentals'],
    activeConceptId: 'wave-fundamentals',
    activeNavTab: 'learning',
  };
}

export function loadLearnerState(): LearnerState {
  if (typeof window === 'undefined') {
    return getDefaultLearnerState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultLearnerState();

    const parsed = JSON.parse(raw) as LearnerState;
    const defaultState = getDefaultLearnerState();
    const mergedMastery = { ...defaultState.mastery, ...(parsed.mastery || {}) };

    return {
      ...defaultState,
      ...parsed,
      mastery: mergedMastery,
      recentStudiedConceptIds: parsed.recentStudiedConceptIds || ['wave-fundamentals'],
      activeConceptId: parsed.activeConceptId || 'wave-fundamentals',
      activeNavTab: parsed.activeNavTab || 'learning',
    };
  } catch (err) {
    console.warn('Failed to parse saved learner state, falling back to defaults:', err);
    return getDefaultLearnerState();
  }
}

export function saveLearnerState(state: LearnerState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save learner state to localStorage:', err);
  }
}

export function calculateMasteryUpdate(
  current: ConceptMasteryRecord,
  isCorrect: boolean,
): ConceptMasteryRecord {
  const newAttempted = current.questionsAttempted + 1;
  const newCorrect = current.questionsCorrect + (isCorrect ? 1 : 0);
  const accuracy = newCorrect / newAttempted;

  let evidenceScore = Math.round(accuracy * 100);
  let status: MasteryStatus = 'developing';

  if (newAttempted === 1) {
    if (isCorrect) {
      evidenceScore = 65;
      status = 'developing';
    } else {
      evidenceScore = 25;
      status = 'needs_review';
    }
  } else if (newAttempted >= 2) {
    if (accuracy >= 0.75 && newCorrect >= 2) {
      status = 'demonstrated';
      evidenceScore = Math.min(100, Math.round(accuracy * 100));
    } else if (accuracy >= 0.4) {
      status = 'developing';
      evidenceScore = Math.round(accuracy * 100);
    } else {
      status = 'needs_review';
      evidenceScore = Math.max(10, Math.round(accuracy * 100));
    }
  }

  return {
    status,
    evidenceScore,
    questionsAttempted: newAttempted,
    questionsCorrect: newCorrect,
    lastUpdated: new Date().toISOString(),
  };
}
