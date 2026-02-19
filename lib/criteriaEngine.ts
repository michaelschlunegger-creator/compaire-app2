export function selectCriteria(category: string, customCriterion = '') {
  const criteria = [
    { id: 'price', name: 'Price', direction: 'lower_better', defaultWeight: 0.14 },
    { id: 'quality', name: 'Quality', direction: 'higher_better', defaultWeight: 0.12 },
    { id: 'performance', name: `${category} Performance`, direction: 'higher_better', defaultWeight: 0.12 },
    { id: 'risk', name: 'Risk', direction: 'lower_better', defaultWeight: 0.09 },
    { id: 'durability', name: 'Durability', direction: 'higher_better', defaultWeight: 0.08 },
    { id: 'maintainability', name: 'Maintainability', direction: 'higher_better', defaultWeight: 0.08 },
    { id: 'support', name: 'Support', direction: 'higher_better', defaultWeight: 0.08 },
    { id: 'availability', name: 'Availability', direction: 'higher_better', defaultWeight: 0.08 },
    { id: 'efficiency', name: 'Efficiency', direction: 'higher_better', defaultWeight: 0.08 },
    { id: 'sustainability', name: 'Sustainability', direction: 'higher_better', defaultWeight: 0.13 },
  ];

  if (customCriterion.trim()) {
    criteria.push({ id: 'custom', name: customCriterion.trim(), direction: 'higher_better', defaultWeight: 0.1 });
  }

  const sum = criteria.reduce((acc, x) => acc + x.defaultWeight, 0);
  return criteria.map((x) => ({ ...x, defaultWeight: Number((x.defaultWeight / sum).toFixed(4)) }));
}
