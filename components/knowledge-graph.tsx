'use client';

import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Node,
  Edge,
  MarkerType,
  NodeProps,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState, MasteryStatus } from '@/types/learning';
import { CheckCircle2, AlertTriangle, Clock, CircleDot, ArrowRight, BookOpen } from 'lucide-react';

interface ConceptNodeData {
  id: string;
  title: string;
  summary: string;
  status: MasteryStatus;
  evidenceScore: number;
  unitTitle: string;
  onSelect: (conceptId: string) => void;
  onOpenLesson: (conceptId: string) => void;
}

// Custom Node component matching the creamy Apple/MacBook aesthetic
function CustomConceptNode({ data }: NodeProps<Node<ConceptNodeData>>) {
  const { id, title, summary, status, evidenceScore, onSelect, onOpenLesson } = data;

  // Status-specific badges & color stylings
  const statusConfig = {
    not_assessed: {
      badgeBg: 'bg-stone-100 text-stone-600 border-stone-200',
      label: 'Not Assessed',
      icon: <Clock className="w-3.5 h-3.5 text-stone-400" />,
      border: 'border-stone-200 hover:border-stone-400',
      accentBar: 'bg-stone-300'
    },
    needs_review: {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Needs Review',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />,
      border: 'border-rose-300 ring-2 ring-rose-100 hover:border-rose-400',
      accentBar: 'bg-rose-500'
    },
    developing: {
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      label: 'Developing',
      icon: <CircleDot className="w-3.5 h-3.5 text-indigo-500" />,
      border: 'border-indigo-300 ring-2 ring-indigo-100 hover:border-indigo-400',
      accentBar: 'bg-indigo-500'
    },
    demonstrated: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Demonstrated',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      border: 'border-emerald-300 ring-2 ring-emerald-100 hover:border-emerald-400',
      accentBar: 'bg-emerald-500'
    }
  }[status];

  return (
    <div
      onClick={() => onSelect(id)}
      className={`group w-64 bg-white/95 backdrop-blur-sm rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border ${statusConfig.border}`}
    >
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-stone-400 !border-2 !border-white" />
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig.badgeBg}`}>
          {statusConfig.icon}
          {statusConfig.label}
        </span>
        <span className="text-[11px] font-bold text-stone-500">{evidenceScore}%</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-stone-900 group-hover:text-indigo-600 transition leading-snug line-clamp-1 mb-1">
        {title}
      </h3>

      {/* Short Summary */}
      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
        {summary}
      </p>

      {/* Progress Bar & Jump Button */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusConfig.accentBar}`}
            style={{ width: `${Math.max(8, evidenceScore)}%` }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLesson(id);
          }}
          className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-indigo-600 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-full transition"
        >
          <BookOpen className="w-3 h-3" />
          Lesson
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-indigo-500 !border-2 !border-white" />
    </div>
  );
}

const nodeTypes = {
  conceptNode: CustomConceptNode
};

interface KnowledgeGraphProps {
  learnerState: LearnerState;
  onSelectConcept: (conceptId: string) => void;
  onOpenLesson: (conceptId: string) => void;
}

export function KnowledgeGraph({ learnerState, onSelectConcept, onOpenLesson }: KnowledgeGraphProps) {
  // Define layout positions for the 10 concepts in a logical hierarchical DAG flow
  const initialNodes: Node<ConceptNodeData>[] = useMemo(() => {
    // Organized in 4 tiers:
    // Tier 1: Fundamentals & Parameters
    // Tier 2: Superposition & Phase difference
    // Tier 3: Constructive, Destructive & Sustained interference
    // Tier 4: Young's Double Slit, Fringe Width & Engineering Applications
    const coordinates: Record<string, { x: number; y: number }> = {
      'wave-fundamentals': { x: 50, y: 30 },
      'wave-parameters': { x: 380, y: 30 },
      'superposition': { x: 120, y: 190 },
      'phase-path-difference': { x: 440, y: 190 },
      'constructive-interference': { x: 40, y: 360 },
      'destructive-interference': { x: 300, y: 360 },
      'sustained-interference': { x: 580, y: 360 },
      'young-double-slit': { x: 160, y: 530 },
      'fringe-width': { x: 460, y: 530 },
      'interference-applications': { x: 310, y: 700 }
    };

    return SAMPLE_CURRICULUM.concepts.map((concept) => {
      const pos = coordinates[concept.id] || { x: 200, y: 200 };
      const mastery = learnerState.mastery[concept.id] || {
        status: 'not_assessed',
        evidenceScore: 0
      };

      return {
        id: concept.id,
        type: 'conceptNode',
        position: pos,
        data: {
          id: concept.id,
          title: concept.title,
          summary: concept.shortSummary,
          status: mastery.status,
          evidenceScore: mastery.evidenceScore,
          unitTitle: concept.unitTitle,
          onSelect: onSelectConcept,
          onOpenLesson: onOpenLesson
        }
      };
    });
  }, [learnerState, onSelectConcept, onOpenLesson]);

  // Edges represent direct prerequisite relationships in the curriculum
  const initialEdges: Edge[] = useMemo(() => {
    const edgesList: Edge[] = [];

    SAMPLE_CURRICULUM.concepts.forEach((concept) => {
      concept.relations.forEach((rel) => {
        // Only draw directed edges for prerequisite or part_of to maintain clean graph
        if (rel.type === 'prerequisite_of') {
          edgesList.push({
            id: `edge-${concept.id}-${rel.targetId}`,
            source: concept.id,
            target: rel.targetId,
            animated: learnerState.mastery[concept.id]?.status === 'demonstrated',
            style: {
              stroke: learnerState.mastery[concept.id]?.status === 'demonstrated' ? '#4f46e5' : '#a8a29e',
              strokeWidth: 2.5
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: learnerState.mastery[concept.id]?.status === 'demonstrated' ? '#4f46e5' : '#a8a29e',
              width: 16,
              height: 16
            }
          });
        }
      });
    });

    return edgesList;
  }, [learnerState]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync node data whenever learner state changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="relative w-full h-[700px] bg-[#faf7f0] rounded-[28px] border border-[#e7e2d6] overflow-hidden shadow-sm">
      {/* Top Bar with Legend and Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase">Curriculum Knowledge Graph</h3>
          <p className="text-[11px] text-stone-500">Interactive prerequisite network for B.Tech Waves &amp; Wave Optics</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span> Not Assessed
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Needs Review
          </span>
          <span className="flex items-center gap-1.5 font-medium text-indigo-700">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Developing
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Demonstrated
          </span>
        </div>
      </div>

      {/* Graph Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d6cfbe" gap={20} size={1} />
        <Controls className="!bg-white !border-stone-200" position="bottom-right" />
      </ReactFlow>

      {/* Floating Instructions Pill */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2 shadow-xs">
        <span>💡 Click any node to inspect details; click <strong>Lesson</strong> to open full explanation.</span>
      </div>
    </div>
  );
}
