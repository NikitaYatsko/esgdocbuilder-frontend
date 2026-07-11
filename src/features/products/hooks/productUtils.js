export const normalizeResponse = (data) => {
  if (!data) return { products: [], pagination: null };
  const products = data?.content || data?.items || data?.products || (Array.isArray(data) ? data : []);
  const pagination = data?.pagination || data?.data?.pagination || (Array.isArray(products) ? { pages: 1, total: products.length } : null);
  return {
    products: Array.isArray(products) ? products : [],
    pagination,
  };
};

export const parseNumber = (value) => {
  if (value === '' || value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};