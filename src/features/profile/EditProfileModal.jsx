import React, { useState, useEffect } from 'react';
import { Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup';
import { StyledModal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../modal/StyledModal';
import { StyledInput } from '../modal/StyledInput';
import { StyledButton } from '../modal/StyledButton';

const validationSchema = yup.object({
    fullName: yup
        .string()
        .required('Имя обязательно')
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(50, 'Имя должно содержать максимум 50 символов'),
    email: yup
        .string()
        .required('Email обязателен')
        .email('Введите корректный email'),
    phone: yup
        .string()
        .required('Телефон обязателен')
        .matches(/^[0-9+\-\s()]+$/, 'Введите корректный номер телефона')
        .min(8, 'Телефон должен содержать минимум 8 символов')
        .max(20, 'Телефон должен содержать максимум 20 символов'),
});

export const EditProfileModal = ({ open, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));
        validateField(name, value);
    };

    const validateField = async (name, value) => {
        try {
            await yup.reach(validationSchema, name).validate(value);
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [name]: error.message,
            }));
        }
    };

    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            const newErrors = {};
            error.inner.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            
            const allTouched = {};
            Object.keys(formData).forEach(key => {
                allTouched[key] = true;
            });
            setTouched(allTouched);
            
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (isValid) {
            onSave(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setErrors({});
        setTouched({});
        onClose();
    };

    return (
        <StyledModal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-profile-modal"
        >
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6" color="text.primary">
                            Редактирование профиля
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <StyledInput
                        name="fullName"
                        label="Имя"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fullName && !!errors.fullName}
                        helperText={touched.fullName && errors.fullName}
                        fullWidth
                    />

                    <StyledInput
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        fullWidth
                    />

                    <StyledInput
                        name="phone"
                        label="Телефон"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && !!errors.phone}
                        helperText={touched.phone && errors.phone}
                        placeholder="+373 8800-555-3555"
                        fullWidth
                    />
                </ModalBody>

                <ModalFooter>
                    <StyledButton variant="outlined" onClick={handleClose}>
                        Отмена
                    </StyledButton>
                    <StyledButton variant="contained" onClick={handleSubmit}>
                        Сохранить изменения
                    </StyledButton>
                </ModalFooter>
            </ModalContent>
        </StyledModal>
    );
};