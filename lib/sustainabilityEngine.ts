export function computeSustainability(scoreSet: any) {
  if (!scoreSet.sustainability) return { a: null, b: null };
  return { a: scoreSet.sustainability.a, b: scoreSet.sustainability.b };
}
