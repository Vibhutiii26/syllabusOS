'use client';

import React from 'react';
import Link from 'next/link';
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
  Star
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#faf7f0] text-stone-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. SaaS Navigation Bar */}
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
                Personalized AI Learning Platform
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-stone-600">
            <a href="#features" className="hover:text-stone-900 transition">Features</a>
            <a href="#how-it-works" className="hover:text-stone-900 transition">How It Works</a>
            <a href="#curricula" className="hover:text-stone-900 transition">Supported Subjects</a>
            <a href="#graph" className="hover:text-stone-900 transition">Knowledge Graph</a>
          </nav>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AICTE Aligned • Evidence-Driven University Learning</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
            Missed a class? Lost your notes?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 block mt-1">
              Pick up right where you need.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            SyllabusOS doesn&apos;t just spit out generic answers. It connects your actual university syllabus, diagnoses missing foundational prerequisites, and adapts step-by-step to how you learn.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-full bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 transition shadow-lg flex items-center gap-2.5"
            >
              Start Free Learning Path
              <ArrowRight className="w-4 h-4 text-indigo-300" />
            </button>

            <a
              href="#how-it-works"
              className="px-6 py-4 rounded-full bg-white text-stone-800 border border-stone-300/80 text-sm font-bold hover:bg-stone-50 transition shadow-xs"
            >
              Explore How It Works
            </a>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real Syllabus Prerequisite Graph
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PDF Lecture Notes Extractor
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant PowerPoint (.pptx) Export
            </span>
          </div>
        </div>

        {/* Hero Interactive Preview Card (MacBook Canvas Frame) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
          <div className="bg-[#fbf9f4] rounded-[36px] border border-[#e4decb] shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-[28px] border border-stone-200/80 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Preview 1: Prerequisite Detective */}
              <div className="p-5 rounded-2xl bg-[#fef3c7] border border-[#fde68a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-900">Foundational Gap Detective</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Struggling with Young&apos;s Double-Slit?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The application diagnoses whether your gap is in <strong>Wave Superposition</strong> or <strong>Phase Difference</strong>, repairs it with an everyday story analogy, then guides you back.
                </p>
                <div className="text-[11px] font-bold text-amber-800 pt-1 flex items-center gap-1">
                  Verified with Deterministic Math <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Preview 2: Dynamic Knowledge Graph */}
              <div className="p-5 rounded-2xl bg-[#fce7f3] border border-[#fbcfe8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-pink-900">Curriculum Topology</span>
                  <Compass className="w-4 h-4 text-pink-600" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Personal Concept Graph
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Interactive Directed Acyclic Graph (DAG) visualizing 10 connected concepts, prerequisite pathways, and real-time mastery badges: <em>Not Assessed</em>, <em>Needs Review</em>, <em>Demonstrated</em>.
                </p>
                <div className="text-[11px] font-bold text-pink-800 pt-1 flex items-center gap-1">
                  Powered by @xyflow/react <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Preview 3: Study Materials & PPTX Export */}
              <div className="p-5 rounded-2xl bg-[#dbeafe] border border-[#bfdbfe] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-blue-900">Study Generation</span>
                  <Presentation className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Real .PPTX &amp; Revision Notes
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Generate professional, downloadable PowerPoint slide decks, interactive flashcards, and step-by-step derivations directly from your syllabus or uploaded PDFs.
                </p>
                <div className="text-[11px] font-bold text-blue-800 pt-1 flex items-center gap-1">
                  Actual Downloadable Files <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-white border-y border-[#e7e2d6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Complete Learning OS
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Built for University Engineering Students
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Every feature is built around the actual student journey: from missing college notes to mastering exam derivations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Syllabus-Grounded AI Teacher</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Powered by Gemini 3.8 Flash, our tutor references your exact subject code and university syllabus. It never hallucinates non-existent formulas or unsupported topics.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">PDF &amp; Lecture Notes Upload</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload your university syllabus, teacher PDFs, and handwritten lecture notes. Server-side text parsing breaks them into searchable, grounded study modules.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Presentation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Real PowerPoint Presentation Export</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generate real, beautiful `.pptx` presentations using `pptxgenjs` with learning outcomes, derivations, and summaries tailored to your seminar or viva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Multi-Subject Catalog Section */}
      <section id="curricula" className="py-20 bg-[#faf7f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Comprehensive Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Supported University Subjects
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Select your academic year and branch to explore pre-calibrated curricula or upload custom notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: 'PHY-101', name: 'Engineering Physics', desc: 'Waves & Optics, Quantum Mechanics, Lasers & Fiber Optics', badge: 'Live Deep MVP' },
              { code: 'CS-201', name: 'Data Structures & Algorithms', desc: 'Linear structures, BSTs, AVL, Heaps, Graph traversal, DP', badge: 'Available' },
              { code: 'MAT-101', name: 'Engineering Mathematics I', desc: 'Calculus, Taylor series, Linear algebra, Eigenvalues', badge: 'Available' },
              { code: 'EC-202', name: 'Digital Logic & Design', desc: 'Boolean algebra, K-Maps, Combinational & Sequential circuits', badge: 'Available' },
              { code: 'CS-301', name: 'Operating Systems', desc: 'Process scheduling, Concurrency, Virtual memory, Paging', badge: 'Available' },
              { code: 'PDF-EXT', name: 'Upload Your Custom Subject', desc: 'Upload any teacher syllabus or lecture notes PDF to build custom paths', badge: 'Custom' }
            ].map((sub, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-indigo-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {sub.code}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {sub.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{sub.name}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Footer Banner */}
      <footer className="bg-stone-900 text-white py-16 px-4 border-t border-stone-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience syllabus-aware learning?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Sign up in 30 seconds with Clerk. Pick your university, semester, and subject, and start with an evidence-calibrated personal path.
          </p>

          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-full bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition shadow-lg"
            >
              Get Started with Clerk
            </button>
          </div>

          <div className="pt-8 border-t border-stone-800 text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 SyllabusOS. Built for University Engineering Students.</span>
            <span>Clerk Auth • Neon Postgres • Gemini 3.8 Flash • @xyflow/react</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
