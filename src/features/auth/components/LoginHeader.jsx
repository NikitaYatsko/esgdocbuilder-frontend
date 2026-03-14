import { Box, Typography, useTheme } from '@mui/material';
import logoUrl from '@styles/img/logo.svg';
import { UI_CONSTANTS } from '@constants/ui.constants';

export const LoginHeader = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        component="img"
        src={logoUrl}
        alt="Logo"
        sx={{
          width: UI_CONSTANTS.LOGO_WIDTH,
          height: UI_CONSTANTS.LOGO_HEIGHT,
          mb: 2,
          filter: theme.palette.mode === 'dark' ? 'brightness(0.8) invert(0.2)' : 'none'
        }}
      />

      <Typography
        variant="h1"
        sx={{
          fontSize: 20,
          fontFamily: 'Open Sans, sans-serif',
          fontWeight: 500,
          mb: 4,
          color: theme.palette.text.primary,
        }}
      >
        Добро пожаловать!
      </Typography>
    </>
  );
};