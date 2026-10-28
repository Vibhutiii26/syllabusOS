import { Curriculum } from '@/types/learning';
import {
  SAMPLE_CURRICULUM as UNIT2_CURRICULUM,
  INITIAL_DIAGNOSTIC_ASSESSMENT
} from './curriculum/unit2-wave-optics';
import { UNIT1_CONCEPTS } from './curriculum/unit1-laser-fiber';

export const SAMPLE_CURRICULUM: Curriculum = {
  ...UNIT2_CURRICULUM,
  id: 'btech-applied-physics-ph31001',
  subjectCode: 'PH31001(T)',
  subjectName: 'Applied Physics (T)',
  academicYear: '2025-2026',
  concepts: [
    ...UNIT1_CONCEPTS,
    ...UNIT2_CURRICULUM.concepts
  ]
};

export { INITIAL_DIAGNOSTIC_ASSESSMENT };
export { UNIT1_CONCEPTS };
