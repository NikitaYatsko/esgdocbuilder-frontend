import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "@contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { authApi } from "@features/auth/api/authApi";
import TableComponent from "@features/auth/components/TableComponent";
import { CenteredContainer } from "@/layouts/CenteredContainer.jsx";
import {
    StyledModal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from "@features/modal/StyledModal.jsx";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// ========== СТИЛИ ==========
const UserPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

const RowStyled = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'role'
})(({ theme, role }) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: role === 'ADMIN'
        ? theme.palette.error.main
        : theme.palette.primary.main,
    color: '#fff',
}));

const FormRow = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
});

// ========== КОМПОНЕНТ ==========
const UserList = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: ''
    });

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;

    // ========== ЗАГРУЗКА ДАННЫХ ==========
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            showMessage('Ошибка загрузки пользователей', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await authApi.getAllRoles();
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchRoles();
        }
    }, [isAdmin, fetchUsers, fetchRoles]);

    // ========== УВЕДОМЛЕНИЯ ==========
    const showMessage = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // ========== CRUD ОПЕРАЦИИ ==========
    const handleDelete = async (email) => {
        if (window.confirm(`Удалить пользователя ${email}?`)) {
            try {
                await authApi.deleteUser(email);
                await fetchUsers();
                showMessage('Пользователь успешно удалён', 'success');
            } catch (error) {
                showMessage('Ошибка при удалении', 'error');
            }
        }
    };

    const handleCreate = async () => {
        // Валидация
        if (formData.password !== formData.confirmPassword) {
            showMessage('Пароли не совпадают', 'error');
            return;
        }

        try {
            await authApi.createUser({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone || null,
                role: formData.role,
            });

            setModalOpen(false);
            resetForm();
            await fetchUsers();
            showMessage('Пользователь успешно создан', 'success');
        } catch (error) {
            showMessage(error.response?.data?.message || 'Ошибка при создании', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            phone: '',
            role: ''
        });
    };

    const handleChange = (field) => (event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    // ========== ТАБЛИЦА ==========
    const userColumns = [
        {
            id: 'imageUrl',
            label: 'Аватар',
            align: 'center',
            render: (value) => (
                <Avatar
                    src={value}
                    alt="user"
                    sx={{ width: 40, height: 40, mx: 'auto' }}
                />
            ),
        },
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'fullName', label: 'Имя', align: 'left' },
        { id: 'email', label: 'Email', align: 'left' },
        { id: 'phone', label: 'Телефон', align: 'left' },
        { id: 'role', label: 'Роль', align: 'center' },
        {
            id: 'actions',
            label: 'Действия',
            align: 'center',
            render: (_, row) => (
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(row.email)}
                    sx={{ borderRadius: 2 }}
                >
                    Удалить
                </Button>
            )
        },
    ];

    const userRows = users.map((userItem) => ({
        imageUrl: userItem.imageUrl || undefined,
        id: userItem.id,
        fullName: userItem.fullName || '—',
        email: userItem.email,
        phone: userItem.phone || '—',
        role: (
            <RowStyled role={userItem.roles?.[0]?.name}>
                {userItem.roles?.[0]?.name || 'USER'}
            </RowStyled>
        ),
        email_raw: userItem.email
    }));

    // ========== РЕНДЕР ==========
    if (!isAdmin) {
        return (
            <CenteredContainer width={1200}>
                <UserPaper elevation={0}>
                    <Alert severity="error" sx={{ justifyContent: 'center' }}>
                        Доступ запрещён. Только для администраторов.
                    </Alert>
                </UserPaper>
            </CenteredContainer>
        );
    }

    return (
        <CenteredContainer width={1200}>
            <UserPaper elevation={0}>
                {/* HEADER */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Управление пользователями
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Всего пользователей: {users.length}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setModalOpen(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        Создать пользователя
                    </Button>
                </Box>

                {/* TABLE */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableComponent
                        columns={userColumns}
                        rows={userRows}
                        tableWidth="100%"
                        tableMinWidth="600px"
                        tableHeight="600px"
                    />
                )}

                {/* MODAL */}
                <StyledModal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>
                                <Typography variant="h6" fontWeight={600}>
                                    Создать пользователя
                                </Typography>
                                <IconButton onClick={() => setModalOpen(false)} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </ModalTitle>
                        </ModalHeader>

                        <ModalBody>
                            <FormRow>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Имя"
                                    value={formData.firstName}
                                    onChange={handleChange('firstName')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Фамилия"
                                    value={formData.lastName}
                                    onChange={handleChange('lastName')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Пароль"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Подтвердите пароль"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Телефон"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    placeholder="+7 (999) 123-45-67"
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Роль</InputLabel>
                                    <Select
                                        value={formData.role}
                                        label="Роль"
                                        onChange={handleChange('role')}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role.id || role.name} value={role.name}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </FormRow>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none' }}>
                                Отмена
                            </Button>
                            <Button variant="contained" onClick={handleCreate} sx={{ textTransform: 'none' }}>
                                Создать
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </StyledModal>

                {/* SNACKBAR */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </UserPaper>
        </CenteredContainer>
    );
};

export default UserList;