import { Curriculum } from '@/types/learning';
import { SAMPLE_CURRICULUM } from './curriculum';

export interface SubjectOption {
  id: string;
  code: string;
  name: string;
  branch: string;
  year: string;
  semester: string;
  units: {
    id: string;
    number: number;
    title: string;
    description: string;
    conceptCount: number;
  }[];
  curriculumData?: Curriculum;
}

export const SUBJECT_CATALOG: SubjectOption[] = [
  {
    id: 'btech-eng-phys-waves',
    code: 'PHY-101',
    name: 'Engineering Physics',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    units: [
      {
        id: 'unit-waves-optics',
        number: 1,
        title: 'Waves and Wave Optics',
        description: 'Wave propagation, phase relations, superposition, interference, YDSE, and anti-reflective thin films.',
        conceptCount: 10
      },
      {
        id: 'unit-lasers-quantum',
        number: 2,
        title: 'Quantum Mechanics & Lasers',
        description: 'de Broglie hypothesis, Heisenberg uncertainty, wave-particle duality, stimulated emission, optical cavities.',
        conceptCount: 8
      },
      {
        id: 'unit-fiber-optics',
        number: 3,
        title: 'Electromagnetism & Fiber Optics',
        description: 'Maxwell equations, total internal reflection, optical fiber numerical aperture, wave attenuation.',
        conceptCount: 6
      }
    ],
    curriculumData: SAMPLE_CURRICULUM
  },
  {
    id: 'btech-dsa',
    code: 'CS-201',
    name: 'Data Structures & Algorithms',
    branch: 'Computer Science & IT',
    year: '2nd Year',
    semester: 'Semester 3',
    units: [
      {
        id: 'unit-dsa-foundations',
        number: 1,
        title: 'Linear Data Structures & Complexity',
        description: 'Asymptotic Big-O analysis, dynamic arrays, singly/doubly linked lists, stacks, and queues.',
        conceptCount: 8
      },
      {
        id: 'unit-dsa-trees',
        number: 2,
        title: 'Trees & Hierarchical Structures',
        description: 'Binary search trees, AVL trees, Red-Black balancing, Heaps, and Priority Queues.',
        conceptCount: 7
      },
      {
        id: 'unit-dsa-graphs',
        number: 3,
        title: 'Graph Algorithms & Optimization',
        description: 'BFS/DFS traversal, Dijkstra shortest path, Minimum Spanning Trees (Kruskal/Prim), Dynamic Programming.',
        conceptCount: 9
      }
    ]
  },
  {
    id: 'btech-math-1',
    code: 'MAT-101',
    name: 'Engineering Mathematics I',
    branch: 'Common First Year (All Branches)',
    year: '1st Year',
    semester: 'Semester 1',
    units: [
      {
        id: 'unit-math-calculus',
        number: 1,
        title: 'Differential Calculus & Curvature',
        description: 'Taylor & Maclaurin series, partial differentiation, Maxima-minima of multivariable functions, Jacobians.',
        conceptCount: 8
      },
      {
        id: 'unit-math-matrices',
        number: 2,
        title: 'Linear Algebra & Matrices',
        description: 'Rank of matrices, Eigenvalues & Eigenvectors, Cayley-Hamilton theorem, Diagonalization of matrices.',
        conceptCount: 7
      }
    ]
  },
  {
    id: 'btech-digital-logic',
    code: 'EC-202',
    name: 'Digital Logic & Computer Design',
    branch: 'Electronics & Computer Engineering',
    year: '2nd Year',
    semester: 'Semester 3',
    units: [
      {
        id: 'unit-logic-gates',
        number: 1,
        title: 'Boolean Algebra & Combinational Circuits',
        description: 'De Morgan laws, Karnaugh maps (K-Maps), Multiplexers, Decoders, Half/Full Adders.',
        conceptCount: 8
      },
      {
        id: 'unit-sequential-circuits',
        number: 2,
        title: 'Sequential Logic & State Machines',
        description: 'SR, JK, D, T Flip-flops, Synchronous counters, Shift registers, Finite State Machines (FSM).',
        conceptCount: 7
      }
    ]
  },
  {
    id: 'btech-os',
    code: 'CS-301',
    name: 'Operating Systems',
    branch: 'Computer Science & IT',
    year: '3rd Year',
    semester: 'Semester 5',
    units: [
      {
        id: 'unit-os-processes',
        number: 1,
        title: 'Processes, Threads & Concurrency',
        description: 'Process state lifecycle, PCB, context switching, CPU scheduling algorithms, Semaphores & Mutex.',
        conceptCount: 8
      },
      {
        id: 'unit-os-memory',
        number: 2,
        title: 'Memory Management & Virtual Memory',
        description: 'Paging, Segmentation, Page replacement algorithms (LRU, FIFO, Optimal), Thrashing, Virtual Memory.',
        conceptCount: 7
      }
    ]
  }
];

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
