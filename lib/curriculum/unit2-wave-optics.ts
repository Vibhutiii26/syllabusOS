import { Curriculum } from '@/types/learning';

const UNIT2_CURRICULUM: Curriculum = {
  id: 'btech-applied-physics-ph31001',
  university: 'Technical University Model Curriculum (AICTE/UGC Aligned)',
  degree: 'Bachelor of Technology (B.Tech)',
  branch: 'Common First Year (All Branches: CSE / ECE / ME / EE / Civil)',
  academicYear: '2025-2026',
  semester: 'Semester 1',
  subjectCode: 'PH31001(T)',
  subjectName: 'Applied Physics (T)',
  unit: {
    id: 'unit-2-wave-optics',
    number: 2,
    title: 'UNIT-II: Wave Optics',
    description: 'Foundational wave mechanics, phase relationships, thin film interference, Newton’s rings, Michelson interferometer, and diffraction.',
    conceptIds: [
      'wave-fundamentals',
      'wave-parameters',
      'superposition',
      'phase-path-difference',
      'constructive-interference',
      'destructive-interference',
      'sustained-interference',
      'young-double-slit',
      'fringe-width',
      'interference-applications'
    ]
  },
  concepts: [
    {
      id: 'wave-fundamentals',
      title: 'Wave Fundamentals',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'Disturbances that transfer energy and momentum through a medium or vacuum without bulk transport of matter.',
      learningObjective: 'Define mechanical and electromagnetic waves, differentiate transverse vs longitudinal oscillations, and describe wave propagation.',
      storyAnalogy: {
        hook: 'Imagine dropping a single pebble into a dead-calm mountain lake.',
        analogy: 'Circular ripples expand outward across the surface. A floating dry leaf bobs up and down right where it is—it does not travel with the ripple to the shore. The wave transfers pure kinetic and potential energy across meters without dragging the water molecules along for the ride.',
        connection: 'All physical waves, whether ocean swells, sound vibrating air in a lecture hall, or laser pulses crossing optical fibers, carry energy through local periodic disturbance.'
      },
      explanationSections: [
        {
          heading: '1. What is a Wave?',
          content: 'A wave is a self-propagating oscillatory disturbance that carries energy and momentum through space and time. Importantly, matter itself undergoes only local displacement about an equilibrium position; bulk material does not travel from source to detector.'
        },
        {
          heading: '2. Transverse vs. Longitudinal Oscillations',
          content: 'In transverse waves (e.g., ripples on water, electromagnetic light waves), the disturbance oscillates perpendicular (90°) to the direction of propagation. In longitudinal waves (e.g., sound waves, acoustic pressure waves), particles oscillate parallel to the wave motion through alternating compressions and rarefactions.'
        },
        {
          heading: '3. Propagation Medium',
          content: 'Mechanical waves strictly require an elastic material medium with inertia and elasticity to propagate. Electromagnetic waves (light, X-rays, microwaves) consist of coupled oscillating electric and magnetic fields and freely propagate through absolute vacuum at speed c ≈ 3 × 10⁸ m/s.'
        }
      ],
      diagramKey: 'wave-fundamentals',
      realWorldApplication: {
        title: 'Seismic Wave Geophysics and Structural Safety',
        description: 'Earthquake tremors produce both longitudinal P-waves (compressional, traveling fast through rock) and transverse S-waves (shear, causing structural shearing). Structural engineers design high-rise dampers tuned to absorb these wave frequencies.',
        industry: 'Civil & Geotechnical Engineering'
      },
      relations: [
        {
          targetId: 'wave-parameters',
          type: 'prerequisite_of',
          reason: 'Understanding what a wave is is necessary before quantifying amplitude, frequency, and phase.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-wf-1',
          conceptId: 'wave-fundamentals',
          prompt: 'When a mechanical wave propagates through an elastic medium, what is transported across space?',
          options: [
            { id: 'a', text: 'Bulk material and matter only', explanation: 'Particles only oscillate locally around their equilibrium; matter is not transported in bulk.' },
            { id: 'b', text: 'Energy and momentum without net transport of matter', explanation: 'Correct! Waves convey energy and momentum while medium particles oscillate locally.' },
            { id: 'c', text: 'Only electrical charge', explanation: 'Mechanical waves propagate through neutral matter without moving charge packets across distances.' },
            { id: 'd', text: 'Static gravitational potential', explanation: 'Waves are dynamic propagating disturbances, not static fields.' }
          ],
          correctOptionId: 'b',
          explanation: 'Waves transport energy and momentum through oscillations of particles or fields without permanent displacement of the medium.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'wave-parameters',
      title: 'Amplitude, Frequency, Wavelength, and Phase',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'The quantitative mathematical parameters that characterize any harmonic wave in space and time.',
      learningObjective: 'Calculate wave speed, angular frequency, wavenumber, and evaluate instantaneous phase of harmonic waves.',
      storyAnalogy: {
        hook: 'Watch a runner on a circular track while measuring their shadow cast on the stadium wall.',
        analogy: 'As the runner moves at constant speed in a circle, their shadow moves back and forth in pure harmonic motion. The radius of the track is Amplitude (maximum stretch). The time to complete one lap is the Period (T = 1/f). The runner’s current angular position on the circle (0° to 360°) is their instantaneous Phase.',
        connection: 'Phase is simply an angle describing where a vibrating particle or field is within its repeating cycle.'
      },
      explanationSections: [
        {
          heading: '1. Spatial and Temporal Wave Parameters',
          content: 'Amplitude (A) is the maximum displacement from equilibrium. Wavelength (λ) is the physical distance between consecutive identical crests. Frequency (f) is cycles per second (Hertz), while Period (T = 1/f) is the seconds per cycle.'
        },
        {
          heading: '2. The Wave Equation & Speed',
          content: 'Wave velocity v is related to frequency and wavelength by v = f · λ = ω / k. Here ω = 2πf is the angular frequency (rad/s), and k = 2π / λ is the spatial wavenumber (rad/m).'
        },
        {
          heading: '3. What is Phase (φ)?',
          content: 'In the harmonic expression y(x, t) = A sin(kx - ωt + φ₀), the full argument (kx - ωt + φ₀) is the instantaneous phase. Two waves with identical phase are in-step (both at crests together); if phase difference is 180° (π radians), one is at a peak while the other is at a trough.'
        }
      ],
      formula: {
        title: 'Wave Velocity & Angular Relations',
        latex: 'v = f \\lambda = \\frac{\\omega}{k}, \\quad y(x, t) = A \\sin(kx - \\omega t + \\phi_0)',
        explanation: 'Relates propagation speed v to frequency f, wavelength λ, angular frequency ω = 2πf, and propagation constant k = 2π/λ.',
        variables: [
          { symbol: 'v', name: 'Wave propagation speed', unit: 'm/s' },
          { symbol: 'A', name: 'Amplitude (peak displacement)', unit: 'm' },
          { symbol: 'f', name: 'Frequency', unit: 'Hz (s⁻¹)' },
          { symbol: '\\lambda', name: 'Wavelength', unit: 'm' },
          { symbol: 'k', name: 'Wavenumber (2π/λ)', unit: 'rad/m' },
          { symbol: '\\omega', name: 'Angular frequency (2πf)', unit: 'rad/s' },
          { symbol: '\\phi_0', name: 'Initial phase angle', unit: 'rad' }
        ]
      },
      diagramKey: 'wave-parameters',
      workedExample: {
        title: 'Determining Speed and Wavenumber of a Green Laser',
        problem: 'A green laser pointer emits light with a wavelength of 532 nm (532 × 10⁻⁹ m) in air. Calculate its frequency f and wavenumber k, assuming speed of light c = 3 × 10⁸ m/s.',
        steps: [
          'Step 1: Use v = f · λ ⇒ f = c / λ.',
          'Step 2: f = (3.0 × 10⁸ m/s) / (532 × 10⁻⁹ m) ≈ 5.64 × 10¹⁴ Hz (564 THz).',
          'Step 3: Calculate wavenumber k = 2π / λ = (2 × 3.14159) / (532 × 10⁻⁹ m) ≈ 1.18 × 10⁷ rad/m.'
        ],
        solution: 'Frequency is 5.64 × 10¹⁴ Hz and wavenumber is 1.18 × 10⁷ rad/m.'
      },
      realWorldApplication: {
        title: '5G and Wi-Fi Carrier Frequencies',
        description: 'Wi-Fi 6 uses 5 GHz carrier waves (wavelength ≈ 6 cm), while mmWave 5G uses 28 GHz (wavelength ≈ 1 cm). Smaller wavelengths enable massive MIMO antennas packed onto phone chips.',
        industry: 'Telecommunications & RF Electronics'
      },
      relations: [
        {
          targetId: 'wave-fundamentals',
          type: 'part_of',
          reason: 'Parameters define the measurable characteristics of fundamental waves.'
        },
        {
          targetId: 'superposition',
          type: 'prerequisite_of',
          reason: 'You must understand amplitude and phase before adding multiple overlapping waves.'
        },
        {
          targetId: 'phase-path-difference',
          type: 'prerequisite_of',
          reason: 'Calculating phase difference requires knowing wavelength and wave phase arguments.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-wp-1',
          conceptId: 'wave-parameters',
          prompt: 'A sound wave travels at 340 m/s with a frequency of 170 Hz. What is its wavelength?',
          options: [
            { id: 'a', text: '0.5 meters', explanation: 'That would be frequency divided by velocity, which is inverted.' },
            { id: 'b', text: '2.0 meters', explanation: 'Correct! λ = v / f = 340 / 170 = 2.0 m.' },
            { id: 'c', text: '57,800 meters', explanation: 'Multiplying speed by frequency does not yield wavelength.' },
            { id: 'd', text: '1.41 meters', explanation: 'Incorrect numerical calculation.' }
          ],
          correctOptionId: 'b',
          prerequisiteHintId: 'wave-fundamentals',
          explanation: 'Using the wave relation v = f · λ, we solve λ = v / f = 340 m/s / 170 Hz = 2.0 m.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'superposition',
      title: 'Principle of Superposition',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'When two or more waves overlap in a linear medium, the resultant displacement is the algebraic sum of individual displacements.',
      learningObjective: 'State the linear superposition principle and calculate the resultant amplitude of overlapping harmonic disturbances.',
      storyAnalogy: {
        hook: 'Two motorboats cruise past each other on a serene canal, each leaving a wake.',
        analogy: 'When the wakes meet in the middle, they pass right through one another unharmed. At the instant of crossing, if two 10 cm wave peaks arrive together, the water lifts 20 cm into the air. If a 10 cm peak meets a 10 cm trough, the surface stays momentarily flat as a mirror.',
        connection: 'This algebraic addition is the Principle of Superposition. Neither wave destroys the other; their displacements simply sum point-by-point.'
      },
      explanationSections: [
        {
          heading: '1. Mathematical Statement of Superposition',
          content: 'For linear media, if y₁(x, t) and y₂(x, t) are independent solutions to the governing wave equation, then the resultant wave function is their linear combination: y(x, t) = y₁(x, t) + y₂(x, t).'
        },
        {
          heading: '2. Linear vs Non-linear Media',
          content: 'Superposition strictly holds when the medium response is linear (Hooke’s law regime for mechanics; constant dielectric permittivity for optics). At extreme laser intensities in non-linear crystals, superposition breaks down, creating frequency doubling (harmonics).'
        },
        {
          heading: '3. Vector addition of amplitudes',
          content: 'When two harmonic waves with amplitudes A₁ and A₂ and phase difference Δφ overlap, the resultant amplitude R is: R = √(A₁² + A₂² + 2 A₁ A₂ cos Δφ).'
        }
      ],
      formula: {
        title: 'Resultant Amplitude of Two Overlapping Waves',
        latex: 'R = \\sqrt{A_1^2 + A_2^2 + 2 A_1 A_2 \\cos(\\Delta \\phi)}',
        explanation: 'Calculates the resultant amplitude R when two waves with amplitudes A₁ and A₂ meet with phase difference Δφ.',
        variables: [
          { symbol: 'R', name: 'Resultant Amplitude', unit: 'm or V/m' },
          { symbol: 'A_1, A_2', name: 'Amplitudes of wave 1 and wave 2', unit: 'm or V/m' },
          { symbol: '\\Delta \\phi', name: 'Phase difference between the waves', unit: 'rad' }
        ]
      },
      diagramKey: 'superposition',
      workedExample: {
        title: 'Two In-Phase Coherent Waves Overlapping',
        problem: 'Two coherent sound speakers emit waves with equal amplitude A = 4 mm at a listener. If they arrive with a phase difference of Δφ = π/3 rad (60°), calculate the resultant amplitude R.',
        steps: [
          'Step 1: Formula: R = √(A² + A² + 2A² cos(60°)).',
          'Step 2: Note cos(60°) = 0.5. So R = √(4² + 4² + 2(16)(0.5)) = √(16 + 16 + 16) = √48.',
          'Step 3: √48 = 4√3 ≈ 6.93 mm.'
        ],
        solution: 'The resultant vibration amplitude is 4√3 mm ≈ 6.93 mm.'
      },
      realWorldApplication: {
        title: 'Noise-Cancelling Headphones (Active Noise Cancellation)',
        description: 'Microphones on the outer ear cup sample incoming ambient drone (jet engine, HVAC hum). An internal DSP chip computes the exact inverted wave (180° out of phase) and plays it through the driver. By superposition, ambient sound + anti-sound = near silence.',
        industry: 'Consumer Audio & Avionics'
      },
      relations: [
        {
          targetId: 'wave-parameters',
          type: 'related_to',
          reason: 'Superposition relies directly on the individual amplitudes and relative phases of waves.'
        },
        {
          targetId: 'constructive-interference',
          type: 'prerequisite_of',
          reason: 'Constructive interference is the maximum constructive case of superposition (Δφ = 0, 2π...).'
        },
        {
          targetId: 'destructive-interference',
          type: 'prerequisite_of',
          reason: 'Destructive interference is the minimum cancellation case of superposition (Δφ = π, 3π...).'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-sup-1',
          conceptId: 'superposition',
          prompt: 'If two identical waves of amplitude A arrive at a point exactly in phase (Δφ = 0), what is the resultant amplitude according to the superposition principle?',
          options: [
            { id: 'a', text: '0', explanation: 'Displacement is zero only when waves are out of phase by 180° (cancelling each other).' },
            { id: 'b', text: 'A', explanation: 'Two identical waves add constructively, exceeding a single wave amplitude.' },
            { id: 'c', text: '2A', explanation: 'Correct! When Δφ = 0, cos(0) = 1, so R = √(A² + A² + 2A²) = √(4A²) = 2A.' },
            { id: 'd', text: 'A²', explanation: 'Amplitude has linear units, not squared units.' }
          ],
          correctOptionId: 'c',
          prerequisiteHintId: 'wave-parameters',
          explanation: 'When two waves with amplitude A are in phase, their peak displacements align, giving R = A + A = 2A.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'phase-path-difference',
      title: 'Phase Difference and Path Difference',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'The geometric and optical translation between distance traveled (path difference Δx) and cycle offset (phase difference Δφ).',
      learningObjective: 'Convert spatial path difference into phase difference using wavelength, and account for optical path lengths.',
      storyAnalogy: {
        hook: 'Two identical twin cyclists pedaling at the same cadence take two different roads to college.',
        analogy: 'Both start pedaling synchronously at 8:00 AM. Path A is 100 meters long, while Path B is 101 meters long. If one full pedal rotation carries a bicycle 2 meters (λ = 2 m), the rider on Path B travels an extra 1 meter—which is exactly half a rotation (180° or π rad). When they meet at the gate, their pedals are completely opposite: one foot is up while the other is down.',
        connection: 'The extra physical distance (1 m) is the Path Difference (Δx). The resulting pedal angle difference (π radians) is the Phase Difference (Δφ).'
      },
      explanationSections: [
        {
          heading: '1. The Golden Ratio of Wave Optics',
          content: 'A travel difference of one full wavelength (λ) corresponds to one complete harmonic cycle (2π radians or 360°). Therefore: (Phase Difference Δφ) / 2π = (Path Difference Δx) / λ.'
        },
        {
          heading: '2. Optical Path Length (OPL)',
          content: 'When light travels through a dielectric medium of refractive index n over geometric distance d, its speed slows to c/n and its wavelength shortens to λ₀/n. The optical path length is OPL = n · d. Path difference in optical media is Δ = n₁d₁ - n₂d₂.'
        },
        {
          heading: '3. Stokes’ Reflection Phase Shift',
          content: 'When a wave reflects from an optically denser medium (higher refractive index, e.g., air to glass), it experiences an abrupt phase reversal of π radians (equivalent to an additional path difference of λ/2).'
        }
      ],
      formula: {
        title: 'Phase Difference to Path Difference Equation',
        latex: '\\Delta \\phi = \\frac{2\\pi}{\\lambda} \\Delta x = k \\Delta x',
        explanation: 'Calculates the relative phase angle difference Δφ induced by spatial path difference Δx in a medium with wavelength λ.',
        variables: [
          { symbol: '\\Delta \\phi', name: 'Phase difference', unit: 'radians' },
          { symbol: '\\Delta x', name: 'Path difference', unit: 'meters' },
          { symbol: '\\lambda', name: 'Wavelength in medium', unit: 'meters' },
          { symbol: 'k', name: 'Wavenumber (2π/λ)', unit: 'rad/m' }
        ]
      },
      diagramKey: 'phase-path',
      workedExample: {
        title: 'Phase Difference for Red He-Ne Laser Light',
        problem: 'Two beams from a helium-neon laser (λ = 632.8 nm in air) arrive at a sensor. One beam traversed an extra distance of Δx = 316.4 nm. Find the phase difference Δφ.',
        steps: [
          'Step 1: Formula: Δφ = (2π / λ) · Δx.',
          'Step 2: Notice that Δx = 316.4 nm = 632.8 nm / 2 = λ / 2.',
          'Step 3: Δφ = (2π / λ) · (λ / 2) = π radians (180°).'
        ],
        solution: 'The phase difference is exactly π radians (180°), leading to complete destructive cancellation.'
      },
      realWorldApplication: {
        title: 'LIGO Gravitational Wave Observatory',
        description: 'LIGO splits laser beams into two 4-km perpendicular arms. Passing gravitational waves stretch space by 10⁻¹⁸ meters (less than a proton diameter). This tiny path difference alters the phase difference at the photo-detector, turning dark interference fringes into light signals.',
        industry: 'Astrophysics & Precision Metrology'
      },
      relations: [
        {
          targetId: 'wave-parameters',
          type: 'part_of',
          reason: 'Relates spatial wavelength parameter to temporal phase parameter.'
        },
        {
          targetId: 'constructive-interference',
          type: 'prerequisite_of',
          reason: 'Constructive interference requires path difference Δx = nλ.'
        },
        {
          targetId: 'destructive-interference',
          type: 'prerequisite_of',
          reason: 'Destructive interference requires path difference Δx = (2n + 1)λ/2.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-pp-1',
          conceptId: 'phase-path-difference',
          prompt: 'If the path difference between two coherent waves of wavelength λ is Δx = λ / 2, what is the resulting phase difference?',
          options: [
            { id: 'a', text: 'π/2 radians (90°)', explanation: 'A path difference of λ/4 would produce π/2 radians.' },
            { id: 'b', text: 'π radians (180°)', explanation: 'Correct! Δφ = (2π/λ) · (λ/2) = π radians.' },
            { id: 'c', text: '2π radians (360°)', explanation: 'A full wavelength path difference λ produces 2π radians.' },
            { id: 'd', text: 'Zero', explanation: 'Path difference is non-zero, so phase difference cannot be zero.' }
          ],
          correctOptionId: 'b',
          prerequisiteHintId: 'wave-parameters',
          explanation: 'Using the fundamental relation Δφ = (2π/λ) · Δx, substituting Δx = λ/2 yields Δφ = (2π/λ)(λ/2) = π radians (180°).',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'constructive-interference',
      title: 'Constructive Interference',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'Mutual reinforcement of overlapping coherent waves resulting in maximum intensity when crest meets crest.',
      learningObjective: 'State the criteria for constructive interference in terms of path difference and phase difference, and compute resultant intensity.',
      storyAnalogy: {
        hook: 'Two rowers paddling a racing scull in perfect rhythm.',
        analogy: 'When both oars enter the water at the exact same fraction of a second, their pulling forces reinforce each other. The boat surges forward with maximum velocity. If one rower pulled while the other pushed backwards, they would stall.',
        connection: 'Constructive interference is optical synchronization: crest meets crest and trough meets trough, creating a brilliant bright band where intensity is quadrupled.'
      },
      explanationSections: [
        {
          heading: '1. Conditions for Constructive Interference',
          content: 'Constructive interference occurs when two coherent waves arrive at a point in phase: Phase difference Δφ = 2nπ (where n = 0, ±1, ±2, ...). Correspondingly, path difference must be an integer multiple of wavelength: Δx = nλ.'
        },
        {
          heading: '2. The Intensity Quadrupling Law',
          content: 'In optics, intensity I is proportional to the square of amplitude (I ∝ A²). If two identical coherent waves with amplitude A and intensity I₀ combine in phase, the new amplitude is 2A. The resultant intensity is I_max = (2A)² = 4A² = 4 I₀! The waves do not generate new energy; energy is redistributed from dark zones to bright zones.'
        },
        {
          heading: '3. Central Maximum',
          content: 'At the geometric centerline equidistant between two coherent sources, the path difference Δx = 0 (n = 0). This creates the zero-order central bright fringe.'
        }
      ],
      formula: {
        title: 'Constructive Interference Condition & Peak Intensity',
        latex: '\\Delta x = n\\lambda, \\quad \\Delta \\phi = 2n\\pi \\quad (n \\in \\mathbb{Z}), \\quad I_{\\max} = 4 I_0',
        explanation: 'Path difference must equal an integer multiple of wavelength for constructive interference; intensity quadruples for two equal coherent sources.',
        variables: [
          { symbol: '\\Delta x', name: 'Path difference', unit: 'meters' },
          { symbol: 'n', name: 'Fringe order integer (0, 1, 2, ...)', unit: 'dimensionless' },
          { symbol: '\\lambda', name: 'Wavelength', unit: 'meters' },
          { symbol: 'I_{\\max}', name: 'Peak resultant intensity', unit: 'W/m²' },
          { symbol: 'I_0', name: 'Individual beam intensity', unit: 'W/m²' }
        ]
      },
      diagramKey: 'constructive-destructive',
      workedExample: {
        title: 'Calculating First-Order Bright Fringe Condition',
        problem: 'In an experiment using blue light (λ = 450 nm), two coherent rays meet at point P. The distance from Source 1 is 1.200000 m and from Source 2 is 1.200900 m. Determine if constructive interference occurs at P.',
        steps: [
          'Step 1: Calculate path difference Δx = 1.200900 m - 1.200000 m = 0.000900 m = 900 nm.',
          'Step 2: Check condition Δx = nλ ⇒ n = Δx / λ = 900 nm / 450 nm = 2.',
          'Step 3: Because n = 2 is an exact integer, the waves arrive crest-to-crest.'
        ],
        solution: 'Yes! Constructive interference occurs at P, producing the 2nd-order bright fringe.'
      },
      realWorldApplication: {
        title: 'Dielectric High-Reflector Mirrors in Lasers',
        description: 'Laser cavities require 99.999% reflection mirrors. Metal mirrors absorb 1-4% of light and melt. Dielectric mirrors stack alternating thin layers of TiO₂ and SiO₂ such that all reflected waves interfere constructively in phase, achieving near-perfect lossless reflection.',
        industry: 'Laser Engineering & Photonics'
      },
      relations: [
        {
          targetId: 'superposition',
          type: 'part_of',
          reason: 'Constructive interference is the in-phase maximum case of wave superposition.'
        },
        {
          targetId: 'phase-path-difference',
          type: 'related_to',
          reason: 'Governed by path difference condition Δx = nλ.'
        },
        {
          targetId: 'young-double-slit',
          type: 'prerequisite_of',
          reason: 'Young double slit produces alternating bright constructive fringes on the detector.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-ci-1',
          conceptId: 'constructive-interference',
          prompt: 'What condition for path difference Δx guarantees constructive interference between two coherent waves of wavelength λ?',
          options: [
            { id: 'a', text: 'Δx = (2n + 1)λ / 2', explanation: 'This is the condition for odd half-wavelengths, which produces destructive cancellation.' },
            { id: 'b', text: 'Δx = nλ (where n = 0, 1, 2, ...)', explanation: 'Correct! Integer multiples of wavelength ensure crest meets crest.' },
            { id: 'c', text: 'Δx = λ / 4', explanation: 'Quarter-wave produces 90° phase difference, neither maximum nor minimum.' },
            { id: 'd', text: 'Δx = (n + 0.25)λ', explanation: 'This yields intermediate intensity.' }
          ],
          correctOptionId: 'b',
          prerequisiteHintId: 'phase-path-difference',
          explanation: 'Constructive interference requires an integer number of full wave cycles of path difference: Δx = nλ (where n = 0, 1, 2,...).',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'destructive-interference',
      title: 'Destructive Interference',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'Mutual cancellation of overlapping coherent waves resulting in zero or minimum intensity when crest meets trough.',
      learningObjective: 'Formulate the condition for destructive interference, explain energy conservation in dark fringes, and evaluate minimum intensity.',
      storyAnalogy: {
        hook: 'Can shining two bright flashlights at the same spot ever produce pure darkness?',
        analogy: 'With normal incandescent flashlights, no—their photons are chaotic and incoherent. But with two coherent laser beams, if one beam’s crest arrives at the precise moment the second beam’s trough arrives, the electric field vectors point in exact opposite directions and cancel completely to zero.',
        connection: 'Where does the energy go? It is not destroyed; it is redirected into the neighboring bright constructive zones.'
      },
      explanationSections: [
        {
          heading: '1. Conditions for Destructive Cancellation',
          content: 'Destructive interference occurs when two coherent waves arrive exactly 180° (π radians) out of phase: Δφ = (2n + 1)π (odd multiple of π). In terms of path difference: Δx = (2n + 1) λ / 2 = (n + 1/2)λ, for n = 0, 1, 2, ...'
        },
        {
          heading: '2. Zero Intensity for Matched Amplitudes',
          content: 'When amplitudes are equal (A₁ = A₂ = A), the resultant amplitude is R = A - A = 0. Therefore, minimum intensity I_min = 0 (complete blackness / total silence).'
        },
        {
          heading: '3. Energy Conservation Law in Optics',
          content: 'Interference does not create or destroy energy. The average intensity across one complete fringe period is (I_max + I_min) / 2 = (4 I₀ + 0) / 2 = 2 I₀, exactly equal to the sum of the two independent beams (I₀ + I₀). Energy is merely spatially redistributed.'
        }
      ],
      formula: {
        title: 'Destructive Interference Condition & Minimum Intensity',
        latex: '\\Delta x = (2n + 1)\\frac{\\lambda}{2} = \\left(n + \\frac{1}{2}\\right)\\lambda, \\quad I_{\\min} = (A_1 - A_2)^2',
        explanation: 'Path difference must equal an odd multiple of half-wavelengths for destructive interference. If A₁ = A₂, minimum intensity is strictly zero.',
        variables: [
          { symbol: '\\Delta x', name: 'Path difference', unit: 'meters' },
          { symbol: 'n', name: 'Fringe order index (0, 1, 2, ...)', unit: 'dimensionless' },
          { symbol: '\\lambda', name: 'Wavelength', unit: 'meters' },
          { symbol: 'I_{\\min}', name: 'Minimum resultant intensity', unit: 'W/m²' }
        ]
      },
      diagramKey: 'constructive-destructive',
      workedExample: {
        title: 'Locating the First Dark Band in Coherent Waves',
        problem: 'Two coherent laser sources emit light of wavelength λ = 500 nm. What is the smallest non-zero path difference Δx that results in complete destructive cancellation at the screen?',
        steps: [
          'Step 1: Formula for destructive interference: Δx = (2n + 1)λ / 2.',
          'Step 2: For the smallest non-zero path difference, take n = 0 (first dark fringe).',
          'Step 3: Δx = (1) · (500 nm) / 2 = 250 nm.'
        ],
        solution: 'The smallest path difference for total darkness is 250 nm (half a wavelength).'
      },
      realWorldApplication: {
        title: 'Anti-Reflective Coating on Camera Lenses',
        description: 'Camera lenses are coated with a thin transparent film of Magnesium Fluoride (MgF₂, n ≈ 1.38). The film thickness is tuned to λ/4. Light reflecting from the top surface and bottom surface have a round-trip path difference of λ/2, creating destructive interference that eliminates glare and transmits 99.8% of light to the sensor.',
        industry: 'Optical Metrology & Consumer Electronics'
      },
      relations: [
        {
          targetId: 'superposition',
          type: 'part_of',
          reason: 'Destructive interference is the out-of-phase minimum case of superposition.'
        },
        {
          targetId: 'phase-path-difference',
          type: 'related_to',
          reason: 'Requires odd multiple of half wavelengths (Δx = (n + 0.5)λ).'
        },
        {
          targetId: 'sustained-interference',
          type: 'prerequisite_of',
          reason: 'Must have stable phase difference so dark regions remain stationary over time.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-di-1',
          conceptId: 'destructive-interference',
          prompt: 'What happens to the total light energy when two equal-amplitude coherent light waves interfere destructively to create a dark fringe?',
          options: [
            { id: 'a', text: 'The light energy is converted directly into thermal heat in the vacuum', explanation: 'Interference in free space does not dissipate light into thermal energy.' },
            { id: 'b', text: 'The energy is permanently destroyed according to quantum rules', explanation: 'Energy cannot be destroyed; conservation of energy is absolute.' },
            { id: 'c', text: 'The energy is redistributed into the bright constructive fringes', explanation: 'Correct! The average intensity remains 2I₀; energy is spatially redistributed from dark to bright bands.' },
            { id: 'd', text: 'The energy turns into sound waves', explanation: 'Photons do not transform into acoustic phonons in free propagation.' }
          ],
          correctOptionId: 'c',
          prerequisiteHintId: 'superposition',
          explanation: 'Conservation of energy dictates that energy is not lost; it is redistributed across the interference pattern, making bright bands four times as intense as an individual wave while dark bands are zero.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'sustained-interference',
      title: 'Conditions for Sustained Interference',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'The essential physical conditions required to observe a stationary, high-contrast, observable interference pattern over time.',
      learningObjective: 'List and explain the five cardinal conditions for observing sustained optical interference patterns.',
      storyAnalogy: {
        hook: 'Why don’t two ordinary light bulbs sitting on your study table produce striped dark and bright shadows on your wall?',
        analogy: 'Independent tungsten filaments or LEDs emit trillions of independent wave-trains that jump in random phases every 10⁻¹⁰ seconds. By the time your eye tries to register a dark spot, the phase has scrambled a billion times, averaging out to uniform brightness.',
        connection: 'To see a stable, sharp fringe pattern, the sources must be Coherent: locked in a fixed phase relationship over time.'
      },
      explanationSections: [
        {
          heading: '1. Coherence (The Primary Requirement)',
          content: 'The two interfering light sources must be coherent: they must maintain a constant, time-invariant phase difference (d(Δφ)/dt = 0). This is achieved practically by deriving both secondary sources from a single primary wavefront or amplitude beam-splitter.'
        },
        {
          heading: '2. Monochromaticity & Frequency Matching',
          content: 'The sources must emit identical frequencies and wavelengths (monochromatic light). If wavelengths differ, the fringe patterns of different colors overlap at different spacings, washing out visibility into white light blur.'
        },
        {
          heading: '3. Equal or Near-Equal Amplitudes (A₁ ≈ A₂)',
          content: 'Fringe visibility (contrast) is defined as V = (I_max - I_min) / (I_max + I_min). For maximum contrast (V = 1), I_min must be zero, which strictly requires A₁ = A₂.'
        },
        {
          heading: '4. Geometric Constraints',
          content: 'The two sources must be very close to each other (small slit separation d), and the observation screen must be placed sufficiently far away (large D) so that fringe width β = λD/d is large enough to resolve.'
        }
      ],
      formula: {
        title: 'Fringe Visibility (Michelson Contrast)',
        latex: 'V = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}} = \\frac{2 A_1 A_2}{A_1^2 + A_2^2}',
        explanation: 'Quantifies pattern sharpness. When A₁ = A₂, visibility V = 1 (100% contrast). When one wave dominates, V approaches 0.',
        variables: [
          { symbol: 'V', name: 'Fringe visibility / contrast', unit: '0 to 1 (dimensionless)' },
          { symbol: 'I_{\\max}', name: 'Intensity at bright fringe maximum', unit: 'W/m²' },
          { symbol: 'I_{\\min}', name: 'Intensity at dark fringe minimum', unit: 'W/m²' },
          { symbol: 'A_1, A_2', name: 'Amplitudes of interfering beams', unit: 'V/m' }
        ]
      },
      diagramKey: 'sustained-conditions',
      workedExample: {
        title: 'Calculating Fringe Contrast with Unequal Beam Splitter',
        problem: 'A misaligned beam splitter produces two interfering beams with intensities I₁ = 9 mW and I₂ = 1 mW. Calculate the fringe visibility V of the resulting interference pattern.',
        steps: [
          'Step 1: Amplitudes A₁ ∝ √9 = 3, A₂ ∝ √1 = 1.',
          'Step 2: I_max = (A₁ + A₂)² = (3 + 1)² = 16. I_min = (A₁ - A₂)² = (3 - 1)² = 4.',
          'Step 3: Visibility V = (16 - 4) / (16 + 4) = 12 / 20 = 0.60 (60%).'
        ],
        solution: 'Fringe visibility is 0.60 (60% contrast). The fringes will look washed out compared to perfectly matched beams.'
      },
      realWorldApplication: {
        title: 'Optical Coherence Tomography (OCT) in Ophthalmology',
        description: 'OCT scanners use low-coherence superluminescent diodes to image retinal layers non-invasively. Interference fringes occur only when optical path lengths match within the short coherence length, allowing micrometer-depth optical sectioning of the living human eye.',
        industry: 'Biomedical Optics & Ophthalmology'
      },
      relations: [
        {
          targetId: 'constructive-interference',
          type: 'related_to',
          reason: 'Stable constructive interference requires constant phase coherence.'
        },
        {
          targetId: 'destructive-interference',
          type: 'related_to',
          reason: 'Zero minimum intensity requires equal amplitudes.'
        },
        {
          targetId: 'young-double-slit',
          type: 'prerequisite_of',
          reason: 'Young double-slit experiment was specifically designed to satisfy all sustained interference conditions.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-si-1',
          conceptId: 'sustained-interference',
          prompt: 'Why do two independent incandescent light bulbs NOT produce an observable interference pattern on a wall?',
          options: [
            { id: 'a', text: 'Their light travels too fast for eyes to perceive', explanation: 'All light travels at speed c; laser light travels at the same speed and produces clear interference.' },
            { id: 'b', text: 'They lack coherence because their relative phase changes randomly and rapidly', explanation: 'Correct! Independent atoms emit independent wave-trains with random phase jumps every 10⁻¹⁰ seconds.' },
            { id: 'c', text: 'Photons from independent bulbs repel each other electrically', explanation: 'Photons carry no net electric charge and do not repel.' },
            { id: 'd', text: 'Incandescent light has no wavelength', explanation: 'Incandescent filaments emit a broad continuous spectrum of wavelengths.' }
          ],
          correctOptionId: 'b',
          prerequisiteHintId: 'phase-path-difference',
          explanation: 'Independent thermal sources lack coherence; random phase fluctuations average out the interference pattern within nanoseconds, leaving a uniform illuminated background.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'young-double-slit',
      title: "Young's Double-Slit Experiment (YDSE)",
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'The historic experiment by Thomas Young (1801) demonstrating the wave nature of light via wavefront division.',
      learningObjective: 'Describe the geometry of Young’s double-slit experiment and derive the position of bright and dark fringes on a distant screen.',
      storyAnalogy: {
        hook: 'In 1801, Isaac Newton’s corpuscular theory (light is tiny flying bullets) reigned supreme for over a century.',
        analogy: 'If light were bullets, firing them through two narrow parallel slits would create two sharp bullet stripes on the wall behind. Thomas Young cut two razor slits in a shutter, let sunlight enter, and saw not two stripes, but dozens of alternating bright and dark zebra stripes stretching across the wall!',
        connection: 'This was undeniable proof that light acts as a wave, diffracting out of the two slits as coherent cylindrical ripples that superimpose on the screen.'
      },
      explanationSections: [
        {
          heading: '1. Experimental Setup and Wavefront Splitting',
          content: 'A single pinhole illuminated by a light source provides spatial coherence. Light spreads out by Huygens’ principle to illuminate two narrow slits S₁ and S₂ separated by distance d. Since S₁ and S₂ originate from the same wavefront, they act as two synchronized, coherent virtual sources.'
        },
        {
          heading: '2. Path Difference Geometry',
          content: 'For a point P on a screen at distance D (where D >> d) located at distance y from the central axis, the angle θ is small (sin θ ≈ tan θ ≈ y / D). Dropping a perpendicular from S₁ to the ray from S₂ reveals the path difference: Δx = S₂P - S₁P = d sin θ ≈ d (y / D).'
        },
        {
          heading: '3. Bright and Dark Positions on Screen',
          content: 'Setting Δx = nλ yields the positions of bright fringes: y_n = n (λD / d). Setting Δx = (2n + 1)λ/2 yields the positions of dark fringes: y_n\' = (2n + 1) (λD / 2d).'
        }
      ],
      formula: {
        title: 'Fringe Positions on Screen in YDSE',
        latex: 'y_n = n \\frac{\\lambda D}{d} \\quad (\\text{Bright}), \\quad y_n\' = \\left(n + \\frac{1}{2}\\right) \\frac{\\lambda D}{d} \\quad (\\text{Dark})',
        explanation: 'Calculates the distance y from the central axis to the n-th fringe on a screen at distance D from two slits separated by d.',
        variables: [
          { symbol: 'y_n', name: 'Position of n-th bright fringe from center', unit: 'm' },
          { symbol: 'n', name: 'Fringe order integer (0, ±1, ±2, ...)', unit: 'dimensionless' },
          { symbol: '\\lambda', name: 'Wavelength of light', unit: 'm' },
          { symbol: 'D', name: 'Slit-to-screen distance', unit: 'm' },
          { symbol: 'd', name: 'Separation between the two slits', unit: 'm' }
        ]
      },
      diagramKey: 'young-double-slit',
      workedExample: {
        title: 'Locating the 3rd Bright Fringe with a Sodium Lamp',
        problem: 'In a Young double-slit apparatus, slit separation d = 0.20 mm (0.20 × 10⁻³ m), screen distance D = 1.5 m, and yellow sodium light λ = 589 nm (589 × 10⁻⁹ m) is used. Find the distance from the central axis to the 3rd bright fringe.',
        steps: [
          'Step 1: Formula for bright fringe position: y_n = n · (λD / d).',
          'Step 2: Substitute n = 3, λ = 589 × 10⁻⁹ m, D = 1.5 m, d = 0.20 × 10⁻³ m.',
          'Step 3: y₃ = 3 · (589 × 10⁻⁹ × 1.5) / (0.20 × 10⁻³) = 3 · (8.835 × 10⁻⁷) / (2 × 10⁻⁴) = 3 · (4.4175 × 10⁻³) m ≈ 13.25 mm.'
        ],
        solution: 'The 3rd bright fringe is located 13.25 mm from the central maximum.'
      },
      realWorldApplication: {
        title: 'Quantum Wave-Particle Duality and Electron Microscopy',
        description: 'When the double-slit experiment is repeated firing individual electrons or buckyball molecules (C₆₀) one at a time, each particle impacts as a single dot, yet an interference pattern builds up over time. This proves that matter particles possess de Broglie wavelengths (λ = h/p).',
        industry: 'Quantum Physics & Semiconductor Characterization'
      },
      relations: [
        {
          targetId: 'sustained-interference',
          type: 'part_of',
          reason: 'YDSE provides the practical implementation of sustained coherent light interference.'
        },
        {
          targetId: 'constructive-interference',
          type: 'related_to',
          reason: 'Bright fringes in YDSE are formed by constructive interference.'
        },
        {
          targetId: 'destructive-interference',
          type: 'related_to',
          reason: 'Dark bands in YDSE are formed by destructive interference.'
        },
        {
          targetId: 'fringe-width',
          type: 'prerequisite_of',
          reason: 'Fringe width β is the separation between consecutive fringes in YDSE.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-yd-1',
          conceptId: 'young-double-slit',
          prompt: 'In Young\'s double-slit experiment, what is the geometric approximation for the path difference Δx between rays reaching a point on a screen at distance D, where slit spacing is d and position is y?',
          options: [
            { id: 'a', text: 'Δx ≈ d · y / D', explanation: 'Correct! Because D >> d, sin θ ≈ tan θ = y / D, so Δx = d sin θ ≈ d(y / D).' },
            { id: 'b', text: 'Δx ≈ D · y / d', explanation: 'Inverted ratio; slit separation d belongs in the numerator for path difference.' },
            { id: 'c', text: 'Δx ≈ d · D / y', explanation: 'Incorrect dimensional dependence.' },
            { id: 'd', text: 'Δx ≈ (d + D) / y', explanation: 'Linear addition of disparate scales is physically incorrect.' }
          ],
          correctOptionId: 'a',
          prerequisiteHintId: 'phase-path-difference',
          explanation: 'Using right triangle approximation for small angles θ: sin θ ≈ tan θ = y/D, yielding path difference Δx = d sin θ = dy/D.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'fringe-width',
      title: 'Fringe Width and Angular Fringe Width',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'The physical spacing between successive bright or dark fringes, and its dependence on wavelength and setup geometry.',
      learningObjective: 'Calculate linear fringe width β and angular fringe width θ_f, and predict how altering d, D, λ, or medium changes the pattern.',
      storyAnalogy: {
        hook: 'What happens to the zebra stripes on the screen if you dip the entire Young double-slit experiment inside an aquarium full of water?',
        analogy: 'In water, light slows down and its wavelength shortens by a factor of 1.33 (λ_water = λ_air / 1.33). Because the wavelength shrinks, the fringes compress together like an accordion, packing more stripes into each millimeter.',
        connection: 'The fringe width formula β = λD/d reveals that fringe spacing is directly proportional to wavelength λ and inversely proportional to slit separation d.'
      },
      explanationSections: [
        {
          heading: '1. Derivation of Linear Fringe Width (β)',
          content: 'Fringe width β is defined as the distance between any two consecutive bright fringes (y_{n+1} - y_n) or two consecutive dark fringes (y\'_{n+1} - y\'_n). From y_n = n(λD/d): β = (n + 1)(λD/d) - n(λD/d) = λD / d. Notice β is completely independent of the order n: all fringes in ideal YDSE have identical uniform width!'
        },
        {
          heading: '2. Angular Fringe Width (θ_f)',
          content: 'The angular separation between adjacent fringes subtended at the slits is: θ_f = β / D = λ / d (measured in radians). Angular fringe width depends only on wavelength and slit spacing; moving the screen further away increases linear width β but leaves angular spacing θ_f unchanged.'
        },
        {
          heading: '3. Effect of Medium Refractive Index (n_m)',
          content: 'When the apparatus is immersed in a liquid of refractive index n_m, wavelength shrinks to λ\' = λ / n_m. The new fringe width becomes β\' = β / n_m (fringes contract).'
        }
      ],
      formula: {
        title: 'Fringe Width & Angular Width Formulas',
        latex: '\\beta = \\frac{\\lambda D}{d}, \\quad \\theta_f = \\frac{\\beta}{D} = \\frac{\\lambda}{d}, \\quad \\beta_{\\text{medium}} = \\frac{\\beta_{\\text{air}}}{\\mu}',
        explanation: 'Linear fringe width β is proportional to λ and D, inversely proportional to d. Angular width θ_f is λ/d.',
        variables: [
          { symbol: '\\beta', name: 'Linear fringe width (spacing between fringes)', unit: 'm' },
          { symbol: '\\theta_f', name: 'Angular fringe width', unit: 'radians' },
          { symbol: '\\lambda', name: 'Wavelength of light in vacuum/air', unit: 'm' },
          { symbol: 'D', name: 'Distance from slits to screen', unit: 'm' },
          { symbol: 'd', name: 'Distance between slits', unit: 'm' },
          { symbol: '\\mu', name: 'Refractive index of surrounding medium', unit: 'dimensionless' }
        ]
      },
      diagramKey: 'fringe-width',
      workedExample: {
        title: 'Predicting Fringe Shift When Immersed in Water',
        problem: 'In air, an interference experiment produces fringes spaced β_air = 2.4 mm apart. If the apparatus is submerged in water (refractive index μ = 4/3), calculate the new fringe width β_water.',
        steps: [
          'Step 1: Formula: β_water = β_air / μ.',
          'Step 2: Substitute β_air = 2.4 mm and μ = 4/3 = 1.333.',
          'Step 3: β_water = 2.4 mm / (4/3) = 2.4 × 0.75 = 1.8 mm.'
        ],
        solution: 'The fringes compress to a narrower width of 1.8 mm.'
      },
      realWorldApplication: {
        title: 'Precision Micro-calibration and Optical Profilometry',
        description: 'Engineers use fringe spacing to measure the exact thickness of microscopic objects (such as thermal grease or silicon wafer bowing). By counting the number of displaced fringes across a known distance, variations of a fraction of a micron are detected.',
        industry: 'Semiconductor Fabrication & Precision Manufacturing'
      },
      relations: [
        {
          targetId: 'young-double-slit',
          type: 'part_of',
          reason: 'Fringe width is the quantitative measure of fringe separation in YDSE.'
        },
        {
          targetId: 'interference-applications',
          type: 'applied_in',
          reason: 'Fringe width changes are the exact measurement principle behind thin-film testing and optical wedges.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-fw-1',
          conceptId: 'fringe-width',
          prompt: 'If the distance d between the two slits in a Young\'s experiment is halved (d\' = d / 2) while keeping λ and D constant, what happens to the fringe width β?',
          options: [
            { id: 'a', text: 'The fringe width is halved (β\' = β / 2)', explanation: 'Fringe width is inversely proportional to d, not directly proportional.' },
            { id: 'b', text: 'The fringe width is doubled (β\' = 2β)', explanation: 'Correct! Since β = λD / d, halving the denominator d doubles the value of β.' },
            { id: 'c', text: 'The fringe width remains unchanged', explanation: 'd directly governs the angular divergence of fringes.' },
            { id: 'd', text: 'The fringe width quadruples', explanation: 'The relationship is 1/d, not 1/d².' }
          ],
          correctOptionId: 'b',
          prerequisiteHintId: 'young-double-slit',
          explanation: 'From β = λD/d, fringe width β is inversely proportional to slit distance d. Halving d results in β\' = λD/(d/2) = 2(λD/d) = 2β.',
          difficulty: 'beginner'
        }
      ]
    },
    {
      id: 'interference-applications',
      title: 'Engineering Applications of Interference',
      unitId: 'unit-2-wave-optics',
      unitTitle: 'UNIT-II: Wave Optics',
      shortSummary: 'Industrial and laboratory applications: thin film interference, Newton’s rings, optical flatness testing, and anti-reflection coatings.',
      learningObjective: 'Apply interference principles to evaluate thin-film thickness, anti-reflective coatings, and optical surface flatness.',
      storyAnalogy: {
        hook: 'Look closely at swirling rainbow colors floating on a spilled gasoline puddle in a wet parking lot.',
        analogy: 'Gasoline is not colored ink. The gasoline film is only a few hundred nanometers thick. Sunlight reflects from both the top surface of the oil and the bottom surface where oil meets water. At specific viewing angles and thicknesses, blue light cancels out while red reinforces, painting vibrant dynamic colors without any pigment!',
        connection: 'This exact same thin-film interference is engineered into high-precision anti-reflective coatings, laser filters, and wafer testing tools.'
      },
      explanationSections: [
        {
          heading: '1. Thin-Film Interference Principles',
          content: 'When light strikes a thin film of thickness t and refractive index μ, division of amplitude produces two reflected rays. Ray 1 reflects from the top surface; Ray 2 refracts, reflects from the bottom surface, and exits back into the top medium. The path difference is Δ = 2μt cos r.'
        },
        {
          heading: '2. Optical Flatness Testing with Air Wedges',
          content: 'To test if an optical glass flat is truly plane-parallel to within nanometers, it is placed over a reference flat separated by a thin spacer at one end, forming an air wedge. Illuminated by monochromatic light, perfectly straight, equidistant parallel fringes appear. If the surface has a microscopic scratch or dip, the fringes bend like topographic contour lines on a map.'
        },
        {
          heading: '3. Anti-Reflecting Coatings (Blooming)',
          content: 'A thin layer of refractive index μ_film = √(μ_air · μ_glass) and thickness t = λ / (4 μ_film) produces two reflected waves that have equal amplitude and undergo a net relative path difference of λ/2. They destructively interfere, driving reflectance from 4% down to under 0.1%.'
        }
      ],
      formula: {
        title: 'Thin Film Path Difference & Anti-Reflective Thickness',
        latex: '\\Delta = 2\\mu t \\cos(r) \\pm \\frac{\\lambda}{2}, \\quad t_{\\text{AR}} = \\frac{\\lambda}{4\\mu_{\\text{film}}}',
        explanation: 'Condition for thin-film interference including Stokes π phase shift, and quarter-wave thickness formula for anti-reflective coatings.',
        variables: [
          { symbol: 't', name: 'Film physical thickness', unit: 'm' },
          { symbol: '\\mu', name: 'Refractive index of film', unit: 'dimensionless' },
          { symbol: 'r', name: 'Angle of refraction inside the film', unit: 'degrees' },
          { symbol: 't_{\\text{AR}}', name: 'Quarter-wave anti-reflective thickness', unit: 'm' }
        ]
      },
      diagramKey: 'interference-applications',
      workedExample: {
        title: 'Designing an Anti-Reflective Coating for Silicon Solar Cells',
        problem: 'Silicon solar cells (μ_Si ≈ 3.5) lose light to reflection. A silicon nitride coating (Si₃N₄, μ_film = 2.0) is deposited on top. Calculate the optimal film thickness t for center solar spectrum light (λ = 600 nm in air).',
        steps: [
          'Step 1: Formula for quarter-wave anti-reflective layer: t = λ / (4 · μ_film).',
          'Step 2: Substitute λ = 600 nm and μ_film = 2.0.',
          'Step 3: t = 600 nm / (4 × 2.0) = 600 nm / 8.0 = 75 nm.'
        ],
        solution: 'The optimal coating thickness is 75 nanometers (0.075 μm).'
      },
      realWorldApplication: {
        title: 'Semiconductor Lithography and Wafer Alignment',
        description: 'Modern extreme ultraviolet (EUV) photolithography uses interference fringes from multi-beam alignment marks to overlay 2-nanometer transistor features with sub-nanometer registration accuracy.',
        industry: 'Semiconductor Manufacturing (ASML, TSMC)'
      },
      relations: [
        {
          targetId: 'constructive-interference',
          type: 'applied_in',
          reason: 'Constructive reflection produces the bright color peaks in thin films and dielectric mirrors.'
        },
        {
          targetId: 'destructive-interference',
          type: 'applied_in',
          reason: 'Destructive interference is the operational principle of anti-reflective coatings.'
        },
        {
          targetId: 'fringe-width',
          type: 'applied_in',
          reason: 'Fringe spacing in air wedges directly indicates wedge angle and surface deviations.'
        }
      ],
      practiceQuestions: [
        {
          id: 'q-ia-1',
          conceptId: 'interference-applications',
          prompt: 'What is the theoretical minimum thickness t of an anti-reflective coating with refractive index μ to eliminate reflection of light of wavelength λ via destructive interference at normal incidence?',
          options: [
            { id: 'a', text: 't = λ / (4μ)', explanation: 'Correct! The round-trip through the film adds 2t = 2(λ/4μ) = λ/(2μ), introducing a λ/2 path shift that cancels reflected rays.' },
            { id: 'b', text: 't = λ / (2μ)', explanation: 'A half-wave thickness produces a round-trip of full λ, reinforcing reflection rather than canceling it.' },
            { id: 'c', text: 't = λ · μ / 4', explanation: 'Wavelength inside the medium is λ/μ; multiplying by μ is incorrect.' },
            { id: 'd', text: 't = λ', explanation: 'A full-wave thickness is too thick and creates multiple parasitic reflection orders.' }
          ],
          correctOptionId: 'a',
          prerequisiteHintId: 'destructive-interference',
          explanation: 'For normal incidence, round trip path difference is 2μt. To get destructive interference of reflected rays (path difference λ/2), 2μt = λ/2 ⇒ t = λ/(4μ).',
          difficulty: 'intermediate'
        }
      ]
    }
  ]
};

export const SAMPLE_CURRICULUM: Curriculum = UNIT2_CURRICULUM;

export const INITIAL_DIAGNOSTIC_ASSESSMENT = [
  {
    id: 'diag-1',
    conceptId: 'wave-parameters',
    prompt: 'A transverse wave on a string travels at 120 m/s with a frequency of 60 Hz. What is its wavelength λ?',
    options: [
      { id: 'a', text: '0.5 meters', explanation: 'Frequency was divided by velocity instead of velocity by frequency.' },
      { id: 'b', text: '2.0 meters', explanation: 'Correct! λ = v / f = 120 / 60 = 2.0 meters.' },
      { id: 'c', text: '7,200 meters', explanation: 'Multiplying velocity by frequency is incorrect.' },
      { id: 'd', text: '60 meters', explanation: 'Incorrect numerical result.' }
    ],
    correctOptionId: 'b',
    prerequisiteHintId: 'wave-fundamentals',
    explanation: 'Using the fundamental wave relation v = f · λ, we obtain λ = v / f = 120 m/s / 60 Hz = 2.0 m.',
    difficulty: 'beginner' as const
  },
  {
    id: 'diag-2',
    conceptId: 'superposition',
    prompt: 'When two identical waves with amplitude A meet at a point exactly in phase (Δφ = 0 rad), what is the resulting displacement amplitude?',
    options: [
      { id: 'a', text: '0', explanation: 'Zero amplitude occurs only when waves are 180° out of phase (cancelling).' },
      { id: 'b', text: 'A', explanation: 'When two waves add in phase, their amplitudes sum constructively.' },
      { id: 'c', text: '2A', explanation: 'Correct! By the superposition principle, amplitudes add linearly in phase: A + A = 2A.' },
      { id: 'd', text: 'A / 2', explanation: 'Superposition increases in-phase amplitude, never divides it.' }
    ],
    correctOptionId: 'c',
    prerequisiteHintId: 'wave-parameters',
    explanation: 'By the principle of superposition, when phase difference Δφ = 0, peaks add constructively: R = A₁ + A₂ = 2A.',
    difficulty: 'beginner' as const
  },
  {
    id: 'diag-3',
    conceptId: 'phase-path-difference',
    prompt: 'Two coherent beams with wavelength λ arrive at a detector. One travels a path that is λ/2 longer than the other. What phase difference does this introduce?',
    options: [
      { id: 'a', text: 'π/2 radians (90°)', explanation: 'A path difference of λ/4 corresponds to π/2 radians.' },
      { id: 'b', text: 'π radians (180°)', explanation: 'Correct! Δφ = (2π/λ) · (λ/2) = π radians.' },
      { id: 'c', text: '2π radians (360°)', explanation: 'A full wavelength λ corresponds to 2π radians.' },
      { id: 'd', text: 'Zero radians', explanation: 'A non-zero path difference creates a non-zero phase difference.' }
    ],
    correctOptionId: 'b',
    prerequisiteHintId: 'wave-parameters',
    explanation: 'The relation between phase difference and path difference is Δφ = (2π/λ) · Δx. For Δx = λ/2, Δφ = π radians (180°).',
    difficulty: 'beginner' as const
  },
  {
    id: 'diag-4',
    conceptId: 'young-double-slit',
    prompt: 'In Young\'s double-slit experiment, what is the path difference Δx between light from the two slits (separated by distance d) reaching a point at angle θ on a distant screen?',
    options: [
      { id: 'a', text: 'Δx = d sin θ', explanation: 'Correct! By dropping a perpendicular between the two slit paths, the extra distance is d sin θ.' },
      { id: 'b', text: 'Δx = d / sin θ', explanation: 'Path difference cannot approach infinity as θ approaches 0.' },
      { id: 'c', text: 'Δx = d cos θ', explanation: 'At θ = 0 (central axis), path difference is zero, whereas d cos(0) would equal d.' },
      { id: 'd', text: 'Δx = λ sin θ', explanation: 'The slit spacing is d, not λ.' }
    ],
    correctOptionId: 'a',
    prerequisiteHintId: 'phase-path-difference',
    explanation: 'From the geometry of the double-slit setup with screen distance D >> d, the path difference is Δx = d sin θ ≈ d(y/D).',
    difficulty: 'intermediate' as const
  },
  {
    id: 'diag-5',
    conceptId: 'fringe-width',
    prompt: 'In Young\'s double-slit setup, if you double the distance D between the slits and the screen, what happens to the fringe width β = λD/d?',
    options: [
      { id: 'a', text: 'Fringe width is halved', explanation: 'Fringe width is directly proportional to D, so it increases, not decreases.' },
      { id: 'b', text: 'Fringe width is doubled', explanation: 'Correct! Since β = λD/d, doubling D directly doubles the fringe width β.' },
      { id: 'c', text: 'Fringe width remains unchanged', explanation: 'Changing screen distance directly alters linear fringe separation.' },
      { id: 'd', text: 'Fringe width quadruples', explanation: 'The dependence on D is linear, not quadratic.' }
    ],
    correctOptionId: 'b',
    prerequisiteHintId: 'young-double-slit',
    explanation: 'Because fringe width β = λD/d is directly proportional to screen distance D, doubling D doubles the fringe width β.',
    difficulty: 'beginner' as const
  }
];

