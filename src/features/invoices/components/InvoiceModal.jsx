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

const InvoiceModal = ({ open, onClose, onSave, loading = false, mode = 'create' }) => {

    const { products, loading: productsLoading } = useProducts();

    const [invoiceName, setInvoiceName] = useState("");
    const [power, setPower] = useState("");
    
    const [form, setForm] = useState({
        product: null,
        quantity: 1,
        price: 0,
        vat: 0,
        total: 0
    });

    const [errors, setErrors] = useState({});

    const calculateTotal = (price, quantity, vat) => {
        const subtotal = price * quantity;
        const vatAmount = subtotal * (vat / 100);
        return subtotal + vatAmount;
    };

    const handleProductChange = (_, value) => {
        const product = value;
        const price = product?.sellPrice || 0;
        const vat = product?.vat || 0;
        
        setForm(prev => ({
            product,
            quantity: prev.quantity,
            price,
            vat,
            total: calculateTotal(price, prev.quantity, vat)
        }));
        
        if (errors.product) {
            setErrors(prev => ({ ...prev, product: "" }));
        }
    };

    const handleQuantityChange = (e) => {
        const quantity = Number(e.target.value) || 0;
        setForm(prev => ({
            ...prev,
            quantity,
            total: calculateTotal(prev.price, quantity, prev.vat)
        }));
        
        if (errors.quantity) {
            setErrors(prev => ({ ...prev, quantity: "" }));
        }
    };

    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                setInvoiceName("");
                setPower("");
            } else {
                setForm({
                    product: null,
                    quantity: 1,
                    price: 0,
                    vat: 0,
                    total: 0
                });
            }
            setErrors({});
        }
    }, [open, mode]);

    const validate = () => {
        const newErrors = {};
        
        if (mode === 'create') {
            if (!invoiceName.trim()) newErrors.invoiceName = "Введите название сметы";
            if (!power.trim()) newErrors.power = "Введите мощность";
            if (power && isNaN(Number(power))) newErrors.power = "Введите корректное число";
        } else {
            if (!form.product) newErrors.product = "Выберите товар";
            if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Введите корректное количество";
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
                productId: form.product.id,
                productName: form.product.name,
                quantity: form.quantity,
                price: form.price,
                vat: form.vat,
                total: form.total
            };
        }

        onSave(submitData);
    };

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6">
                            {mode === 'create' ? "Создать смету" : "Добавить товар в смету"}
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
                                options={products}
                                loading={productsLoading}
                                getOptionLabel={(option) => option?.name || ""}
                                value={form.product}
                                onChange={handleProductChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Выберите товар"
                                        error={!!errors.product}
                                        helperText={errors.product}
                                    />
                                )}
                            />
                            
                            <StyledInput
                                label="Количество"
                                type="number"
                                value={form.quantity}
                                onChange={handleQuantityChange}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                                required
                            />
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="Цена"
                                        type="number"
                                        value={form.price}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Автоматически из товара"
                                        fullWidth
                                    />
                                </Box>
                                
                                <Box sx={{ flex: 1 }}>
                                    <StyledInput
                                        label="НДС (%)"
                                        type="number"
                                        value={form.vat}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                        helperText="Автоматически из товара"
                                        fullWidth
                                    />
                                </Box>
                            </Box>
                            
                            <StyledInput
                                label="Общая сумма"
                                type="number"
                                value={Math.round(form.total)}
                                disabled
                                InputProps={{ readOnly: true }}
                                helperText="Рассчитывается автоматически"
                            />
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
                        {loading ? "Сохранение..." : (mode === 'create' ? "Создать" : "Добавить")}
                    </StyledButton>
                </ModalFooter>
            </ModalContent>
        </StyledModal>
    );
};

export default InvoiceModal;