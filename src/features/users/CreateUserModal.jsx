import {
    Typography,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText
} from "@mui/material";

import { useState } from "react";
import * as yup from "yup";
import CloseIcon from '@mui/icons-material/Close';

import {
    StyledModal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from "@features/modal/StyledModal.jsx";

import { FormRow } from "@features/users/styled.js";

// ===== YUP SCHEMA =====
const validationSchema = yup.object({
    email: yup
        .string()
        .email("Некорректный email")
        .required("Email обязателен"),

    firstName: yup
        .string()
        .required("Имя обязательно"),

    lastName: yup
        .string()
        .required("Фамилия обязательна"),

    password: yup
        .string()
        .min(6, "Минимум 6 символов")
        .required("Пароль обязателен"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Пароли не совпадают")
        .required("Подтвердите пароль"),

    phone: yup
        .string()
        .nullable(),

    role: yup
        .string()
        .required("Выберите роль"),
});

const CreateUserModal = ({
                             open,
                             onClose,
                             onSubmit,
                             formData,
                             onChange,
                             roles
                         }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            setErrors({});
            await onSubmit(); // дергаем родителя

        } catch (validationError) {
            const newErrors = {};

            validationError.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors);
        }
    };

    // очищаем ошибку при вводе
    const handleFieldChange = (field) => (e) => {
        onChange(field)(e);

        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));
    };

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6" fontWeight={600}>
                            Создать пользователя
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormRow>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleFieldChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                fullWidth
                                label="Имя"
                                value={formData.firstName}
                                onChange={handleFieldChange('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />

                            <TextField
                                fullWidth
                                label="Фамилия"
                                value={formData.lastName}
                                onChange={handleFieldChange('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />

                            <TextField
                                fullWidth
                                label="Пароль"
                                type="password"
                                value={formData.password}
                                onChange={handleFieldChange('password')}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <TextField
                                fullWidth
                                label="Подтвердите пароль"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleFieldChange('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />

                            <TextField
                                fullWidth
                                label="Телефон"
                                value={formData.phone}
                                onChange={handleFieldChange('phone')}
                                placeholder="+7 (999) 123-45-67"
                            />

                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel>Роль</InputLabel>
                                <Select
                                    value={formData.role}
                                    label="Роль"
                                    onChange={handleFieldChange('role')}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.id || role.name} value={role.name}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.role}</FormHelperText>
                            </FormControl>
                        </FormRow>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </StyledModal>
    );
};

export default CreateUserModal;