import { useState, useCallback } from 'react';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [unitFilter, setUnitFilter] = useState('');
  const [rangeFilters, setRangeFilters] = useState({
    sellPriceMin: '',
    sellPriceMax: '',
    costPriceMin: '',
    costPriceMax: '',
    marginalityMin: '',
    marginalityMax: '',
    vatMin: '',
    vatMax: '',
  });

  const searchProducts = useCallback((term) => setSearchTerm(term), []);
  const filterByCategory = useCallback((id) => {
    const normalized = (id === '' || id == null) ? null : Number(id);
    setCategoryFilter(Number.isFinite(normalized) ? normalized : null);
  }, []);
  const filterByTypeOfUnit = useCallback((type) => {
    setUnitFilter(type ? String(type).toUpperCase().trim() : '');
  }, []);
  const setFilterRange = useCallback((field, value) => {
    setRangeFilters(prev => ({ ...prev, [field]: value }));
  }, []);
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter(null);
    setUnitFilter('');
    setRangeFilters({
      sellPriceMin: '', sellPriceMax: '',
      costPriceMin: '', costPriceMax: '',
      marginalityMin: '', marginalityMax: '',
      vatMin: '', vatMax: '',
    });
  }, []);
  const clearSearch = useCallback(() => setSearchTerm(''), []);

  return {
    searchTerm,
    categoryFilter,
    unitFilter,
    rangeFilters,
    searchProducts,
    filterByCategory,
    filterByTypeOfUnit,
    setFilterRange,
    clearFilters,
    clearSearch,
  };
};