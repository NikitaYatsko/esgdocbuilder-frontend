import { Box, Typography, IconButton, Alert, styled } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TableComponent from "@features/auth/components/TableComponent";

const RowStyled = styled(Box)(({ theme, role }) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: role === 'ADMIN'
        ? theme.palette.error.light
        : theme.palette.info.light,
    color: role === 'ADMIN'
        ? theme.palette.error.contrastText
        : theme.palette.info.contrastText,
}));


const UserTable = ({ users, onDelete, onAdd, loading }) => {
    const userColumns = [
        { id: 'fullName', label: 'Имя', align: 'left' },
        { id: 'email', label: 'Email', align: 'left' },
        { id: 'phone', label: 'Телефон', align: 'left' },
        { id: 'role', label: 'Роль', align: 'left' },
        { id: 'actions', label: 'Действия', align: 'center' },
    ];

    const userRows = users.map((userItem) => ({
        id: userItem.email,
        fullName: userItem.fullName || '—',
        email: userItem.email,
        phone: userItem.phone || '—',
        role: (
            <RowStyled role={userItem.roles?.[0]?.name}>
                {userItem.roles?.[0]?.name || 'USER'}
            </RowStyled>
        ),
        actions: (
            <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(userItem.email)}
                disabled={loading}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        ),
    }));

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Управление пользователями
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Всего пользователей: {users.length}
                    </Typography>
                </Box>
                <IconButton
                    color="primary"
                    onClick={onAdd}
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    }}
                >
                    <PersonAddIcon />
                </IconButton>
            </Box>

            {users.length === 0 && !loading ? (
                <Alert severity="info">
                    Пользователи не найдены
                </Alert>
            ) : (
                <TableComponent
                    columns={userColumns}
                    rows={userRows}
                    tableWidth="100%"
                    tableMinWidth="600px"
                    tableHeight="400px"
                />
            )}
        </Box>
    );
};

export default UserTable;