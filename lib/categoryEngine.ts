export async function detectCategory(productA: string, productB: string) {
  const text = `${productA} ${productB}`.toLowerCase();
  if (text.includes('crm') || text.includes('saas')) {
    return { category: 'Software', subcategory: 'Business SaaS', type: 'service' };
  }
  if (text.includes('car') || text.includes('phone') || text.includes('laptop')) {
    return { category: 'Consumer Products', subcategory: 'Electronics/Auto', type: 'product' };
  }
  return { category: 'General', subcategory: 'Cross-category', type: 'product_or_service' };
}
