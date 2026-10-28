'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState, DiagnosticQuestion } from '@/types/learning';
import { getRemediationContent } from '@/lib/diagnosis';
import { InteractiveDiagram } from './interactive-diagrams';
import { AlertCircle, CheckCircle2, ArrowRight, HelpCircle, Sparkles, BookOpen, X } from 'lucide-react';

interface PrerequisiteRemediationModalProps {
  targetConceptId: string;
  suspectedPrereqId: string;
  learnerState: LearnerState;
  onClose: () => void;
  onUpdateMastery: (conceptId: string, isCorrect: boolean) => void;
  onNavigateToConcept: (conceptId: string) => void;
}

export function PrerequisiteRemediationModal({
  targetConceptId,
  suspectedPrereqId,
  learnerState,
  onClose,
  onUpdateMastery,
  onNavigateToConcept
}: PrerequisiteRemediationModalProps) {
  const targetConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === targetConceptId);
  const prereqConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === suspectedPrereqId);
  const remediation = getRemediationContent(suspectedPrereqId, targetConceptId);

  // Remediation stages: 1. Diagnosis Check -> 2. Conceptual Remediation -> 3. Quick Check -> 4. Resolved
  const [stage, setStage] = useState<'check' | 'explain' | 'practice' | 'resolved'>('check');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!targetConcept || !prereqConcept || !remediation) return null;

  const testQuestion: DiagnosticQuestion = prereqConcept.practiceQuestions[0] || {
    id: `prereq-check-${prereqConcept.id}`,
    conceptId: prereqConcept.id,
    prompt: `Fundamental verification: What is the core condition in ${prereqConcept.title}?`,
    options: [
      { id: 'opt-a', text: prereqConcept.shortSummary, explanation: 'Correct foundational understanding.' },
      { id: 'opt-b', text: 'Wave properties change randomly with time.', explanation: 'Incorrect.' }
    ],
    correctOptionId: 'opt-a',
    explanation: prereqConcept.shortSummary,
    difficulty: 'beginner'
  };

  const handleSubmitCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption === testQuestion.correctOptionId;
    setIsCorrect(correct);
    setHasSubmitted(true);
    onUpdateMastery(prereqConcept.id, correct);

    if (correct) {
      // Prerequisite is solid! Move to resolution
      setStage('resolved');
    } else {
      // Prerequisite gap confirmed! Move to explanation & remediation
      setStage('explain');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fbf9f4] w-full max-w-2xl rounded-[32px] border border-[#e7e2d6] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                SyllabusOS Prerequisite Detective
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-0.5">
                Investigating Foundation Gap: {prereqConcept.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Stage 1: Prerequisite Quick Check */}
          {stage === 'check' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                <strong>Why are we testing this?</strong> You had difficulty with <em>{targetConcept.title}</em>.
                In university physics, this concept directly relies on <strong>{prereqConcept.title}</strong>.
                Let&apos;s quickly check if your foundation here is firm.
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Diagnostic Check • {prereqConcept.title}
                </span>
                <p className="text-sm font-medium text-stone-900">{testQuestion.prompt}</p>

                <div className="space-y-2 pt-2">
                  {testQuestion.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        selectedOption === opt.id
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-medium'
                          : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="prereq-check"
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="mt-0.5 accent-indigo-600"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmitCheck}
                  className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition shadow-sm flex items-center gap-2"
                >
                  Verify Prerequisite
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Remediation Explanation & Diagram */}
          {stage === 'explain' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <strong>Foundational Gap Identified!</strong> Your answer confirmed that <strong>{prereqConcept.title}</strong> needs review. Let&apos;s anchor this concept before jumping back into the complex equations of {targetConcept.title}.
                </div>
              </div>

              {/* Story & Analogy Card */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  Intuitive Analogy: {prereqConcept.title}
                </div>
                <p className="text-xs text-amber-950 italic">&quot;{remediation.analogy.hook}&quot;</p>
                <p className="text-xs text-stone-700 leading-relaxed">{remediation.analogy.analogy}</p>
                <p className="text-xs font-medium text-amber-900">{remediation.analogy.connection}</p>
              </div>

              {/* Diagram */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200">
                <span className="text-xs font-bold text-stone-700 block mb-2">Visualizing {prereqConcept.title}</span>
                <InteractiveDiagram diagramKey={prereqConcept.diagramKey} />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => onNavigateToConcept(prereqConcept.id)}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Open full lesson for {prereqConcept.title}
                </button>
                <button
                  onClick={() => setStage('resolved')}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  I Understand Now, Return to {targetConcept.title}
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Stage 3: Resolved */}
          {stage === 'resolved' && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                {isCorrect
                  ? `Prerequisite Verified: ${prereqConcept.title}`
                  : `Remediation Complete!`}
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                {isCorrect
                  ? `Your foundation in "${prereqConcept.title}" is solid. Your earlier mistake was likely a calculation or terminology slip on "${targetConcept.title}".`
                  : `We've updated your knowledge graph. Now that you've reviewed the intuition for "${prereqConcept.title}", you are ready to tackle "${targetConcept.title}".`}
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToConcept(targetConcept.id);
                  }}
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
                >
                  Continue to {targetConcept.title} Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
