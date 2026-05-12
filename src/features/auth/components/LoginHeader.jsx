import { Box, Typography, useTheme } from '@mui/material';

export const LoginHeader = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 24,
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          DocBuilder
        </Typography>
      </Box>

      <Typography
        variant="h1"
        sx={{
          fontSize: 20,
          fontFamily: 'Open Sans, sans-serif',
          fontWeight: 500,
          mb: 4,
          color: theme.palette.text.primary,
          textAlign: 'center',
        }}
      >
        Добро пожаловать!
      </Typography>
    </>
  );
};