import { Box, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

export const ProfileActions = ({ onEdit, onLogout }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={onEdit}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                }}
            >
                Редактировать профиль
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                }}
            >
                Выйти
            </Button>
        </Box>
    );
};