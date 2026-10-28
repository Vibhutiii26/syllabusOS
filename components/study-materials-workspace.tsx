'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { InteractiveDiagram } from './interactive-diagrams';
import { UploadedDoc } from './materials-uploader';
import {
  Presentation,
  BookOpen,
  Sparkles,
  HelpCircle,
  Download,
  Eye,
  Check,
  RotateCw,
  FileText,
  Sliders,
  Layers,
  Printer,
  ChevronRight,
  Calculator,
  ArrowRight
} from 'lucide-react';

interface StudyMaterialsWorkspaceProps {
  initialTab?: 'presentation' | 'notes' | 'flashcards' | 'visuals';
  uploadedDocs?: UploadedDoc[];
  onOpenLesson: (conceptId: string) => void;
}

export function StudyMaterialsWorkspace({
  initialTab = 'presentation',
  uploadedDocs = [],
  onOpenLesson
}: StudyMaterialsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'presentation' | 'notes' | 'flashcards' | 'visuals'>(initialTab);

  // Presentation State
  const [pptTitle, setPptTitle] = useState('Wave Optics & Interference Phenomena');
  const [pptTopic, setPptTopic] = useState('Young Double Slit & Thin Films');
  const [pptSlideCount, setPptSlideCount] = useState(6);
  const [isGeneratingPpt, setIsGeneratingPpt] = useState(false);
  const [pptSuccess, setPptSuccess] = useState(false);

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Visuals State
  const [selectedDiagramKey, setSelectedDiagramKey] = useState('superposition');

  // Flashcards bank
  const flashcards = [
    {
      q: 'What is the Principle of Superposition?',
      a: 'When two or more waves overlap in a linear medium, the resultant displacement is the algebraic sum of individual displacements: y = y₁ + y₂.'
    },
    {
      q: 'Condition for Constructive Interference?',
      a: 'Path difference must be an integer multiple of wavelength: Δx = nλ. Phase difference Δφ = 2nπ. Peak intensity quadruples to 4I₀.'
    },
    {
      q: 'Condition for Destructive Interference?',
      a: 'Path difference must be an odd multiple of half-wavelengths: Δx = (2n + 1)λ / 2. Phase difference Δφ = (2n + 1)π. Intensity drops to zero for equal amplitudes.'
    },
    {
      q: 'What is the formula for Fringe Width (β)?',
      a: 'β = (λ · D) / d. Directly proportional to wavelength λ and screen distance D, inversely proportional to slit distance d.'
    },
    {
      q: 'What is the minimum thickness for an anti-reflective coating?',
      a: 't = λ / (4μ), where μ is the refractive index of the thin film material (quarter-wave layer).'
    }
  ];

  const handleGeneratePpt = async () => {
    setIsGeneratingPpt(true);
    setPptSuccess(false);

    try {
      const res = await fetch('/api/materials/presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pptTitle,
          topic: pptTopic,
          subjectName: SAMPLE_CURRICULUM.subjectName,
          slideCount: pptSlideCount,
          sections: uploadedDocs[0]?.sections || []
        })
      });

      if (!res.ok) throw new Error('PPT generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pptTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setPptSuccess(true);
    } catch (err) {
      console.error('Failed to generate presentation:', err);
      alert('Could not generate PPTX file. Please try again.');
    } finally {
      setIsGeneratingPpt(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            SyllabusOS Creator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Create Study Materials
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Generate presentation decks, revision notes, interactive flashcards, and scientific diagrams.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-200/80 p-1 rounded-full text-xs font-bold max-w-xl">
        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'presentation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Presentation className="w-3.5 h-3.5 text-blue-600" />
          PowerPoint (.pptx)
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'notes' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          Revision Notes
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'flashcards' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Flashcards
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'visuals' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          Visual Diagrams
        </button>
      </div>

      {/* TAB 1: Presentation Generator */}
      {activeTab === 'presentation' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Real PPTX File Generator
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Generate Professional Slide Deck
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">16:9 HD Layout • pptxgenjs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Presentation Title:</label>
              <input
                type="text"
                value={pptTitle}
                onChange={(e) => setPptTitle(e.target.value)}
                className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Topic Focus:</label>
              <input
                type="text"
                value={pptTopic}
                onChange={(e) => setPptTopic(e.target.value)}
                className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Slide Outline Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
              Included Slide Deck Outline (6 Slides):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { num: '1', title: 'Title & University Affiliation', desc: 'Dark theme hero slide' },
                { num: '2', title: 'Learning Objectives & Outcomes', desc: '4 key educational targets' },
                { num: '3', title: 'Theoretical Principles & Physics', desc: 'Grounded in syllabus excerpt' },
                { num: '4', title: 'Mathematical Equations & Units', desc: 'Path/phase relations, fringe width' },
                { num: '5', title: 'Engineering Applications', desc: 'Anti-reflective thin films, LIGO' },
                { num: '6', title: 'Summary & Exam Takeaways', desc: 'Core review points' }
              ].map((s) => (
                <div key={s.num} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 font-bold text-[10px] flex items-center justify-center">
                      {s.num}
                    </span>
                    <strong className="text-stone-800">{s.title}</strong>
                  </div>
                  <p className="text-stone-500 text-[11px] pl-7">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Files are generated locally with full typography and ready to open in Microsoft PowerPoint, Keynote, or Google Slides.
            </span>

            <button
              disabled={isGeneratingPpt}
              onClick={handleGeneratePpt}
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 disabled:opacity-40 transition flex items-center gap-2 shadow-sm"
            >
              {isGeneratingPpt ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Generating .pptx file...
                </>
              ) : pptSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Downloaded Presentation!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate &amp; Download Presentation (.pptx)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Revision Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Exam Quick-Revision Cheat Sheet
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Engineering Physics — Waves and Optics Notes
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm">1. Essential Equations Reference:</h4>
              <ul className="space-y-1 font-mono text-xs text-indigo-900 bg-white p-3 rounded-xl border border-stone-200">
                <li>• Wave Speed: v = f · λ = ω / k</li>
                <li>• Phase Difference: Δφ = (2π / λ) · Δx</li>
                <li>• Constructive Condition: Δx = nλ,  Δφ = 2nπ,  I_max = 4I₀</li>
                <li>• Destructive Condition: Δx = (2n + 1)λ / 2,  Δφ = (2n + 1)π,  I_min = 0</li>
                <li>• YDSE Fringe Width: β = (λ · D) / d</li>
                <li>• In Medium: β_medium = β_air / μ</li>
                <li>• Anti-Reflective Thickness: t = λ / (4μ)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 text-sm">2. Core Conceptual Takeaways:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-stone-900">Coherence Requirement</span>
                  <p className="text-xs text-stone-500">Sources must maintain a time-invariant phase difference (d(Δφ)/dt = 0). Independent bulbs fail due to random 10⁻¹⁰s phase jumps.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-stone-900">Energy Conservation</span>
                  <p className="text-xs text-stone-500">Interference does not destroy light; energy is spatially redistributed from dark zones (0) into bright zones (4I₀), keeping average intensity at 2I₀.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Active Recall Deck
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Physics Concept Flashcards
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-bold">
              Card {cardIndex + 1} of {flashcards.length}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-64 rounded-3xl p-8 border cursor-pointer transition-all duration-300 flex flex-col justify-between text-center select-none shadow-sm hover:shadow-md bg-[#faf7f0] border-[#e7e2d6]"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {isFlipped ? 'Answer & Explanation (Click to flip)' : 'Question Prompt (Click to reveal answer)'}
            </div>

            <div className="my-auto px-4">
              <h4 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {isFlipped ? flashcards[cardIndex].a : flashcards[cardIndex].q}
              </h4>
            </div>

            <div className="text-[11px] text-stone-400 font-medium">
              💡 Tap anywhere to flip
            </div>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              Next Card
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Visual Diagrams */}
      {activeTab === 'visuals' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Interactive Scientific Visualizer
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Wave Mechanics &amp; Optical Diagrams
              </h3>
            </div>

            {/* Model Selector */}
            <select
              value={selectedDiagramKey}
              onChange={(e) => setSelectedDiagramKey(e.target.value)}
              className="px-4 py-2 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="superposition">Wave Superposition (Constructive / Destructive)</option>
              <option value="wave-parameters">Amplitude, Wavelength &amp; Phase</option>
              <option value="phase-path">Phase Difference vs Path Difference</option>
              <option value="young-double-slit">Young&apos;s Double Slit Apparatus</option>
              <option value="fringe-width">Fringe Width Scaling in Medium</option>
              <option value="interference-applications">Anti-Reflective Thin Film Coating</option>
            </select>
          </div>

          <div className="pt-2">
            <InteractiveDiagram diagramKey={selectedDiagramKey} />
          </div>
        </div>
      )}
    </div>
  );
}
