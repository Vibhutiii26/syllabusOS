import { GoogleGenAI } from '@google/genai';
import { SAMPLE_CURRICULUM } from './curriculum';
import { TutorRequest, TutorResponse } from './schemas';

// Initialize the Google Gen AI client with the server-side environment key
const apiKey = process.env.GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI:', err);
  }
}

/**
 * Builds grounded fallback answers if Gemini is unavailable or rate-limited.
 */
function getGroundedFallback(request: TutorRequest): TutorResponse {
  const concept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === request.conceptId);
  if (!concept) {
    return {
      answer: "I'm your SyllabusOS AI Teacher. While connecting to the live AI service, I am grounded in your B.Tech Engineering Physics syllabus. Please select any concept from Waves and Wave Optics to begin.",
      source: 'grounded_curriculum_fallback',
      conceptId: request.conceptId,
      suggestedFollowUps: ['What is the principle of superposition?', 'How does fringe width change in water?']
    };
  }

  if (request.mode === 'analogy_story') {
    return {
      answer: `### 📖 Conceptual Story: ${concept.title}\n\n**The Everyday Hook:**\n${concept.storyAnalogy.hook}\n\n**The Analogy:**\n${concept.storyAnalogy.analogy}\n\n**Why It Matters to Engineers:**\n${concept.storyAnalogy.connection}\n\n*In your university exam, remember to clearly relate this physical intuition back to the wave equations!*`,
      source: 'grounded_curriculum_fallback',
      conceptId: concept.id,
      suggestedFollowUps: ['Can you show the mathematical formula?', 'What are the main university exam questions?']
    };
  }

  if (request.mode === 'deep_derivation') {
    const formulaSection = concept.formula
      ? `\n\n**Governing Formula:**\n$$\n${concept.formula.latex}\n$$\n*${concept.formula.explanation}*\n\n**Variables:**\n${concept.formula.variables.map((v) => `- **${v.symbol}**: ${v.name} (${v.unit || 'unitless'})`).join('\n')}`
      : '';

    const exampleSection = concept.workedExample
      ? `\n\n**Worked Engineering Example:**\n*${concept.workedExample.problem}*\n\n${concept.workedExample.steps.join('\n')}\n\n**Result:** ${concept.workedExample.solution}`
      : '';

    return {
      answer: `### 📐 Deep Mathematical Derivation: ${concept.title}\n\n${concept.explanationSections.map((s) => `#### ${s.heading}\n${s.content}`).join('\n\n')}${formulaSection}${exampleSection}`,
      source: 'grounded_curriculum_fallback',
      conceptId: concept.id,
      suggestedFollowUps: ['Explain this in simpler terms', 'How does this apply to noise cancellation?']
    };
  }

  return {
    answer: `### 🎓 Syllabus Overview: ${concept.title}\n\n${concept.shortSummary}\n\n**Key Syllabus Objective:**\n${concept.learningObjective}\n\n${concept.explanationSections[0]?.content || ''}\n\n**Real-world Industry Application:**\n${concept.realWorldApplication.title}: ${concept.realWorldApplication.description}`,
    source: 'grounded_curriculum_fallback',
    conceptId: concept.id,
    suggestedFollowUps: [
      `How does ${concept.title} relate to its prerequisites?`,
      'Give me a step-by-step worked example',
      'Explain this using an intuitive analogy'
    ]
  };
}

/**
 * Generates an educational response using Gemini 3.8 Flash, grounded in syllabus context.
 */
export async function generateTutorResponse(request: TutorRequest): Promise<TutorResponse> {
  const concept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === request.conceptId);

  // If no Gemini client or API key, provide rich grounded fallback
  if (!aiClient || !apiKey) {
    return getGroundedFallback(request);
  }

  const conceptContext = concept
    ? `
Syllabus Context:
- Subject: ${SAMPLE_CURRICULUM.subjectName} (${SAMPLE_CURRICULUM.subjectCode})
- Concept: ${concept.title}
- Summary: ${concept.shortSummary}
- Objective: ${concept.learningObjective}
- Formula: ${concept.formula?.latex || 'N/A'} (${concept.formula?.explanation || ''})
- Key Analogy: ${concept.storyAnalogy.analogy}
- Real World Application: ${concept.realWorldApplication.title} - ${concept.realWorldApplication.description}
- Prerequisites: ${concept.relations.map((r) => `${r.targetId} (${r.type}: ${r.reason})`).join('; ')}
`
    : `Syllabus: B.Tech Engineering Physics - Waves and Wave Optics`;

  const learnerContextStr = request.learnerContext
    ? `Student Status: ${request.learnerContext.status || 'not_assessed'} (demonstrated evidence score: ${request.learnerContext.evidenceScore || 0}%). Adapt tone accordingly. If the student is struggling or needs review, start with ultra-clear intuitive physical analogies before equations.`
    : `Student Status: Beginner engineering undergraduate.`;

  const systemInstruction = `You are the SyllabusOS AI Professor, an empathetic, rigorous, and inspiring university physics tutor for B.Tech engineering students.
Your primary role is to bridge gaps between abstract math and intuitive physical understanding.

Guidelines:
1. ALWAYS teach using connected stories, intuitive analogies, and clean step-by-step explanations.
2. Ground all answers strictly in the University Engineering Physics curriculum (specifically Waves & Optics).
3. When formulas are requested, clearly state the equation, explain every variable and its standard SI unit.
4. If the student struggles, diagnose foundational prerequisites (e.g. Wave parameters, Superposition, Phase difference) rather than just repeating definitions.
5. Format mathematical expressions clearly using standard Markdown or LaTeX notation ($...$ for inline, $$...$$ for blocks).
6. Never fabricate university examination marks, non-existent formulas, or unsupported claims.
7. Keep answers focused, encouraging, and pedagogically rich.`;

  const conversationLines = (request.conversationHistory || [])
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Professor'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${conceptContext}
${learnerContextStr}

Mode requested: ${request.mode}

Recent Conversation:
${conversationLines}

Student's latest question:
"${request.prompt}"

Respond in well-structured Markdown with headings, bullet points, and LaTeX formulas where appropriate.`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return getGroundedFallback(request);
    }

    return {
      answer: text,
      source: 'gemini',
      conceptId: request.conceptId,
      suggestedFollowUps: [
        'Can you show a real-world engineering calculation?',
        'How does this concept connect to upcoming topics?',
        'Give me a quick 1-minute comprehension check'
      ]
    };
  } catch (error) {
    console.error('Gemini API call failed, using grounded curriculum fallback:', error);
    return getGroundedFallback(request);
  }
}
