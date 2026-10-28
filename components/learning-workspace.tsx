'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import {
  LearnerState,
  DiagnosticQuestion,
  MasteryStatus
} from '@/types/learning';
import {
  loadLearnerState,
  saveLearnerState,
  calculateMasteryUpdate,
  getDefaultLearnerState
} from '@/lib/learner-state';
import { analyzeFailureForPrerequisites } from '@/lib/diagnosis';

import { AppSidebar } from '@/components/app-sidebar';
import { LessonView } from '@/components/lesson-view';
import { SyllabusSelector } from '@/components/syllabus-selector';
import { KnowledgeGraph } from '@/components/knowledge-graph';
import { TutorChat } from '@/components/tutor-chat';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { DiagnosticAssessment } from '@/components/diagnostic-assessment';
import { PrerequisiteRemediationModal } from '@/components/prerequisite-modal';
import { ConceptDetails } from '@/components/concept-details';

import {
  Search,
  Sparkles,
  Compass,
  BookOpen,
  Bot,
  Bell,
  Settings,
  X,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function SyllabusOSApp({ initialState, onChangeCurriculum }: { initialState: import("@/types/backend").LearnerStateDTO; onChangeCurriculum: () => void }) {
  const { isSignedIn, isLoaded } = useUser();
  const [learnerState, setLearnerState] = useState<LearnerState>(getDefaultLearnerState);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Active view states
  const [activeTab, setActiveTab] = useState<'learning' | 'syllabus' | 'graph' | 'tutor' | 'progress'>('learning');
  const [activeConceptId, setActiveConceptId] = useState<string>('wave-fundamentals');

  // Modal / Drawer states
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [showConceptDrawerId, setShowConceptDrawerId] = useState<string | null>(null);
  const [activePrereqCheck, setActivePrereqCheck] = useState<{
    targetConceptId: string;
    suspectedPrereqId: string;
  } | null>(null);

  // AI Tutor pre-prompt pass-through
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>();
  const [tutorInitialMode, setTutorInitialMode] = useState<string | undefined>();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // The server is authoritative for learner evidence; local storage holds view preferences.
  useEffect(() => {
    const loaded = loadLearnerState();
    setLearnerState({ ...loaded, mastery: Object.fromEntries(Object.entries(initialState.mastery).map(([id, item]) => [id, { ...item, lastUpdated: item.lastAssessedAt || '' }])) });
    setActiveConceptId(loaded.activeConceptId || 'wave-fundamentals');
    setActiveTab(loaded.activeNavTab || 'learning');
    setIsClientLoaded(true);
  }, [initialState]);

  // Persist state updates to LocalStorage
  const updateLearnerState = (updater: (prev: LearnerState) => LearnerState) => {
    setLearnerState((prev) => {
      const next = updater(prev);
      saveLearnerState(next);
      return next;
    });
  };

  // Handler for question answers (deterministic scoring)
  const handleAnswerQuestion = async (
    questionId: string,
    conceptId: string,
    selectedOptionId: string,
    _isCorrect: boolean
  ) => {
    try {
      const response = await fetch('/api/assessment/answer', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ questionId, selectedOptionId }) });
      if (!response.ok) throw new Error('Could not save that answer. Try again.');
      const result = await response.json();
      const serverState = result.state as LearnerStateDTO;
      setLearnerState((prev) => ({ ...prev, mastery: Object.fromEntries(Object.entries(serverState.mastery).map(([id, item]) => [id, { ...item, lastUpdated: item.lastAssessedAt || '' }])), assessmentHistory: [...prev.assessmentHistory, { id: `eval-${Date.now()}`, questionId, conceptId, selectedOptionId, isCorrect: result.isCorrect, timestamp: new Date().toISOString() }] }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save that answer.');
    }
  };

  // Handler when answer fails: launches prerequisite check
  const handleTriggerPrerequisiteDiagnosis = (conceptId: string, question: DiagnosticQuestion) => {
    const analysis = analyzeFailureForPrerequisites(conceptId, question, learnerState);
    if (analysis.hasPrerequisiteGap && analysis.suspectedConceptId) {
      setActivePrereqCheck({
        targetConceptId: conceptId,
        suspectedPrereqId: analysis.suspectedConceptId
      });
    }
  };

  // Handler for navigation to lesson
  const handleOpenLesson = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setActiveTab('learning');
    setShowConceptDrawerId(null);
    setShowDiagnosticModal(false);
    updateLearnerState((prev) => ({
      ...prev,
      activeConceptId: conceptId,
      activeNavTab: 'learning',
      recentStudiedConceptIds: Array.from(new Set([conceptId, ...prev.recentStudiedConceptIds])).slice(0, 5)
    }));
  };

  // Handler for tutor opening with prompt
  const handleOpenTutorWithPrompt = (conceptId: string, prompt?: string, mode?: string) => {
    setActiveConceptId(conceptId);
    setTutorInitialPrompt(prompt);
    setTutorInitialMode(mode);
    setActiveTab('tutor');
  };

  // Reset progress for testing & demonstration
  const handleResetProgress = () => {
    if (window.confirm('Reset all assessment progress and restart demo state?')) {
      const def = getDefaultLearnerState();
      setLearnerState(def);
      saveLearnerState(def);
      setActiveConceptId('wave-fundamentals');
      setActiveTab('learning');
    }
  };

  const demonstratedCount = Object.values(learnerState.mastery).filter(
    (m) => m.status === 'demonstrated'
  ).length;

  // Filtered concepts for search
  const filteredConcepts = searchQuery.trim()
    ? SAMPLE_CURRICULUM.concepts.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.shortSummary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f3ede2] p-2 sm:p-4 md:p-6 flex items-center justify-center">
      {/* Outer Window Container (MacBook bezel with large rounded corners) */}
      <div className="w-full max-w-[1600px] min-h-[92vh] bg-[#fbf9f4] rounded-[36px] border border-[#e4decb] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Floating Dark Sidebar */}
        <div className="p-3 sm:p-4 shrink-0 flex">
          <AppSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              updateLearnerState((prev) => ({ ...prev, activeNavTab: tab }));
            }}
            onOpenDiagnostic={() => setShowDiagnosticModal(true)}
            onResetProgress={handleResetProgress}
            demonstratedCount={demonstratedCount}
            totalConcepts={SAMPLE_CURRICULUM.concepts.length}
          />
        </div>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-[92vh] p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Search & Filter Bar */}
          <header className="flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full border border-stone-200/70 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concepts, formulas, derivations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-100/80 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="text-stone-400 font-medium text-[11px]">In:</span>
              <button
                onClick={() => handleOpenLesson('wave-fundamentals')}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition"
              >
                Waves
              </button>
              <button
                onClick={() => handleOpenLesson('superposition')}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition"
              >
                Superposition
              </button>
              <button
                onClick={() => handleOpenLesson('young-double-slit')}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition"
              >
                Double-Slit
              </button>
              <button
                onClick={() => handleOpenLesson('fringe-width')}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition"
              >
                Fringe Width
              </button>
            </div>

            {/* User Profile Pill & Quick Diagnostic Trigger */}
            <div className="flex items-center gap-3">
              <button onClick={onChangeCurriculum} className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200">Change study path</button>
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Assessment
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                  EP
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-stone-800 block leading-tight">B.Tech Student</span>
                  <span className="text-[10px] text-stone-400 block">Semester 1</span>
                </div>
              </div>
            </div>
          </header>

          {/* Search Results Dropdown Overlay */}
          {searchQuery.trim() && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-lg space-y-2 max-h-72 overflow-y-auto">
              <span className="text-[11px] font-bold uppercase text-stone-400">
                Found {filteredConcepts.length} matching topics:
              </span>
              {filteredConcepts.map((fc) => (
                <div
                  key={fc.id}
                  onClick={() => {
                    handleOpenLesson(fc.id);
                    setSearchQuery('');
                  }}
                  className="p-2.5 rounded-xl hover:bg-stone-100 transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900">{fc.title}</span>
                    <p className="text-stone-500 text-[11px] line-clamp-1">{fc.shortSummary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>
          )}

          {/* Primary View Switcher */}
          <div className="flex-1">
            {activeTab === 'learning' && (
              <LessonView
                conceptId={activeConceptId}
                learnerState={learnerState}
                onNavigateConcept={(id) => handleOpenLesson(id)}
                onAnswerPractice={handleAnswerQuestion}
                onTriggerPrerequisiteDiagnosis={handleTriggerPrerequisiteDiagnosis}
                onOpenTutor={handleOpenTutorWithPrompt}
              />
            )}

            {activeTab === 'syllabus' && (
              <SyllabusSelector
                learnerState={learnerState}
                onSelectConcept={(id) => setShowConceptDrawerId(id)}
                onOpenLesson={(id) => handleOpenLesson(id)}
              />
            )}

            {activeTab === 'graph' && (
              <div className="space-y-4">
                <KnowledgeGraph
                  learnerState={learnerState}
                  onSelectConcept={(id) => setShowConceptDrawerId(id)}
                  onOpenLesson={(id) => handleOpenLesson(id)}
                />
              </div>
            )}

            {activeTab === 'tutor' && (
              <TutorChat
                learnerState={learnerState}
                initialConceptId={activeConceptId}
                initialPrompt={tutorInitialPrompt}
                initialMode={tutorInitialMode}
                onOpenLesson={(id) => handleOpenLesson(id)}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressDashboard
                learnerState={learnerState}
                onOpenLesson={(id) => handleOpenLesson(id)}
                onOpenKnowledgeGraph={() => setActiveTab('graph')}
                onStartAssessment={() => setShowDiagnosticModal(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Diagnostic Assessment Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setShowDiagnosticModal(false)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <DiagnosticAssessment
              learnerState={learnerState}
              onAnswerQuestion={handleAnswerQuestion}
              onTriggerPrerequisiteDiagnosis={handleTriggerPrerequisiteDiagnosis}
              onCompleteAssessment={() => {
                // Assessment finished
              }}
              onOpenKnowledgeGraph={() => {
                setShowDiagnosticModal(false);
                setActiveTab('graph');
              }}
              onOpenLesson={(id) => {
                setShowDiagnosticModal(false);
                handleOpenLesson(id);
              }}
            />
          </div>
        </div>
      )}

      {/* Prerequisite Remediation Modal / Detective */}
      {activePrereqCheck && (
        <PrerequisiteRemediationModal
          targetConceptId={activePrereqCheck.targetConceptId}
          suspectedPrereqId={activePrereqCheck.suspectedPrereqId}
          learnerState={learnerState}
          onClose={() => setActivePrereqCheck(null)}
          onUpdateMastery={(conceptId, isCorrect) => {
            handleAnswerQuestion(`remed-${Date.now()}`, conceptId, 'opt-auto', isCorrect);
          }}
          onNavigateToConcept={(id) => {
            setActivePrereqCheck(null);
            handleOpenLesson(id);
          }}
        />
      )}

      {/* Concept Details Side Drawer */}
      {showConceptDrawerId && (
        <div className="fixed inset-0 z-40 flex items-center justify-end p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md h-full max-h-[92vh] overflow-y-auto">
            <ConceptDetails
              conceptId={showConceptDrawerId}
              learnerState={learnerState}
              onClose={() => setShowConceptDrawerId(null)}
              onOpenLesson={(id) => handleOpenLesson(id)}
              onSelectRelated={(id) => setShowConceptDrawerId(id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

