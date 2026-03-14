import { Box, useTheme, styled } from '@mui/material';
import { lazy, Suspense } from 'react';

const LoginForm = lazy(() => import('@features/auth/ui/LoginForm'));

const LoginWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const FallbackBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const LoginPage = () => {
  const theme = useTheme();

  return (
    <LoginWrapper>
      <Suspense fallback={<FallbackBox>Loading...</FallbackBox>}>
        <LoginForm />
      </Suspense>
    </LoginWrapper>
)};