import { Paper, useTheme, styled  } from '@mui/material';
import { useState } from 'react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { ErrorAlert } from '../ErrorAlert';
import { LoginHeader } from '../LoginHeader';
import { EmailField } from '../EmailField';
import { PasswordField } from '../PasswordField';
import { ForgotPasswordLink } from '../ForgotPasswordLink';
import { SubmitButton } from '../SubmitButton';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 450,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '2rem',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4), 
}));

const LoginForm = () => {
  const { state, handleChange, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <StyledPaper elevation={0}>
      <LoginHeader />

      {state.errors.general && (
        <ErrorAlert message={state.errors.general} />
      )}

      <EmailField
        value={state.email}
        onChange={(value) => handleChange('email', value)}
        error={state.errors.email}
      />

      <PasswordField
        value={state.password}
        onChange={(value) => handleChange('password', value)}
        error={state.errors.password}
        showPassword={showPassword}
        onTogglePassword={handleTogglePassword}
      />

      <ForgotPasswordLink onClick={handleForgotPassword} />

      <SubmitButton 
        loading={state.loading} 
        onClick={handleSubmit}
      />
    </StyledPaper>
  );
};

export default LoginForm;