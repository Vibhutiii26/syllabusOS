import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import type { Concept, RelationType } from '@/types/learning';

// ---------------------------------------------------------------------------
// Shared curriculum graph helpers (client-safe; no answer keys here).
// ---------------------------------------------------------------------------

const CONCEPTS_MAP = new Map(SAMPLE_CURRICULUM.concepts.map((c) => [c.id, c]));

export const CURRICULUM = SAMPLE_CURRICULUM;

export function getConceptById(id: string): Concept | undefined {
  return CONCEPTS_MAP.get(id);
}

/** Concepts that must be understood before `conceptId` (incoming prereq edges). */
export function getPrerequisites(conceptId: string): Concept[] {
  const out: Concept[] = [];
  for (const concept of SAMPLE_CURRICULUM.concepts) {
    if (concept.id === conceptId) continue;
    if (
      concept.relations.some(
        (r) => r.targetId === conceptId && r.type === 'prerequisite_of',
      )
    ) {
      out.push(concept);
    }
  }
  return out;
}

/** Concepts that depend on `conceptId` (outgoing prereq edges). */
export function getDependents(conceptId: string): Concept[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.relations
    .filter((r) => r.type === 'prerequisite_of')
    .map((r) => getConceptById(r.targetId))
    .filter((c): c is Concept => Boolean(c));
}

export function getRelated(
  conceptId: string,
  types: RelationType[] = ['related_to', 'part_of', 'applied_in'],
): Concept[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.relations
    .filter((r) => types.includes(r.type))
    .map((r) => getConceptById(r.targetId))
    .filter((c): c is Concept => Boolean(c));
}

/** Curriculum-defined teaching order. */
export function conceptOrder(): Concept[] {
  return SAMPLE_CURRICULUM.concepts;
}
