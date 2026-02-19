export function computeConfidence(criteria: any, facts: any) {
  const sourceCount = Object.keys(facts.a).length + Object.keys(facts.b).length;
  const completeness = Object.keys(criteria).length / 12;
  const agreement = 0.72;
  return Math.min(100, Math.round(sourceCount * 2 + completeness * 35 + agreement * 35));
}
