import { Container, Box } from '@mui/material';
import { lazy, Suspense } from 'react';

const LoginForm = lazy(() => import('@features/auth/ui/LoginForm')); // нужен для ускорония загрузки

export const LoginPage = () => (
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
      bgcolor: '#EFEFEF',
    }}
  >
    <Suspense fallback={<Box sx={{color: '#1c1b1b'}}>Loading...</Box>}>
      <LoginForm />
    </Suspense>
  </Box>
);