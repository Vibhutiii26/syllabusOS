'use client';

import React, { useState } from 'react';
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  SignOutButton
} from '@clerk/nextjs';
import {
  FIRST_YEAR_SUBJECTS,
  APPLIED_PHYSICS_SYLLABUS,
  saveOnboardingProfile
} from '@/lib/curricula-registry';

interface LandingPageProps {
  onStartPhysicsClass: (unitId?: string) => void;
  onOpenSyllabus: () => void;
  onOpenWorkspace: () => void;
}

export function LandingPage({
  onStartPhysicsClass,
  onOpenSyllabus,
  onOpenWorkspace
}: LandingPageProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const units = APPLIED_PHYSICS_SYLLABUS.units;
  const currentUnit = units[activeUnitIndex] || units[0];

  const handleLaunch = (unitId?: string) => {
    saveOnboardingProfile({
      university: 'State Technical University (AICTE Model)',
      degree: 'B.Tech',
      branch: 'Common First Year (All Branches)',
      year: '1st Year',
      semester: 'Semester 1',
      subjectId: 'btech-applied-physics-ph31001',
      unitId: unitId || currentUnit.id,
      familiarity: 'beginner',
      preferences: {
        stories: true,
        visuals: true,
        workedExamples: true,
        conciseRevision: false
      },
      completedAt: new Date().toISOString()
    });

    onStartPhysicsClass(unitId || currentUnit.id);
  };

  return (
    <div className="min-h-[100svh] bg-[#141517] text-[#eff0f1] font-sans antialiased selection:bg-[#ff4a1f] selection:text-[#141517]">
      {/* 1. Header Navigation Bar (Flat, solid, tone separation, zero-glass) */}
      <header className="bg-[#141517]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Wordmark */}
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold tracking-tight text-[#eff0f1]">
              SyllabusOS
            </span>
            <span className="text-sm text-[#9c9ea3] font-medium hidden sm:inline">
              PH31001(T) Applied Physics
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9c9ea3]">
            <a href="#classes" className="hover:text-[#eff0f1] transition-colors">
              Physics Units
            </a>
            <a href="#curriculum" className="hover:text-[#eff0f1] transition-colors">
              First-Year Roadmap
            </a>
            <a href="#books" className="hover:text-[#eff0f1] transition-colors">
              Prescribed Textbooks
            </a>
            <button
              onClick={onOpenSyllabus}
              className="hover:text-[#eff0f1] transition-colors cursor-pointer text-left"
            >
              Course Objectives
            </button>
          </nav>

          {/* Authentication Actions */}
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm text-[#9c9ea3] hidden sm:inline">
                  {user?.firstName || 'Student'}
                </span>
                <button
                  onClick={onOpenWorkspace}
                  className="px-5 py-2.5 bg-[#ff4a1f] text-[#141517] text-sm font-bold rounded-none hover:bg-[#e63d12] transition-colors cursor-pointer"
                >
                  Enter Classroom
                </button>
                <SignOutButton>
                  <button className="text-sm text-[#9c9ea3] hover:text-[#eff0f1] transition-colors cursor-pointer">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-[#eff0f1] hover:text-[#ff4a1f] transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="px-6 py-2.5 bg-[#ff4a1f] text-[#141517] text-sm font-bold rounded-none hover:bg-[#e63d12] transition-colors cursor-pointer">
                    Create Account
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Asymmetric, Architectural, Type-Led */}
      <section className="pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Heading & Claim */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[0.95] text-[#eff0f1]">
                University physics. Taught to your syllabus.
              </h1>

              <p className="text-lg sm:text-xl text-[#9c9ea3] leading-relaxed max-w-xl">
                An evidence-grounded study system built for B.Tech First Year (Session 2025–2026). Lasers, optical fibers, wave interference, and quantum mechanics with deterministic prerequisite gap analysis.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleLaunch()}
                  className="px-8 py-4 bg-[#ff4a1f] text-[#141517] text-sm font-bold rounded-none hover:bg-[#e63d12] transition-colors cursor-pointer"
                >
                  Start Physics Classes
                </button>

                <button
                  onClick={onOpenSyllabus}
                  className="px-6 py-4 bg-[#202226] text-[#eff0f1] text-sm font-semibold rounded-none hover:bg-[#2b2d32] transition-colors cursor-pointer"
                >
                  Inspect Course Code PH31001(T)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 bg-[#18191b] p-6">
                <div>
                  <span className="block text-2xl font-bold text-[#eff0f1]">5 Units</span>
                  <span className="text-xs text-[#9c9ea3]">Full Course Mapped</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-[#eff0f1]">4 Credits</span>
                  <span className="text-xs text-[#9c9ea3]">5 Hours / Week</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-[#eff0f1]">0 Blue</span>
                  <span className="text-xs text-[#9c9ea3]">Clean Architectural Spec</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Syllabus Navigator (Live Thing) */}
            <div id="classes" className="lg:col-span-5 bg-[#1c1e21] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-bold text-[#ff4a1f]">
                  Interactive Syllabus Navigator
                </span>
                <span className="text-xs text-[#9c9ea3]">Session 2025–26</span>
              </div>

              {/* Unit Selector Tabs */}
              <div className="flex flex-wrap gap-1 bg-[#141517] p-1.5">
                {units.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => setActiveUnitIndex(idx)}
                    className={`flex-1 min-w-[50px] py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                      activeUnitIndex === idx
                        ? 'bg-[#ff4a1f] text-[#141517]'
                        : 'text-[#9c9ea3] hover:text-[#eff0f1] hover:bg-[#202226]'
                    }`}
                  >
                    Unit {u.number}
                  </button>
                ))}
              </div>

              {/* Active Unit Description */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#9c9ea3] block">Unit {currentUnit.number}</span>
                  <h3 className="text-xl font-bold text-[#eff0f1] mt-0.5">
                    {currentUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')}
                  </h3>
                </div>

                <p className="text-sm text-[#9c9ea3] leading-relaxed">
                  {currentUnit.description}
                </p>

                <div className="space-y-2 pt-2 bg-[#18191b] p-4">
                  <span className="text-xs font-bold text-[#9c9ea3] block">
                    Prescribed Topics in Syllabus:
                  </span>
                  <ul className="text-xs text-[#eff0f1] space-y-1.5">
                    {currentUnit.subtopics.slice(0, 4).map((sub, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#ff4a1f] font-bold">—</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleLaunch(currentUnit.id)}
                  className="w-full py-3.5 bg-[#eff0f1] text-[#141517] text-sm font-bold rounded-none hover:bg-white transition-colors cursor-pointer mt-2"
                >
                  Enter Unit {currentUnit.number} Classroom
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. First-Year Subjects Section (Clean field in light bone-grey for editorial contrast) */}
      <section id="curriculum" className="py-24 bg-[#f4f3ef] text-[#141517]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-sm font-bold text-[#ff4a1f]">
              B.Tech First Year Curriculum
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#141517]">
              Semester subjects and availability.
            </h2>
            <p className="text-base text-[#4a4d52] leading-relaxed">
              Applied Physics is fully available with deep interactive lessons, diagnostic assessments, and notes uploader. Other core engineering subjects are mapped and entering development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIRST_YEAR_SUBJECTS.map((subject) => {
              const isAvailable = subject.status === 'available';

              return (
                <div
                  key={subject.id}
                  className={`p-8 flex flex-col justify-between space-y-6 ${
                    isAvailable
                      ? 'bg-white text-[#141517]'
                      : 'bg-[#eae8e1] text-[#333538]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#141517] px-2.5 py-1 bg-[#dedcd4]">
                        {subject.code}
                      </span>
                      {isAvailable ? (
                        <span className="text-xs font-bold bg-[#141517] text-[#eff0f1] px-2.5 py-1">
                          Active &amp; Ready
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#75777c]">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#141517]">{subject.name}</h3>
                      <p className="text-xs text-[#55585e] mt-1">
                        {subject.program} • {subject.credits} Credits • {subject.hours}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 bg-[#f4f3ef] p-3">
                      <span className="text-xs font-bold text-[#55585e] block">
                        Mapped Units:
                      </span>
                      <ul className="text-xs text-[#141517] space-y-1">
                        {subject.units.map((u) => (
                          <li key={u.id} className="line-clamp-1">
                            • {u.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    {isAvailable ? (
                      <button
                        onClick={() => handleLaunch()}
                        className="w-full py-3 bg-[#ff4a1f] text-[#141517] text-sm font-bold rounded-none hover:bg-[#e63d12] transition-colors cursor-pointer"
                      >
                        Open Physics Classes
                      </button>
                    ) : (
                      <div className="w-full py-3 bg-[#dedcd4] text-[#75777c] text-xs font-semibold text-center">
                        Syllabus Mapped · Releasing Soon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Course Learning Objectives & Official Books */}
      <section id="books" className="py-24 bg-[#18191b]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* CLOs */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-sm font-bold text-[#ff4a1f]">
                Course Learning Objectives
              </span>
              <h2 className="text-3xl font-extrabold text-[#eff0f1] tracking-tight">
                Six target capabilities for PH31001(T).
              </h2>
              <div className="space-y-3 pt-2">
                {APPLIED_PHYSICS_SYLLABUS.learningObjectives?.map((clo) => (
                  <div
                    key={clo.code}
                    className="p-4 bg-[#202226] flex items-start gap-3"
                  >
                    <span className="text-xs font-bold text-[#ff4a1f] shrink-0 pt-0.5">
                      {clo.code}
                    </span>
                    <p className="text-xs text-[#eff0f1] leading-relaxed font-medium">
                      {clo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescribed Textbooks */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-sm font-bold text-[#ff4a1f]">
                Prescribed Reading
              </span>
              <h2 className="text-3xl font-extrabold text-[#eff0f1] tracking-tight">
                Recommended university textbooks.
              </h2>
              <div className="space-y-3 pt-2">
                {APPLIED_PHYSICS_SYLLABUS.textbooks?.map((book, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#202226] space-y-1"
                  >
                    <span className="text-xs font-bold text-[#eff0f1] block">
                      {idx + 1}. {book.title}
                    </span>
                    <span className="text-xs text-[#9c9ea3] block">{book.authors}</span>
                    <span className="text-[11px] text-[#75777c] block">{book.publisher}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing Field (Statement & Action) */}
      <section className="py-24 bg-[#141517]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#eff0f1]">
            Start your physics classes now.
          </h2>
          <p className="text-base text-[#9c9ea3] max-w-xl mx-auto">
            Log in with Clerk to save your evidence scores and mastery history, or begin immediately in student exploration mode.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunch()}
              className="px-8 py-4 bg-[#ff4a1f] text-[#141517] text-sm font-bold rounded-none hover:bg-[#e63d12] transition-colors cursor-pointer"
            >
              Enter Applied Physics Classroom
            </button>
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-6 py-4 bg-[#202226] text-[#eff0f1] text-sm font-semibold rounded-none hover:bg-[#2b2d32] transition-colors cursor-pointer">
                  Sign In with Clerk
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* 6. Clean Minimal Footer */}
      <footer className="py-12 bg-[#0f1011]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6 text-xs text-[#75777c]">
          <div>
            <span className="font-bold text-[#eff0f1]">SyllabusOS</span> — Technical University Curriculum Platform (Session 2025–2026).
          </div>
          <div>
            Built with Next.js, Clerk Auth, Neon PostgreSQL &amp; Google Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}
