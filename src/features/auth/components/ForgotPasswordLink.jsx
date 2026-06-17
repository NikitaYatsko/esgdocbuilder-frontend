import { Typography } from '@mui/material';

export const ForgotPasswordLink = ({ onClick }) => (
  <Typography
    sx={{
      width: 337,
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