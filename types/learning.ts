export type MasteryStatus = 'not_assessed' | 'needs_review' | 'developing' | 'demonstrated';

export type RelationType = 'prerequisite_of' | 'part_of' | 'related_to' | 'applied_in';

export interface ConceptRelation {
  targetId: string;
  type: RelationType;
  reason: string;
}

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit?: string;
}

export interface ConceptFormula {
  latex: string;
  title: string;
  explanation: string;
  variables: FormulaVariable[];
}

export interface WorkedExample {
  title: string;
  problem: string;
  steps: string[];
  solution: string;
}

export interface DiagnosticOption {
  id: string;
  text: string;
  explanation: string;
}

export type QuestionSource = 'diagnostic' | 'practice' | 'remediation';

/**
 * Client-safe question. The answer key (correctOptionId) intentionally
 * lives only in lib/server/questions.ts; deterministic checking happens
 * in the API routes, never in the browser.
 */
export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  prompt: string;
  options: DiagnosticOption[];
  correctOptionId?: string;
  explanation?: string;
  prerequisiteHintId?: string; // Concept to check if answered incorrectly
  difficulty: 'beginner' | 'intermediate';
}

/** Server-only view: adds the answer key back on top of the shared data. */
export interface ServerDiagnosticQuestion extends DiagnosticQuestion {
  correctOptionId: string;
  source: QuestionSource;
}

export interface Concept {
  id: string;
  title: string;
  unitId: string;
  unitTitle: string;
  shortSummary: string;
  learningObjective: string;
  storyAnalogy: {
    hook: string;
    analogy: string;
    connection: string;
  };
  explanationSections: {
    heading: string;
    content: string;
  }[];
  formula?: ConceptFormula;
  diagramKey: string;
  workedExample?: WorkedExample;
  realWorldApplication: {
    title: string;
    description: string;
    industry: string;
  };
  relations: ConceptRelation[];
  practiceQuestions: DiagnosticQuestion[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  conceptIds: string[];
}

export interface Curriculum {
  id: string;
  university: string;
  degree: string;
  branch: string;
  academicYear: string;
  semester: string;
  subjectCode: string;
  subjectName: string;
  unit: Unit;
  concepts: Concept[];
}

export interface ConceptMasteryRecord {
  status: MasteryStatus;
  evidenceScore: number; // 0 - 100
  questionsAttempted: number;
  questionsCorrect: number;
  lastUpdated: string;
}

export interface AssessmentRecord {
  id: string;
  questionId: string;
  conceptId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface ActivePrerequisiteInvestigation {
  targetConceptId: string;
  suspectedPrerequisiteId: string;
  hypothesis: string;
  stage: 'diagnosing' | 'remediating' | 'practice' | 'resolved';
}

export interface LearningRecommendation {
  conceptId: string;
  priority: 'high' | 'medium' | 'low';
  badge: 'Prerequisite Gap' | 'Recommended Next' | 'Review Foundation' | 'Deepen Practice' | 'Ready to Master';
  reason: string;
  prerequisiteId?: string;
}

export interface LearnerState {
  curriculumId: string;
  mastery: Record<string, ConceptMasteryRecord>;
  assessmentHistory: AssessmentRecord[];
  activeInvestigation?: ActivePrerequisiteInvestigation | null;
  recentStudiedConceptIds: string[];
  activeConceptId: string;
  activeNavTab: 'learning' | 'syllabus' | 'graph' | 'tutor' | 'progress';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  conceptId?: string;
  timestamp: string;
}
