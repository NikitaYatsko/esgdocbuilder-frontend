import { useState } from 'react';
import {
    StyledModal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from '@features/modal/StyledModal';
import { StyledInput } from '@features/modal/StyledInput';
import { StyledButton } from '@features/modal/StyledButton';
import { Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreateUserModal = ({ open, onClose, onCreate, loading, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',    
        lastName: '',     
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSubmit = async () => {
        const result = await onCreate(formData);
        
        if (result.success) {
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
                phone: ''
            });
            setFieldErrors({});
            onClose();
        } else if (result.errors) {
            setFieldErrors(result.errors);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            phone: ''
        });
        setFieldErrors({});
        onClose();
    };

    return (
        <StyledModal open={open} onClose={handleClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6" component="h2">
                            Создание пользователя
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    {error && typeof error === 'string' && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <StyledInput
                        fullWidth
                        label="Имя"
                        placeholder="Введите имя"
                        value={formData.firstName}
                        onChange={handleChange('firstName')}
                        error={!!fieldErrors.firstName}
                        helperText={fieldErrors.firstName}
                        disabled={loading}
                        required
                    />

                    <StyledInput
                        fullWidth
                        label="Фамилия"
                        placeholder="Введите фамилию"
                        value={formData.lastName}
                        onChange={handleChange('lastName')}
                        error={!!fieldErrors.lastName}
                        helperText={fieldErrors.lastName}
                        disabled={loading}
                        required
                    />

                    <StyledInput
                        fullWidth
                        label="Email"
                        placeholder="user@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                        disabled={loading}
                        required
                    />

                    <StyledInput
                        fullWidth
                        label="Пароль"
                        placeholder="Введите пароль"
                        type="password"
                        value={formData.password}
                        onChange={handleChange('password')}
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
                        disabled={loading}
                        required
                    />

                    <StyledInput
                        fullWidth
                        label="Подтверждение пароля"
                        placeholder="Подтвердите пароль"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={!!fieldErrors.confirmPassword}
                        helperText={fieldErrors.confirmPassword}
                        disabled={loading}
                        required
                    />

                    <StyledInput
                        fullWidth
                        label="Телефон"
                        placeholder="+373 8800-555-3555"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        error={!!fieldErrors.phone}
                        helperText={fieldErrors.phone}
                        disabled={loading}
                    />
                </ModalBody>

                <ModalFooter>
                    <StyledButton
                        variant="outlined"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Отмена
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Создать'}
                    </StyledButton>
                </ModalFooter>
            </ModalContent>
        </StyledModal>
    );
};

export default CreateUserModal;