'use client';

import { useEffect, useState } from 'react';
import { Check, Circle, Play, RotateCcw } from 'lucide-react';
import type { UnitDetail } from '@/lib/curricula-registry';

export function UnitStudySession({ unit }: { unit: UnitDetail }) {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const storageKey = `syllabus_os_unit_progress_v1:${unit.id}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]') as string[];
      queueMicrotask(() => setCompletedTopics(saved));
    } catch {
      queueMicrotask(() => setCompletedTopics([]));
    }
  }, [storageKey]);

  const toggleComplete = (topic: string) => {
    setCompletedTopics((previous) => {
      const next = previous.includes(topic) ? previous.filter((item) => item !== topic) : [...previous, topic];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const selected = unit.subtopics[selectedTopic];
  const isComplete = selected ? completedTopics.includes(selected) : false;

  return (
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <header className="border-b border-stone-200 bg-stone-50 px-6 py-6 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-700">Unit {unit.number} · Guided study</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-stone-900">{unit.title.replace(/^UNIT-[IVX]+:\s*/, '')}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">{unit.description}</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200" aria-label={`${completedTopics.length} of ${unit.subtopics.length} topics complete`}>
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${unit.subtopics.length ? Math.min(100, completedTopics.length / unit.subtopics.length * 100) : 0}%` }} />
          </div>
          <span className="whitespace-nowrap text-xs font-semibold text-stone-500">{completedTopics.length}/{unit.subtopics.length} explored</span>
        </div>
      </header>

      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(240px,0.85fr)]">
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Choose a syllabus topic</h2>
            <button onClick={() => { setCompletedTopics([]); localStorage.removeItem(storageKey); }} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-800" title="Reset topic progress">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
          <ol className="space-y-2">
            {unit.subtopics.map((topic, index) => {
              const complete = completedTopics.includes(topic);
              const active = selectedTopic === index;
              return (
                <li key={topic}>
                  <button onClick={() => setSelectedTopic(index)} aria-current={active ? 'step' : undefined} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? 'border-indigo-300 bg-indigo-50 text-indigo-950' : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'}`}>
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${complete ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-500'}`}>{complete ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
                    <span className="text-sm leading-snug">{topic}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="border-t border-stone-200 bg-[#faf8f3] p-6 sm:p-7 md:border-l md:border-t-0">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Now studying</span>
          <h2 className="mt-3 text-lg font-bold leading-snug text-stone-900">{selected}</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">Work through this syllabus point, connect its definitions and equations to the surrounding unit, then mark it explored to keep your place.</p>
          <button onClick={() => selected && toggleComplete(selected)} className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${isComplete ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-stone-900 text-white hover:bg-indigo-700'}`}>
            {isComplete ? <><Check className="h-4 w-4" /> Mark for review</> : <><Play className="h-4 w-4" /> Mark topic explored</>}
          </button>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-stone-500"><Circle className="mt-0.5 h-3 w-3 shrink-0" />Your topic progress is saved on this device.</p>
        </aside>
      </div>
    </section>
  );
}
