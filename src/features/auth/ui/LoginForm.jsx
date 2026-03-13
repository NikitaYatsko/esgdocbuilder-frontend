import { Paper, TextField, Button, InputAdornment, Alert, CircularProgress, Typography, Box, IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import logoUrl from '@styles/img/logo.svg'
import { Visibility, VisibilityOff, PersonOutline, LockOutline } from '@mui/icons-material';


const LoginForm = () => {
    const { state, handleChange, handleSubmit } = useLoginForm();
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                width: 450,
                height: 550,
                bgcolor: theme.palette.background.paper,
                borderRadius: '50px',
                border: '1px solid ${theme.palette.divider}',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
            }}
        >
            <Box
                component="img"
                src={logoUrl}
                alt="Logo"
                sx={{
                    width: 150,
                    height: 120,
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

            {state.errors.general && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {state.errors.general}
                </Alert>
            )}

            <Typography
                sx={{
                    width: '337px',
                    fontSize: 14,
                    fontFamily: 'Open Sans, sans-serif',
                    mb: 0.5,
                    color: 'text.primary'
                }}
            >
                Введите email
            </Typography>

            <TextField
                fullWidth
                placeholder="Email"
                value={state.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!state.errors.email}
                helperText={state.errors.email}
                autoFocus
                sx={{
                    width: '337px',
                    height: '45px',
                    mb: 4,
                    '& .MuiInputBase-root': {
                        height: '45px',
                        borderRadius: '8px',
                        bgcolor: theme.palette.background.paper,
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px  inset',
                        WebkitTextFillColor: theme.palette.text.primary,
                        caretColor: theme.palette.text.primary,
                        borderRadius: '8px',
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline sx={{ color: '#BDBDBD', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Typography
                sx={{
                    width: '337px',
                    fontSize: 14,
                    fontFamily: 'Open Sans, sans-serif',
                    mb: 0.5,
                    color: 'text.primary'
                }}
            >
                Введите пароль
            </Typography>

            <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={state.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={!!state.errors.password}
                helperText={state.errors.password}
                sx={{
                    width: '337px',
                    height: '45px',
                    mb: 3,
                    '& .MuiInputBase-root': {
                        height: '45px',
                        borderRadius: '8px',
                        bgcolor: theme.palette.background.paper,
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px  inset',
                        WebkitTextFillColor: theme.palette.text.primary,
                        caretColor: theme.palette.text.primary,
                        borderRadius: '8px',
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOutline sx={{ color: '#BDBDBD', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                size="small"
                                disableRipple
                                sx={{
                                    outline: 'none',
                                    '&:focus': {
                                        outline: 'none',
                                    },
                                    '&:focus-visible': {
                                        outline: 'none',
                                    },
                                }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Typography
                sx={{
                    width: '337px',
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
            >
                Забыли пароль?
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={ handleSubmit }
                disabled={state.loading}
                sx={{
                    width: '185px',
                    height: '45px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:focus-visible': {
                        outline: 'none',
                    },
                    '&.Mui-focusVisible': {
                        outline: 'none',
                    },
                    '&:focus:not(:focus-visible)': {
                        outline: 'none',
                    },
                }}
            >
                {state.loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>
        </Paper>
    );
};

export default LoginForm;