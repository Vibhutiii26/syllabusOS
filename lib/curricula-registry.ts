import { Curriculum } from '@/types/learning';
import { SAMPLE_CURRICULUM } from './curriculum';

export interface CourseLearningObjective {
  code: string;
  description: string;
}

export interface UnitDetail {
  id: string;
  number: number;
  title: string;
  description: string;
  subtopics: string[];
  conceptCount: number;
  suggestedHours?: number;
}

export interface BookReference {
  title: string;
  authors: string;
  publisher: string;
  edition?: string;
  year?: string;
}

export interface SubjectOption {
  id: string;
  code: string;
  name: string;
  program: string;
  session: string;
  branch: string;
  year: string;
  semester: string;
  credits: string;
  hours: string;
  status: 'available' | 'coming_soon';
  learningObjectives?: CourseLearningObjective[];
  units: UnitDetail[];
  textbooks?: BookReference[];
  references?: BookReference[];
  curriculumData?: Curriculum;
}

export const APPLIED_PHYSICS_SYLLABUS: SubjectOption = {
  id: 'btech-applied-physics-ph31001',
  code: 'PH31001(T)',
  name: 'Applied Physics (T)',
  program: 'B Tech Ist Year',
  session: '2025-2026',
  branch: 'Common First Year (All Branches: CSE, ECE, ME, EE, Civil, IT)',
  year: '1st Year',
  semester: 'Semester 1',
  credits: '4',
  hours: 'L: 3, T: 0, P: 2 (Total: 5 Hrs/Week)',
  status: 'available',
  learningObjectives: [
    {
      code: 'CLO01',
      description: 'To provide the basic concepts of laser & fiber optics and their various applications.'
    },
    {
      code: 'CLO02',
      description: 'To learn the principles of wave optics and understand their applicability in daily life.'
    },
    {
      code: 'CLO03',
      description: 'To understand the concept of Quantum Mechanics.'
    },
    {
      code: 'CLO04',
      description: 'To impart knowledge about nuclear structure, radiation, accelerators and detectors.'
    },
    {
      code: 'CLO05',
      description: 'To understand the fundamental concepts of crystal structure, semiconductor and superconductivity.'
    },
    {
      code: 'CLO06',
      description: 'To develop the basic skills to apply knowledge by the topics covered in the course to engineering problems.'
    }
  ],
  units: [
    {
      id: 'unit-1-laser-fiber',
      number: 1,
      title: 'UNIT-I: Laser and Fiber Optics',
      description: 'Quantum processes in laser, Einstein coefficients, population inversion, Ruby/He-Ne lasers, and optical fiber propagation.',
      subtopics: [
        'Lasers: Three quantum processes in laser (Absorption, Spontaneous Emission, Stimulated Emission)',
        'Einstein’s A & B co-efficient and their physical significance',
        'Population inversion and optical pumping schemes',
        'Components of Laser & Characteristic properties (Directionality, Monochromaticity, Coherence, High Brightness)',
        'Ruby Laser (Three-level solid-state optical laser)',
        'He-Ne Laser (Four-level gas laser and population mechanism)',
        'Industrial, medical and communication applications of Lasers',
        'Fiber Optics: Introduction to optical fiber & total internal reflection mechanism',
        'Propagation of light through optical fiber and numerical aperture NA = √(n₁² - n₂²)',
        'Acceptance angle, fractional refractive index change (Δ), and V-number',
        'Classification of optical fibers (Step index, Graded index, Single mode, Multimode)',
        'Engineering applications of optical fiber communication and sensors'
      ],
      conceptCount: 10,
      suggestedHours: 9
    },
    {
      id: 'unit-2-wave-optics',
      number: 2,
      title: 'UNIT-II: Wave Optics',
      description: 'Interference in thin films, Newton’s rings experiment, Michelson’s interferometer, Fraunhofer diffraction, and transmission gratings.',
      subtopics: [
        'Interference: Fundamentals of wave interference, phase and path difference',
        'Interference in thin films (Reflected and transmitted light, Stokes relation)',
        'Newton’s ring experiment (Air wedge, dark & bright circular fringes, radius calculation Dn² = 4nRλ)',
        'Michelson’s Interferometer and its engineering metrology applications',
        'Diffraction of light: Types of diffraction (Fresnel vs Fraunhofer)',
        'Fraunhofer diffraction at a single slit (Central maxima, minima condition d sin θ = mλ)',
        'Plane transmission Diffraction Grating, dispersive power, and resolving power'
      ],
      conceptCount: 10,
      suggestedHours: 8
    },
    {
      id: 'unit-3-quantum-mechanics',
      number: 3,
      title: 'UNIT-III: Quantum Mechanics',
      description: 'Breakdown of classical physics, de-Broglie hypothesis, uncertainty principle, wave function, and Schrödinger wave equations.',
      subtopics: [
        'Limitations of Classical Mechanics',
        'de-Broglie hypothesis for matter waves (λ = h / p)',
        'Phase velocity (vp = ω/k) and Group velocity (vg = dω/dk)',
        'Wave packet representation of localized particles',
        'Heisenberg’s uncertainty principle (Δx · Δp ≥ ℏ/2)',
        'Application: Proof of non-existence of electron inside atomic nucleus',
        'Compton effect and wavelength shift (Δλ = (h/m₀c)(1 - cos θ))',
        'Wave function (Ψ), physical significance, and Born statistical interpretation',
        'Schrödinger time-dependent wave equation',
        'Schrödinger time-independent wave equation',
        'Application: Particle in a one-dimensional infinite potential well (Energy levels En = n²h² / 8mL²)'
      ],
      conceptCount: 9,
      suggestedHours: 9
    },
    {
      id: 'unit-4-nuclear-physics',
      number: 4,
      title: 'UNIT-IV: Nuclear Physics',
      description: 'Nuclear structure, radioactive decays (α, β, γ), radiation shielding, accelerators (LINAC, Cyclotron, Betatron), and GM counter.',
      subtopics: [
        'Nuclear Radiations: Introduction of nucleus, nuclear forces, and binding energy',
        'Types of nuclear radiations (Alpha α, Beta β, Gamma γ decays)',
        'Interaction of nuclear radiations with matter (Photoelectric, Compton, Pair production)',
        'Radiation safety, biological effects, and shielding measures',
        'Radiation Technology: Linear Accelerator (LINAC) principle & operation',
        'Cyclotron: Magnetic resonance particle acceleration and relativistic limit',
        'Betatron: Magnetic induction electron acceleration',
        'Applications of particle accelerators in industry and radiotherapy',
        'Geiger-Muller (GM) counter: Construction, gas ionization, avalanche, and dead time'
      ],
      conceptCount: 7,
      suggestedHours: 7
    },
    {
      id: 'unit-5-solid-state-physics',
      number: 5,
      title: 'UNIT-V: Solid State Physics',
      description: 'Crystallography, Miller indices, Bragg’s law, semiconductor Fermi levels, Hall effect, and superconductivity.',
      subtopics: [
        'Crystal Physics: Space lattice, basis, and unit cell types',
        'Cubic unit cells: Simple Cubic (SC), Body-Centered Cubic (BCC), Face-Centered Cubic (FCC)',
        'Atomic Packing Fraction (APF) calculation (SC: 52%, BCC: 68%, FCC: 74%)',
        'Miller indices (h k l) of crystal planes and interplanar spacing',
        'Bragg’s law of X-ray Diffraction (2d sin θ = nλ) and crystal structure determination',
        'Semiconductor Physics: Band structure and Fermi energy level (Ef)',
        'Fermi level in Intrinsic and Extrinsic (n-type and p-type) semiconductors',
        'Hall effect: Hall voltage (VH), Hall coefficient (RH = 1/ne), and practical applications',
        'Superconductivity: Zero electrical resistance and critical temperature (Tc)',
        'Persistent currents, critical magnetic field (Hc), and Meissner effect (perfect diamagnetism)',
        'Type-I vs Type-II superconductors, vortex states, and magnetic levitation applications'
      ],
      conceptCount: 9,
      suggestedHours: 9
    }
  ],
  textbooks: [
    {
      title: 'A Textbook of Optics',
      authors: 'N. Subramaniam, Brij Lal and M. N. Avadhanulu',
      publisher: 'S. Chand, New Delhi'
    },
    {
      title: 'Engineering Physics',
      authors: 'H. K. Malik and A. K. Singh',
      publisher: 'Tata McGraw Hill, New Delhi'
    },
    {
      title: 'Concepts of Modern Physics',
      authors: 'Arthur Beiser',
      publisher: 'Tata McGraw Hill, New Delhi'
    },
    {
      title: 'Engineering Physics',
      authors: 'Gaur and Gupta',
      publisher: 'Dhanpat Rai Publications'
    },
    {
      title: 'Engineering Physics',
      authors: 'Navneet Gupta and S. K. Tiwary',
      publisher: 'Dhanpat Rai Publications'
    }
  ],
  references: [
    {
      title: 'An Introduction to Fiber Optics',
      authors: 'A. Ghatak and K. Thyagarajan',
      publisher: 'Cambridge University Press'
    },
    {
      title: 'Nuclear Physics',
      authors: 'S. N. Ghosal',
      publisher: 'S. Chand Publication'
    },
    {
      title: 'Elements of Solid-State Physics',
      authors: 'J. P. Srivastava',
      publisher: 'PHI Publication'
    },
    {
      title: 'Concepts of Modern Physics (6th Edition SIE)',
      authors: 'Arthur Beiser, S. Mahajan, S. R. Choudhary',
      publisher: 'Tata-McGraw-Hill, New Delhi',
      year: '2012'
    },
    {
      title: 'Feynman Lectures on Physics (Vol. 1-3)',
      authors: 'R. P. Feynman, R. B. Leighton and M. Sands',
      publisher: 'Addison-Wesley, Delhi',
      year: '1995'
    },
    {
      title: 'Radiation Detection and Measurement',
      authors: 'G. F. Knoll',
      publisher: 'John Wiley & Sons, Inc., New York'
    }
  ],
  curriculumData: SAMPLE_CURRICULUM
};

