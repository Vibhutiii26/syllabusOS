// Shared DTOs between the SyllabusOS API and the frontend.
// Kept free of any lib/ imports so the client bundle never pulls server code.

import type { MasteryStatus } from '@/types/learning';

export interface MasteryDTO {
  status: MasteryStatus;
  evidenceScore: number;
  questionsAttempted: number;
  questionsCorrect: number;
  lastAssessedAt: string | null;
}

export interface AttemptDTO {
  id: string;
  questionId: string;
  conceptId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  source: 'diagnostic' | 'practice' | 'remediation';
  createdAt: string;
}

export interface InvestigationDTO {
  targetConceptId: string;
  suspectedPrerequisiteId: string;
  hypothesis: string;
  stage: 'diagnosing' | 'remediating' | 'resolved';
  outcome?: string;
}

export interface RecommendationDTO {
  conceptId: string;
  priority: 'high' | 'medium' | 'low';
  badge:
    | 'Prerequisite Gap'
    | 'Recommended Next'
    | 'Review Foundation'
    | 'Deepen Practice'
    | 'Ready to Master';
  reason: string;
}

export interface StudyRecordDTO {
  conceptId: string;
  completed: boolean;
  lastStudiedAt: string;
}

export interface SavedCurriculumDTO {
  curriculumId: string;
  university: string;
  degree: string;
  branch: string;
  academicYear: string;
  semester: string;
  subject: string;
  unitId: string;
  unitTitle: string;
}

export interface UserInfoDTO {
  id: string;
  displayName: string | null;
  /** True when Clerk keys are absent and the server runs in demo mode. */
  demoMode: boolean;
}

export interface LearnerStateDTO {
  user: UserInfoDTO;
  curriculum: SavedCurriculumDTO | null;
  diagnosticCompleted: boolean;
  mastery: Record<string, MasteryDTO>;
  history: AttemptDTO[];
  /** Active prerequisite-aware investigation (hypothesis stage). */
  investigation: InvestigationDTO | null;
  /** Recommended tutor question target, if the FSM is waiting on one. */
  nextQuestionId: string | null;
  recommendations: RecommendationDTO[];
  learningPath: Array<{ conceptId: string; status: MasteryStatus }>;
  recentStudied: StudyRecordDTO[];
}

export interface AnswerResultDTO {
  isCorrect: boolean;
  /** Explanation of the chosen option (client-safe text, no key leak). */
  explanation: string;
  /** Investigation guidance when a hypothesis opened / advanced / resolved. */
  diagnosis?: {
    opened: boolean;
    stage: string;
    message: string;
    suggestedPrerequisiteId?: string;
  } | null;
  state: LearnerStateDTO;
}

export interface TutorHistoryDTO {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
  }>;
}
