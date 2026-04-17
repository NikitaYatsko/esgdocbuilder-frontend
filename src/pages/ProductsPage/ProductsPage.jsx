
import { Box, Snackbar, Alert, Menu, MenuItem, Select, InputLabel, FormControl, Button, Typography, TextField } from "@mui/material";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import PageHeader from "@features/auth/components/PageHeader.jsx";
import SearchBar from "@features/products/components/SearchBar";
import { useCallback, useState } from "react";
import ProductModal from "@features/products/components/ProductModal.jsx";
import styled from "@emotion/styled";
import { useProducts } from "@features/products/hooks/useProducts.js";
import PaginationBox from "@features/main/PaginationBox";
import {CenteredContainer} from "@/layouts/CenteredContainer.jsx";

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    display: 'block',
}));

const UNIT_TYPES = [
    { value: 'PCS', label: 'Шт (PCS)' },
    { value: 'M', label: 'Метр (M)' },
    { value: 'M2', label: 'Метр² (M2)' },
    { value: 'SET', label: 'Комплект (SET)' },
    { value: 'JOB', label: 'Работа (JOB)' },
];

const ProductsPage = () => {

    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [modalLoading, setModalLoading] = useState(false);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const {
        products,
        loading,
        pagination,
        searchTerm,
        rangeFilters,
        categories,
        searchProducts,
        filterByCategory,
        filterByTypeOfUnit,
        setFilterRange,
        clearFilters,
        clearSearch,
        page,
        nextPage,
        prevPage,
        deleteProduct,
        createProduct,
        updateProduct,
        refetch
    } = useProducts();

    const columns = [
        { id: 'name', label: 'Наименование', align: 'left' },
        { id: 'category', label: 'Категория', align: 'left' },
        { id: 'typeOfUnit', label: 'Единица измерения', align: 'left' },
        { id: 'costPrice', label: 'Цена Закупки', align: 'left' },
        { id: 'sellPrice', label: 'Цена Продажи', align: 'left' },
        { id: 'marginality', label: 'Маржинальность', align: 'left' },
        { id: 'vat', label: 'НДС', align: 'left' },
    ];

    const rows = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || p.category,
        typeOfUnit: p.typeOfUnit?.name || p.typeOfUnit,
        costPrice: p.costPrice,
        sellPrice: p.sellPrice,
        marginality: p.marginality,
        vat: p.vat,
    })).sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
        if (bValue == null) return sortOrder === 'asc' ? 1 : -1;
        if (typeof aValue === 'string') {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const handleRowClick = (row) => {
        // Логика обработки клика по строке (если нужна)
    };

    const handleEdit = (row) => {
        const fullProduct = products.find(p => p.id === row.id);
        setSelectedProduct(fullProduct);
        setOpenModal(true);
    };

    const handleDelete = async (row) => {
            const result = await deleteProduct(row.id);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: "Товар успешно удалён",
                    severity: "success"
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.error || "Ошибка при удалении товара",
                    severity: "error"
                });
            }
        };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setOpenModal(true);
    };

    const handleSaveProduct = async (productData) => {
        setModalLoading(true);
        
        let result;
        if (selectedProduct) {
            result = await updateProduct(selectedProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }
        
        setModalLoading(false);
        
        if (result.success) {
            setSnackbar({
                open: true,
                message: selectedProduct ? "Товар успешно обновлён" : "Товар успешно добавлен",
                severity: "success"
            });
            setOpenModal(false);
            setSelectedProduct(null);
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка при сохранении товара",
                severity: "error"
            });
        }
    };

    const handleSearch = useCallback((value) => {
        searchProducts(value);
    }, [searchProducts]);

    const handleClearSearch = useCallback(() => {
        clearSearch();
    }, [clearSearch]);

    const handleNumericInput = (e, allowDecimal = false) => {
        const value = e.target.value;
        let regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
        if (!regex.test(value)) {
            e.target.value = value.replace(allowDecimal ? /[^\d.]/g : /\D/g, '');
        }
        if (Number(value) > 999999999) {
            e.target.value = '999999999';
        }
    };

    const handleFilter = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else {
                // Третий клик - сброс сортировки
                setSortField('');
                setSortOrder('asc');
            }
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleCloseFilter = () => {
        setFilterAnchorEl(null);
    };

    const handleCategoryChange = async (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        await filterByCategory(categoryId);
    };

    const handleUnitChange = async (event) => {
        const unit = event.target.value;
        setSelectedUnit(unit);
        await filterByTypeOfUnit(unit);
    };

    const handleRangeChange = (field) => (event) => {
        setFilterRange(field, event.target.value);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSelectedUnit('');
        clearFilters();
        handleCloseFilter();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
            <CenteredContainer width="1200">
                <StyledBox>
                    <PageHeader title="Товары" onAdd={handleAddProduct} />
                    <SearchBar
                        value={searchTerm}
                        onSearch={handleSearch}
                        onClear={handleClearSearch}
                        onFilter={handleFilter}
                    />

                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleCloseFilter}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ sx: { p: 2, minWidth: 280 } }}
                    >
                        <Typography sx={{ mb: 1, fontWeight: 600 }}>Фильтр продуктов</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="category-filter-label">Категория</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                value={selectedCategory}
                                label="Категория"
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">Не выбрано</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="unit-filter-label">Единица измерения</InputLabel>
                            <Select
                                labelId="unit-filter-label"
                                value={selectedUnit}
                                label="Единица измерения"
                                onChange={handleUnitChange}
                            >
                                <MenuItem value="">Не выбрано</MenuItem>
                                {UNIT_TYPES.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                            <TextField
                                label="Цена продажи мин"
                                type="number"
                                size="small"
                                value={rangeFilters.sellPriceMin}
                                onChange={handleRangeChange('sellPriceMin')}
                                onInput={(e) => handleNumericInput(e, false)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                            <TextField
                                label="Цена продажи макс"
                                type="number"
                                size="small"
                                value={rangeFilters.sellPriceMax}
                                onChange={handleRangeChange('sellPriceMax')}
                                onInput={(e) => handleNumericInput(e, false)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                            <TextField
                                label="Цена закупки мин"
                                type="number"
                                size="small"
                                value={rangeFilters.costPriceMin}
                                onChange={handleRangeChange('costPriceMin')}
                                onInput={(e) => handleNumericInput(e, false)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                            <TextField
                                label="Цена закупки макс"
                                type="number"
                                size="small"
                                value={rangeFilters.costPriceMax}
                                onChange={handleRangeChange('costPriceMax')}
                                onInput={(e) => handleNumericInput(e, false)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                            <TextField
                                label="Маржинальность мин"
                                type="number"
                                size="small"
                                value={rangeFilters.marginalityMin}
                                onChange={handleRangeChange('marginalityMin')}
                                onInput={(e) => handleNumericInput(e, true)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                            <TextField
                                label="Маржинальность макс"
                                type="number"
                                size="small"
                                value={rangeFilters.marginalityMax}
                                onChange={handleRangeChange('marginalityMax')}
                                onInput={(e) => handleNumericInput(e, true)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                            <TextField
                                label="НДС мин"
                                type="number"
                                size="small"
                                value={rangeFilters.vatMin}
                                onChange={handleRangeChange('vatMin')}
                                onInput={(e) => handleNumericInput(e, true)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                            <TextField
                                label="НДС макс"
                                type="number"
                                size="small"
                                value={rangeFilters.vatMax}
                                onChange={handleRangeChange('vatMax')}
                                onInput={(e) => handleNumericInput(e, true)}
                                inputProps={{ max: 999999999, min: 0 }}
                            />
                        </Box>

                        <Button fullWidth variant="outlined" onClick={handleClearFilters}>
                            Сбросить фильтр
                        </Button>
                    </Menu>

                    <Box>
                        <TableComponent
                            columns={columns}
                            rows={rows}
                            onRowClick={handleRowClick}
                            showActions={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            tableWidth="100%"
                            tableMinWidth="600px"
                            onSort={handleSort}
                            sortField={sortField}
                            sortOrder={sortOrder}
                        />
                        {pagination && (
                            <PaginationBox
                                page={page}
                                totalPages={pagination.pages}
                                onNext={nextPage}
                                onPrev={prevPage}
                            />
                        )}
                    </Box>
                    <ProductModal
                        open={openModal}
                        onClose={handleCloseModal}
                        product={selectedProduct}
                        onSave={handleSaveProduct}
                        loading={modalLoading}
                        categories={categories}
                    />

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </StyledBox>
            </CenteredContainer>
    );
};

export default ProductsPage;