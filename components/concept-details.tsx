'use client';

import React from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState } from '@/types/learning';
import { InteractiveDiagram } from './interactive-diagrams';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CircleDot,
  X
} from 'lucide-react';

interface ConceptDetailsProps {
  conceptId: string;
  learnerState: LearnerState;
  onClose?: () => void;
  onOpenLesson: (conceptId: string) => void;
  onSelectRelated: (conceptId: string) => void;
}

export function ConceptDetails({
  conceptId,
  learnerState,
  onClose,
  onOpenLesson,
  onSelectRelated
}: ConceptDetailsProps) {
  const concept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === conceptId);
  if (!concept) return null;

  const mastery = learnerState.mastery[conceptId] || {
    status: 'not_assessed',
    evidenceScore: 0,
    questionsAttempted: 0,
    questionsCorrect: 0
  };

  const statusBadge = {
    not_assessed: {
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      label: 'Not Assessed',
      icon: <Clock className="w-3.5 h-3.5 text-stone-400" />
    },
    needs_review: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Needs Review',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
    },
    developing: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      label: 'Developing',
      icon: <CircleDot className="w-3.5 h-3.5 text-indigo-500" />
    },
    demonstrated: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Demonstrated',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
    }
  }[mastery.status];

  return (
    <div className="bg-white rounded-[28px] border border-[#e7e2d6] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
              {statusBadge.icon}
              {statusBadge.label} ({mastery.evidenceScore}%)
            </span>
            <span className="text-xs text-stone-400 font-medium">{concept.unitTitle}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">{concept.title}</h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Short Summary & Objective */}
      <div className="space-y-2 text-xs leading-relaxed text-stone-600 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
        <p className="font-medium text-stone-800">{concept.shortSummary}</p>
        <p className="text-stone-500">
          <strong>Syllabus Objective:</strong> {concept.learningObjective}
        </p>
      </div>

      {/* Interactive Diagram Preview */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          Visual Diagram Model
        </span>
        <InteractiveDiagram diagramKey={concept.diagramKey} />
      </div>

      {/* Story Hook Preview */}
      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-1.5">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Intuitive Analogy Hook
        </span>
        <p className="text-xs text-stone-700 italic">&quot;{concept.storyAnalogy.hook}&quot;</p>
        <p className="text-xs text-stone-600 line-clamp-2">{concept.storyAnalogy.analogy}</p>
      </div>

      {/* Relations & Prerequisites */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5" />
          Syllabus Concept Graph Connections
        </span>
        <div className="flex flex-wrap gap-2">
          {concept.relations.map((rel) => {
            const relConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === rel.targetId);
            if (!relConcept) return null;
            return (
              <button
                key={rel.targetId}
                onClick={() => onSelectRelated(rel.targetId)}
                className="px-3 py-1.5 rounded-xl text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition text-left"
              >
                <span className="font-semibold">{relConcept.title}</span>
                <span className="text-[10px] text-stone-400 block">
                  {rel.type.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Open Full Lesson Button */}
      <div className="pt-2">
        <button
          onClick={() => onOpenLesson(concept.id)}
          className="w-full py-3 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <BookOpen className="w-4 h-4" />
          Launch Story-Driven Lesson
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
