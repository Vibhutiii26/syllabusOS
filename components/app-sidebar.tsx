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
  ShieldCheck,
  UploadCloud,
  Presentation,
  Home,
  LogOut,
  Atom
} from 'lucide-react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { useUser, UserButton, SignOutButton } from '@clerk/nextjs';

export type WorkspaceTab =
  | 'learning'
  | 'syllabus'
  | 'materials'
  | 'study-materials'
  | 'graph'
  | 'tutor'
  | 'progress';

interface AppSidebarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onOpenDiagnostic: () => void;
  onResetProgress: () => void;
  onReturnHome?: () => void;
  demonstratedCount: number;
  totalConcepts: number;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  onOpenDiagnostic,
  onResetProgress,
  onReturnHome,
  demonstratedCount,
  totalConcepts
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
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#141416] text-white md:rounded-[32px] p-5 flex flex-col justify-between shrink-0 shadow-xl border border-stone-800">
      {/* Top Branding */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center font-black text-white shadow-md">
              <span className="text-sm tracking-tighter">S</span>
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
        <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            <span>Active Course</span>
            <span className="text-emerald-400 font-mono">PH31001(T)</span>
          </div>
          <p className="text-xs font-bold text-white line-clamp-1">Applied Physics (T)</p>
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <span>5 Units AICTE</span>
            <span className="font-semibold text-stone-300">
              {demonstratedCount}/{totalConcepts} Done
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-3 mb-1 block">
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
              <UserButton afterSignOutUrl="/" />
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
