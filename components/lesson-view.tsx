'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState, DiagnosticQuestion } from '@/types/learning';
import { InteractiveDiagram } from './interactive-diagrams';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Cpu,
  Layers,
  ChevronRight,
  Calculator,
  RefreshCw
} from 'lucide-react';

interface LessonViewProps {
  conceptId: string;
  unitConcepts?: typeof SAMPLE_CURRICULUM.concepts;
  unitTitle?: string;
  learnerState: LearnerState;
  onNavigateConcept: (conceptId: string) => void;
  onAnswerPractice: (questionId: string, conceptId: string, selectedOptionId: string, isCorrect: boolean) => Promise<import('@/types/backend').AnswerResultDTO | null>;
  onTriggerPrerequisiteDiagnosis: (conceptId: string, question: DiagnosticQuestion) => void;
  onOpenTutor: (conceptId: string, initialPrompt?: string, mode?: string) => void;
}

export function LessonView({
  conceptId,
  unitConcepts = SAMPLE_CURRICULUM.concepts,
  unitTitle = SAMPLE_CURRICULUM.unit.title,
  learnerState,
  onNavigateConcept,
  onAnswerPractice,
  onTriggerPrerequisiteDiagnosis,
  onOpenTutor
}: LessonViewProps) {
  const concept = unitConcepts.find((c) => c.id === conceptId) || unitConcepts[0] || SAMPLE_CURRICULUM.concepts[0];
  const conceptIndex = unitConcepts.findIndex((c) => c.id === concept.id);
  const prevConcept = conceptIndex > 0 ? unitConcepts[conceptIndex - 1] : null;
  const nextConcept = conceptIndex < unitConcepts.length - 1 ? unitConcepts[conceptIndex + 1] : null;

  const mastery = learnerState.mastery[concept.id] || {
    status: 'not_assessed',
    evidenceScore: 0,
    questionsAttempted: 0,
    questionsCorrect: 0
  };

  // Practice question state
  const practiceQuestion = concept.practiceQuestions[0];
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string | null>(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [isCorrectPractice, setIsCorrectPractice] = useState(false);
  const [isCheckingPractice, setIsCheckingPractice] = useState(false);
  const [practiceExplanation, setPracticeExplanation] = useState('');

  const handlePracticeSubmit = async () => {
    if (!selectedPracticeOption || !practiceQuestion || practiceSubmitted || isCheckingPractice) return;
    setIsCheckingPractice(true);
    const result = await onAnswerPractice(practiceQuestion.id, concept.id, selectedPracticeOption, false);
    setIsCheckingPractice(false);
    if (!result) { setPracticeExplanation('Could not check or save your answer. Please try again.'); return; }
    setIsCorrectPractice(result.isCorrect);
    setPracticeExplanation(result.explanation);
    setPracticeSubmitted(true);
    if (!result.isCorrect) onTriggerPrerequisiteDiagnosis(concept.id, practiceQuestion);
  };

  const handleResetPractice = () => {
    setSelectedPracticeOption(null);
    setPracticeSubmitted(false);
    setPracticeExplanation('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-[20px] border border-[#e7e2d6]">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <span className="text-stone-400">{concept.unitTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-stone-900 font-bold">{concept.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {prevConcept && (
            <button
              onClick={() => {
                onNavigateConcept(prevConcept.id);
                handleResetPractice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Prev
            </button>
          )}
          {nextConcept && (
            <button
              onClick={() => {
                onNavigateConcept(nextConcept.id);
                handleResetPractice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 transition"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Hero Header */}
      <div className="bg-white rounded-[32px] p-8 border border-[#e7e2d6] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {unitTitle} · Lesson {conceptIndex + 1} of {unitConcepts.length}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Mastery Evidence:</span>
            <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              {mastery.evidenceScore}% • {mastery.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {concept.title}
        </h1>

        <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
          {concept.shortSummary}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-stone-500 border-t border-stone-100">
          <strong className="text-stone-800">Learning Objective:</strong>
          <span>{concept.learningObjective}</span>
        </div>
      </div>

      {/* 1. Connected Story & Intuitive Analogy (Warm Pastel Card matching MacBook theme) */}
      <div className="bg-[#fef3c7]/80 rounded-[30px] p-6 sm:p-8 border border-[#fde68a] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-900">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
              Intuitive Physical Analogy
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
            Conceptual Anchor
          </span>
        </div>

        <blockquote className="text-base sm:text-lg font-semibold text-amber-950 italic border-l-4 border-amber-500/60 pl-4 py-1">
          &quot;{concept.storyAnalogy.hook}&quot;
        </blockquote>

        <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed font-normal">
          {concept.storyAnalogy.analogy}
        </p>

        <div className="pt-3 border-t border-amber-300/50 text-xs font-semibold text-amber-900 flex items-center gap-2">
          <span>Engineering Connection:</span>
          <span className="font-normal text-amber-950">{concept.storyAnalogy.connection}</span>
        </div>
      </div>

      {/* 2. Interactive SVG Scientific Diagram */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Interactive Model &amp; Wave Mechanics
          </h3>
          <span className="text-xs text-stone-400">Interact with parameters to test your intuition</span>
        </div>
        <InteractiveDiagram diagramKey={concept.diagramKey} />
      </div>

      {/* 3. Step-by-Step Detailed Explanation */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Rigorous Step-by-Step Explanation
        </h3>

        <div className="space-y-6">
          {concept.explanationSections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {sec.heading}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-7">
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Formulas & Variable Definitions (if present) */}
      {concept.formula && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Mathematical Formulation: {concept.formula.title}
            </h3>
            <span className="text-xs font-medium text-stone-400">SI Standard Units</span>
          </div>

          {/* Formula Display Box */}
          <div className="bg-[#faf7f0] rounded-[22px] p-5 border border-[#e7e2d6] text-center space-y-2">
            <div className="font-mono text-base sm:text-lg font-bold text-stone-900 tracking-wide py-1">
              {concept.formula.latex}
            </div>
            <p className="text-xs text-stone-500 italic max-w-lg mx-auto">
              {concept.formula.explanation}
            </p>
          </div>

          {/* Variables Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {concept.formula.variables.map((v, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {v.symbol}
                  </span>
                  <span className="font-medium text-stone-800">{v.name}</span>
                </div>
                {v.unit && (
                  <span className="text-[11px] text-stone-400 font-mono">[{v.unit}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Worked Example (if present) */}
      {concept.workedExample && (
        <div className="bg-[#dcfce7]/60 rounded-[30px] p-6 sm:p-8 border border-[#bbf7d0] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-900">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                Worked Numerical Example
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              University Exam Type
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 space-y-2 text-xs sm:text-sm">
            <p className="font-semibold text-emerald-950">
              <strong>Problem:</strong> {concept.workedExample.problem}
            </p>
            <div className="space-y-1.5 pt-2 border-t border-emerald-100 text-stone-700 text-xs">
              {concept.workedExample.steps.map((st, i) => (
                <p key={i} className="leading-relaxed">
                  {st}
                </p>
              ))}
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-950 font-bold text-xs mt-2">
              {concept.workedExample.solution}
            </div>
          </div>
        </div>
      )}

      {/* 6. Real World Application */}
      <div className="bg-[#dbeafe]/70 rounded-[30px] p-6 sm:p-8 border border-[#bfdbfe] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-900">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
              Engineering Application
            </h3>
          </div>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
            {concept.realWorldApplication.industry}
          </span>
        </div>

        <h4 className="text-sm font-bold text-blue-950">
          {concept.realWorldApplication.title}
        </h4>
        <p className="text-xs sm:text-sm text-blue-950/80 leading-relaxed">
          {concept.realWorldApplication.description}
        </p>
      </div>

      {/* 7. Quick Comprehension Check */}
      {practiceQuestion && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Self-Check Practice
              </span>
              <h3 className="text-base font-bold text-stone-900">
                Demonstrate Your Understanding
              </h3>
            </div>
            <span className="text-xs font-semibold text-stone-400">1 MCQ</span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
            {practiceQuestion.prompt}
          </p>

          <div className="space-y-2.5">
            {practiceQuestion.options.map((opt) => {
              const isSelected = selectedPracticeOption === opt.id;
              const isCorrect = practiceSubmitted && isCorrectPractice && isSelected;

              let style = 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/80 text-stone-800';
              if (practiceSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-50 border-rose-300 text-rose-950';
                } else {
                  style = 'opacity-40 border-stone-200 bg-stone-50';
                }
              } else if (isSelected) {
                style = 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-200';
              }

              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition ${style}`}
                >
                  <input
                    type="radio"
                    name={`practice-${practiceQuestion.id}`}
                    value={opt.id}
                    checked={isSelected}
                    disabled={practiceSubmitted}
                    onChange={() => setSelectedPracticeOption(opt.id)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <span>{opt.text}</span>
                    {practiceSubmitted && isSelected && (
                      <p className={`mt-1 text-xs ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {practiceExplanation}
                      </p>
                    )}
                  </div>
                  {practiceSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {practiceSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {!practiceSubmitted ? (
              <button
                disabled={!selectedPracticeOption || isCheckingPractice}
                onClick={handlePracticeSubmit}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition shadow-sm"
              >
                {isCheckingPractice ? 'Checking…' : 'Submit Answer'}
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full justify-between">
                <span className={`text-xs font-bold ${isCorrectPractice ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isCorrectPractice
                    ? '✓ Correct! Evidence score updated.'
                    : 'Prerequisite check triggered to help reinforce gaps.'}
                </span>
                <button
                  onClick={handleResetPractice}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                >
                  Retry Practice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. AI Professor Shortcuts ("Explain Differently", "Ask Follow-Up") */}
      <div className="bg-stone-900 text-white rounded-[32px] p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">SyllabusOS AI Teacher Support</h3>
              <p className="text-xs text-stone-400">Powered by Gemini 3.8 Flash • Grounded in Engineering Physics</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            Ready to Help
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Need an alternative explanation or step-by-step guidance? Your AI Professor is trained on your exact syllabus requirements.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            onClick={() => onOpenTutor(concept.id, `Explain ${concept.title} using a completely different everyday analogy.`, 'analogy_story')}
            className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Explain Differently
          </button>
          <button
            onClick={() => onOpenTutor(concept.id, `Walk me through the mathematical derivation and variable definitions for ${concept.title}.`, 'deep_derivation')}
            className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition flex items-center gap-2"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            Show Step Derivation
          </button>
          <button
            onClick={() => onOpenTutor(concept.id, `What are the most common exam questions and tricky traps for ${concept.title}?`, 'general_question')}
            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask a Follow-Up Question
          </button>
        </div>
      </div>
    </div>
  );
}
