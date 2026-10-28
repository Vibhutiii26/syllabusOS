'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, Eye, RefreshCw } from 'lucide-react';

interface DiagramProps {
  diagramKey: string;
}

export function InteractiveDiagram({ diagramKey }: DiagramProps) {
  switch (diagramKey) {
    case 'wave-fundamentals':
      return <WaveFundamentalsDiagram />;
    case 'wave-parameters':
      return <WaveParametersDiagram />;
    case 'superposition':
    case 'constructive-destructive':
      return <SuperpositionDiagram />;
    case 'phase-path':
      return <PhasePathDiagram />;
    case 'sustained-conditions':
      return <SustainedConditionsDiagram />;
    case 'young-double-slit':
      return <YoungDoubleSlitDiagram />;
    case 'fringe-width':
      return <FringeWidthDiagram />;
    case 'laser':
    case 'three-quantum-processes':
    case 'laser-processes':
      return <LaserQuantumProcessesDiagram />;
    case 'optical-fiber':
    case 'acceptance-angle':
    case 'numerical-aperture':
      return <OpticalFiberTIRDiagram />;
    case 'newton-rings':
      return <NewtonRingsDiagram />;
    default:
      return <SuperpositionDiagram />;
  }
}

function LaserQuantumProcessesDiagram() {
  const [process, setProcess] = useState<'absorption' | 'spontaneous' | 'stimulated'>('stimulated');
  const labels = {
    absorption: { title: 'Absorption', detail: 'An atom absorbs a photon and moves to a higher energy level.', color: '#8b5cf6', arrow: 'M 250 150 L 250 55' },
    spontaneous: { title: 'Spontaneous emission', detail: 'An excited atom emits a photon on its own and drops to a lower level.', color: '#f59e0b', arrow: 'M 250 55 L 250 150' },
    stimulated: { title: 'Stimulated emission', detail: 'An incoming photon triggers a matching photon: same phase, frequency, and direction.', color: '#10b981', arrow: 'M 250 55 L 250 150' },
  }[process];

  return (
    <section className="space-y-4 rounded-3xl border border-[#e7e2d6] bg-[#faf7f0] p-5">
      <div><h4 className="font-semibold text-stone-900">How a laser creates coherent light</h4><p className="mt-1 text-xs text-stone-600">Choose a quantum process to see how photons interact with an atom.</p></div>
      <div className="flex flex-wrap gap-2">{(['absorption', 'spontaneous', 'stimulated'] as const).map((item) => <button key={item} onClick={() => setProcess(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${process === item ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 ring-1 ring-stone-200'}`}>{item === 'spontaneous' ? 'Spontaneous emission' : item === 'stimulated' ? 'Stimulated emission' : 'Absorption'}</button>)}</div>
      <div className="rounded-2xl border border-stone-200 bg-white p-3">
        <svg viewBox="0 0 500 210" className="h-44 w-full" role="img" aria-label={`${labels.title} energy-level diagram`}>
          <defs><marker id="laser-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill={labels.color} /></marker></defs>
          <line x1="95" y1="155" x2="405" y2="155" stroke="#64748b" strokeWidth="3"/><line x1="95" y1="55" x2="405" y2="55" stroke="#64748b" strokeWidth="3"/>
          <text x="90" y="178" fontSize="13" fill="#475569">E₁ · lower state</text><text x="90" y="40" fontSize="13" fill="#475569">E₂ · excited state</text>
          {process !== 'spontaneous' && process !== 'absorption' && <><line x1="40" y1="105" x2="205" y2="105" stroke="#6366f1" strokeWidth="3" markerEnd="url(#laser-arrow)"/><text x="42" y="92" fontSize="12" fill="#4f46e5">incoming photon</text></>}
          <line x1="250" y1={process === 'absorption' ? 150 : 55} x2="250" y2={process === 'absorption' ? 55 : 150} stroke={labels.color} strokeWidth="4" markerEnd="url(#laser-arrow)"/>
          {process !== 'absorption' && <line x1="295" y1="105" x2="460" y2="105" stroke={labels.color} strokeWidth="3" markerEnd="url(#laser-arrow)"/>}
          <circle cx="250" cy={process === 'absorption' ? 55 : 155} r="9" fill={labels.color}/>
          <text x="315" y="94" fontSize="12" fill={labels.color}>{process === 'absorption' ? 'photon absorbed' : 'emitted photon'}</text>
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-stone-700"><strong>{labels.title}:</strong> {labels.detail}</p>
    </section>
  );
}

function OpticalFiberTIRDiagram() {
  const [angle, setAngle] = useState(48);
  const beyondCritical = angle >= 42;
  return <section className="space-y-4 rounded-3xl border border-[#e7e2d6] bg-[#faf7f0] p-5"><div><h4 className="font-semibold text-stone-900">Light guided through an optical fiber</h4><p className="mt-1 text-xs text-stone-600">Adjust the incidence angle. Above the critical angle, total internal reflection keeps light in the core.</p></div><div className="rounded-2xl border border-stone-200 bg-white p-3"><svg viewBox="0 0 520 190" className="h-40 w-full" role="img" aria-label="Total internal reflection in an optical fiber"><rect x="35" y="45" width="450" height="100" rx="18" fill="#dbeafe" stroke="#93c5fd"/><rect x="35" y="70" width="450" height="50" rx="10" fill="#eef2ff" stroke="#a5b4fc"/><text x="48" y="64" fontSize="12" fill="#475569">Cladding · lower refractive index</text><text x="48" y="140" fontSize="12" fill="#475569">Core · higher refractive index</text><polyline points="55,105 170,76 285,105 400,76 465,92" fill="none" stroke={beyondCritical ? '#4f46e5' : '#ef4444'} strokeWidth="4" strokeLinejoin="round"/><circle cx="170" cy="76" r="5" fill="#f59e0b"/><text x="180" y="73" fontSize="11" fill="#92400e">core boundary</text><text x="325" y="165" fontSize="12" fill={beyondCritical ? '#047857' : '#b91c1c'}>{beyondCritical ? 'Total internal reflection' : 'Light escapes into cladding'}</text></svg></div><label className="block text-xs font-semibold text-stone-700">Incidence angle: {angle}°<input type="range" min="20" max="70" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mt-2 w-full accent-indigo-600"/></label><p className="text-xs text-stone-600">Critical angle ≈ 42° · {beyondCritical ? 'The ray stays guided in the fiber core.' : 'The angle is below critical, so the ray refracts into the cladding.'}</p></section>;
}

function NewtonRingsDiagram() {
  const [radius, setRadius] = useState(1);
  return <section className="space-y-4 rounded-3xl border border-[#e7e2d6] bg-[#faf7f0] p-5"><div><h4 className="font-semibold text-stone-900">Newton’s rings</h4><p className="mt-1 text-xs text-stone-600">A thin air film between a curved lens and a glass plate creates concentric interference rings.</p></div><div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row"><svg viewBox="0 0 220 220" className="h-48 w-48" role="img" aria-label="Concentric bright and dark Newton's rings"><defs><radialGradient id="rings-bg"><stop offset="0" stopColor="#111827"/><stop offset="0.5" stopColor="#f8fafc"/><stop offset="1" stopColor="#111827"/></radialGradient></defs><circle cx="110" cy="110" r="96" fill="url(#rings-bg)"/>{Array.from({length:5},(_,i)=><circle key={i} cx="110" cy="110" r={18+i*16*radius} fill="none" stroke={i%2?'#cbd5e1':'#475569'} strokeWidth="3" opacity=".85"/>)}<circle cx="110" cy="110" r="5" fill="#0f172a"/></svg><p className="max-w-xs text-xs leading-relaxed text-stone-600">The dark center is surrounded by alternating bright and dark rings. Increasing the lens curvature scale spreads the rings outward.</p></div><label className="block text-xs font-semibold text-stone-700">Ring spacing<input type="range" min="0.7" max="1.35" step="0.05" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="mt-2 w-full accent-indigo-600"/></label><p className="font-mono text-xs text-stone-700">Dark ring condition: rₘ² = mλR</p></section>;
}

/**
 * 1. Wave Fundamentals: Particles bobbing while disturbance moves
 */
function WaveFundamentalsDiagram() {
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Dynamic Wave Motion: {waveType === 'transverse' ? 'Transverse Wave' : 'Longitudinal Wave'}
          </h4>
          <p className="text-xs text-stone-500">Notice how particles oscillate locally while energy propagates across.</p>
        </div>
        <div className="flex bg-stone-200/70 p-1 rounded-full text-xs font-medium">
          <button
            onClick={() => setWaveType('transverse')}
            className={`px-3 py-1 rounded-full transition ${waveType === 'transverse' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
          >
            Transverse (Light/Water)
          </button>
          <button
            onClick={() => setWaveType('longitudinal')}
            className={`px-3 py-1 rounded-full transition ${waveType === 'longitudinal' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
          >
            Longitudinal (Sound)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60 relative overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 600 180" className="w-full h-44">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Reference Centerline */}
          <line x1="40" y1="90" x2="560" y2="90" stroke="#e5e7eb" strokeDasharray="4 4" strokeWidth="1.5" />

          {waveType === 'transverse' ? (
            <>
              {/* Continuous Sine Wave */}
              <path
                d="M 50 90 Q 112.5 20, 175 90 T 300 90 T 425 90 T 550 90"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Oscillating Particles bobbing up and down */}
              {[112.5, 175, 237.5, 300, 362.5, 425, 487.5].map((x, i) => {
                const yPositions = [20, 90, 160, 90, 20, 90, 160];
                const y = yPositions[i];
                return (
                  <g key={i}>
                    {/* Vertical oscillation line */}
                    <line x1={x} y1="20" x2={x} y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                    {/* Particle dot */}
                    <circle cx={x} cy={y} r="5.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                    {/* Direction arrow */}
                    {i === 0 && (
                      <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#4f46e5" fontWeight="bold">
                        Crest
                      </text>
                    )}
                    {i === 2 && (
                      <text x={x} y={y + 18} textAnchor="middle" fontSize="10" fill="#4f46e5" fontWeight="bold">
                        Trough
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Propagation Vector */}
              <line x1="440" y1="30" x2="540" y2="30" stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <polygon points="545,30 535,26 535,34" fill="#059669" />
              <text x="490" y="24" textAnchor="middle" fontSize="11" fill="#059669" fontWeight="600">
                Energy Flow →
              </text>
            </>
          ) : (
            <>
              {/* Longitudinal Compressions & Rarefactions */}
              {[...Array(35)].map((_, idx) => {
                // Compress around x=150 and x=400
                const base = 50 + idx * 14;
                const dist1 = Math.abs(base - 170);
                const dist2 = Math.abs(base - 420);
                const shift = Math.sin((idx / 35) * Math.PI * 4) * 8;
                const x = base + shift;
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1="40"
                    x2={x}
                    y2="140"
                    stroke="#6366f1"
                    strokeWidth={dist1 < 30 || dist2 < 30 ? "3" : "1.5"}
                    opacity={dist1 < 30 || dist2 < 30 ? 0.9 : 0.4}
                  />
                );
              })}
              <text x="170" y="30" textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">Compression</text>
              <text x="295" y="30" textAnchor="middle" fontSize="11" fill="#6b7280">Rarefaction</text>
              <text x="420" y="30" textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">Compression</text>
            </>
          )}
        </svg>
      </div>
      <div className="flex items-center justify-between text-xs text-stone-600 bg-white/70 px-4 py-2.5 rounded-xl border border-stone-200">
        <span><strong>Key Observation:</strong> Medium particles stay in their positions; pure energy moves forward.</span>
        <span className="text-indigo-600 font-medium">B.Tech Physics Core Law</span>
      </div>
    </div>
  );
}

/**
 * 2. Wave Parameters: Amplitude, Wavelength, Phase
 */
function WaveParametersDiagram() {
  const [amplitude, setAmplitude] = useState(40);
  const [wavelength, setWavelength] = useState(140);

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Interactive Wave Parameters</h4>
          <p className="text-xs text-stone-500">Tune Amplitude (A) and Wavelength (λ) to observe how wave geometry changes.</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 font-medium text-stone-700">
            A:
            <input
              type="range"
              min="20"
              max="60"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="accent-indigo-600 w-20 cursor-pointer"
            />
            <span className="text-stone-500">{amplitude}px</span>
          </label>
          <label className="flex items-center gap-2 font-medium text-stone-700">
            λ:
            <input
              type="range"
              min="100"
              max="200"
              value={wavelength}
              onChange={(e) => setWavelength(Number(e.target.value))}
              className="accent-indigo-600 w-20 cursor-pointer"
            />
            <span className="text-stone-500">{wavelength}px</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60 flex items-center justify-center">
        <svg viewBox="0 0 600 200" className="w-full h-48">
          {/* Axis */}
          <line x1="30" y1="100" x2="570" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="50" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Dynamic Sine wave path */}
          {(() => {
            let path = `M 50 100`;
            for (let x = 50; x <= 560; x += 2) {
              const y = 100 - amplitude * Math.sin(((x - 50) / wavelength) * 2 * Math.PI);
              path += ` L ${x} ${y.toFixed(1)}`;
            }
            return (
              <path
                d={path}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })()}

          {/* Amplitude Dimension Indicator */}
          {(() => {
            const crestX = 50 + wavelength * 0.25;
            const crestY = 100 - amplitude;
            return (
              <g>
                <line x1={crestX} y1="100" x2={crestX} y2={crestY} stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx={crestX} cy={crestY} r="4" fill="#dc2626" />
                <line x1={crestX - 10} y1={crestY} x2={crestX + 10} y2={crestY} stroke="#dc2626" strokeWidth="2" />
                <text x={crestX + 12} y={100 - amplitude / 2} fontSize="11" fill="#dc2626" fontWeight="bold">
                  Amplitude (A)
                </text>
              </g>
            );
          })()}

          {/* Wavelength Dimension Indicator */}
          {(() => {
            const crest1X = 50 + wavelength * 0.25;
            const crest2X = crest1X + wavelength;
            const crestY = 100 - amplitude - 15;
            return (
              <g>
                <line x1={crest1X} y1={crestY} x2={crest2X} y2={crestY} stroke="#2563eb" strokeWidth="2" />
                <line x1={crest1X} y1={crestY - 6} x2={crest1X} y2={crestY + 6} stroke="#2563eb" strokeWidth="2" />
                <line x1={crest2X} y1={crestY - 6} x2={crest2X} y2={crestY + 6} stroke="#2563eb" strokeWidth="2" />
                <text x={(crest1X + crest2X) / 2} y={crestY - 6} textAnchor="middle" fontSize="12" fill="#2563eb" fontWeight="bold">
                  Wavelength (λ) = {wavelength} nm (scaled)
                </text>
              </g>
            );
          })()}

          {/* Phase angle labels */}
          <text x="50" y="115" fontSize="10" fill="#6b7280" textAnchor="middle">0 rad</text>
          <text x={50 + wavelength * 0.25} y="115" fontSize="10" fill="#6b7280" textAnchor="middle">π/2</text>
          <text x={50 + wavelength * 0.5} y="115" fontSize="10" fill="#6b7280" textAnchor="middle">π</text>
          <text x={50 + wavelength * 0.75} y="115" fontSize="10" fill="#6b7280" textAnchor="middle">3π/2</text>
          <text x={50 + wavelength} y="115" fontSize="10" fill="#6b7280" textAnchor="middle">2π (Full Cycle)</text>
        </svg>
      </div>
    </div>
  );
}

/**
 * 3. Principle of Superposition & Constructive/Destructive Interference
 */
function SuperpositionDiagram() {
  const [phaseDiffDeg, setPhaseDiffDeg] = useState(0); // 0 = constructive, 180 = destructive

  const phaseRad = (phaseDiffDeg * Math.PI) / 180;
  const isConstructive = Math.abs(phaseDiffDeg % 360) < 30 || Math.abs(phaseDiffDeg % 360) > 330;
  const isDestructive = Math.abs((phaseDiffDeg % 360) - 180) < 30;

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Interactive Wave Superposition & Interference Simulator
          </h4>
          <p className="text-xs text-stone-500">
            Slide the Phase Difference (Δφ) between Wave 1 & Wave 2 to observe how the resultant wave responds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPhaseDiffDeg(0)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${phaseDiffDeg === 0 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'}`}
          >
            Constructive (0°)
          </button>
          <button
            onClick={() => setPhaseDiffDeg(180)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${phaseDiffDeg === 180 ? 'bg-rose-600 text-white shadow-sm' : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'}`}
          >
            Destructive (180°)
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border border-stone-200">
        <Sliders className="w-4 h-4 text-stone-500" />
        <span className="text-xs font-medium text-stone-700 whitespace-nowrap">Phase Difference Δφ:</span>
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={phaseDiffDeg}
          onChange={(e) => setPhaseDiffDeg(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <span className="text-xs font-bold text-stone-900 w-16 text-right">
          {phaseDiffDeg}° ({((phaseDiffDeg / 180).toFixed(2))}π)
        </span>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Component Waves */}
        <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-700">Individual Overlapping Waves</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-2.5 h-1 bg-blue-500 rounded"></span> Wave 1 (y₁)
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <span className="w-2.5 h-1 bg-amber-500 rounded"></span> Wave 2 (y₂)
              </span>
            </div>
          </div>
          <svg viewBox="0 0 300 130" className="w-full h-32">
            <line x1="20" y1="65" x2="280" y2="65" stroke="#e5e7eb" strokeWidth="1.5" />
            {/* Wave 1 */}
            {(() => {
              let p1 = `M 20 65`;
              for (let x = 20; x <= 280; x += 2) {
                const y = 65 - 28 * Math.sin(((x - 20) / 90) * 2 * Math.PI);
                p1 += ` L ${x} ${y.toFixed(1)}`;
              }
              return <path d={p1} fill="none" stroke="#2563eb" strokeWidth="2.5" opacity={0.8} />;
            })()}
            {/* Wave 2 with phase difference */}
            {(() => {
              let p2 = `M 20 65`;
              for (let x = 20; x <= 280; x += 2) {
                const y = 65 - 28 * Math.sin(((x - 20) / 90) * 2 * Math.PI + phaseRad);
                p2 += ` L ${x} ${y.toFixed(1)}`;
              }
              return <path d={p2} fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="4 2" opacity={0.8} />;
            })()}
          </svg>
        </div>

        {/* Resultant Superimposed Wave */}
        <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-700">Resultant Displacement (y = y₁ + y₂)</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isConstructive
                  ? 'bg-emerald-100 text-emerald-800'
                  : isDestructive
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {isConstructive ? 'Constructive (Peak 2A)' : isDestructive ? 'Destructive (Cancel 0)' : 'Intermediate Superposition'}
            </span>
          </div>
          <svg viewBox="0 0 300 130" className="w-full h-32">
            <line x1="20" y1="65" x2="280" y2="65" stroke="#e5e7eb" strokeWidth="1.5" />
            {(() => {
              let pResult = `M 20 65`;
              for (let x = 20; x <= 280; x += 2) {
                const theta = ((x - 20) / 90) * 2 * Math.PI;
                const y1 = 28 * Math.sin(theta);
                const y2 = 28 * Math.sin(theta + phaseRad);
                const yTotal = 65 - (y1 + y2);
                pResult += ` L ${x} ${yTotal.toFixed(1)}`;
              }
              return (
                <path
                  d={pResult}
                  fill="none"
                  stroke={isConstructive ? '#059669' : isDestructive ? '#e11d48' : '#7c3aed'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })()}
          </svg>
        </div>
      </div>

      <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
        <span>
          <strong>Resultant Amplitude:</strong>{' '}
          {isDestructive
            ? 'R = A - A = 0 (Total darkness/silence)'
            : isConstructive
            ? 'R = A + A = 2A (Intensity quadruples: I = 4I₀)'
            : `R = 2A cos(Δφ/2) ≈ ${(2 * Math.cos(phaseRad / 2)).toFixed(2)}A`}
        </span>
        <span className="font-mono text-stone-500">Δφ = {phaseDiffDeg}°</span>
      </div>
    </div>
  );
}

/**
 * 4. Phase Difference and Path Difference: Geometric ray paths
 */
function PhasePathDiagram() {
  const [extraPath, setExtraPath] = useState(0.5); // 0 = 0, 0.5 = lambda/2, 1 = lambda

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Geometric Path Difference (Δx) to Phase Difference (Δφ)</h4>
          <p className="text-xs text-stone-500">The fundamental bridge of physical optics: Δφ = (2π/λ) · Δx</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExtraPath(0)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${extraPath === 0 ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-700'}`}
          >
            Δx = 0 (In-phase)
          </button>
          <button
            onClick={() => setExtraPath(0.5)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${extraPath === 0.5 ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-700'}`}
          >
            Δx = λ/2 (Out-of-phase)
          </button>
          <button
            onClick={() => setExtraPath(1.0)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${extraPath === 1.0 ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-700'}`}
          >
            Δx = 1λ (Full cycle)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60">
        <svg viewBox="0 0 550 170" className="w-full h-40">
          {/* Source 1 */}
          <circle cx="60" cy="50" r="10" fill="#4f46e5" />
          <text x="60" y="54" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">S₁</text>

          {/* Source 2 */}
          <circle cx="60" cy="120" r="10" fill="#4f46e5" />
          <text x="60" y="124" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">S₂</text>

          {/* Detector Point P */}
          <circle cx="480" cy="60" r="8" fill="#10b981" />
          <text x="500" y="64" fontSize="11" fill="#065f46" fontWeight="bold">Point P</text>

          {/* Ray 1 from S1 to P */}
          <line x1="70" y1="50" x2="472" y2="60" stroke="#6366f1" strokeWidth="2.5" />

          {/* Ray 2 from S2 to P */}
          <line x1="70" y1="120" x2="472" y2="60" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Perpendicular drop showing extra path */}
          <line x1="130" y1="52" x2="130" y2="112" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
          <polygon points="130,105 137,105 137,112 130,112" fill="none" stroke="#ef4444" strokeWidth="1" />

          {/* Extra Path Indicator */}
          <path d="M 70 120 L 130 112" stroke="#dc2626" strokeWidth="4" />
          <text x="100" y="136" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold">
            Extra Path Δx = {extraPath}λ
          </text>

          <text x="320" y="135" fontSize="12" fill="#374151" fontWeight="600">
            Phase difference Δφ = {(extraPath * 2).toFixed(1)}π rad ({Math.round(extraPath * 360)}°)
          </text>
        </svg>
      </div>
    </div>
  );
}

/**
 * 5. Conditions for Sustained Interference
 */
function SustainedConditionsDiagram() {
  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <h4 className="text-sm font-semibold text-stone-900">The 4 Cardinal Conditions for Sustained Interference</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-xs font-bold text-stone-900">Coherent Sources</span>
          </div>
          <p className="text-[11px] text-stone-600">Phase difference must remain strictly constant with time (d(Δφ)/dt = 0).</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-xs font-bold text-stone-900">Monochromatic Light</span>
          </div>
          <p className="text-[11px] text-stone-600">Identical wavelength λ so fringes of different colors don’t overlap and blur.</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-xs font-bold text-stone-900">Equal Amplitudes (A₁ ≈ A₂)</span>
          </div>
          <p className="text-[11px] text-stone-600">Ensures 100% fringe contrast (I_min = 0, pitch black dark fringes).</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">4</span>
            <span className="text-xs font-bold text-stone-900">Geometry: Small d, Large D</span>
          </div>
          <p className="text-[11px] text-stone-600">Slits must be very close, screen far away so fringe width β is observable.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 6. Young's Double Slit Experiment (YDSE) Apparatus & Screen Pattern
 */
function YoungDoubleSlitDiagram() {
  const [fringeCount, setFringeCount] = useState(5);

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Young’s Double Slit Experiment (YDSE)</h4>
          <p className="text-xs text-stone-500">Wavefront division produces alternating bright constructive and dark destructive fringes.</p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60">
        <svg viewBox="0 0 600 220" className="w-full h-52">
          {/* Slit Barrier */}
          <line x1="120" y1="20" x2="120" y2="85" stroke="#1f2937" strokeWidth="5" />
          <line x1="120" y1="105" x2="120" y2="125" stroke="#1f2937" strokeWidth="5" />
          <line x1="120" y1="145" x2="120" y2="200" stroke="#1f2937" strokeWidth="5" />

          {/* Slit labels */}
          <text x="105" y="98" fontSize="10" fill="#4b5563" fontWeight="bold">S₁</text>
          <text x="105" y="138" fontSize="10" fill="#4b5563" fontWeight="bold">S₂</text>

          {/* Slit separation d indicator */}
          <line x1="135" y1="95" x2="135" y2="135" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="130" y1="95" x2="140" y2="95" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="130" y1="135" x2="140" y2="135" stroke="#2563eb" strokeWidth="1.5" />
          <text x="145" y="118" fontSize="10" fill="#2563eb" fontWeight="bold">d</text>

          {/* Expanding Wavefront ripples from S1 & S2 */}
          {[30, 60, 90, 120, 150].map((r, i) => (
            <path
              key={`w1-${i}`}
              d={`M 120 ${95 - r} A ${r} ${r} 0 0 1 120 ${95 + r}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray={i % 2 === 0 ? "none" : "3 3"}
              opacity="0.4"
            />
          ))}
          {[30, 60, 90, 120, 150].map((r, i) => (
            <path
              key={`w2-${i}`}
              d={`M 120 ${135 - r} A ${r} ${r} 0 0 1 120 ${135 + r}`}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray={i % 2 === 0 ? "none" : "3 3"}
              opacity="0.4"
            />
          ))}

          {/* Screen */}
          <line x1="420" y1="20" x2="420" y2="200" stroke="#1f2937" strokeWidth="4" />
          <text x="420" y="15" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">Screen</text>

          {/* Screen Distance D indicator */}
          <line x1="120" y1="210" x2="420" y2="210" stroke="#6b7280" strokeWidth="1.5" />
          <text x="270" y="206" textAnchor="middle" fontSize="10" fill="#4b5563">Distance D (D &gt;&gt; d)</text>

          {/* Fringes Pattern on Screen */}
          <g transform="translate(435, 20)">
            <rect x="0" y="0" width="120" height="180" fill="#0f172a" rx="8" />
            <text x="60" y="-6" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">
              Detected Fringes
            </text>

            {/* Alternating fringes */}
            {[
              { y: 15, type: 'dark', label: 'Dark (n=2)' },
              { y: 35, type: 'bright', label: 'Bright 2' },
              { y: 55, type: 'dark', label: 'Dark (n=1)' },
              { y: 75, type: 'bright', label: 'Bright 1' },
              { y: 95, type: 'center', label: 'Central Max (n=0)' },
              { y: 115, type: 'bright', label: 'Bright 1' },
              { y: 135, type: 'dark', label: 'Dark (n=1)' },
              { y: 155, type: 'bright', label: 'Bright 2' },
              { y: 175, type: 'dark', label: 'Dark (n=2)' }
            ].map((f, idx) => (
              <g key={idx}>
                {f.type === 'center' ? (
                  <rect x="5" y={f.y - 8} width="110" height="16" fill="#facc15" opacity="0.95" rx="3" />
                ) : f.type === 'bright' ? (
                  <rect x="10" y={f.y - 6} width="100" height="12" fill="#60a5fa" opacity="0.85" rx="3" />
                ) : null}
                <text x="60" y={f.y + 4} textAnchor="middle" fontSize="9" fill={f.type === 'dark' ? '#64748b' : '#0f172a'} fontWeight="600">
                  {f.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * 7. Fringe Width: β = λD/d with medium comparison
 */
function FringeWidthDiagram() {
  const [submergedInWater, setSubmergedInWater] = useState(false);

  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Fringe Width Scaling: β = λD / d</h4>
          <p className="text-xs text-stone-500">Observe how fringe spacing contracts when immersed in a refractive medium.</p>
        </div>
        <button
          onClick={() => setSubmergedInWater(!submergedInWater)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            submergedInWater ? 'bg-cyan-600 text-white shadow-sm' : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {submergedInWater ? 'In Water (μ = 1.33)' : 'In Air (μ = 1.00)'}
        </button>
      </div>

      <div className={`p-4 rounded-[20px] transition-colors border ${submergedInWater ? 'bg-cyan-50/70 border-cyan-200' : 'bg-white border-[#e7e2d6]/60'}`}>
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
          <span>Screen View Pattern: {submergedInWater ? 'Compressed Fringes (β\' = 1.8 mm)' : 'Standard Spacing (β = 2.4 mm)'}</span>
          <span className="font-mono text-stone-500">{submergedInWater ? 'λ\' = λ / 1.33' : 'λ_air = 600 nm'}</span>
        </div>

        <svg viewBox="0 0 500 70" className="w-full h-16 rounded-xl bg-slate-900 overflow-hidden">
          {(() => {
            const spacing = submergedInWater ? 24 : 36;
            const elements = [];
            for (let x = 20; x < 480; x += spacing) {
              elements.push(
                <g key={x}>
                  <rect x={x} y="5" width={spacing * 0.55} height="60" fill="#38bdf8" opacity="0.9" rx="2" />
                  <text x={x + (spacing * 0.27)} y="38" textAnchor="middle" fontSize="9" fill="#0c4a6e" fontWeight="bold">
                    Bright
                  </text>
                </g>
              );
            }
            return elements;
          })()}
        </svg>

        <div className="mt-3 text-xs text-stone-600 flex justify-between items-center">
          <span>{submergedInWater ? 'Wavelength is shorter in water, so fringes pack closer together.' : 'Normal fringe width in air with standard spacing.'}</span>
          <span className="font-semibold text-stone-800">β ∝ λ</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 8. Anti-Reflective Coating Thin Film
 */
function AntiReflectiveDiagram() {
  return (
    <div className="bg-[#faf7f0] rounded-[24px] p-6 border border-[#e7e2d6] space-y-4">
      <h4 className="text-sm font-semibold text-stone-900">Quarter-Wave Anti-Reflective Film (t = λ / 4μ)</h4>
      <div className="bg-white rounded-[20px] p-4 border border-[#e7e2d6]/60">
        <svg viewBox="0 0 550 190" className="w-full h-44">
          {/* Air Layer */}
          <rect x="30" y="10" width="490" height="40" fill="#f8fafc" />
          <text x="45" y="32" fontSize="11" fill="#64748b" fontWeight="bold">Air (n = 1.0)</text>

          {/* Thin Film Layer */}
          <rect x="30" y="50" width="490" height="50" fill="#e0e7ff" />
          <text x="45" y="78" fontSize="11" fill="#4338ca" fontWeight="bold">MgF₂ Coating Film (n = 1.38, thickness t = λ / 4n)</text>

          {/* Glass Substrate */}
          <rect x="30" y="100" width="490" height="70" fill="#cbd5e1" />
          <text x="45" y="135" fontSize="11" fill="#334155" fontWeight="bold">Camera Lens Glass Substrate (n = 1.52)</text>

          {/* Rays */}
          {/* Incident Ray */}
          <line x1="180" y1="15" x2="220" y2="50" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="202,34 195,30 200,26" fill="#f59e0b" />
          <text x="155" y="28" fontSize="10" fill="#b45309" fontWeight="bold">Incident Light</text>

          {/* Reflected Ray 1 (from top surface) */}
          <line x1="220" y1="50" x2="260" y2="15" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
          <text x="245" y="24" fontSize="10" fill="#ef4444" fontWeight="bold">Ray 1 (π shift)</text>

          {/* Internal reflection Ray 2 */}
          <line x1="220" y1="50" x2="245" y2="100" stroke="#f59e0b" strokeWidth="2" />
          <line x1="245" y1="100" x2="270" y2="50" stroke="#f59e0b" strokeWidth="2" />
          <line x1="270" y1="50" x2="310" y2="15" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
          <text x="305" y="28" fontSize="10" fill="#ef4444" fontWeight="bold">Ray 2 (Roundtrip λ/2 + π shift)</text>

          {/* Destructive Cancellation indicator */}
          <rect x="370" y="15" width="140" height="30" fill="#fee2e2" rx="6" />
          <text x="440" y="34" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="bold">
            Ray 1 &amp; Ray 2 Cancel (0% Glare!)
          </text>
        </svg>
      </div>
    </div>
  );
}
