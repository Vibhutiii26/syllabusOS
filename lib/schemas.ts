import { z } from 'zod';

// All API request bodies are validated here. Anything unverified coming from
// the browser is rejected with 422 before reaching DB or Gemini.

export const answerBodySchema = z.object({
  questionId: z.string().min(1).max(64),
  selectedOptionId: z.string().min(1).max(8),
});

export const tutorBodySchema = z.object({
  conceptId: z.string().min(1).max(64).optional(),
  unitId: z.string().min(1).max(64).optional(),
  topic: z.string().max(300).optional(),
  message: z.string().min(1).max(4000),
  mode: z.enum(['explain', 'different', 'practice']).optional(),
  reset: z.boolean().optional(),
});

export const curriculumBodySchema = z.object({
  curriculumId: z.string().min(1).max(64),
});

export const studyBodySchema = z.object({
  conceptId: z.string().min(1).max(64),
  completed: z.boolean().optional(),
});

export const TutorRequestSchema = z.object({
  conceptId: z.string().min(1, 'Concept ID is required'),
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  mode: z.enum(['explain_simple', 'deep_derivation', 'analogy_story', 'troubleshoot_prerequisite', 'general_question']).default('general_question'),
  learnerContext: z.object({
    status: z.enum(['not_assessed', 'needs_review', 'developing', 'demonstrated']).optional(),
    evidenceScore: z.number().min(0).max(100).optional(),
    recentFailures: z.array(z.string()).optional()
  }).optional(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(2000)
    })
  ).max(8).optional()
});

export type AnswerBody = z.infer<typeof answerBodySchema>;
export type TutorBody = z.infer<typeof tutorBodySchema>;
export type TutorRequest = z.infer<typeof TutorRequestSchema>;

export interface TutorResponse {
  answer: string;
  source: 'gemini' | 'grounded_curriculum_fallback';
  conceptId: string;
  suggestedFollowUps?: string[];
}
