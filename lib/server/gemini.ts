import 'server-only';
import { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// Gemini tutor client. Server-only: the API key must never leave this module.
// ---------------------------------------------------------------------------

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export function geminiKeyConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export interface TutorContext {
  conceptTitle: string;
  conceptSummary: string;
  learningObjective: string;
  formula?: string;
  prerequisites: Array<{ title: string; summary: string }>;
  dependents: Array<{ title: string; summary: string }>;
  masterySummary: string;
  applicationNote: string;
}

export async function generateTutorReply(
  userMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
  mode: 'explain' | 'different' | 'practice' | undefined,
  context: TutorContext,
): Promise<{ text: string }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemInstruction = [
    'You are SyllabusOS AI Teacher, a patient university engineering-physics tutor.',
    'Ground every answer in the curriculum context provided below; do not invent university-specific requirements, grading rules, or unsupported facts.',
    'Teach at a beginner-friendly level by default; raise depth only if the student mastery summary shows they are already solid.',
    'Use relatable analogies and connected stories, explain every symbol in formulas, show step-by-step derivations for worked math, and connect the topic to its prerequisites and later topics.',
    'Structure each answer with these concise sections when relevant: Direct answer; How it works (numbered steps); Formula and symbols (with SI units); Connection to the selected syllabus topic. Omit irrelevant sections rather than padding.',
    'Use valid Markdown and standard LaTeX delimiters for equations. Never output literal escape sequences in place of mathematical symbols.',
    'Answer only the student’s latest question, preserve the selected concept as the topic, and explicitly say when the supplied syllabus context does not contain enough information.',
    'Keep answers focused and readable. Avoid repeating the same analogy or conclusion across turns.',
    'Never claim to know the student\'s university notes.',
    buildSystemContext(context, mode),
  ].join('\n\n');

  // Hard cap: the client may send up to 10 turns per request; we forward at
  // most the last 8 to bound token usage.
  const trimmed = userMessages.slice(-8);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: trimmed.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
    config: { systemInstruction },
  });

  const text =
    response.text ??
    response.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ??
    '';
  return { text };
}

function buildSystemContext(context: TutorContext, mode: string | undefined): string {
  const parts: string[] = ['--- CURRICULUM CONTEXT ---'];
  parts.push(`Topic: ${context.conceptTitle}`);
  parts.push(`Summary: ${context.conceptSummary}`);
  parts.push(`Learning objective: ${context.learningObjective}`);
  if (context.formula) parts.push(`Key formula: ${context.formula}`);
  parts.push(
    `Prerequisites to connect to: ${
      context.prerequisites.map((p) => `${p.title} — ${p.summary}`).join('; ') || 'none in this unit'
    }`,
  );
  parts.push(
    `Later topics to point toward: ${
      context.dependents.map((d) => d.title).join('; ') || 'none in this unit'
    }`,
  );
  parts.push(
    `Student mastery estimate (an estimate that improves with evidence): ${context.masterySummary}`,
  );
  parts.push(`Real-world anchor: ${context.applicationNote}`);
  if (mode === 'different') {
    parts.push(
      'The student asked for an alternative explanation — re-explain with a NEW analogy, not a repetition.',
    );
  } else if (mode === 'practice') {
    parts.push(
      'Offer a short practice question with a worked solution path. Do not grade answers — SyllabusOS grades questions deterministically.',
    );
  }
  parts.push('--- END CONTEXT ---');
  return parts.join('\n');
}
