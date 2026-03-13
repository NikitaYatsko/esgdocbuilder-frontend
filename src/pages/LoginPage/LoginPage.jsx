import { Container, Box, useTheme } from '@mui/material';
import { lazy, Suspense } from 'react';

const LoginForm = lazy(() => import('@features/auth/ui/LoginForm')); // нужен для ускорония загрузки

export const LoginPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: theme.palette.background.default,
    }}
  >
    <Suspense fallback={<Box sx={{color: theme.palette.text.primary}}>Loading...</Box>}>
      <LoginForm />
    </Suspense>
  </Box>
)};