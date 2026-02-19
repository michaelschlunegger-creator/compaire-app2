export function computeTco(scoreSet: any) {
  const a = scoreSet.price ? Math.round((100 - scoreSet.price.a) * 52) : null;
  const b = scoreSet.price ? Math.round((100 - scoreSet.price.b) * 52) : null;
  return { a, b };
}
