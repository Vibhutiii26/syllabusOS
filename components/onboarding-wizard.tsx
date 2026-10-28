'use client';

import React, { useState } from 'react';
import {
  SUBJECT_CATALOG,
  StudentOnboardingProfile,
  saveOnboardingProfile
} from '@/lib/curricula-registry';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Layers,
  Compass,
  Cpu,
  Brain,
  Sliders,
  Check
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: StudentOnboardingProfile) => void;
  onSkip?: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [university, setUniversity] = useState('Technical University Model (AICTE Aligned)');
  const [customUni, setCustomUni] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1st Year');
  const [semester, setSemester] = useState('Semester 1');
  const [selectedSubjectId, setSelectedSubjectId] = useState('btech-eng-phys-waves');
  const [familiarity, setFamiliarity] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [preferences, setPreferences] = useState({
    stories: true,
    visuals: true,
    workedExamples: true,
    conciseRevision: false
  });

  // Filter subjects based on selection or fallback to full catalog
  const availableSubjects = SUBJECT_CATALOG;
  const activeSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];

  const handleFinish = () => {
    const profile: StudentOnboardingProfile = {
      university: customUni.trim() ? customUni.trim() : university,
      degree,
      branch,
      year,
      semester,
      subjectId: selectedSubjectId,
      unitId: activeSubject.units[0]?.id || 'unit-1',
      familiarity,
      preferences,
      completedAt: new Date().toISOString()
    };

    saveOnboardingProfile(profile);
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl bg-white rounded-[36px] border border-[#e7e2d6] shadow-xl p-6 sm:p-10 space-y-8 animate-fade-in relative overflow-hidden">
        
        {/* Top Stepper Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Step {step} of 4
            </span>
            <span>
              {step === 1 && 'Institution & Degree'}
              {step === 2 && 'Branch, Year & Semester'}
              {step === 3 && 'Choose Subject & Unit'}
              {step === 4 && 'Learning Level & Style'}
            </span>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-stone-400 hover:text-stone-600 font-medium transition"
              >
                Skip to demo
              </button>
            )}
          </div>

          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-900 rounded-full transition-all duration-400"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Institution & Degree */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Personalization Setup
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Where are you studying?
              </h2>
              <p className="text-xs text-stone-500">
                SyllabusOS calibrates its concept maps to match your institution&apos;s curriculum standard.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">
                  Select University or Technical Board:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Technical University Model (AICTE Aligned)',
                    'Delhi Technological University (DTU)',
                    'Visvesvaraya Technological University (VTU)',
                    'AKTU (Dr. A.P.J. Abdul Kalam Technical Univ)',
                    'Anna University (Tamil Nadu)',
                    'Other / Custom Institution'
                  ].map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setUniversity(uni)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition ${
                        university === uni
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>

                {university === 'Other / Custom Institution' && (
                  <input
                    type="text"
                    value={customUni}
                    onChange={(e) => setCustomUni(e.target.value)}
                    placeholder="Enter your college or university name..."
                    className="w-full mt-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-700 block">Degree Program:</label>
                <div className="flex flex-wrap gap-2">
                  {['B.Tech', 'B.E', 'B.Sc (Honors)', 'BCA / MCA'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDegree(d)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                        degree === d
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Branch, Year & Semester */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Academic Stage
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Select your Branch, Year &amp; Semester
              </h2>
              <p className="text-xs text-stone-500">
                This filters relevant subject modules so your study sessions match your actual term exams.
              </p>
            </div>

            <div className="space-y-4">
              {/* Branch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">Engineering Branch:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Computer Science & Engineering',
                    'Information Technology',
                    'Electronics & Communication (ECE)',
                    'Mechanical Engineering (ME)',
                    'Electrical Engineering (EE)',
                    'Common First Year (All Branches)'
                  ].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranch(b)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left transition ${
                        branch === b
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Academic Year:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setYear(y)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition ${
                          year === y
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Semester:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSemester(sem.replace('Sem ', 'Semester '))}
                        className={`p-2 rounded-xl text-xs font-bold text-center transition ${
                          semester === sem.replace('Sem ', 'Semester ')
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Subject & Unit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Curriculum Focus
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Which subject do you want to learn?
              </h2>
              <p className="text-xs text-stone-500">
                Pick an active subject to initialize your knowledge graph and diagnostic roadmap.
              </p>
            </div>

            <div className="space-y-3">
              {availableSubjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                        : 'bg-stone-50/80 border-stone-200 hover:bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {sub.code}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900">{sub.name}</h4>
                        {sub.curriculumData && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Full Deep MVP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">{sub.units[0]?.title} • {sub.branch}</p>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 border-stone-400">
                      {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Learning Level & Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Personalized Learning Style
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                How do you prefer to learn?
              </h2>
              <p className="text-xs text-stone-500">
                Our Gemini AI Teacher will adapt explanation depth and analogies based on your preferences.
              </p>
            </div>

            {/* Familiarity */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Current Familiarity with this Subject:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'beginner' as const, label: 'Beginner', desc: 'Missed classes, need intuitive stories and zero prior assumptions.' },
                  { id: 'intermediate' as const, label: 'Intermediate', desc: 'Know basic definitions, need formulas and exam derivations.' },
                  { id: 'advanced' as const, label: 'Advanced', desc: 'Looking for deep numericals and engineering applications.' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFamiliarity(f.id)}
                    className={`p-3.5 rounded-2xl border text-left space-y-1 transition ${
                      familiarity === f.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">{f.label}</span>
                    <p className={`text-[11px] leading-relaxed ${familiarity === f.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {f.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Style Toggles */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-stone-700 block">
                Learning Preferences (Optional):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'stories', label: 'Intuitive Everyday Analogies', desc: 'Explain physical concepts before math' },
                  { key: 'visuals', label: 'Interactive Wave & Circuit Diagrams', desc: 'Show animated visual representations' },
                  { key: 'workedExamples', label: 'Step-by-Step Worked Numericals', desc: 'Include university exam type problems' },
                  { key: 'conciseRevision', label: 'Concise Revision Bullet Points', desc: 'Quick formulas and summary tables' }
                ].map((pref) => {
                  const isChecked = preferences[pref.key as keyof typeof preferences];
                  return (
                    <label
                      key={pref.key}
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          [pref.key]: !isChecked
                        }))
                      }
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-3 transition ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-medium'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 accent-indigo-600"
                      />
                      <div>
                        <span className="font-bold">{pref.label}</span>
                        <p className="text-[11px] text-stone-500">{pref.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-stone-100">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-2 shadow-sm"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              Create My Personalized Study Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
