'use client';

import React from 'react';
import {
  BookOpen,
  Compass,
  Bot,
  BarChart3,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  UploadCloud,
  Presentation,
  Home,
  LogOut,
  History,
  ChevronRight,
  CirclePlay
} from 'lucide-react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { APPLIED_PHYSICS_SYLLABUS } from '@/lib/curricula-registry';
import { useUser, UserButton, SignOutButton } from '@clerk/nextjs';

export type WorkspaceTab =
  | 'learning'
  | 'syllabus'
  | 'materials'
  | 'study-materials'
  | 'graph'
  | 'tutor'
  | 'progress'
  | 'sessions';

interface AppSidebarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onOpenDiagnostic: () => void;
  onResetProgress: () => void;
  onReturnHome?: () => void;
  demonstratedCount: number;
  totalConcepts: number;
  activeUnitTitle?: string;
  activeUnitId?: string;
  onSelectUnit?: (unitId: string) => void;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  onOpenDiagnostic,
  onResetProgress,
  onReturnHome,
  demonstratedCount,
  totalConcepts,
  activeUnitTitle,
  activeUnitId,
  onSelectUnit
}: AppSidebarProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  const navItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'learning',
      label: 'Physics Classes',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Active'
    },
    {
      id: 'syllabus',
      label: 'Official Syllabus',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'materials',
      label: 'Upload Notes & PDF',
      icon: <UploadCloud className="w-4 h-4" />
    },
    {
      id: 'study-materials',
      label: 'PPT & Study Aids',
      icon: <Presentation className="w-4 h-4" />,
      badge: '.pptx'
    },
    {
      id: 'graph',
      label: 'Knowledge Graph',
      icon: <Compass className="w-4 h-4" />,
      badge: 'DAG'
    },
    {
      id: 'tutor',
      label: 'AI Teacher',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Gemini'
    },
    {
      id: 'progress',
      label: 'Progress Dashboard',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'sessions',
      label: 'Study Sessions',
      icon: <History className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-full md:w-[278px] bg-[#17181d] text-white md:rounded-[30px] p-4 sm:p-5 flex flex-col justify-between shrink-0 shadow-xl border border-white/5">
      {/* Top Branding */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[15px] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Layers className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SyllabusOS
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h1>
              <p className="text-[10px] text-stone-400 font-medium">B.Tech 1st Year (2025-26)</p>
            </div>
          </div>

          {onReturnHome && (
            <button
              onClick={onReturnHome}
              title="Return to Home Landing"
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Subject Badge */}
        <div className="rounded-[22px] border border-white/8 bg-gradient-to-br from-[#242630] to-[#1c1e26] p-4 shadow-inner">
          <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-stone-400">Your course</span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">ACTIVE</span></div>
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-[14px] bg-indigo-500/15 text-indigo-300"><BookOpen className="h-5 w-5"/></div><div className="min-w-0"><p className="truncate text-sm font-bold text-white">Applied Physics</p><p className="text-[10px] text-stone-400">B.Tech · PH31001(T)</p></div></div>
          <div className="mt-4 rounded-xl border border-indigo-300/10 bg-indigo-400/8 px-3 py-2"><p className="text-[9px] font-bold uppercase tracking-wider text-indigo-300">Current unit</p><p className="mt-0.5 line-clamp-1 text-xs font-semibold text-white">{activeUnitTitle?.replace(/^UNIT-[IVX]+:\s*/, '')}</p></div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-stone-400"><span>{totalConcepts} lessons in this unit</span><span className="font-semibold text-stone-200">{demonstratedCount} mastered</span></div>
        </div>

        <div className="space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-2"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-stone-500">Physics units</span><span className="text-[10px] text-stone-500">1–5</span></div>
          <div className="space-y-1.5">{APPLIED_PHYSICS_SYLLABUS.units.map((unit) => {
            const isActive = activeUnitId === unit.id;
            return <button key={unit.id} onClick={() => onSelectUnit?.(unit.id)} className={`group flex w-full items-center gap-3 rounded-[15px] border px-3 py-2.5 text-left transition ${isActive ? 'border-indigo-400/25 bg-indigo-500/15 text-white shadow-sm' : 'border-transparent text-stone-400 hover:border-white/5 hover:bg-white/5 hover:text-white'}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold ${isActive ? 'bg-indigo-400 text-white' : 'bg-white/5 text-stone-400 group-hover:bg-white/10'}`}>U{unit.number}</span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{unit.title.replace(/^UNIT-[IVX]+:\s*/, '')}</span><span className={`mt-0.5 block text-[9px] ${isActive ? 'text-indigo-200' : 'text-stone-500'}`}>{SAMPLE_CURRICULUM.concepts.filter((concept) => concept.unitId === unit.id).length ? 'Interactive lessons' : 'Syllabus session'}</span></span>{isActive ? <CirclePlay className="h-4 w-4 text-indigo-300"/> : <ChevronRight className="h-4 w-4 text-stone-600 transition group-hover:translate-x-0.5 group-hover:text-stone-300"/>}</button>;
          })}</div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[.16em] px-3 mb-2 block">
            Physics Classroom
          </span>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
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
      </div>

      {/* Bottom Actions & Clerk Auth Status */}
      <div className="space-y-3 pt-5 border-t border-stone-800/80">
        <button
          onClick={onOpenDiagnostic}
          className="w-full py-2.5 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          Diagnostic Quiz
        </button>

        {/* User Session Bar with Clerk Logout */}
        {isLoaded && isSignedIn && (
          <div className="p-2.5 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
                <UserButton />
              <div className="text-left overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                </span>
                <span className="text-[10px] text-stone-400 block truncate">1st Year Student</span>
              </div>
            </div>

            <SignOutButton>
              <button
                title="Log Out"
                className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-rose-400 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </SignOutButton>
          </div>
        )}

        <button
          onClick={onResetProgress}
          className="w-full py-1.5 px-3 rounded-2xl text-[10px] text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo State
        </button>

        <div className="px-2 flex items-center justify-between text-[10px] text-stone-500">
          <span>SyllabusOS v1.0</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> AICTE Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
