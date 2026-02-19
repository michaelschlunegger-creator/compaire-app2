function seededValue(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return 35 + (Math.abs(h) % 60);
}

export function extractFacts(productA: string, productB: string, criteria: any[]) {
  const facts = { a: {}, b: {} } as any;
  const urls = { a: {}, b: {} } as any;
  const raw = { a: {}, b: {} } as any;

  criteria.forEach((c) => {
    raw.a[c.id] = seededValue(`${productA}-${c.id}`);
    raw.b[c.id] = seededValue(`${productB}-${c.id}`);
    facts.a[c.id] = `${productA}: inferred ${c.name} signal`;
    facts.b[c.id] = `${productB}: inferred ${c.name} signal`;
    urls.a[c.id] = [`https://www.google.com/search?q=${encodeURIComponent(productA + ' ' + c.name)}`];
    urls.b[c.id] = [`https://www.google.com/search?q=${encodeURIComponent(productB + ' ' + c.name)}`];
  });

  return { facts, urls, raw };
}

export function scoreCriteria(criteria: any[], raw: any, sliders: any) {
  const weighted = {} as any;
  let totalA = 0;
  let totalB = 0;

  const tweak = (id: string, base: number) => {
    let v = base;
    if (id === 'price') v *= 1 + sliders.costSensitivity / 150;
    if (id === 'sustainability') v *= 1 + sliders.sustainabilityImportance / 150;
    if (id === 'durability') v *= 1 + sliders.longTermFocus / 150;
    if (id === 'risk') v *= 1 + sliders.riskAversion / 150;
    return v;
  };

  const tw = criteria.map((c) => tweak(c.id, c.defaultWeight));
  const sum = tw.reduce((a, b) => a + b, 0);

  criteria.forEach((c, i) => {
    const w = tw[i] / sum;
    const a = Math.min(100, Math.max(0, raw.a[c.id]));
    const b = Math.min(100, Math.max(0, raw.b[c.id]));
    const sa = c.direction === 'lower_better' ? 100 - a : a;
    const sb = c.direction === 'lower_better' ? 100 - b : b;
    weighted[c.id] = { a: Number(sa.toFixed(1)), b: Number(sb.toFixed(1)), weight: Number(w.toFixed(4)), direction: c.direction };
    totalA += sa * w;
    totalB += sb * w;
  });

  return { criteria: weighted, total: { a: Number(totalA.toFixed(1)), b: Number(totalB.toFixed(1)) } };
}