export const FIRST_YEAR_SUBJECTS: SubjectOption[] = [
  APPLIED_PHYSICS_SYLLABUS,
  {
    id: 'btech-math-1',
    code: 'MA31001',
    name: 'Engineering Mathematics I',
    program: 'B Tech Ist Year',
    session: '2025-2026',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    credits: '4',
    hours: 'L: 3, T: 1, P: 0 (Total: 4 Hrs/Week)',
    status: 'coming_soon',
    units: [
      {
        id: 'unit-math-calc',
        number: 1,
        title: 'UNIT-I: Differential Calculus & Curvature',
        description: 'Taylor & Maclaurin expansions, partial differentiation, Euler’s theorem, Jacobians.',
        subtopics: ['Rolle’s Theorem & Mean Value Theorems', 'Taylor Series & Asymptotes', 'Partial Differentiation & Euler’s Theorem', 'Maxima-Minima of Functions of Two Variables'],
        conceptCount: 8
      },
      {
        id: 'unit-math-matrices',
        number: 2,
        title: 'UNIT-II: Linear Algebra & Matrix Theory',
        description: 'Rank of matrices, system of linear equations, Eigenvalues and Cayley-Hamilton theorem.',
        subtopics: ['Echelon Form & Rank of Matrix', 'Consistency of Linear Systems', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem & Diagonalization'],
        conceptCount: 7
      },
      {
        id: 'unit-math-integrals',
        number: 3,
        title: 'UNIT-III: Integral Calculus & Vector Calculus',
        description: 'Beta-Gamma functions, Double & triple integrals, Gradient, Divergence, and Curl.',
        subtopics: ['Beta & Gamma Functions', 'Double & Triple Integrals', 'Gradient, Divergence and Curl', 'Green’s, Gauss and Stokes Theorems'],
        conceptCount: 8
      }
    ]
  },
  {
    id: 'btech-electrical-1',
    code: 'EE31001',
    name: 'Basic Electrical Engineering',
    program: 'B Tech Ist Year',
    session: '2025-2026',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    credits: '4',
    hours: 'L: 3, T: 1, P: 2 (Total: 6 Hrs/Week)',
    status: 'coming_soon',
    units: [
      {
        id: 'unit-ee-dc',
        number: 1,
        title: 'UNIT-I: DC Circuits & Network Theorems',
        description: 'Mesh and nodal analysis, Thevenin’s, Norton’s, Superposition, and Maximum Power Transfer theorems.',
        subtopics: ['Kirchhoff’s Laws & Nodal/Mesh Analysis', 'Thevenin’s & Norton’s Theorems', 'Superposition & Maximum Power Transfer', 'Star-Delta Conversions'],
        conceptCount: 6
      },
      {
        id: 'unit-ee-ac',
        number: 2,
        title: 'UNIT-II: AC Circuits & Transformers',
        description: 'Single-phase AC series/parallel RLC circuits, power factor, and single-phase transformers.',
        subtopics: ['Representation of Sinusoidal Waveforms', 'Series & Parallel RLC Resonance', 'Active, Reactive and Apparent Power', 'Single Phase Ideal & Real Transformer'],
        conceptCount: 7
      }
    ]
  },
  {
    id: 'btech-pps-1',
    code: 'CS31001',
    name: 'Programming for Problem Solving',
    program: 'B Tech Ist Year',
    session: '2025-2026',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    credits: '4',
    hours: 'L: 3, T: 0, P: 2 (Total: 5 Hrs/Week)',
    status: 'coming_soon',
    units: [
      {
        id: 'unit-cs-basics',
        number: 1,
        title: 'UNIT-I: Algorithms & Flowcharts',
        description: 'Problem-solving methodology, flowcharts, pseudocode, variables, data types, and arithmetic expressions.',
        subtopics: ['Algorithm design and step-by-step logic', 'Data types, memory representation, operators', 'Conditional statements (if-else, switch)', 'Loops (while, do-while, for)'],
        conceptCount: 6
      },
      {
        id: 'unit-cs-arrays',
        number: 2,
        title: 'UNIT-II: Arrays, Functions & Pointers',
        description: '1D & 2D arrays, string manipulation, user functions, parameter passing, and pointer mechanics.',
        subtopics: ['1D and 2D arrays, Matrix operations', 'Functions and recursion', 'Pointers and address arithmetic', 'Dynamic memory allocation (malloc, free)'],
        conceptCount: 8
      }
    ]
  },
  {
    id: 'btech-chem-1',
    code: 'CH31001',
    name: 'Engineering Chemistry',
    program: 'B Tech Ist Year',
    session: '2025-2026',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    credits: '4',
    hours: 'L: 3, T: 0, P: 2 (Total: 5 Hrs/Week)',
    status: 'coming_soon',
    units: [
      {
        id: 'unit-ch-water',
        number: 1,
        title: 'UNIT-I: Water Technology & Treatment',
        description: 'Hardness of water, boiler troubles, zeolite process, reverse osmosis, and municipal water purification.',
        subtopics: ['Hardness types (Temporary vs Permanent)', 'Boiler scale and sludge formation', 'Ion-exchange & Zeolite demineralization', 'Reverse Osmosis desalination'],
        conceptCount: 6
      },
      {
        id: 'unit-ch-polymers',
        number: 2,
        title: 'UNIT-II: Polymers, Nanomaterials & Corrosion',
        description: 'Polymerization mechanisms, conducting polymers, carbon nanotubes, and electrochemical corrosion mechanisms.',
        subtopics: ['Thermoplastics vs Thermosetting polymers', 'Conducting polymers and elastomers', 'Electrochemical mechanism of corrosion', 'Cathodic protection and sacrificial anode'],
        conceptCount: 7
      }
    ]
  },
  {
    id: 'btech-eg-1',
    code: 'ME31001',
    name: 'Engineering Graphics & Design',
    program: 'B Tech Ist Year',
    session: '2025-2026',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    credits: '3',
    hours: 'L: 1, T: 0, P: 4 (Total: 5 Hrs/Week)',
    status: 'coming_soon',
    units: [
      {
        id: 'unit-eg-projection',
        number: 1,
        title: 'UNIT-I: Orthographic Projections & Scales',
        description: 'Principles of engineering graphics, conic sections, scales, and orthographic projection of points and lines.',
        subtopics: ['Representative Fraction (RF) and plain/diagonal scales', 'Orthographic projection in 1st vs 3rd angle', 'Projections of lines inclined to both planes', 'Projections of simple planes and laminas'],
        conceptCount: 6
      }
    ]
  }
];

export const SUBJECT_CATALOG: SubjectOption[] = FIRST_YEAR_SUBJECTS;

export interface StudentOnboardingProfile {
  university: string;
  degree: string;
  branch: string;
  year: string;
  semester: string;
  subjectId: string;
  unitId: string;
  familiarity: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    stories: boolean;
    visuals: boolean;
    workedExamples: boolean;
    conciseRevision: boolean;
  };
  completedAt: string;
}

export const ONBOARDING_STORAGE_KEY = 'syllabus_os_onboarding_profile_v1';

export function getSavedOnboardingProfile(): StudentOnboardingProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse onboarding profile:', e);
    return null;
  }
}

export function saveOnboardingProfile(profile: StudentOnboardingProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save onboarding profile:', e);
  }
}

export function getSubjectById(subjectId: string): SubjectOption {
  return SUBJECT_CATALOG.find((s) => s.id === subjectId) || APPLIED_PHYSICS_SYLLABUS;
}

export function getSubjectsByFilter(filters: {
  year?: string;
  branch?: string;
  semester?: string;
}): SubjectOption[] {
  return SUBJECT_CATALOG.filter((sub) => {
    if (filters.year && filters.year !== 'all' && sub.year !== filters.year) {
      return false;
    }
    if (filters.semester && filters.semester !== 'all' && sub.semester !== filters.semester) {
      return false;
    }
    return true;
  });
}

