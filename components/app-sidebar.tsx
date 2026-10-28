'use client';

import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Compass,
  Bot,
  BarChart3,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';

interface AppSidebarProps {
  activeTab: 'learning' | 'syllabus' | 'graph' | 'tutor' | 'progress';
  onTabChange: (tab: 'learning' | 'syllabus' | 'graph' | 'tutor' | 'progress') => void;
  onOpenDiagnostic: () => void;
  onResetProgress: () => void;
  demonstratedCount: number;
  totalConcepts: number;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  onOpenDiagnostic,
  onResetProgress,
  demonstratedCount,
  totalConcepts
}: AppSidebarProps) {
  const navItems = [
    {
      id: 'learning' as const,
      label: 'My Learning',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Active'
    },
    {
      id: 'syllabus' as const,
      label: 'My Syllabus',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'graph' as const,
      label: 'Knowledge Graph',
      icon: <Compass className="w-4 h-4" />,
      badge: 'Interactive'
    },
    {
      id: 'tutor' as const,
      label: 'AI Teacher',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Gemini'
    },
    {
      id: 'progress' as const,
      label: 'Progress',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#141416] text-white md:rounded-[32px] p-5 flex flex-col justify-between shrink-0 shadow-xl border border-stone-800">
      {/* Top Branding */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center font-black text-white shadow-md">
            <span className="text-sm tracking-tighter">S</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              SyllabusOS
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h1>
            <p className="text-[10px] text-stone-400 font-medium">B.Tech Physics Edition</p>
          </div>
        </div>

        {/* Current Subject Badge */}
        <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            <span>Subject</span>
            <span className="text-emerald-400">PHY-101</span>
          </div>
          <p className="text-xs font-bold text-white line-clamp-1">{SAMPLE_CURRICULUM.subjectName}</p>
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <span>Unit 1: Optics</span>
            <span className="font-semibold text-stone-300">
              {demonstratedCount}/{totalConcepts} Done
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-3 mb-1 block">
            Navigation
          </span>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-stone-800/80">
        <button
          onClick={onOpenDiagnostic}
          className="w-full py-2.5 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          Diagnostic Quiz
        </button>

        <button
          onClick={onResetProgress}
          className="w-full py-2 px-3 rounded-2xl text-[11px] text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo State
        </button>

        <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-stone-500">
          <span>SyllabusOS v1.0 MVP</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> AICTE Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
