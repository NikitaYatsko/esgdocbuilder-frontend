import { Box, Container, Paper, Typography, Alert, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "@contexts/AuthContext";
import { useEffect, useState } from "react";
import { useUserManagement } from "@features/userList/hooks/useUserManagement";
import CreateUserModal from "@features/userList/components/CreateUserModal";
import UserTable from "@features/userList/components/UserTable";

const PageContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)({
    flexGrow: 1,
    marginLeft: '70px',
    marginTop: '70px',
    width: 'calc(100% - 70px)',
    height: 'calc(100vh - 70px)',
    overflow: 'auto',
    padding: 24,
});

const CenteredContainer = styled(Container)({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
});

const UserPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 8,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

const UserList = () => {
    const { user } = useAuth();
    const {
        users,
        loading,
        modalOpen,
        error,
        fetchUsers,
        createUser,
        deleteUser,
        openModal,
        closeModal,
    } = useUserManagement();
    
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin, fetchUsers]);
    

    const handleCreateUser = async (userData) => {
        const result = await createUser(userData);
        
        if (result.success) {
            setSnackbar({
                open: true,
                message: 'Пользователь успешно создан',
                severity: 'success'
            });
        } else if (result.error) {
            setSnackbar({
                open: true,
                message: result.error,
                severity: 'error'
            });
        }
        
        return result;
    };

    const handleDeleteUser = async (email) => {
        if (window.confirm(`Вы уверены, что хотите удалить пользователя ${email}?`)) {
            const result = await deleteUser(email);
            
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'Пользователь успешно удален',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.error,
                    severity: 'error'
                });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (!isAdmin) {
        return (
            <PageContainer>
                <MainContent component="main">
                    <CenteredContainer maxWidth="lg">
                        <UserPaper elevation={0}>
                            <Alert severity="error">
                                Доступ запрещён. Только для администраторов.
                            </Alert>
                        </UserPaper>
                    </CenteredContainer>
                </MainContent>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <MainContent component="main">
                <CenteredContainer maxWidth="lg">
                    <UserPaper elevation={0}>
                        <UserTable
                            users={users}
                            onDelete={handleDeleteUser}
                            onAdd={openModal}
                            loading={loading}
                        />
                    </UserPaper>
                </CenteredContainer>
            </MainContent>

            <CreateUserModal
                open={modalOpen}
                onClose={closeModal}
                onCreate={handleCreateUser}
                loading={loading}
                error={error}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
};

export default UserList;