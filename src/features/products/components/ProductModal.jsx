import { useEffect, useState } from "react";
import {
    Typography,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Box
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

const UNIT_TYPES = [
    { value: "PCS", label: "Шт (PCS)" },
    { value: "M", label: "Метр (M)" },
    { value: "M2", label: "Метр² (M2)" },
    { value: "SET", label: "Комплект (SET)" },
    { value: "JOB", label: "Работа (JOB)" }
];

const ProductModal = ({ open, onClose, product, onSave, loading = false, categories = [] }) => {

    const isEdit = Boolean(product);

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        typeOfUnit: "PCS",
        costPrice: "",
        sellPrice: "",
        marginality: "",
        vat: ""
    });

    const [errors, setErrors] = useState({});

    const calculateMarginality = (costPrice, sellPrice) => {
        if (!costPrice || !sellPrice) return "";

        const cost = Number(costPrice);
        const sell = Number(sellPrice);

        if (isNaN(cost) || isNaN(sell)) return "";

        const marginality = sell - cost;
        return marginality.toFixed(2);
    };

    const getVatSettings = () => {
        const saved = localStorage.getItem("vat_settings");
        if (saved) {
            return JSON.parse(saved);
        }
        return { vatPercent: 20, vatDivisor: 120 };
    };

    const calculateVat = (sellPrice) => {
        if (!sellPrice) return "";
        const sell = Number(sellPrice);
        if (isNaN(sell)) return "";
        const { vatPercent, vatDivisor } = getVatSettings();
        const vat = (sell * vatPercent) / vatDivisor;
        return vat.toFixed(2);
    };

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

    const handleChange = (field) => (e) => {
        const value = e.target.value;

        setForm(prev => {
            const newForm = { ...prev, [field]: value };

            if (field === 'costPrice' || field === 'sellPrice') {
                const costPrice = field === 'costPrice' ? value : prev.costPrice;
                const sellPrice = field === 'sellPrice' ? value : prev.sellPrice;
                newForm.marginality = calculateMarginality(costPrice, sellPrice);
                newForm.vat = calculateVat(sellPrice);
            }
            if (field === 'costPrice') {
                const costPrice = value;
                const sellPrice = prev.sellPrice;
                newForm.marginality = calculateMarginality(costPrice, sellPrice);

            }

            return newForm;
        });

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                categoryId: product.categoryId || product.category?.id || "",
                typeOfUnit: product.typeOfUnit || "PCS",
                costPrice: product.costPrice || product.purchasePrice || "",
                sellPrice: product.sellPrice || product.salePrice || "",
                marginality: product.marginality || product.margin || "",
                vat: product.vat || (product.sellPrice ? calculateVat(product.sellPrice) : "")
            });
        } else {
            setForm({
                name: "",
                categoryId: "",
                typeOfUnit: "PCS",
                costPrice: "",
                sellPrice: "",
                marginality: "",
                vat: ""
            });
        }
        setErrors({});
    }, [product, open]);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Название обязательно";
        if (!form.categoryId) newErrors.categoryId = "Выберите категорию";
        if (!form.costPrice) newErrors.costPrice = "Цена закупки обязательна";
        if (form.costPrice && isNaN(form.costPrice)) newErrors.costPrice = "Введите число";
        if (!form.sellPrice) newErrors.sellPrice = "Цена продажи обязательна";
        if (form.sellPrice && isNaN(form.sellPrice)) newErrors.sellPrice = "Введите число";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const submitData = {
            name: form.name,
            categoryId: Number(form.categoryId),
            typeOfUnit: form.typeOfUnit,
            costPrice: form.costPrice ? Number(form.costPrice) : null,
            sellPrice: form.sellPrice ? Number(form.sellPrice) : null,
            marginality: form.marginality ? Number(form.marginality) : null,
            vat: form.vat ? Number(form.vat) : null
        };

        onSave(submitData);
    };

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6">
                            {isEdit ? "Редактировать товар" : "Добавить товар"}
                        </Typography>

                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <StyledInput
                        label="Название"
                        value={form.name}
                        onChange={handleChange("name")}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                    />

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth error={!!errors.categoryId} required>
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={form.categoryId}
                                onChange={handleChange("categoryId")}
                                label="Категория"
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Единица измерения</InputLabel>
                            <Select
                                value={form.typeOfUnit}
                                onChange={handleChange("typeOfUnit")}
                                label="Единица измерения"
                            >
                                {UNIT_TYPES.map((unit) => (
                                    <MenuItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <StyledInput
                        label="Цена закупки"
                        value={form.costPrice}
                        onChange={handleChange("costPrice")}
                        onInput={(e) => handleNumericInput(e, false)}
                        error={!!errors.costPrice}
                        helperText={errors.costPrice}
                        required
                        type="number"
                        inputProps={{ max: 999999999, min: 0 }}
                    />

                    <StyledInput
                        label="Цена продажи"
                        value={form.sellPrice}
                        onChange={handleChange("sellPrice")}
                        onInput={(e) => handleNumericInput(e, false)}
                        error={!!errors.sellPrice}
                        helperText={errors.sellPrice}
                        required
                        type="number"
                        inputProps={{ max: 999999999, min: 0 }}
                    />

                    <StyledInput
                        label="Маржинальность"
                        value={form.marginality}
                        onChange={handleChange("marginality")}
                        onInput={(e) => handleNumericInput(e, true)}
                        type="number"
                        InputProps={{ inputProps: { step: "0.01", max: 999999999, min: 0 } }}
                    />

                    <StyledInput
                        label="НДС"
                        value={form.vat}
                        onChange={handleChange("vat")}
                        onInput={(e) => handleNumericInput(e, true)}
                        type="number"
                        InputProps={{ inputProps: { step: "0.01", max: 999999999, min: 0 } }}
                    />
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
                        {loading ? "Сохранение..." : (isEdit ? "Сохранить" : "Добавить")}
                    </StyledButton>
                </ModalFooter>

            </ModalContent>
        </StyledModal>
    );
};

export default ProductModal;