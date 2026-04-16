import { useEffect, useState } from "react";
import {
    Typography,
    IconButton,
    Box,
    Autocomplete,
    TextField,
    Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
    StyledModal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from "@features/modal/StyledModal";

import { StyledInput } from "@features/modal/StyledInput";
import { StyledButton } from "@features/modal/StyledButton";
import { useProducts } from "@features/products/hooks/useProducts";

const CATEGORIES = [
    { id: 1, name: "Панели" },
    { id: 2, name: "Инверторы" },
    { id: 3, name: "Система крепления" },
    { id: 4, name: "Солнечный кабель" },
    { id: 5, name: "Кабель-каналы" },
    { id: 6, name: "Щитовая IP65 DC" },
    { id: 7, name: "Щитовая IP65 AC" },
    { id: 8, name: "Кабеля и провода" },
    { id: 9, name: "Учет и измерение" },
    { id: 10, name: "Монтаж / Пусконаладка / Доставка" },
    { id: 11, name: "Пакеты документов" },
    { id: 12, name: "Спецтехника" },
    { id: 13, name: "Подстанционные работы" },
    { id: 14, name: "Трасса / Опоры / Земляные работы" },
    { id: 15, name: "Щитовые работы и замена" }
];

const InvoiceModal = ({ open, onClose, onSave, loading = false, mode = 'create', initialData = null }) => {

    const { products, loading: productsLoading } = useProducts();

    const [invoiceName, setInvoiceName] = useState("");
    const [power, setPower] = useState("");

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [errors, setErrors] = useState({});

const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory.name)
    : [];

    const calculateValues = (product, qty) => {
        if (!product) {
            return {
                price: 0,
                vatPerUnit: 0,
                vatTotal: 0,
                unitMarginality: 0,
                totalMarginality: 0,
                total: 0
            };
        }

        const price = product.sellPrice || 0;
        const vatPerUnit = product.vat || 0;
        const unitMarginality = product.marginality || 0;
        const vatTotal = vatPerUnit * qty;
        const totalMarginality = unitMarginality * qty;
        const total = price * qty;

        return {
            price,
            vatPerUnit,
            vatTotal,
            unitMarginality,
            totalMarginality,
            total
        };
    };

    const [calculatedValues, setCalculatedValues] = useState({
        price: 0,
        vatPerUnit: 0,
        vatTotal: 0,
        unitMarginality: 0,
        totalMarginality: 0,
        total: 0
    });

    useEffect(() => {
        const values = calculateValues(selectedProduct, quantity);
        setCalculatedValues(values);
    }, [selectedProduct, quantity]);

    const handleCategoryChange = (_, value) => {
        setSelectedCategory(value);
        setSelectedProduct(null); 
    };

    const handleProductChange = (_, value) => {
        setSelectedProduct(value);
        if (errors.product) {
            setErrors(prev => ({ ...prev, product: "" }));
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setQuantity("");
            return;
        }
        const qty = Number(value);
        if (isNaN(qty)) return;
        setQuantity(qty);
        if (errors.quantity) {
            setErrors(prev => ({ ...prev, quantity: "" }));
        }
    };

useEffect(() => {
    if (!open) return;

    if (mode === 'editItem' && initialData) {
        const product = products.find(p => p.id === initialData.productId);

        if (product) {
            const category = CATEGORIES.find(c => c.name === product.category);

            setSelectedCategory(category || null);
            setSelectedProduct(product);
        }

        setQuantity(initialData.quantity || 1);
    }

    if (mode === 'create') {
        setInvoiceName("");
        setPower("");
        setSelectedCategory(null);
        setSelectedProduct(null);
        setQuantity(1);
    }

    setErrors({});
}, [open, mode, initialData, products]);

    const validate = () => {
        const newErrors = {};

        if (mode === 'create') {
            if (!invoiceName.trim()) newErrors.invoiceName = "Введите название сметы";
            if (!power.trim()) newErrors.power = "Введите мощность";
            if (power && isNaN(Number(power))) newErrors.power = "Введите корректное число";
        } else if (mode === 'editItem') {
            if (!selectedCategory) newErrors.category = "Выберите категорию";
            if (!selectedProduct) newErrors.product = "Выберите товар";
            if (!quantity || quantity <= 0) newErrors.quantity = "Введите корректное количество";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        let submitData;
        if (mode === 'create') {
            submitData = {
                invoiceName: invoiceName,
                power: Number(power)
            };
        } else {
            submitData = {
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                productCategory: selectedCategory.name,
                quantity: quantity,
                price: calculatedValues.price,
                vatPerUnit: calculatedValues.vatPerUnit,
                vatTotal: calculatedValues.vatTotal,
                unitMarginality: calculatedValues.unitMarginality,
                marginality: calculatedValues.totalMarginality,
                total: calculatedValues.total,
                itemId: initialData?.id || initialData?.itemId
            };
        }

        onSave(submitData);
    };

    const getModalTitle = () => {
        if (mode === 'create') return "Создать смету";
        if (mode === 'editItem') return "Редактировать товар";
        return "Добавить товар";
    };

    const getButtonText = () => {
        if (loading) return "Сохранение...";
        if (mode === 'create') return "Создать";
        return "Сохранить";
    };

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6">
                            {getModalTitle()}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    {mode === 'create' ? (
                        <Stack spacing={2}>
                            <StyledInput
                                label="Название сметы"
                                value={invoiceName}
                                onChange={(e) => setInvoiceName(e.target.value)}
                                error={!!errors.invoiceName}
                                helperText={errors.invoiceName}
                                required
                            />
                            <StyledInput
                                label="Мощность (кВт)"
                                type="number"
                                value={power}
                                onChange={(e) => setPower(e.target.value)}
                                error={!!errors.power}
                                helperText={errors.power}
                                required
                                InputProps={{ inputProps: { step: "0.1" } }}
                            />
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            <Autocomplete
                                options={CATEGORIES}
                                getOptionLabel={(o) => o.name}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Категория"
                                        error={!!errors.category}
                                        helperText={errors.category}
                                    />
                                )}
                            />

                            <Autocomplete
                                options={filteredProducts}
                                loading={productsLoading}
                                getOptionLabel={(option) => option?.name || ""}
                                value={selectedProduct}
                                onChange={handleProductChange}
                                disabled={!selectedCategory}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Товар"
                                        error={!!errors.product}
                                        helperText={errors.product}
                                    />
                                )}
                            />

                            <StyledInput
                                label="Количество"
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                                required
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="Цена за единицу"
                                        type="number"
                                        value={calculatedValues.price}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Автоматически из товара"
                                        fullWidth
                                    />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="НДС за единицу"
                                        type="number"
                                        value={calculatedValues.vatPerUnit}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Автоматически из товара"
                                        fullWidth
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="НДС (всего)"
                                        type="number"
                                        value={Math.round(calculatedValues.vatTotal)}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="НДС × Количество"
                                        fullWidth
                                    />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="Маржинальность (ед.)"
                                        type="number"
                                        value={Math.round(calculatedValues.unitMarginality)}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Из товара"
                                        fullWidth
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="Маржинальность (общая)"
                                        type="number"
                                        value={Math.round(calculatedValues.totalMarginality)}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Ед. маржинальность × Количество"
                                        fullWidth
                                    />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="Общая сумма"
                                        type="number"
                                        value={Math.round(calculatedValues.total)}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Цена × Количество"
                                        fullWidth
                                    />
                                </Box>
                            </Box>
                        </Stack>
                    )}
                </ModalBody>

                <ModalFooter>
                    <StyledButton variant="outlined" onClick={onClose} disabled={loading}>
                        Отмена
                    </StyledButton>

                    <StyledButton
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {getButtonText()}
                    </StyledButton>
                </ModalFooter>
            </ModalContent>
        </StyledModal>
    );
};

export default InvoiceModal;