'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { LandingPage } from '@/components/landing-page';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import SyllabusOSApp from '@/components/learning-workspace';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import type { StudentOnboardingProfile } from '@/lib/curricula-registry';
import type { LearnerStateDTO } from '@/types/backend';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [state, setState] = useState<LearnerStateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Navigation mode: 'landing' | 'workspace' | 'onboarding'
  const [viewMode, setViewMode] = useState<'landing' | 'workspace' | 'onboarding'>('landing');
  const [activeUnitId, setActiveUnitId] = useState<string>('unit-1-laser-fiber');

  // Load server state if user is logged in
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    let cancelled = false;
    fetch('/api/state', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('We could not load your study profile. Please try again.');
        }
        return response.json() as Promise<LearnerStateDTO>;
      })
      .then((data) => {
        if (!cancelled) {
          setState(data);
          setViewMode(data.curriculum ? 'workspace' : 'onboarding');
        }
      })
      .catch((error: Error) => {
        if (!cancelled) setMessage(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  const saveCurriculum = async (_profile: StudentOnboardingProfile) => {
    setMessage('');
    try {
      const response = await fetch('/api/state', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'select_curriculum', curriculumId: SAMPLE_CURRICULUM.id })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'We could not save your study path. Please try again.');
        return;
      }
      setState(data as LearnerStateDTO);
    } catch {
      setMessage('We could not save your study path. Check your connection and try again.');
      return;
    }
    setViewMode('workspace');
  };

  const handleStartPhysicsClass = (unitId?: string) => {
    if (unitId) setActiveUnitId(unitId);
    if (isSignedIn) setViewMode(state?.curriculum ? 'workspace' : 'onboarding');
    else window.location.href = '/sign-in';
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
        <div className="flex items-center gap-3 text-sm text-stone-600 font-semibold">
          <div className="w-5 h-5 rounded-full border-2 border-stone-800 border-t-transparent animate-spin"></div>
          <span>Loading SyllabusOS...</span>
        </div>
      </main>
    );
  }

  // 1. Onboarding Wizard View
  if (viewMode === 'onboarding') {
    return (
      <>
        <OnboardingWizard
          onComplete={saveCurriculum}
          onSkip={() => setViewMode('workspace')}
        />
        {message && (
          <div
            role="alert"
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow"
          >
            {message}
          </div>
        )}
      </>
    );
  }

  // 2. Learning Workspace View (Physics Classroom)
  if (viewMode === 'workspace') {
    return (
      <SyllabusOSApp
        initialState={state}
        initialUnitId={activeUnitId}
        onChangeCurriculum={() => setViewMode('onboarding')}
        onReturnHome={() => setViewMode('landing')}
      />
    );
  }

  // 3. Default: Landing Page View with Clerk Auth & 1st Year Subjects
  return (
    <LandingPage
      onStartPhysicsClass={handleStartPhysicsClass}
      onOpenSyllabus={() => document.getElementById('first-year-subjects')?.scrollIntoView({ behavior: 'smooth' })}
      onOpenWorkspace={() => { if (isSignedIn) setViewMode(state?.curriculum ? 'workspace' : 'onboarding'); else window.location.href = '/sign-in'; }}
    />
  );
}
