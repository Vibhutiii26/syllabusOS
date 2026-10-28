import type { Concept } from '@/types/learning';

// ---------------------------------------------------------------------------
// UNIT-I: Laser and Fiber Optics — PH31001(T) Applied Physics
// Answer keys are NOT stored here. Keys live only in lib/server/questions.ts.
// ---------------------------------------------------------------------------

export const UNIT1_CONCEPTS: Concept[] = [
  {
    id: 'three-quantum-processes',
    title: 'Three Quantum Processes: Absorption, Spontaneous & Stimulated Emission',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'The three ways light interacts with an atom: absorbing a photon, emitting one randomly, or emitting one triggered by an incoming photon.',
    learningObjective: 'Distinguish absorption, spontaneous emission and stimulated emission, and explain why stimulated emission is the key to light amplification.',
    storyAnalogy: {
      hook: 'Imagine a ball resting at the bottom of a staircase — a photon is a hand that can either lift it up or, under the right conditions, knock a second ball down and get a twin for free.',
      analogy: 'Absorption: a hand (photon) lifts the ball one step up (atom excited). Spontaneous emission: after some random delay the ball falls back on its own, kicking a photon out in a random direction. Stimulated emission: a passing photon of exactly the right energy nudges the ball down and a second, identical photon comes out travelling with it.',
      connection: 'Laser = Light Amplification by Stimulated Emission of Radiation: one photon becomes two identical photons, then four, then eight — an avalanche of perfectly cloned light.'
    },
    explanationSections: [
      {
        heading: '1. Absorption (Excitation)',
        content: 'An atom in a lower energy state E₁ absorbs a photon whose energy exactly matches the gap (hν = E₂ − E₁) and jumps to the upper state E₂. The photon disappears. This is how energy is pumped into the system.'
      },
      {
        heading: '2. Spontaneous Emission',
        content: 'The excited atom decays to E₁ on its own after a random lifetime (~10⁻⁸ s), emitting a photon of energy hν in a random direction with random phase. This is incoherent light — the light of a candle or an LED.'
      },
      {
        heading: '3. Stimulated Emission (The Amplifier)',
        content: 'If a photon of energy hν passes an already-excited atom, it stimulates the atom to decay, emitting a second photon with the SAME direction, phase, frequency and polarization as the stimulating photon. One photon in → two coherent photons out: this is optical gain.'
      }
    ],
    formula: {
      title: 'Resonance Condition',
      latex: 'h\\nu = E_2 - E_1',
      explanation: 'The photon energy must exactly match the energy gap between the two atomic levels for any of the three processes to occur.',
      variables: [
        { symbol: 'h', name: 'Planck\'s constant (6.626 × 10⁻³⁴ J·s)', unit: 'J·s' },
        { symbol: '\\nu', name: 'Photon frequency', unit: 'Hz' },
        { symbol: 'E_1, E_2', name: 'Lower and upper atomic energy levels', unit: 'J' }
      ]
    },
    diagramKey: 'three-quantum-processes',
    realWorldApplication: {
      title: 'Why LEDs Glow but Lasers Pierce',
      description: 'An LED is pure spontaneous emission: random photons in all directions, a soft glow. A laser cavity forces stimulated emission to dominate: cloned photons march in lockstep, producing a beam that stays tight enough to hit the Moon (retro-reflectors left by Apollo astronauts).',
      industry: 'Photonics & Optical Communications'
    },
    relations: [
      { targetId: 'wave-fundamentals', type: 'related_to', reason: 'Photons are the quantum packets of the electromagnetic waves studied in wave optics.' },
      { targetId: 'einstein-coefficients', type: 'prerequisite_of', reason: 'Einstein put the three processes on a quantitative footing with his A and B coefficients.' }
    ],
    practiceQuestions: [
      {
        id: 'q-tqp-1',
        conceptId: 'three-quantum-processes',
        prompt: 'Which process is responsible for light AMPLIFICATION in a laser?',
        options: [
          { id: 'a', text: 'Absorption', explanation: 'Absorption removes photons from the beam — it is how energy is pumped IN, not amplified.' },
          { id: 'b', text: 'Spontaneous emission', explanation: 'Spontaneous emission produces random, incoherent photons — the seed, not the amplifier.' },
          { id: 'c', text: 'Stimulated emission', explanation: 'Correct! An incoming photon triggers an excited atom to release a second, identical photon, doubling the coherent light.' },
          { id: 'd', text: 'Thermal radiation', explanation: 'Thermal (blackbody) radiation is broadband incoherent light, the opposite of laser gain.' }
        ],
        prerequisiteHintId: 'wave-fundamentals',
        explanation: 'Stimulated emission clones a photon: one photon stimulates an excited atom and two coherent, identical photons leave. Repeated across the medium, this multiplies light — amplification.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'einstein-coefficients',
    title: 'Einstein\'s A & B Coefficients',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'Einstein\'s 1917 rate equations relating spontaneous (A) and stimulated (B) emission probabilities, and why A/B grows as ν³.',
    learningObjective: 'Derive the relation between Einstein\'s A and B coefficients at thermal equilibrium and explain its consequence: spontaneous emission dominates at high frequencies.',
    storyAnalogy: {
      hook: 'Einstein asked a bookkeeping question: at equilibrium, atoms must emit exactly as much light as they absorb — what does that balance force?',
      analogy: 'Picture a crowded two-level city where citizens (atoms) constantly move between downtown (E₁) and uptown (E₂). Absorption is the up-escalator (rate ∝ B₁₂ρ(ν)). Stimulated emission is a down-escalator that speeds up with crowd size (B₂₁ρ(ν)). Spontaneous emission is a fireman\'s slide anyone may take at any moment (A₂₁).',
      connection: 'Balancing the escalators forces B₁₂ = B₂₁ and A₂₁/B₂₁ = 8πhν³/c³ — spontaneous emission becomes negligible compared to stimulated emission only when the radiation field is dense (many photons per mode).'
    },
    explanationSections: [
      {
        heading: '1. The Three Rate Terms',
        content: 'Upward: N₁B₁₂ρ(ν) (absorption). Downward: N₂B₂₁ρ(ν) (stimulated) + N₂A₂₁ (spontaneous). Here ρ(ν) is the energy density of the radiation field per unit frequency, and A, B are Einstein\'s coefficients.'
      },
      {
        heading: '2. Equilibrium Balance',
        content: 'At thermal equilibrium with Boltzmann populations (N₂/N₁ = e^(−hν/kT)) and Planck\'s radiation law ρ(ν), the balance yields two results: B₁₂ = B₂₁ (absorption and stimulated emission are equally likely) and A₂₁/B₂₁ = 8πhν³/c³.'
      },
      {
        heading: '3. The ν³ Problem and How Lasers Beat It',
        content: 'Because A grows as ν³, at optical frequencies spontaneous emission is enormous relative to stimulated emission in thermal light. A laser beats this with an optical cavity: it concentrates the field into very few modes, making the stimulated term dominate — that is why a cavity is essential.'
      }
    ],
    formula: {
      title: 'Einstein Relations',
      latex: 'B_{12} = B_{21}, \\qquad \\frac{A_{21}}{B_{21}} = \\frac{8\\pi h \\nu^3}{c^3}',
      explanation: 'Relates the spontaneous-emission coefficient to the stimulated-emission coefficient; the ratio grows with the cube of frequency.',
      variables: [
        { symbol: 'A_{21}', name: 'Spontaneous emission coefficient', unit: 's⁻¹' },
        { symbol: 'B_{21}', name: 'Stimulated emission coefficient', unit: 'm³·J⁻¹·s⁻²' },
        { symbol: '\\nu', name: 'Transition frequency', unit: 'Hz' },
        { symbol: 'c', name: 'Speed of light', unit: 'm/s' }
      ]
    },
    diagramKey: 'einstein-coefficients',
    realWorldApplication: {
      title: 'Why Blue LEDs Were Hard to Build',
      description: 'The ν³ law says high-frequency (blue/UV) emitters lose energy to spontaneous emission faster. Growing defect-free GaN layers to beat non-radiative losses is precisely why the 2014 Nobel Prize (Akasaki, Amano, Nakamura) for the blue LED took decades.',
      industry: 'Optoelectronics (LED & Laser Diodes)'
    },
    relations: [
      { targetId: 'three-quantum-processes', type: 'part_of', reason: 'The coefficients quantify the rates of the three quantum processes.' },
      { targetId: 'population-inversion', type: 'prerequisite_of', reason: 'Whether stimulated emission wins over absorption depends on the population ratio N₂/N₁.' }
    ],
    practiceQuestions: [
      {
        id: 'q-ec-1',
        conceptId: 'einstein-coefficients',
        prompt: 'According to Einstein\'s relations, how does the ratio A/B of spontaneous to stimulated emission coefficient depend on frequency ν?',
        options: [
          { id: 'a', text: 'Proportional to ν', explanation: 'The dependence is stronger than linear — check the ν³ law.' },
          { id: 'b', text: 'Proportional to ν³', explanation: 'Correct! A/B = 8πhν³/c³, so spontaneous emission grows cubically with frequency.' },
          { id: 'c', text: 'Inversely proportional to ν³', explanation: 'That would make spontaneous emission dominant at LOW frequencies — the opposite of observation.' },
          { id: 'd', text: 'Independent of ν', explanation: 'The ratio carries an explicit ν³ factor; it is frequency dependent.' }
        ],
        prerequisiteHintId: 'three-quantum-processes',
        explanation: 'Einstein\'s equilibrium derivation gives A₂₁/B₂₁ = 8πhν³/c³ — spontaneous emission becomes increasingly dominant at higher (optical) frequencies.',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'population-inversion',
    title: 'Population Inversion and Pumping',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'Engineering an unnatural state where more atoms sit in the upper level than the lower one — the precondition for net light amplification.',
    learningObjective: 'Explain why thermal equilibrium prevents lasing, define population inversion, and describe pumping plus the role of a metastable state.',
    storyAnalogy: {
      hook: 'In any ordinary system, more people stand on the ground floor than on the roof. A laser needs the rooftop crowded.',
      analogy: 'At room temperature, Boltzmann statistics put overwhelmingly more atoms in the lower level — like gravity keeps most hikers in the valley. To lase, you must haul more than half the hikers uphill (pumping) and give them a comfortable ledge (metastable state) where they wait instead of immediately sliding down.',
      connection: 'With N₂ > N₁, a passing photon meets more atoms ready to clone it (stimulated emission) than eager to eat it (absorption): gain > 1. Light is amplified, not absorbed.'
    },
    explanationSections: [
      {
        heading: '1. Why Equilibrium Cannot Lase',
        content: 'Boltzmann\'s law N₂/N₁ = e^(−hν/kT) makes N₂ < N₁ for any positive gap at ordinary temperatures. With N₂ < N₁, absorption dominates stimulated emission — light passing through is attenuated, never amplified.'
      },
      {
        heading: '2. Pumping: Creating the Inversion',
        content: 'Population inversion (N₂ > N₁) is created by pumping energy in: optical pumping with a flashlamp (ruby), electrical discharge (He-Ne), electric current injection (laser diodes), or chemical reactions. Pumping must be strong enough to overcome decay.'
      },
      {
        heading: '3. The Metastable State Trick',
        content: 'Ordinary excited states last ~10⁻⁸ s — too short to accumulate population. A metastable state lives ~10⁻³ s (100,000× longer). Real lasers use (at least) three levels: pump atoms into a short-lived high level that quickly drains into the metastable level, where the population piles up and inversion is achieved relative to the ground state.'
      }
    ],
    formula: {
      title: 'Boltzmann Distribution & Inversion Condition',
      latex: '\\frac{N_2}{N_1} = e^{-h\\nu/kT} < 1 \\; (\\text{equilibrium}), \\qquad \\text{Lasing requires } N_2 > N_1',
      explanation: 'Thermal equilibrium forbids inversion; only external pumping can make the upper-level population exceed the lower-level one.',
      variables: [
        { symbol: 'N_1, N_2', name: 'Populations of lower and upper levels', unit: 'atoms/m³' },
        { symbol: 'k', name: 'Boltzmann constant', unit: 'J/K' },
        { symbol: 'T', name: 'Absolute temperature', unit: 'K' }
      ]
    },
    diagramKey: 'population-inversion',
    realWorldApplication: {
      title: 'Optical Fiber Amplifiers (EDFA) Carry the Internet',
      description: 'Erbium-doped fiber amplifiers pump erbium ions at 980 nm to build population inversion on a metastable level; incoming 1550 nm data signals stimulate emission and are amplified without any conversion to electricity — the reason transatlantic cables work.',
      industry: 'Optical Telecommunications'
    },
    relations: [
      { targetId: 'einstein-coefficients', type: 'part_of', reason: 'Inversion is exactly the condition N₂B₂₁ > N₁B₁₂ from the rate equations.' },
      { targetId: 'laser-components', type: 'prerequisite_of', reason: 'The pump and active medium exist to create and hold the inversion.' },
      { targetId: 'ruby-laser', type: 'prerequisite_of', reason: 'Ruby achieves inversion on a metastable Cr³⁺ level via flashlamp pumping.' }
    ],
    practiceQuestions: [
      {
        id: 'q-pi-1',
        conceptId: 'population-inversion',
        prompt: 'Why is a metastable state essential for achieving population inversion?',
        options: [
          { id: 'a', text: 'It absorbs the pump photons', explanation: 'Absorption happens in the lower level; the metastable state is an UPPER level that stores atoms.' },
          { id: 'b', text: 'It stores excited atoms ~10⁵ times longer than ordinary states, letting population pile up', explanation: 'Correct! Its ~10⁻³ s lifetime (vs 10⁻⁸ s) lets pumping accumulate atoms faster than they decay.' },
          { id: 'c', text: 'It emits photons spontaneously at a higher rate', explanation: 'Longer lifetime means SLOWER spontaneous emission — that is precisely the point.' },
          { id: 'd', text: 'It lowers the energy gap to zero', explanation: 'The gap stays finite; only the lifetime is unusual.' }
        ],
        prerequisiteHintId: 'einstein-coefficients',
        explanation: 'Normal excited states decay in ~10⁻⁸ s, faster than pumping can accumulate atoms. A metastable state (~10⁻³ s) acts as a reservoir, allowing N₂ to exceed N₁.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'laser-components',
    title: 'Components of a Laser',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'Every laser has three jobs to do: pump energy in, store atoms ready to amplify, and feed light back and forth through the gain medium.',
    learningObjective: 'Identify the pumping source, active medium and optical resonator cavity, and explain the role of each in producing sustained oscillation.',
    storyAnalogy: {
      hook: 'Think of a laser as a microphone held too close to its own speaker — a howl builds up out of pure feedback.',
      analogy: 'The speaker-microphone loop is the optical cavity: photons bounce between two mirrors, passing through the gain medium again and again. The pump is the power supply feeding the amp; the active medium is the amplifier itself; the partially-silvered output mirror lets a fixed fraction of the howl escape as the usable beam.',
      connection: 'Lasing starts when the round-trip gain exceeds the round-trip loss — gain equals loss is the oscillation threshold.'
    },
    explanationSections: [
      {
        heading: '1. Pumping Source',
        content: 'Supplies energy to create population inversion: flashlamp (ruby), electric discharge (He-Ne, CO₂), diode pumping (fiber lasers, DPSS), or current injection (semiconductor lasers).'
      },
      {
        heading: '2. Active Medium',
        content: 'The material whose atoms/ions/molecules provide the lasing energy levels — Cr³⁺ ions in an aluminum-oxide crystal (ruby), He-Ne gas mixture, Nd³⁺ ions in YAG, or electron-hole pairs in a GaAs junction. It may be solid, gas, liquid (dye) or semiconductor.'
      },
      {
        heading: '3. Optical Resonator Cavity',
        content: 'Two parallel mirrors (one ~100% reflective, one ~98% for output) enclosing the medium. Photons traverse the medium repeatedly, stimulating more emissions. Only axial photons survive many round trips, which is why the beam is so directional and monochromatic (standing-wave modes select discrete frequencies).'
      }
    ],
    formula: {
      title: 'Laser Oscillation Threshold',
      latex: 'G \\cdot R_1 R_2 \\, e^{2\\alpha L} \\ge 1',
      explanation: 'Round-trip gain must at least compensate mirror and internal losses for lasing to sustain.',
      variables: [
        { symbol: 'G', name: 'Single-pass gain of the medium', unit: 'dimensionless' },
        { symbol: 'R_1, R_2', name: 'Mirror reflectivities', unit: 'dimensionless' },
        { symbol: 'L', name: 'Cavity length', unit: 'm' },
        { symbol: '\\alpha', name: 'Internal loss coefficient', unit: 'm⁻¹' }
      ]
    },
    diagramKey: 'laser-components',
    realWorldApplication: {
      title: 'Fiber Lasers in Sheet-Metal Cutting',
      description: 'A Yb-doped fiber laser pumps the doped fiber core (active medium) with diodes (pump), using fiber Bragg gratings as the cavity mirrors — a rugged, air-cooled 10 kW laser that cuts 20 mm steel plates in car and ship factories.',
      industry: 'Industrial Manufacturing'
    },
    relations: [
      { targetId: 'population-inversion', type: 'part_of', reason: 'Pump + medium exist to create inversion; the cavity turns gain into oscillation.' },
      { targetId: 'ruby-laser', type: 'prerequisite_of', reason: 'Ruby is the classic three-part laser assembly.' }
    ],
    practiceQuestions: [
      {
        id: 'q-lc-1',
        conceptId: 'laser-components',
        prompt: 'What is the purpose of the optical resonator cavity in a laser?',
        options: [
          { id: 'a', text: 'To pump atoms to the upper level', explanation: 'Pumping is the job of the flashlamp/discharge/current source, not the mirrors.' },
          { id: 'b', text: 'To provide optical feedback so photons pass through the gain medium repeatedly, sustaining oscillation', explanation: 'Correct! Mirrors recycle photons through the medium, and the gain builds until it balances losses.' },
          { id: 'c', text: 'To absorb spontaneous emission', explanation: 'The cavity does not absorb; it selects and recirculates axial photons.' },
          { id: 'd', text: 'To cool the active medium', explanation: 'Cooling may be needed thermally, but it is not the optical function of the cavity.' }
        ],
        prerequisiteHintId: 'population-inversion',
        explanation: 'The two mirrors form a feedback loop: photons make many passes through the inverted medium, amplifying until round-trip gain equals round-trip loss — the threshold of oscillation.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'ruby-laser',
    title: 'Ruby Laser (Three-Level Solid-State Laser)',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'The first laser ever built (Maiman, 1960): a flashlamp-pumped sapphire crystal doped with chromium ions, lasing deep red at 694.3 nm.',
    learningObjective: 'Describe the three-level scheme of the ruby laser, its pumping and construction, and why it operates in pulsed mode.',
    storyAnalogy: {
      hook: 'The first thing humanity\'s laser ever did was shine a brilliant crimson pulse — out of a synthetic gemstone.',
      analogy: 'A flashlamp wraps a ruby rod like a helix and fires like a camera flash: Cr³⁺ ions absorb green/blue light and jump to a broad band, tumble down quickly into a metastable level, and when more than half the ions are stored there, a cascade of 694.3 nm photons erupts along the rod.',
      connection: 'Because more than half the atoms must be lifted out of the ground state before ANY gain appears, three-level lasers need brutal pumping and run in pulses, not continuously.'
    },
    explanationSections: [
      {
        heading: '1. Construction',
        content: 'A ruby rod (Al₂O₃ doped with ~0.05% Cr³⁺) with its ends polished parallel (one silvered ~100%, one ~90%), surrounded by a helical xenon flashlamp and often a liquid-nitrogen cooled enclosure.'
      },
      {
        heading: '2. Three-Level Operation',
        content: 'Level 1 = ground state. Pump: Cr³⁺ absorbs ~550 nm light to broad level 3, which decays non-radiatively in ~10⁻⁸ s to metastable level 2 (~3 ms lifetime). When N₂ > N₁/2 (more than half), inversion with the ground state exists and stimulated emission at 694.3 nm (deep red) avalanches.'
      },
      {
        heading: '3. Why Pulsed',
        content: 'Reaching inversion from the ground state requires >50% of ALL atoms to be excited, consuming enormous flash energy and heat. The flash fires, a giant pulse emerges, the medium must then re-pump — hence pulsed output (spiking behavior), unsuited to continuous operation.'
      }
    ],
    formula: {
      title: 'Ruby Laser Emission',
      latex: '\\lambda = 694.3\\,\\text{nm} \\; (\\text{Cr}^{3+} : E_2 \\to E_1), \\quad \\text{three-level: } N_2 > \\tfrac{N_1}{2} \\text{ needed}',
      explanation: 'The chromium ion\'s metastable-to-ground transition defines the deep-red output; three-level schemes must clear more than half the ground population first.',
      variables: [
        { symbol: '\\lambda', name: 'Output wavelength', unit: 'nm' },
        { symbol: 'N_1, N_2', name: 'Ground / metastable populations', unit: 'ions' }
      ]
    },
    diagramKey: 'ruby-laser',
    realWorldApplication: {
      title: 'Laser Hair Removal & Tattoo Removal',
      description: 'Modern Q-switched Nd:YAG and ruby-based dermatology lasers fire nanosecond pulses that shatter pigment particles in skin — a direct descendant of Maiman\'s pulsed ruby design.',
      industry: 'Medical & Dermatology'
    },
    relations: [
      { targetId: 'laser-components', type: 'part_of', reason: 'Ruby assembles pump + medium + cavity in the classic way.' },
      { targetId: 'population-inversion', type: 'related_to', reason: 'Three-level inversion is the hardest kind — this motivates four-level designs.' },
      { targetId: 'he-ne-laser', type: 'prerequisite_of', reason: 'He-Ne\'s four-level scheme solves the pumping inefficiency of the three-level ruby.' }
    ],
    practiceQuestions: [
      {
        id: 'q-rl-1',
        conceptId: 'ruby-laser',
        prompt: 'Why does a ruby laser (three-level) operate in pulsed mode rather than continuously?',
        options: [
          { id: 'a', text: 'Its wavelength is too long for continuous emission', explanation: 'Wavelength has nothing to do with pulsed vs CW operation.' },
          { id: 'b', text: 'The lower laser level is the ground state, so >50% of all atoms must be excited to gain inversion — extremely demanding pumping', explanation: 'Correct! Three-level lasers must clear most of the ground population; only flash pumping achieves it, then the medium must recover.' },
          { id: 'c', text: 'Mirrors cannot stay aligned continuously', explanation: 'Alignment is a mechanical issue, not the fundamental reason.' },
          { id: 'd', text: 'Ruby melts at room temperature', explanation: 'Sapphire (Al₂O₃) is extremely hard and heat-tolerant; heating is managed but not the core reason.' }
        ],
        prerequisiteHintId: 'population-inversion',
        explanation: 'In a three-level laser the ground state is the lower laser level, so intense flashlamp pulses are required to invert; the system then lases in bursts and needs time to re-establish inversion.',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'he-ne-laser',
    title: 'He-Ne Laser (Four-Level Gas Laser)',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'The classroom workhorse: a helium-neon gas discharge producing a continuous, highly pure 632.8 nm red beam via a four-level scheme.',
    learningObjective: 'Explain energy transfer between He and Ne atoms, the four-level inversion, and the advantages over three-level lasers.',
    storyAnalogy: {
      hook: 'Helium and neon form the perfect crime partnership: one steals the energy, the other spends it.',
      analogy: 'Energetic electrons in a discharge excite helium atoms to a long-lived level (20.61 eV). Excited He atoms collide with ground-state Ne atoms and hand over the energy almost exactly (Ne\'s 20.66 eV level) — resonant transfer. Neon, now crowded in its upper 3s₂ level, lases down to a 2p level at 632.8 nm, then drains quickly to a lower level and finally to ground.',
      connection: 'Because the LOWER laser level empties rapidly to a level above ground, inversion needs only a small population in the upper level — efficient, continuous, low-power operation.'
    },
    explanationSections: [
      {
        heading: '1. Construction',
        content: 'A narrow glass/discharge tube (~30-80 cm) filled with He:Ne ≈ 10:1 at ~1 torr, with electrodes; external or internal mirrors form the cavity; one mirror is a ~99% output coupler.'
      },
      {
        heading: '2. Four-Level Kinetics',
        content: 'E₀ ground (Ne) → pump by collision to E₁ (Ne 3s₂ via He transfer) → laser transition E₁→E₂ at 632.8 nm (spontaneous lifetime ~10⁻⁸ s for upper, but fast ~10⁻⁸ s drain of E₂ to E₃) → E₃ relaxes to ground by collisions with the walls. Inversion exists between E₁ and E₂ because E₂ empties nearly instantly.'
      },
      {
        heading: '3. Why Four-Level Beats Three-Level',
        content: 'The lower laser level is NOT the ground state — it is empty at thermal equilibrium. Inversion is reached with tiny pumping, enabling CW output of ~1-50 mW with excellent coherence (longitudinal mode purity), used for decades in alignment, barcode scanning and holography.'
      }
    ],
    formula: {
      title: 'He-Ne Energy Transfer & Output',
      latex: '\\text{He}(2^1S, 20.61\\,\\text{eV}) + \\text{Ne} \\to \\text{He} + \\text{Ne}(3s_2, 20.66\\,\\text{eV}), \\quad \\lambda_{\\text{laser}} = 632.8\\,\\text{nm}',
      explanation: 'Resonant (near-equal) energy transfer from metastable helium to neon populates the upper laser level; the 3s→2p transition gives the red beam.',
      variables: [
        { symbol: 'E', name: 'Excitation energies (eV)', unit: 'eV' },
        { symbol: '\\lambda', name: 'Output wavelength', unit: 'nm' }
      ]
    },
    diagramKey: 'he-ne-laser',
    realWorldApplication: {
      title: 'Barcode Scanners & Interferometric Metrology',
      description: 'Supermarket barcode scanners and laboratory Michelson interferometers used 632.8 nm He-Ne beams for decades: the wavelength is so stable it serves as a length reference — the meter itself was once defined via krypton and calibrated with such stabilized lasers.',
      industry: 'Retail Automation & Precision Metrology'
    },
    relations: [
      { targetId: 'ruby-laser', type: 'related_to', reason: 'Four-level scheme solves the three-level pumping burden.' },
      { targetId: 'laser-components', type: 'part_of', reason: 'Discharge pump + gas medium + mirror cavity.' },
      { targetId: 'laser-properties', type: 'prerequisite_of', reason: 'The pure 632.8 nm line showcases laser coherence and monochromaticity.' }
    ],
    practiceQuestions: [
      {
        id: 'q-hn-1',
        conceptId: 'he-ne-laser',
        prompt: 'What key advantage does the four-level He-Ne scheme have over the three-level ruby scheme?',
        options: [
          { id: 'a', text: 'It requires no pumping source', explanation: 'A discharge still pumps He atoms — the advantage is efficiency, not zero pumping.' },
          { id: 'b', text: 'The lower laser level is not the ground state and empties quickly, so inversion needs only weak pumping and can be continuous', explanation: 'Correct! With an already-empty lower level, any upper-level population immediately gives inversion.' },
          { id: 'c', text: 'Helium has more energy levels than chromium', explanation: 'The advantage is the LEVEL ARRANGEMENT (empty lower level), not the count of levels per se.' },
          { id: 'd', text: 'Gas atoms move faster than crystal ions', explanation: 'Atomic speed is irrelevant to inversion efficiency.' }
        ],
        prerequisiteHintId: 'ruby-laser',
        explanation: 'In four-level lasers the lower laser level sits above ground and drains rapidly, so it is effectively always empty — weak continuous pumping maintains inversion, enabling CW output.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'laser-properties',
    title: 'Characteristic Properties of Laser Light',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'Directionality, monochromaticity, coherence and high intensity — four properties that separate laser light from every thermal source.',
    learningObjective: 'Quantify and explain the four hallmark properties of laser radiation and connect each to its engineering applications.',
    storyAnalogy: {
      hook: 'A candle lights a room; a laser draws a line on the Moon.',
      analogy: 'Directionality: laser light spreads only ~10⁻⁶ radians — Apollo 11\'s retro-reflectors still return pulses from Earth. Monochromaticity: a He-Ne line is ~10⁻⁹ nm wide versus a bulb\'s whole rainbow. Coherence: wavefronts stay in step over kilometers — the property that makes holograms and interferometers possible.',
      connection: 'All four trace back to stimulated emission in a cavity: cloned photons in one mode = same direction, same wavelength, same phase, all stacked in one tight beam.'
    },
    explanationSections: [
      {
        heading: '1. Directionality',
        content: 'Because only axial photons survive the cavity, the beam divergence θ ≈ λ/(πw) is microradians. A 1 mW He-Ne beam at 1 km is only ~1 mm wider than at the aperture. Consequence: alignment, ranging, LIDAR, laser communiqué over free space.'
      },
      {
        heading: '2. Monochromaticity',
        content: 'Cavity standing-wave modes select one narrow frequency: linewidths of ~10⁶ Hz (≈10⁻¹⁵ m at 633 nm) versus ~10¹⁴ Hz spread for thermal sources. Consequence: clean interference with huge path differences, wavelength-division multiplexing in fiber.'
      },
      {
        heading: '3. Coherence (Spatial + Temporal)',
        content: 'Temporal coherence length c/Δν can reach meters-kilometers; spatial coherence across the beam is near-perfect. Consequence: holography, OCT medical imaging, LIGO detecting 10⁻¹⁸ m path changes.'
      },
      {
        heading: '4. High Intensity / Brightness',
        content: 'Power concentrated into ~10⁻⁶ sr of solid angle and a single frequency: intensities of 10¹⁴ W/cm² are routine in pulsed lab lasers — enough to strip electrons off atoms (plasma), weld metals, or drive inertial-confinement fusion.'
      }
    ],
    formula: {
      title: 'Divergence & Coherence Relations',
      latex: '\\theta_{\\text{div}} \\approx \\frac{\\lambda}{\\pi w}, \\qquad L_c = \\frac{c}{\\Delta \\nu}',
      explanation: 'Diffraction-limited divergence grows with wavelength over beam waist; coherence length is inversely proportional to linewidth.',
      variables: [
        { symbol: '\\theta_{\\text{div}}', name: 'Beam divergence half-angle', unit: 'rad' },
        { symbol: 'w', name: 'Beam waist radius', unit: 'm' },
        { symbol: 'L_c', name: 'Temporal coherence length', unit: 'm' },
        { symbol: '\\Delta \\nu', name: 'Linewidth', unit: 'Hz' }
      ]
    },
    diagramKey: 'laser-properties',
    realWorldApplication: {
      title: 'LIDAR in Autonomous Vehicles',
      description: 'Self-driving cars fire 905/1550 nm pulsed lasers and time photon returns to build cm-resolution 3D maps at 100+ m — only a directional, coherent, bright beam makes eye-safe long-range ranging possible.',
      industry: 'Automotive & Robotics'
    },
    relations: [
      { targetId: 'he-ne-laser', type: 'related_to', reason: 'The 632.8 nm line is the textbook demonstration of all four properties.' },
      { targetId: 'sustained-interference', type: 'related_to', reason: 'Coherence is precisely the sustained-interference condition satisfied by lasers.' }
    ],
    practiceQuestions: [
      {
        id: 'q-lp-1',
        conceptId: 'laser-properties',
        prompt: 'Which property of laser light allows it to stay sharply focused over kilometers?',
        options: [
          { id: 'a', text: 'High intensity', explanation: 'Brightness helps, but a searchlight is bright and still spreads — directionality is the answer.' },
          { id: 'b', text: 'Directionality (extremely low divergence)', explanation: 'Correct! Cavity feedback keeps only axial photons, giving microradian divergence and km-scale tight beams.' },
          { id: 'c', text: 'Monochromaticity', explanation: 'Single color affects interference quality, not beam spread.' },
          { id: 'd', text: 'Polarization', explanation: 'Most He-Ne beams are randomly polarized; polarization is not the focusing factor.' }
        ],
        prerequisiteHintId: 'laser-components',
        explanation: 'The resonator cavity amplifies only photons traveling along the axis, so the emerging beam has diffraction-limited divergence of the order of λ/(πw) — microradians.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'optical-fiber-basics',
    title: 'Optical Fiber: Structure and Propagation by Total Internal Reflection',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'A hair-thin glass waveguide: dense core inside lighter cladding, trapping light by total internal reflection over thousands of kilometers.',
    learningObjective: 'Describe core-cladding-jacket construction, state the TIR conditions, and explain how light propagates along a bent fiber.',
    storyAnalogy: {
      hook: 'How do you make light take a curved path? You build it a hallway of mirrors it cannot escape.',
      analogy: 'A fiber is a light pipeline: the core (glass, higher index n₁) is the hallway; the cladding (lower index n₂) is the wall. Light hitting the wall at a grazing angle is totally reflected — no exit, 100% bounce — so it zigzags forward, even around corners, as if the glass were a liquid-light pipe.',
      connection: 'Total internal reflection only works when the core index exceeds the cladding index AND the strike angle exceeds the critical angle — the two numbers that define every fiber specification.'
    },
    explanationSections: [
      {
        heading: '1. Structure: Core, Cladding, Jacket',
        content: 'Core (doped silica, n₁ ≈ 1.48, diameter 8-62.5 μm) carries the light. Cladding (pure silica, n₂ < n₁, ~125 μm) confines it and adds mechanical strength. Jacket (plastic) protects against moisture and abrasion.'
      },
      {
        heading: '2. Total Internal Reflection (TIR)',
        content: 'When light travels from a denser (n₁) to a rarer (n₂) medium, refraction bends away from the normal. Beyond the critical angle θc (sin θc = n₂/n₁), the ray reflects entirely back: Fresnel reflectivity = 1, transmittance = 0. Glass-air critical angle ≈ 41.8°.'
      },
      {
        heading: '3. Propagation Along a Bent Fiber',
        content: 'Rays bounce between core-cladding walls thousands of times per meter (meridional rays cross the axis; skew rays spiral). Because reflections are total (loss < 0.1 dB per bounce), light follows gentle bends — the basis of endoscopes and telecom cables that wrap around drums.'
      }
    ],
    formula: {
      title: 'Critical Angle for TIR',
      latex: '\\sin\\theta_c = \\frac{n_2}{n_1} \\quad (n_1 > n_2)',
      explanation: 'Rays striking the core-cladding boundary at angles ≥ θc (measured from the normal) reflect totally and stay guided.',
      variables: [
        { symbol: '\\theta_c', name: 'Critical angle', unit: 'degrees' },
        { symbol: 'n_1', name: 'Core refractive index', unit: 'dimensionless' },
        { symbol: 'n_2', name: 'Cladding refractive index', unit: 'dimensionless' }
      ]
    },
    diagramKey: 'optical-fiber-basics',
    realWorldApplication: {
      title: 'Endoscopy: Seeing Inside the Body',
      description: 'A medical endoscope bundles ~50,000 fibers; each pixel fiber carries its patch of the illuminated tissue image out coherently, letting surgeons see and operate through a 10 mm incision with zero light leakage.',
      industry: 'Medical Devices'
    },
    relations: [
      { targetId: 'three-quantum-processes', type: 'related_to', reason: 'The fiber carries the coherent light that lasers generate.' },
      { targetId: 'acceptance-angle-na', type: 'prerequisite_of', reason: 'TIR geometry defines the acceptance cone and numerical aperture.' }
    ],
    practiceQuestions: [
      {
        id: 'q-of-1',
        conceptId: 'optical-fiber-basics',
        prompt: 'For total internal reflection to occur at the core-cladding boundary of an optical fiber, which condition must hold?',
        options: [
          { id: 'a', text: 'Core index less than cladding index', explanation: 'TIR requires going from DENSER to RARER: n₁ (core) must exceed n₂ (cladding).' },
          { id: 'b', text: 'Core index greater than cladding index, and the ray angle exceeds the critical angle', explanation: 'Correct! sin θc = n₂/n₁ with n₁ > n₂; rays beyond θc reflect totally and remain guided.' },
          { id: 'c', text: 'Cladding index greater than core index', explanation: 'That arrangement lets light escape into the cladding by ordinary refraction.' },
          { id: 'd', text: 'Core diameter smaller than the wavelength', explanation: 'Small cores matter for single-mode behavior, not for the TIR condition itself.' }
        ],
        prerequisiteHintId: 'wave-fundamentals',
        explanation: 'TIR happens when light in the denser core strikes the boundary beyond the critical angle sin θc = n₂/n₁ (n₁ > n₂), reflecting 100% back into the core.',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'acceptance-angle-na',
    title: 'Acceptance Angle, Numerical Aperture & Fractional Index Change',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'The light-collecting power of a fiber: the widest entry cone (acceptance angle) still guided by TIR, measured by NA = √(n₁² − n₂²).',
    learningObjective: 'Derive numerical aperture from the acceptance cone geometry, compute NA and fractional refractive index change Δ, and relate NA to V-number.',
    storyAnalogy: {
      hook: 'A funnel with a wide mouth drinks fast; a fiber with a wide acceptance cone drinks more light.',
      analogy: 'Rays entering the fiber face within the acceptance cone strike the core-cladding wall beyond the critical angle and stay trapped. Rays outside the cone refract into the cladding and are lost. The cone\'s half-angle θa is the acceptance angle; its sine (times air index) is the numerical aperture — the fiber\'s light-gathering f-stop.',
      connection: 'NA = √(n₁² − n₂²) = n₁√(2Δ). Bigger index contrast → wider cone → easier coupling from LEDs, but more modes and more signal spreading.'
    },
    explanationSections: [
      {
        heading: '1. Deriving the Acceptance Angle',
        content: 'Apply Snell\'s law at the air-core face (n₀ sin θa = n₁ sin θr) plus TIR condition inside (θr = 90° − θc). Combining: n₀ sin θa = √(n₁² − n₂²). This quantity is the Numerical Aperture, NA.'
      },
      {
        heading: '2. Fractional Refractive Index Change',
        content: 'Δ = (n₁² − n₂²)/(2n₁²) ≈ (n₁ − n₂)/n₁ measures the relative index step between core and cladding. NA = n₁√(2Δ). Typical telecom fiber: n₁ = 1.470, n₂ = 1.460 → NA ≈ 0.17 (small cone, tight guidance).'
      },
      {
        heading: '3. V-Number (Normalized Frequency)',
        content: 'V = (2πa/λ)·NA where a = core radius. V decides how many modes the fiber supports: only one mode when V < 2.405; multimode fibers have V >> 2.405. V is the single number that classifies a fiber as single-mode or multimode.'
      }
    ],
    formula: {
      title: 'Numerical Aperture, Δ and V-number',
      latex: 'NA = \\sin\\theta_a = \\sqrt{n_1^2 - n_2^2} = n_1\\sqrt{2\\Delta}, \\quad \\Delta = \\frac{n_1^2 - n_2^2}{2n_1^2}, \\quad V = \\frac{2\\pi a}{\\lambda}\\,NA',
      explanation: 'The acceptance cone, index contrast and mode count of a fiber are all captured by NA, Δ and V.',
      variables: [
        { symbol: '\\theta_a', name: 'Acceptance angle (half-cone)', unit: 'degrees' },
        { symbol: 'NA', name: 'Numerical aperture', unit: 'dimensionless' },
        { symbol: '\\Delta', name: 'Fractional index change', unit: 'dimensionless' },
        { symbol: 'a', name: 'Core radius', unit: 'μm' },
        { symbol: 'V', name: 'V-number (normalized frequency)', unit: 'dimensionless' }
      ]
    },
    diagramKey: 'acceptance-angle-na',
    workedExample: {
      title: 'Computing NA and Acceptance Angle of a Step Fiber',
      problem: 'A step-index fiber has core index n₁ = 1.50 and cladding index n₂ = 1.45. Find the numerical aperture and the acceptance angle in air.',
      steps: [
        'Step 1: NA = √(n₁² − n₂²) = √(2.25 − 2.1025) = √0.1475 ≈ 0.384.',
        'Step 2: sin θa = NA → θa = arcsin(0.384) ≈ 22.6°.',
        'Step 3: Fractional index change Δ = (n₁ − n₂)/n₁ = 0.05/1.50 ≈ 0.0333 (3.3%).'
      ],
      solution: 'NA ≈ 0.384, acceptance angle ≈ 22.6°, Δ ≈ 0.033.'
    },
    realWorldApplication: {
      title: 'LED-to-Fiber Coupling Budget',
      description: 'LEDs radiate into a wide cone; only light inside the fiber\'s acceptance cone couples in. Designers choose NA ≈ 0.3-0.5 multimode fiber for LED-fed short links, accepting modal dispersion, while laser-fed long-haul lines use NA ≈ 0.14 single-mode fiber.',
      industry: 'Optical Communications'
    },
    relations: [
      { targetId: 'optical-fiber-basics', type: 'part_of', reason: 'NA quantifies the TIR acceptance geometry.' },
      { targetId: 'fiber-classification-applications', type: 'prerequisite_of', reason: 'V-number (via NA) determines single vs multimode classification.' }
    ],
    practiceQuestions: [
      {
        id: 'q-na-1',
        conceptId: 'acceptance-angle-na',
        prompt: 'A fiber has n₁ = 1.50 and n₂ = 1.47. What is its numerical aperture?',
        options: [
          { id: 'a', text: 'NA = 0.03', explanation: 'This is close to the index difference (n₁ − n₂), not the NA formula.' },
          { id: 'b', text: 'NA = 0.30', explanation: 'Correct! NA = √(1.50² − 1.47²) = √(2.25 − 2.1609) = √0.0891 ≈ 0.30.' },
          { id: 'c', text: 'NA = 2.97', explanation: 'NA cannot exceed 1 — it is the sine of an angle.' },
          { id: 'd', text: 'NA = 1.485', explanation: 'This is the average index; NA measures the contrast, not the mean.' }
        ],
        prerequisiteHintId: 'optical-fiber-basics',
        explanation: 'NA = √(n₁² − n₂²) = √(2.25 − 2.1609) = √0.0891 ≈ 0.299 ≈ 0.30, corresponding to an acceptance half-angle of ~17.5°.',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'fiber-classification-applications',
    title: 'Classification of Optical Fibers and Applications',
    unitId: 'unit-1-laser-fiber',
    unitTitle: 'UNIT-I: Laser and Fiber Optics',
    shortSummary: 'Step vs graded index, single vs multimode — and where each fiber class wins: telecom backbones, LANs, endoscopes and sensors.',
    learningObjective: 'Classify fibers by index profile and mode count, explain modal dispersion and grading, and match fiber types to real applications.',
    storyAnalogy: {
      hook: 'Marathon runners on a highway all arrive together only if the highway is perfectly flat — or if the inner lanes are slower.',
      analogy: 'In a step-index multimode fiber, steep-angle rays zigzag on longer paths and arrive late — modal dispersion smears the pulse. A graded-index fiber bends rays smoothly along a parabolic core: outer paths are LONGER but FASTER (lower index), so all rays arrive together. Single-mode fiber removes the race entirely — one lane, one runner.',
      connection: 'Classification = how many races are being run (modes) and whether the track is stepped or graded.'
    },
    explanationSections: [
      {
        heading: '1. Step-Index vs Graded-Index (Index Profile)',
        content: 'Step-index: abrupt n₁→n₂ boundary; rays reflect abruptly. Graded-index: core index peaks on axis (n₁ max) and decays parabolically outward, continuously refracting rays back — reduces modal dispersion dramatically (50 MHz·km → >1 GHz·km).'
      },
      {
        heading: '2. Single-Mode vs Multimode (Mode Count)',
        content: 'Single-mode: small core (5-10 μm), V < 2.405, one propagation mode → negligible modal dispersion, long-haul (100 km spans) at 1310/1550 nm. Multimode: core 50-62.5 μm, V >> 2.405, hundreds of modes → cheap sources/connectors, short reach (LANs, data centers, ≤2 km).'
      },
      {
        heading: '3. Application Map',
        content: 'Telecom backbone & submarine cables: single-mode silica at 1550 nm (loss ≈ 0.2 dB/km, EDFA amplifiers every ~80 km). Campus/data-center links: OM3/OM4 graded multimode. Medicine: imaging bundles (coherent) + light-delivery bundles (incoherent). Sensors: fiber Bragg gratings measure strain/temperature in bridges and pipelines.'
      }
    ],
    formula: {
      title: 'Single-Mode Cutoff Condition',
      latex: 'V = \\frac{2\\pi a}{\\lambda}\\sqrt{n_1^2 - n_2^2} < 2.405 \\;\\Rightarrow\\; \\text{single mode}',
      explanation: 'A fiber guides only the fundamental mode when its V-number is below 2.405 — the design rule behind every single-mode fiber.',
      variables: [
        { symbol: 'V', name: 'Normalized frequency (V-number)', unit: 'dimensionless' },
        { symbol: 'a', name: 'Core radius', unit: 'μm' },
        { symbol: '\\lambda', name: 'Operating wavelength', unit: 'nm' }
      ]
    },
    diagramKey: 'fiber-classification',
    realWorldApplication: {
      title: 'Submarine Cables Move 99% of International Data',
      description: '~500 fiber-optic submarine cables carry terabits per second between continents. Each is a stack of single-mode fibers (16-200 fiber pairs) with EDFA repeaters — a fraction of a dB loss per km makes 6,000 km Atlantic spans feasible.',
      industry: 'Global Telecommunications'
    },
    relations: [
      { targetId: 'acceptance-angle-na', type: 'part_of', reason: 'V-number derived from NA classifies the fiber.' },
      { targetId: 'laser-properties', type: 'related_to', reason: 'Single-mode fibers need the monochromatic, directional sources lasers provide.' }
    ],
    practiceQuestions: [
      {
        id: 'q-fc-1',
        conceptId: 'fiber-classification-applications',
        prompt: 'Why do long-haul telecommunication links use SINGLE-mode rather than multimode fiber?',
        options: [
          { id: 'a', text: 'Single-mode fiber is cheaper to manufacture', explanation: 'It is actually harder to make and splice; the choice is physics, not price.' },
          { id: 'b', text: 'With only one propagation mode, there is no modal dispersion, so pulses stay sharp over hundreds of kilometers', explanation: 'Correct! Multimode rays arrive at different times and smear the signal; one mode eliminates that.' },
          { id: 'c', text: 'Single-mode fiber has a larger numerical aperture', explanation: 'Single-mode fibers usually have SMALLER NA (tighter cone). True but opposite of the claim.' },
          { id: 'd', text: 'Glass is clearer in small cores', explanation: 'Glass purity is the same; clarity depends on material, not core size.' }
        ],
        prerequisiteHintId: 'acceptance-angle-na',
        explanation: 'Modal dispersion (different path lengths per mode) limits multimode bandwidth; single-mode fiber (V < 2.405) supports one mode, keeping pulses clean over 100+ km spans.',
        difficulty: 'intermediate'
      }
    ]
  }
];
