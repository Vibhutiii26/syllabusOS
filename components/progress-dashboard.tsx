'use client';

import React from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { APPLIED_PHYSICS_SYLLABUS } from '@/lib/curricula-registry';
import { LearnerState } from '@/types/learning';
import { generateRecommendations } from '@/lib/recommendations';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  History
} from 'lucide-react';

interface ProgressDashboardProps {
  learnerState: LearnerState;
  activeUnitId?: string;
  sessionHistory?: Array<{ id: string; unitId: string; conceptId: string; startedAt: string; lastStudiedAt: string }>;
  onOpenLesson: (conceptId: string) => void;
  onOpenKnowledgeGraph: () => void;
  onStartAssessment: () => void;
}

export function ProgressDashboard({
  learnerState,
  activeUnitId,
  sessionHistory = [],
  onOpenLesson,
  onOpenKnowledgeGraph,
  onStartAssessment
}: ProgressDashboardProps) {
  const concepts = SAMPLE_CURRICULUM.concepts.filter((concept) => !activeUnitId || concept.unitId === activeUnitId);
  const totalConcepts = concepts.length;

  // Real stats calculated strictly from learnerState
  const masteryValues = concepts.map((concept) => learnerState.mastery[concept.id]).filter((record): record is NonNullable<typeof record> => Boolean(record));
  const demonstratedCount = masteryValues.filter((m) => m.status === 'demonstrated').length;
  const developingCount = masteryValues.filter((m) => m.status === 'developing').length;
  const needsReviewCount = masteryValues.filter((m) => m.status === 'needs_review').length;
  const notAssessedCount = totalConcepts - (demonstratedCount + developingCount + needsReviewCount);

  const totalQuestionsAttempted = masteryValues.reduce((acc, m) => acc + m.questionsAttempted, 0);
  const totalQuestionsCorrect = masteryValues.reduce((acc, m) => acc + m.questionsCorrect, 0);
  const overallAccuracy = totalQuestionsAttempted > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
    : 0;

  // Recommendations derived from our recommendation engine
  const recommendations = generateRecommendations(learnerState);
  const primaryRecommendation = recommendations[0];
  const recConcept = primaryRecommendation
    ? concepts.find((c) => c.id === primaryRecommendation.conceptId)
    : concepts[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            SyllabusOS • Learner Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Physics Learning Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real evidence-driven progress for {SAMPLE_CURRICULUM.subjectCode} — Unit 1: Waves &amp; Wave Optics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartAssessment}
            className="px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-200 transition shadow-2xs"
          >
            Diagnostic Quiz
          </button>
          <button
            onClick={onOpenKnowledgeGraph}
            className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5" />
            Knowledge Graph
          </button>
        </div>
      </div>

      {/* 4 Pastel Squircle Widgets (Matching the user's design reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Warm Amber Card - Concepts Assessed */}
        <div className="bg-[#fef3c7] rounded-[28px] p-5 border border-[#fde68a] shadow-xs flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Mastery Status
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-900 text-xs font-black">
              ★
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-amber-950 tracking-tight">
              {demonstratedCount} <span className="text-sm font-semibold text-amber-800">/ {totalConcepts}</span>
            </div>
            <p className="text-xs font-medium text-amber-900">
              {demonstratedCount === 0 ? 'No concepts mastered yet' : 'Demonstrated understanding'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-950/80 pt-2 border-t border-amber-300/60">
            <span>{developingCount} Developing</span>
            <span>•</span>
            <span>{notAssessedCount} Unassessed</span>
          </div>
        </div>

        {/* Widget 2: Pink / Lavender Card - Practice Accuracy & Wave Sparkline */}
        <div className="bg-[#fce7f3] rounded-[28px] p-5 border border-[#fbcfe8] shadow-xs flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-950 uppercase tracking-wide">
              Practice Accuracy
            </span>
            <span className="text-xs font-bold text-pink-900 bg-pink-200/60 px-2 py-0.5 rounded-full">
              {totalQuestionsAttempted} Questions
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-pink-950 tracking-tight">
              {totalQuestionsAttempted > 0 ? `${overallAccuracy}%` : '—'}
            </div>
            <p className="text-xs font-medium text-pink-900">
              {totalQuestionsCorrect} Correct Answers
            </p>
          </div>

          {/* Mini Wave Sparkline */}
          <div className="w-full pt-1">
            <svg viewBox="0 0 160 28" className="w-full h-7">
              <path
                d="M 5 14 Q 25 2, 45 14 T 85 14 T 125 14 T 155 14"
                fill="none"
                stroke="#db2777"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Widget 3: Sage Green Card - Foundational Gaps */}
        <div className="bg-[#dcfce7] rounded-[28px] p-5 border border-[#bbf7d0] shadow-xs flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
              Prerequisite Gaps
            </span>
            <div className={`w-3 h-3 rounded-full ${needsReviewCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-emerald-950 tracking-tight">
              {needsReviewCount}
            </div>
            <p className="text-xs font-medium text-emerald-900">
              {needsReviewCount === 0 ? 'Zero gaps detected!' : 'Concepts needing review'}
            </p>
          </div>

          <div className="text-[11px] font-semibold text-emerald-900 pt-2 border-t border-emerald-300/60 flex items-center justify-between">
            <span>Evidence Health</span>
            <span className="text-emerald-800">{needsReviewCount === 0 ? 'Optimal' : 'Needs attention'}</span>
          </div>
        </div>

        {/* Widget 4: Periwinkle / Blue Card - Next Recommended Topic */}
        <div className="bg-[#dbeafe] rounded-[28px] p-5 border border-[#bfdbfe] shadow-xs flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
              Recommended Next
            </span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-950 line-clamp-1">
              {recConcept?.title || 'Wave Fundamentals'}
            </h4>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-200/70 px-2 py-0.5 rounded-full inline-block">
              {primaryRecommendation?.badge || 'Recommended Next'}
            </span>
          </div>

          {recConcept && (
            <button
              onClick={() => onOpenLesson(recConcept.id)}
              className="w-full py-1.5 rounded-full bg-blue-900 text-white text-[11px] font-bold hover:bg-blue-800 transition flex items-center justify-center gap-1 shadow-2xs"
            >
              Start Lesson <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Recommended Learning Path Queue */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Adaptive Path Engine
            </span>
            <h3 className="text-base font-bold text-stone-900">
              Personalized Learning Queue
            </h3>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {recommendations.length} Recommendations
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const concept = concepts.find((c) => c.id === rec.conceptId);
            if (!concept) return null;

            const badgeColor = {
              'Prerequisite Gap': 'bg-rose-100 text-rose-800 border-rose-300',
              'Review Foundation': 'bg-amber-100 text-amber-800 border-amber-300',
              'Recommended Next': 'bg-indigo-100 text-indigo-800 border-indigo-300',
              'Deepen Practice': 'bg-blue-100 text-blue-800 border-blue-300',
              'Ready to Master': 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }[rec.badge];

            return (
              <div
                key={rec.conceptId}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:bg-white hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{concept.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {rec.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 pl-7">{rec.reason}</p>
                </div>

                <button
                  onClick={() => onOpenLesson(concept.id)}
                  className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Open Lesson
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Concept Mastery Overview Table */}
      <div className="bg-[#faf7f0] rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] space-y-4">
        <h3 className="text-sm font-bold text-stone-900">
          Curriculum Concepts &amp; Evidence Log
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {concepts.map((concept) => {
            const mastery = learnerState.mastery[concept.id] || {
              status: 'not_assessed',
              evidenceScore: 0,
              questionsAttempted: 0,
              questionsCorrect: 0
            };

            const statusText = {
              not_assessed: 'Not Assessed',
              needs_review: 'Needs Review',
              developing: 'Developing',
              demonstrated: 'Demonstrated'
            }[mastery.status];

            const barColor = {
              not_assessed: 'bg-stone-300',
              needs_review: 'bg-rose-500',
              developing: 'bg-indigo-500',
              demonstrated: 'bg-emerald-500'
            }[mastery.status];

            return (
              <div
                key={concept.id}
                onClick={() => onOpenLesson(concept.id)}
                className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between pr-2">
                    <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{concept.title}</h5>
                    <span className="text-[11px] font-bold text-stone-500">{mastery.evidenceScore}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${Math.max(6, mastery.evidenceScore)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    {statusText} • {mastery.questionsCorrect}/{mastery.questionsAttempted} Qs
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-stone-400" />
              </div>
            );
          })}
        </div>
      </div>

      <section className="rounded-3xl border border-[#e7e2d6] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><History className="h-5 w-5" /></div><div><h2 className="text-lg font-extrabold text-stone-900">Study sessions</h2><p className="text-xs text-stone-500">Pick up where you left off in any unit.</p></div></div>
        <div className="space-y-2">{sessionHistory.length ? sessionHistory.map((session) => {
          const unit = APPLIED_PHYSICS_SYLLABUS.units.find((item) => item.id === session.unitId);
          const concept = SAMPLE_CURRICULUM.concepts.find((item) => item.id === session.conceptId);
          if (!unit || !concept) return null;
          return <button key={session.id} onClick={() => onOpenLesson(session.conceptId)} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left hover:border-indigo-200 hover:bg-indigo-50/50"><span><strong className="block text-sm text-stone-900">Unit {unit.number}: {unit.title.replace(/^UNIT-[IVX]+:\s*/, '')}</strong><span className="text-xs text-stone-500">Last lesson: {concept.title}</span></span><span className="text-[11px] text-stone-500">{new Date(session.lastStudiedAt).toLocaleString()}</span></button>;
        }) : <p className="rounded-2xl bg-stone-50 px-4 py-5 text-sm text-stone-500">Your study sessions will appear here as you work through lessons.</p>}</div>
      </section>
    </div>
  );
}
