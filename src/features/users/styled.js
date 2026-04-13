import {styled} from "@mui/material/styles";
import {Box, Paper} from "@mui/material";

export const UserPaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

export const RowStyled = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'role'
})(({theme, role}) => ({
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

export const FormRow = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
});

export const HeaderWrapper = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
}));