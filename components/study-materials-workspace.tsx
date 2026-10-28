'use client';

import React, { useState } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import type { UnitDetail } from '@/lib/curricula-registry';
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
  activeUnit: UnitDetail;
  activeUnitId: string;
}

export function StudyMaterialsWorkspace({
  initialTab = 'presentation',
  uploadedDocs = [],
  onOpenLesson,
  activeUnit,
  activeUnitId
}: StudyMaterialsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'presentation' | 'notes' | 'flashcards' | 'visuals'>(initialTab);

  // Presentation State
  const unitConcepts = SAMPLE_CURRICULUM.concepts.filter((concept) => concept.unitId === activeUnitId);
  const [pptTitle, setPptTitle] = useState(`${activeUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')} — Study Guide`);
  const [pptTopic, setPptTopic] = useState(activeUnit.subtopics[0] || activeUnit.title);
  const [pptSlideCount, setPptSlideCount] = useState(6);
  const [isGeneratingPpt, setIsGeneratingPpt] = useState(false);
  const [pptSuccess, setPptSuccess] = useState(false);

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Visuals State
  const [selectedDiagramKey, setSelectedDiagramKey] = useState('superposition');

  // Flashcards bank
  const flashcards = unitConcepts.length ? unitConcepts.flatMap((concept) => [
    { q: `What is ${concept.title}?`, a: `${concept.shortSummary}\n\n${concept.learningObjective}` },
    ...(concept.formula ? [{ q: `What equation describes ${concept.title}?`, a: `${concept.formula.latex}\n\n${concept.formula.explanation}\n\n${concept.formula.variables.map((variable) => `${variable.symbol}: ${variable.name}${variable.unit ? ` (${variable.unit})` : ''}`).join('\n')}` }] : [])
  ]) : activeUnit.subtopics.map((topic) => ({ q: `Explain: ${topic}`, a: `${activeUnit.description}\n\nThis topic belongs to Unit ${activeUnit.number}: ${activeUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')}. Use the official syllabus list as your scope and review the topic with your course notes.` }));
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
          sections: uploadedDocs[0]?.sections || [],
          unitTitle: activeUnit.title,
          unitDescription: activeUnit.description,
          syllabusTopics: activeUnit.subtopics,
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
            Generate materials scoped to Unit {activeUnit.number}: {activeUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')}.
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
                {activeUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')} — Revision Notes
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

          <div className="space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p className="rounded-2xl border border-stone-200 bg-stone-50 p-4">{activeUnit.description}</p>
            <ol className="space-y-2">{activeUnit.subtopics.map((topic, index) => {
              const concept = unitConcepts.find((item) => item.title.toLowerCase().includes(topic.split(/[(:]/)[0].toLowerCase()) || topic.toLowerCase().includes(item.title.toLowerCase().split(':')[0]));
              return <li key={topic} className="rounded-xl border border-stone-200 p-4"><h4 className="font-bold text-stone-900">{index + 1}. {topic}</h4>{concept && <><p className="mt-2">{concept.shortSummary}</p>{concept.formula && <p className="mt-2 rounded-lg bg-indigo-50 p-2 font-mono text-indigo-900">{concept.formula.latex} — {concept.formula.explanation}</p>}</>}</li>;
            })}</ol>
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
                Unit {activeUnit.number}: {activeUnit.title.replace(/^UNIT-[IVX]+:\s*/, '')}
              </h3>
            </div>

            {/* Model Selector */}
            <select
              value={selectedDiagramKey}
              onChange={(e) => setSelectedDiagramKey(e.target.value)}
              className="px-4 py-2 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from(new Set(unitConcepts.map((concept) => concept.diagramKey))).map((key) => <option key={key} value={key}>{unitConcepts.find((concept) => concept.diagramKey === key)?.title || key}</option>)}
            </select>
          </div>

          <div className="pt-2">
            {unitConcepts.length ? <InteractiveDiagram diagramKey={selectedDiagramKey} /> : <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-600">Interactive diagrams are not authored for Unit {activeUnit.number} yet. The diagram area is intentionally scoped to this unit so it will not show an unrelated Unit 2 wave model.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
