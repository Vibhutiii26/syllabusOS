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

export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  prompt: string;
  options: DiagnosticOption[];
  correctOptionId: string;
  prerequisiteHintId?: string; // Concept to check if answered incorrectly
  explanation: string;
  difficulty: 'beginner' | 'intermediate';
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
  diagramKey: 'wave-fundamentals' | 'wave-parameters' | 'superposition' | 'phase-path' | 'constructive-destructive' | 'sustained-conditions' | 'young-double-slit' | 'fringe-width' | 'interference-applications';
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
