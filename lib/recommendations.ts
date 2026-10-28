import { LearnerState, LearningRecommendation } from '@/types/learning';
import { SAMPLE_CURRICULUM } from './curriculum';
import { PREREQUISITE_TREE } from './diagnosis';

/**
 * Computes an ordered, prioritized list of recommendations based on learner evidence and syllabus topology.
 */
export function generateRecommendations(state: LearnerState): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];
  const concepts = SAMPLE_CURRICULUM.concepts;

  // 1. Any active prerequisite investigation or confirmed gap has highest priority
  if (state.activeInvestigation && state.activeInvestigation.stage !== 'resolved') {
    const prereqId = state.activeInvestigation.suspectedPrerequisiteId;
    const prereqConcept = concepts.find((c) => c.id === prereqId);
    const targetConcept = concepts.find((c) => c.id === state.activeInvestigation.targetConceptId);

    if (prereqConcept && targetConcept) {
      recommendations.push({
        conceptId: prereqId,
        priority: 'high',
        badge: 'Prerequisite Gap',
        reason: `Bridge foundational gap in "${prereqConcept.title}" before returning to "${targetConcept.title}".`,
        prerequisiteId: prereqId
      });
    }
  }

  // 2. Identify any concepts currently marked "needs_review"
  for (const concept of concepts) {
    const mastery = state.mastery[concept.id];
    if (mastery && mastery.status === 'needs_review') {
      // Avoid duplicate if already added
      if (!recommendations.some((r) => r.conceptId === concept.id)) {
        recommendations.push({
          conceptId: concept.id,
          priority: 'high',
          badge: 'Review Foundation',
          reason: `Your previous attempts showed gaps (${mastery.evidenceScore}% evidence). Review the analogy and worked examples.`
        });
      }
    }
  }

  // 3. Find next concept ready to learn:
  // Concept is unassessed or developing, AND all its prerequisites are demonstrated (or high developing >= 65)
  for (const concept of concepts) {
    const mastery = state.mastery[concept.id];
    const isMastered = mastery && mastery.status === 'demonstrated';
    if (isMastered) continue;

    const prereqs = PREREQUISITE_TREE[concept.id] || [];
    const allPrereqsMet = prereqs.every((pId) => {
      const pMastery = state.mastery[pId];
      return pMastery && (pMastery.status === 'demonstrated' || pMastery.evidenceScore >= 65);
    });

    if (allPrereqsMet && !recommendations.some((r) => r.conceptId === concept.id)) {
      if (!mastery || mastery.status === 'not_assessed') {
        const prereqNames = prereqs
          .map((id) => concepts.find((c) => c.id === id)?.title)
          .filter(Boolean)
          .join(', ');

        recommendations.push({
          conceptId: concept.id,
          priority: recommendations.length === 0 ? 'high' : 'medium',
          badge: 'Recommended Next',
          reason: prereqs.length > 0
            ? `You have demonstrated the foundations (${prereqNames}). You are ready to unlock ${concept.title}.`
            : `Foundational starting point for the syllabus: explore ${concept.title}.`
        });
      } else if (mastery.status === 'developing') {
        recommendations.push({
          conceptId: concept.id,
          priority: 'medium',
          badge: 'Deepen Practice',
          reason: `You're developing understanding in ${concept.title} (${mastery.evidenceScore}% evidence). Solve one more practice problem to demonstrate mastery.`
        });
      }
    }
  }

  // 4. Default fallback: first unassessed concept in syllabus sequence
  if (recommendations.length === 0) {
    const firstUnassessed = concepts.find((c) => {
      const m = state.mastery[c.id];
      return !m || m.status !== 'demonstrated';
    });

    if (firstUnassessed) {
      recommendations.push({
        conceptId: firstUnassessed.id,
        priority: 'medium',
        badge: 'Recommended Next',
        reason: `Continue your syllabus progression with ${firstUnassessed.title}.`
      });
    } else {
      recommendations.push({
        conceptId: concepts[0].id,
        priority: 'low',
        badge: 'Ready to Master',
        reason: `Outstanding work! You have demonstrated understanding across all 10 concepts in Waves and Wave Optics.`
      });
    }
  }

  return recommendations;
}
