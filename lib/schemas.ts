import { z } from 'zod';

export const TutorRequestSchema = z.object({
  conceptId: z.string().min(1, 'Concept ID is required'),
  prompt: z.string().min(1, 'Prompt is required').max(1500, 'Prompt too long'),
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

export type TutorRequest = z.infer<typeof TutorRequestSchema>;

export interface TutorResponse {
  answer: string;
  source: 'gemini' | 'grounded_curriculum_fallback';
  conceptId: string;
  suggestedFollowUps?: string[];
}
