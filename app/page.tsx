'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { LandingPage } from '@/components/landing-page';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import SyllabusOSApp from '@/components/learning-workspace';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import type { LearnerStateDTO } from '@/types/backend';
import type { StudentOnboardingProfile } from '@/lib/curricula-registry';

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<LearnerStateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setLoading(false); setState(null); return; }
    let cancelled = false;
    fetch('/api/state', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in to continue.' : 'We could not load your study profile. Please try again.');
        return response.json() as Promise<LearnerStateDTO>;
      })
      .then((data) => { if (!cancelled) { setState(data); setOnboarding(!data.curriculum); } })
      .catch((error: Error) => { if (!cancelled) setMessage(error.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn]);

  const saveCurriculum = async (_profile: StudentOnboardingProfile) => {
    setMessage('');
    const response = await fetch('/api/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'select_curriculum', curriculumId: SAMPLE_CURRICULUM.id }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.message || 'We could not save your study path. Please try again.'); return; }
    setState(data as LearnerStateDTO);
    setOnboarding(false);
  };

  if (!isLoaded || loading) return <main className="min-h-screen flex items-center justify-center bg-[#faf8f4]"><div className="text-sm text-stone-500">Preparing your study space…</div></main>;
  if (!isSignedIn) return <LandingPage onStartPhysicsClass={() => {}} onOpenSyllabus={() => document.getElementById('first-year-subjects')?.scrollIntoView({ behavior: 'smooth' })} onOpenWorkspace={() => {}} />;
  if (message && !state) return <main className="min-h-screen flex items-center justify-center bg-[#faf8f4] p-6"><div className="max-w-md rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-xl font-bold">Your study space is unavailable</h1><p className="mt-2 text-sm text-stone-600">{message}</p><button onClick={() => location.reload()} className="mt-5 rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white">Try again</button></div></main>;
  if (onboarding || !state?.curriculum) return <><OnboardingWizard onComplete={saveCurriculum} />{message && <div role="alert" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow">{message}</div>}</>;
  return <SyllabusOSApp initialState={state} onChangeCurriculum={() => setOnboarding(true)} />;
}
