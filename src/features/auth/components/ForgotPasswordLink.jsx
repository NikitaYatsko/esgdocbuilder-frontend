import { Typography } from '@mui/material';
import { UI_CONSTANTS } from '@constants/ui.constants';

export const ForgotPasswordLink = ({ onClick }) => (
  <Typography
    sx={{
      width: UI_CONSTANTS.FIELD_WIDTH,
      fontSize: 14,
      fontFamily: 'Open Sans, sans-serif',
      textAlign: 'center',
      mb: 3,
      color: 'primary.main',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      }
    }}
    onClick={onClick}
  >
    Забыли пароль?
  </Typography>
);