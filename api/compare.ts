import { detectCategory } from '../lib/categoryEngine';
import { selectCriteria } from '../lib/criteriaEngine';
import { extractFacts, scoreCriteria } from '../lib/scoringEngine';
import { computeTco } from '../lib/tcoEngine';
import { computeSustainability } from '../lib/sustainabilityEngine';
import { computeConfidence } from '../lib/confidenceEngine';
import { buildCacheKey, enforceDailyLimit, getCachedComparison, setCachedComparison } from '../lib/cache';

export async function compareHandler(payload: any, ip = 'client-local') {
  const limit = enforceDailyLimit(ip);
  if (!limit.allowed) throw new Error('Daily free limit reached (5 comparisons/day).');

  const key = buildCacheKey(payload.productA, payload.productB, payload.region);
  const cached = getCachedComparison(key);
  if (cached) return { ...cached, cached: true, remaining: limit.remaining };

  const category = await detectCategory(payload.productA, payload.productB);
  const criteria = selectCriteria(category.category, payload.customCriterion);
  const { facts, urls, raw } = extractFacts(payload.productA, payload.productB, criteria);
  const scores = scoreCriteria(criteria, raw, payload.sliders);
  const tco = computeTco(scores.criteria);
  const sustainability = computeSustainability(scores.criteria);
  const confidence = computeConfidence(scores.criteria, facts);
  const winner = scores.total.a >= scores.total.b ? 'A' : 'B';

  const result = {
    category,
    criteria,
    facts,
    scores,
    tco,
    sustainability,
    winner,
    explanation: `Option ${winner} wins on adjusted weighted criteria for ${payload.region}.`,
    tradeoffs: `Option ${winner === 'A' ? 'B' : 'A'} still performs better in selected individual dimensions.`,
    confidence,
    evidenceUrls: urls,
  };

  setCachedComparison(key, result);
  return { ...result, cached: false, remaining: limit.remaining };
}
