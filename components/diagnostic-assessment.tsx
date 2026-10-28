'use client';

import React, { useState } from 'react';
import { INITIAL_DIAGNOSTIC_ASSESSMENT, SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState, DiagnosticQuestion } from '@/types/learning';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface DiagnosticAssessmentProps {
  learnerState: LearnerState;
  onAnswerQuestion: (questionId: string, conceptId: string, selectedOptionId: string, isCorrect: boolean) => Promise<import('@/types/backend').AnswerResultDTO | null>;
  onTriggerPrerequisiteDiagnosis: (conceptId: string, question: DiagnosticQuestion) => void;
  onCompleteAssessment: () => void;
  onOpenKnowledgeGraph: () => void;
  onOpenLesson: (conceptId: string) => void;
}

export function DiagnosticAssessment({
  learnerState,
  onAnswerQuestion,
  onTriggerPrerequisiteDiagnosis,
  onCompleteAssessment,
  onOpenKnowledgeGraph,
  onOpenLesson
}: DiagnosticAssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [serverCorrect, setServerCorrect] = useState<boolean | null>(null);
  const [serverExplanation, setServerExplanation] = useState('');

  const questions = INITIAL_DIAGNOSTIC_ASSESSMENT;
  const currentQuestion = questions[currentIndex];
  const concept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === currentQuestion.conceptId);

  const handleSubmit = async () => {
    if (!selectedOptionId || isAnswerSubmitted || isChecking) return;
    setIsChecking(true);
    const result = await onAnswerQuestion(currentQuestion.id, currentQuestion.conceptId, selectedOptionId, false);
    setIsChecking(false);
    if (!result) { setServerExplanation('Could not check or save this answer. Please retry.'); return; }
    const isCorrect = result.isCorrect;
    setServerCorrect(isCorrect);
    setServerExplanation(result.explanation);
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: selectedOptionId, isCorrect }
    }));
    setIsAnswerSubmitted(true);

    // If answer is incorrect and has a prerequisite, offer immediate prerequisite check
    if (!isCorrect) {
      onTriggerPrerequisiteDiagnosis(currentQuestion.conceptId, currentQuestion);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setServerCorrect(null);
      setServerExplanation('');
    } else {
      setIsCompleted(true);
      onCompleteAssessment();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setServerCorrect(null);
    setServerExplanation('');
    setAnswersMap({});
    setIsCompleted(false);
  };

  // If already finished assessment
  if (isCompleted) {
    const totalCount = questions.length;
    const correctCount = Object.values(answersMap).filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalCount) * 100);

    return (
      <div className="bg-white rounded-[28px] p-8 border border-[#e7e2d6] shadow-xs max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Initial Diagnosis Complete
          </span>
          <h2 className="text-2xl font-bold text-stone-900">Baseline Knowledge Profile Created</h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            You scored <strong>{correctCount} / {totalCount}</strong> ({accuracy}% accuracy).
            Your personal curriculum graph has been calibrated with evidence estimates.
          </p>
        </div>

        {/* Breakdown Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-2xl font-black text-emerald-700">{correctCount}</span>
            <p className="text-xs font-semibold text-emerald-800 mt-0.5">Concepts Developing</p>
            <p className="text-[11px] text-emerald-600 mt-1">Foundational intuition confirmed</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-2xl font-black text-amber-700">{totalCount - correctCount}</span>
            <p className="text-xs font-semibold text-amber-800 mt-0.5">Concepts to Review</p>
            <p className="text-[11px] text-amber-600 mt-1">Prerequisite gaps detected</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-center">
            <span className="text-2xl font-black text-stone-800">{SAMPLE_CURRICULUM.concepts.length - totalCount}</span>
            <p className="text-xs font-semibold text-stone-700 mt-0.5">Upcoming Advanced</p>
            <p className="text-[11px] text-stone-500 mt-1">Ready to unlock in sequence</p>
          </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Diagnostic Question Breakdown</h4>
          {questions.map((q, idx) => {
            const ans = answersMap[q.id];
            const qConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === q.conceptId);
            return (
              <div
                key={q.id}
                className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  {ans?.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-stone-900">{qConcept?.title}</span>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{q.prompt}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenLesson(q.conceptId)}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition shrink-0"
                >
                  View Lesson
                </button>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenKnowledgeGraph}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              View Personal Graph
            </button>
            <button
              onClick={() => onOpenLesson(SAMPLE_CURRICULUM.concepts[0].id)}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shadow-sm"
            >
              Start Recommended Lesson
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question View
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs max-w-3xl mx-auto space-y-6">
      {/* Top Header & Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Target className="w-4 h-4" />
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-stone-400">
            Concept: <strong>{concept?.title}</strong>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
          Diagnostic Assessment Item
        </span>
        <h3 className="text-lg font-bold text-stone-900 leading-snug">
          {currentQuestion.prompt}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = isAnswerSubmitted && serverCorrect === true && selectedOptionId === option.id;

          let optionStyle = 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/80 text-stone-800';

          if (isAnswerSubmitted) {
            if (isCorrect) {
              optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
            } else {
              optionStyle = 'opacity-50 border-stone-200 bg-stone-50';
            }
          } else if (isSelected) {
            optionStyle = 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-200';
          }

          return (
            <label
              key={option.id}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition ${optionStyle}`}
            >
              <input
                type="radio"
                name={`diagnostic-${currentQuestion.id}`}
                value={option.id}
                checked={isSelected}
                disabled={isAnswerSubmitted}
                onChange={() => setSelectedOptionId(option.id)}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="flex-1">
                <span className="font-medium">{option.text}</span>
                {isAnswerSubmitted && isSelected && (
                  <p className={`mt-1.5 text-xs ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {serverExplanation}
                  </p>
                )}
              </div>
              {isAnswerSubmitted && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
            </label>
          );
        })}
      </div>

      {/* Immediate Explanation Card if submitted */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 rounded-2xl text-xs space-y-1.5 border animate-fade-in ${
            serverCorrect === true
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {serverCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Well done! Demonstrated foundational understanding.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Foundational Gap Alert: Prerequisite Detective Triggered</span>
              </>
            )}
          </div>
          <p className="leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <span className="text-xs text-stone-400">
          Deterministic university grading • Instant concept mapping
        </span>

        {!isAnswerSubmitted ? (
          <button
          disabled={!selectedOptionId || isChecking}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition shadow-sm"
          >
            {isChecking ? 'Checking…' : 'Check Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'View Diagnostic Results'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
