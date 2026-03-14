import { Box, Button, styled  } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

const ActionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'flex-end',
}));

const ActionButton = styled(Button)({
    borderRadius: 8, 
    textTransform: 'none',
    paddingLeft: 24,  
    paddingRight: 24,
    paddingTop: 8,   
    paddingBottom: 8,
});

export const ProfileActions = ({ onEdit, onLogout }) => {
    return (
        <ActionsContainer>
            <ActionButton
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={onEdit}
            >
                Редактировать профиль
            </ActionButton>
            <ActionButton
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
            >
                Выйти
            </ActionButton>
        </ActionsContainer>
    );
};