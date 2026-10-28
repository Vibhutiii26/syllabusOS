'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import {
  BookOpen,
  Sparkles,
  Compass,
  FileText,
  Presentation,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Layers,
  Cpu,
  Brain,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Star,
  Clock,
  Atom,
  Radio,
  Zap,
  Lock,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

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

  // Fast selector states on hero
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [selectedBranch, setSelectedBranch] = useState('Common First Year (All Branches)');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [selectedUnitId, setSelectedUnitId] = useState('unit-1-laser-fiber');

  const handleLaunchSession = (unitId?: string) => {
    saveOnboardingProfile({
      university: 'State Technical University (AICTE Model)',
      degree: 'B.Tech',
      branch: selectedBranch,
      year: selectedYear,
      semester: selectedSemester,
      subjectId: 'btech-applied-physics-ph31001',
      unitId: unitId || selectedUnitId,
      familiarity: 'beginner',
      preferences: {
        stories: true,
        visuals: true,
        workedExamples: true,
        conciseRevision: false
      },
      completedAt: new Date().toISOString()
    });

    onStartPhysicsClass(unitId || selectedUnitId);
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] text-stone-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. SaaS Navigation Bar with Clerk Login / Logout */}
      <header className="sticky top-0 z-40 bg-[#faf7f0]/85 backdrop-blur-md border-b border-[#e7e2d6] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-black shadow-sm">
              <span className="text-base text-indigo-400">S</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                SyllabusOS
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
                B.Tech 1st Year (Session 2025-2026)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-stone-600">
            <a href="#physics-classes" className="hover:text-stone-900 transition flex items-center gap-1">
              <Atom className="w-3.5 h-3.5 text-indigo-500" />
              Physics Classes
            </a>
            <a href="#first-year-subjects" className="hover:text-stone-900 transition flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-stone-400" />
              1st Year Subjects
            </a>
            <a
              href="#syllabus"
              onClick={(e) => {
                e.preventDefault();
                onOpenSyllabus();
              }}
              className="hover:text-stone-900 transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              Official Syllabus
            </a>
            <a href="#features" className="hover:text-stone-900 transition">
              How It Works
            </a>
          </nav>

          {/* Real Clerk Authentication Options (Login / Logout / Profile) */}
          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
                <UserButton afterSignOutUrl="/" />
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-bold text-stone-900 block leading-tight">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Signed In
                  </span>
                </div>
                <button
                  onClick={onOpenWorkspace}
                  className="ml-2 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition shadow-xs flex items-center gap-1.5"
                >
                  Physics Classroom
                  <ArrowRight className="w-3 h-3 text-indigo-300" />
                </button>
                <SignOutButton>
                  <button
                    title="Log out"
                    className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                    <UserPlus className="w-3.5 h-3.5 text-indigo-300" />
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Syllabus Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Session 2025-2026 • Course Code: PH31001(T) Applied Physics</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
            Master University Engineering Physics with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 block mt-1">
              Syllabus-Grounded AI Classes.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Step-by-step interactive lessons covering Lasers, Optical Fibers, Wave Interference, Quantum Mechanics, Nuclear Physics &amp; Solid State Physics with instant prerequisite gap diagnosis.
          </p>

          {/* Fast Session Creator Widget */}
          <div className="max-w-3xl mx-auto mt-6 bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-stone-200/90 shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Create Personalized Physics Study Session
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                AICTE Calibrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Year Select */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="1st Year">1st Year (Session 2025-26)</option>
                  <option value="2nd Year">2nd Year (Coming Soon)</option>
                  <option value="3rd Year">3rd Year (Coming Soon)</option>
                </select>
              </div>

              {/* Branch Select */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="Common First Year (All Branches)">Common First Year (All Branches)</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              {/* Semester Select */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Semester
                </label>
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

            {/* Launch Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selected Subject: <strong className="text-stone-900">PH31001(T) Applied Physics (T)</strong></span>
              </div>

              <button
                onClick={() => handleLaunchSession()}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
              >
                <span>Launch Physics Classes</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Physics Classes & Official Syllabus Breakdown */}
      <section id="physics-classes" className="py-16 bg-white border-y border-[#e7e2d6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-1">
                <Atom className="w-4 h-4" /> Ready to Study
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                PH31001(T) Applied Physics Classes
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Course Credits: 4 (L:3, T:0, P:2) • 5 Comprehensive Units with Interactive Simulations
              </p>
            </div>

            <button
              onClick={onOpenSyllabus}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              View Complete Syllabus &amp; Textbooks
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPLIED_PHYSICS_SYLLABUS.units.map((unit) => (
              <div
                key={unit.id}
                className="p-6 rounded-[28px] bg-[#faf7f0] border border-[#e7e2d6] hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      UNIT {unit.number}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Interactive Classes
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-600 transition">
                    {unit.title.replace(/^UNIT-[IVX]+:\s*/, '')}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Subtopic badges preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                      Key Topics Covered:
                    </span>
                    <ul className="text-[11px] text-stone-600 space-y-1">
                      {unit.subtopics.slice(0, 3).map((st, i) => (
                        <li key={i} className="flex items-center gap-1.5 line-clamp-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                          <span>{st}</span>
                        </li>
                      ))}
                      {unit.subtopics.length > 3 && (
                        <li className="text-[10px] text-stone-400 font-semibold pl-3">
                          + {unit.subtopics.length - 3} more topics in syllabus
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchSession(unit.id)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-stone-900 group-hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Start Unit {unit.number} Class</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. First Year Subjects Catalog (Physics Available + Others Coming Soon) */}
      <section id="first-year-subjects" className="py-16 bg-[#faf7f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              B.Tech 1st Year Subjects (Session 2025-2026)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Explore your full first-year academic syllabus. Applied Physics is fully live with classes and AI tutoring; remaining subjects are actively mapped and releasing soon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FIRST_YEAR_SUBJECTS.map((subject) => {
              const isAvailable = subject.status === 'available';
              return (
                <div
                  key={subject.id}
                  className={`p-6 rounded-[28px] border transition-all flex flex-col justify-between space-y-4 ${
                    isAvailable
                      ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-stone-50/70 border-stone-200/80 opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                          isAvailable
                            ? 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                            : 'text-stone-600 bg-stone-200'
                        }`}
                      >
                        {subject.code}
                      </span>
                      {isAvailable ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          READY NOW
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          COMING SOON
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-stone-900">{subject.name}</h4>
                      <p className="text-[11px] text-stone-400 font-medium">{subject.program} • {subject.semester}</p>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                        Units in Syllabus ({subject.units.length}):
                      </span>
                      <ul className="text-[11px] text-stone-600 space-y-1">
                        {subject.units.map((u) => (
                          <li key={u.id} className="flex items-center gap-1.5 line-clamp-1">
                            <span className="w-1 h-1 rounded-full bg-stone-400"></span>
                            <span>{u.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    {isAvailable ? (
                      <button
                        onClick={() => handleLaunchSession()}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>Start Physics Classes</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
                      </button>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl bg-stone-200/80 text-stone-500 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Curriculum Mapped • Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="features" className="py-16 bg-white border-t border-[#e7e2d6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Evidence-Driven Pedagogy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Why SyllabusOS is Different
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Every feature is built around the actual university student journey: from missing college lectures to mastering exam derivations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#faf7f0] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Syllabus-Grounded AI Teacher</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Powered by Gemini 3.8 Flash, our AI tutor references the exact course syllabus of PH31001(T) Applied Physics and never invents unverified formulas.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#faf7f0] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">PDF &amp; Lecture Notes Upload</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload your university teacher notes and lab manuals. Server-side PDF extraction parses sections and generates tailored revision guides.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#faf7f0] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Presentation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Real PowerPoint Presentation Export</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generate real, beautiful 16:9 `.pptx` presentation files for your seminars, viva, or revision using built-in presentation generators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Banner */}
      <footer className="bg-stone-900 text-white py-14 px-4 border-t border-stone-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to experience syllabus-aware physics learning?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Log in or sign up with Clerk to save your evidence scores and learning progress, or jump straight into the Physics classroom.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleLaunchSession()}
              className="px-7 py-3 rounded-full bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Open Applied Physics Classes</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            </button>

            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-6 py-3 rounded-full bg-stone-800 text-white text-xs font-bold hover:bg-stone-700 border border-stone-700 transition cursor-pointer">
                  Sign In with Clerk
                </button>
              </SignInButton>
            )}
          </div>

          <div className="pt-8 border-t border-stone-800 text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 SyllabusOS. Built for B.Tech 1st Year Engineering Students.</span>
            <span>PH31001(T) Applied Physics • Clerk Auth • Neon Postgres • Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
