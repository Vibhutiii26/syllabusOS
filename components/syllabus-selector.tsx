'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import {
  APPLIED_PHYSICS_SYLLABUS,
  FIRST_YEAR_SUBJECTS,
  SubjectOption
} from '@/lib/curricula-registry';
import { LearnerState } from '@/types/learning';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CircleDot,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  Atom,
  Lock,
  ExternalLink,
  Library,
  Target
} from 'lucide-react';

interface SyllabusSelectorProps {
  learnerState: LearnerState;
  onSelectConcept: (conceptId: string) => void;
  onOpenLesson: (conceptId: string) => void;
  onSwitchUnit?: (unitId: string) => void;
}

export function SyllabusSelector({
  learnerState,
  onSelectConcept,
  onOpenLesson,
  onSwitchUnit
}: SyllabusSelectorProps) {
  const [activeSubjectId, setActiveSubjectId] = useState('btech-applied-physics-ph31001');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(1);
  const [expandedUnitId, setExpandedUnitId] = useState<string>('unit-1-laser-fiber');

  const activeSubject =
    FIRST_YEAR_SUBJECTS.find((s) => s.id === activeSubjectId) || APPLIED_PHYSICS_SYLLABUS;

  const concepts = SAMPLE_CURRICULUM.concepts;

  const demonstratedCount = Object.values(learnerState.mastery).filter(
    (m) => m.status === 'demonstrated'
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Official Course Header Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-black shadow-md">
              <Atom className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                  {activeSubject.code}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  AICTE Session 2025-2026
                </span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
                {activeSubject.name}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {activeSubject.program} • {activeSubject.branch}
              </p>
            </div>
          </div>

          {/* Subject Switcher */}
          <div className="p-2 bg-stone-100 rounded-2xl border border-stone-200">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-2 mb-0.5">
              Select 1st Year Subject
            </label>
            <select
              value={activeSubjectId}
              onChange={(e) => setActiveSubjectId(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none px-2 py-1 cursor-pointer"
            >
              {FIRST_YEAR_SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code}: {sub.name} {sub.status === 'coming_soon' ? '(Coming Soon)' : '(Active)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Weekly Hours
            </span>
            <p className="text-sm font-extrabold text-stone-900">{activeSubject.hours}</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Total Credits
            </span>
            <p className="text-sm font-extrabold text-stone-900">{activeSubject.credits} Credits</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Syllabus Units
            </span>
            <p className="text-sm font-extrabold text-stone-900">{activeSubject.units.length} Units</p>
          </div>

          <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
              Demonstrated Concepts
            </span>
            <p className="text-sm font-extrabold text-indigo-900">
              {demonstratedCount} / {concepts.length} Mastered
            </p>
          </div>
        </div>

        {/* Course Learning Objectives (CLOs) */}
        {activeSubject.learningObjectives && activeSubject.learningObjectives.length > 0 && (
          <div className="pt-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              Course Learning Objectives (CLOs)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeSubject.learningObjectives.map((clo) => (
                <div
                  key={clo.code}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5 text-xs"
                >
                  <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 font-mono font-bold shrink-0">
                    {clo.code}
                  </span>
                  <span className="text-stone-700 leading-relaxed font-medium">{clo.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Units of the Syllabus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Units &amp; Detailed Curriculum
          </h3>
          <span className="text-xs text-stone-500 font-semibold">
            {activeSubject.status === 'available' ? '5 Units Fully Mapped' : 'Under Development'}
          </span>
        </div>

        <div className="space-y-3">
          {activeSubject.units.map((unit) => {
            const isExpanded = expandedUnitId === unit.id;
            const isPhysics = activeSubject.id === 'btech-applied-physics-ph31001';

            return (
              <div
                key={unit.id}
                className={`rounded-[28px] border transition-all ${
                  isExpanded
                    ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-500/10'
                    : 'bg-white border-stone-200/80 hover:border-stone-300 shadow-xs'
                }`}
              >
                {/* Unit Header */}
                <div
                  onClick={() => setExpandedUnitId(isExpanded ? '' : unit.id)}
                  className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isExpanded ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      U{unit.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-500">
                          UNIT {unit.number}
                        </span>
                        {unit.suggestedHours && (
                          <span className="text-[10px] text-stone-400 font-medium">
                            • {unit.suggestedHours} Lecture Hours
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-stone-900">
                        {unit.title.replace(/^UNIT-[IVX]+:\s*/, '')}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isPhysics && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSwitchUnit) onSwitchUnit(unit.id);
                          onOpenLesson(concepts[0]?.id || 'wave-fundamentals');
                        }}
                        className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition"
                      >
                        <span>Start Unit Class</span>
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                      </button>
                    )}

                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Unit Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {unit.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Prescribed Subtopics in University Syllabus:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {unit.subtopics.map((subtopic, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-800 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span className="leading-tight">{subtopic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isPhysics && (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-stone-500">
                          Includes interactive SVG simulations, formula derivations, and diagnostic self-assessment.
                        </span>
                        <button
                          onClick={() => {
                            if (onSwitchUnit) onSwitchUnit(unit.id);
                            onOpenLesson(concepts[0]?.id || 'wave-fundamentals');
                          }}
                          className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition shadow-xs flex items-center gap-1.5"
                        >
                          <span>Open Interactive Lessons</span>
                          <ArrowRight className="w-3 h-3 text-indigo-300" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Textbooks & Reference Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Textbooks */}
        {activeSubject.textbooks && activeSubject.textbooks.length > 0 && (
          <div className="bg-white rounded-[28px] p-6 border border-[#e7e2d6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
              <Library className="w-4 h-4 text-indigo-600" />
              <span>Prescribed Textbooks</span>
            </div>
            <div className="space-y-2.5">
              {activeSubject.textbooks.map((tb, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-0.5">
                  <span className="font-bold text-stone-900 block">{idx + 1}. {tb.title}</span>
                  <span className="text-stone-600 text-[11px] block">{tb.authors}</span>
                  <span className="text-stone-400 text-[10px] block">{tb.publisher}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {activeSubject.references && activeSubject.references.length > 0 && (
          <div className="bg-white rounded-[28px] p-6 border border-[#e7e2d6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Reference Books &amp; Classics</span>
            </div>
            <div className="space-y-2.5">
              {activeSubject.references.map((rf, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-0.5">
                  <span className="font-bold text-stone-900 block">{idx + 1}. {rf.title}</span>
                  <span className="text-stone-600 text-[11px] block">{rf.authors}</span>
                  <span className="text-stone-400 text-[10px] block">{rf.publisher} {rf.year ? `(${rf.year})` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
