import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { Box, Snackbar, Alert } from "@mui/material";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import PageHeader from "@features/auth/components/PageHeader.jsx";
import SearchBar from "@features/products/components/SearchBar";
import { useState } from "react";
import ProductModal from "@features/products/components/ProductModal.jsx";
import styled from "@emotion/styled";
import { useProducts } from "@features/products/hooks/useProducts.js";
import PaginationBox from "@features/main/PaginationBox";

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    display: 'block',
    marginLeft: '100px',
}));

const ProductsPage = () => {

    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [modalLoading, setModalLoading] = useState(false);
    
    const {
        products,
        loading,
        page,
        pagination,
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
    }));

    const handleRowClick = (row) => {
        console.log('Выбрана строка:', row);
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

    const handleSearch = (searchTerm) => {
        console.log('Поиск:', searchTerm);
    };

    const handleFilter = () => {
        console.log('Открыть фильтр');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <ContentBlock centered={true}>
            <StyledBox>
                <PageHeader title="Товары" onAdd={handleAddProduct} />
                <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

                <Box>
                    <TableComponent
                        columns={columns}
                        rows={rows}
                        onRowClick={handleRowClick}
                        showActions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        tableWidth="1200px"
                        tableMinWidth="600px"
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
        </ContentBlock>
    );
};

export default ProductsPage;