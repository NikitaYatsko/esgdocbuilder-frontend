import {Box, Typography, Paper, Avatar} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useAuth} from "@contexts/AuthContext";
import {useState, useEffect} from "react";
import {authApi} from "@features/auth/api/authApi";
import TableComponent from "@features/auth/components/TableComponent";



// ✅ Замените на простой Box
const PageContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Теперь будет занимать 100% родителя (MainLayout)
    backgroundColor: theme.palette.background.default,
}));



// Остальные стили оставляем без изменений
const UserPaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: 8,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

const RowStyled = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'role'
})(({theme, role}) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 500,
    backgroundColor: role === 'ADMIN'
        ? theme.palette.error.light
        : theme.palette.info.light,
    color: role === 'ADMIN'
        ? theme.palette.error.contrastText
        : theme.palette.info.contrastText,
}));

const UserList = () => {
    const {user} = useAuth();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;

    const userColumns = [
        {
            id: 'imageUrl',
            label: ' ',
            align: 'left',
            render: (value) => (
                <Avatar
                    src={value}
                    alt="user"
                    sx={{ width: 40, height: 40, margin: '0 auto' }}
                />
            ),
        },
        { id: 'id', label: 'ID', align: 'left' },
        { id: 'fullName', label: 'Имя', align: 'left' },
        { id: 'email', label: 'Email', align: 'left' },
        { id: 'phone', label: 'Телефон', align: 'left' },
        { id: 'role', label: 'Роль', align: 'left' },
    ];

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);
            const response = await authApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
        } finally {
            setUsersLoading(false);
        }
    };

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
    }));

    if (!isAdmin) {
        return (
            <PageContainer>
                <CenteredContainer maxWidth="lg">
                    <UserPaper elevation={0}>
                        <Typography color="error" align="center">
                            Доступ запрещён. Только для администраторов.
                        </Typography>
                    </UserPaper>
                </CenteredContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
                <UserPaper elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{mb: 2}}>
                        Управление пользователями
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                        Всего пользователей: {users.length}
                    </Typography>

                    {usersLoading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                            <Typography>Загрузка...</Typography>
                        </Box>
                    ) : (
                        <TableComponent
                            columns={userColumns}
                            rows={userRows}
                            tableWidth="100%"
                            tableMinWidth="600px"
                            tableHeight="400px"
                        />
                    )}
                </UserPaper>
        </PageContainer>
    );
};

export default UserList;