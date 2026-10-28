'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
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
  ChevronDown
} from 'lucide-react';

interface SyllabusSelectorProps {
  learnerState: LearnerState;
  onSelectConcept: (conceptId: string) => void;
  onOpenLesson: (conceptId: string) => void;
}

export function SyllabusSelector({
  learnerState,
  onSelectConcept,
  onOpenLesson
}: SyllabusSelectorProps) {
  const [selectedUniversity, setSelectedUniversity] = useState(SAMPLE_CURRICULUM.university);
  const [selectedDegree, setSelectedDegree] = useState(SAMPLE_CURRICULUM.degree);
  const [selectedBranch, setSelectedBranch] = useState(SAMPLE_CURRICULUM.branch);
  const [selectedSemester, setSelectedSemester] = useState(SAMPLE_CURRICULUM.semester);

  const concepts = SAMPLE_CURRICULUM.concepts;
  const unit = SAMPLE_CURRICULUM.unit;

  const totalConcepts = concepts.length;
  const demonstratedCount = Object.values(learnerState.mastery).filter(
    (m) => m.status === 'demonstrated'
  ).length;
  const reviewCount = Object.values(learnerState.mastery).filter(
    (m) => m.status === 'needs_review'
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Onboarding & University Profile Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">University Syllabus Navigator</h2>
              <p className="text-xs text-stone-500">
                Calibrated against official AICTE / UGC Technical University Guidelines
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Active Verified Syllabus
          </span>
        </div>

        {/* Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* University */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              University
            </span>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value={SAMPLE_CURRICULUM.university}>
                State Technical University (AICTE Model)
              </option>
              <option value="DTU">Delhi Technological University (DTU)</option>
              <option value="VTU">Visvesvaraya Technological University (VTU)</option>
              <option value="AKTU">Dr. A.P.J. Abdul Kalam Technical University (AKTU)</option>
            </select>
          </div>

          {/* Degree */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Degree &amp; Program
            </span>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value={SAMPLE_CURRICULUM.degree}>B.Tech (Bachelor of Technology)</option>
              <option value="B.E">B.E (Bachelor of Engineering)</option>
              <option value="B.Sc">B.Sc (Applied Physics Honors)</option>
            </select>
          </div>

          {/* Branch */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Engineering Branch
            </span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value={SAMPLE_CURRICULUM.branch}>Common First Year (All Branches)</option>
              <option value="CSE">Computer Science &amp; Engineering</option>
              <option value="ECE">Electronics &amp; Communication</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="EE">Electrical Engineering</option>
            </select>
          </div>

          {/* Semester */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Semester
            </span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="Semester 1">Semester 1 (Autumn)</option>
              <option value="Semester 2">Semester 2 (Spring)</option>
            </select>
          </div>
        </div>

        {/* Explicit Sample Scope Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong>Sample Scope Notice:</strong> To ensure high-depth accuracy during the hackathon MVP, SyllabusOS is populated with <strong>B.Tech Engineering Physics — Waves and Wave Optics (Unit 1)</strong>. The curriculum data model is structured in TypeScript/JSON for future multi-institution expansion.
          </p>
        </div>
      </div>

      {/* Unit Overview Card */}
      <div className="bg-[#faf7f0] rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {SAMPLE_CURRICULUM.subjectCode} • {SAMPLE_CURRICULUM.subjectName}
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">{unit.title}</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">{unit.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-stone-900">
                {demonstratedCount} / {totalConcepts}
              </span>
              <p className="text-[11px] text-stone-500">Concepts Demonstrated</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center font-bold text-xs text-emerald-700">
              {Math.round((demonstratedCount / totalConcepts) * 100)}%
            </div>
          </div>
        </div>

        {/* List of 10 Concepts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Curriculum Concept Breakdown ({totalConcepts} Connected Topics)
          </h4>

          {concepts.map((concept, index) => {
            const mastery = learnerState.mastery[concept.id] || {
              status: 'not_assessed',
              evidenceScore: 0
            };

            const statusConfig = {
              not_assessed: {
                label: 'Not Assessed',
                color: 'bg-stone-100 text-stone-600 border-stone-200',
                icon: <Clock className="w-3.5 h-3.5 text-stone-400" />
              },
              needs_review: {
                label: 'Needs Review',
                color: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              },
              developing: {
                label: 'Developing',
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                icon: <CircleDot className="w-3.5 h-3.5 text-indigo-500" />
              },
              demonstrated: {
                label: 'Demonstrated',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              }
            }[mastery.status];

            return (
              <div
                key={concept.id}
                onClick={() => onSelectConcept(concept.id)}
                className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-indigo-600 transition">
                        {concept.title}
                      </h4>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label} ({mastery.evidenceScore}%)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">{concept.shortSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLesson(concept.id);
                    }}
                    className="px-4 py-2 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white text-stone-700 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Open Lesson
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
