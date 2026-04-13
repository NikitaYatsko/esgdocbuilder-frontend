import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import {useAuth} from "@contexts/AuthContext";
import {useState, useEffect, useCallback} from "react";
import TableComponent from "@features/auth/components/TableComponent";
import {CenteredContainer} from "@/layouts/CenteredContainer.jsx";
import AddIcon from '@mui/icons-material/Add';
import {usersApi} from "@features/users/users.api.js";
import {RowStyled, UserPaper} from "@features/users/styled.js";
import CreateUserModal from "@features/users/CreateUserModal.jsx";
import {getUserColumns} from "@features/users/UserColumns.jsx";

const UserList = () => {
    const {user} = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

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
            const response = await usersApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            showMessage('Ошибка загрузки пользователей', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await usersApi.getAllRoles();
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

    const showMessage = (message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };


    const handleDelete = async (email) => {
        if (window.confirm(`Удалить пользователя ${email}?`)) {
            try {
                await usersApi.deleteUser(email);
                await fetchUsers();
                showMessage('Пользователь успешно удалён', 'success');
            } catch (error) {
                showMessage('Ошибка при удалении', 'error');
            }
        }
    };

    const handleCreate = async () => {

        if (formData.password !== formData.confirmPassword) {
            showMessage('Пароли не совпадают', 'error');
            return;
        }
        try {
            await usersApi.createUser({
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
        setFormData(prev => ({...prev, [field]: event.target.value}));
    };
    const userColumns = getUserColumns(handleDelete);

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

    if (!isAdmin) {
        return (
            <CenteredContainer width={1200}>
                <UserPaper elevation={0}>
                    <Alert severity="error" sx={{justifyContent: 'center'}}>
                        Доступ запрещён. Только для администраторов.
                    </Alert>
                </UserPaper>
            </CenteredContainer>
        );
    }

    return (
        <CenteredContainer width={1200}>
            <UserPaper elevation={0}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
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
                        startIcon={<AddIcon/>}
                        onClick={() => setModalOpen(true)}
                        sx={{borderRadius: 2, textTransform: 'none', px: 3}}
                    >
                        Создать пользователя
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                        <CircularProgress/>
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
                <CreateUserModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleCreate}
                    formData={formData}
                    onChange={handleChange}
                    roles={roles}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </UserPaper>
        </CenteredContainer>
    );
};

export default UserList;