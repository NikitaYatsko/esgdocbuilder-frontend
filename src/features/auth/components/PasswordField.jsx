import { TextField, InputAdornment, Typography, IconButton, useTheme } from '@mui/material';
import { LockOutline, Visibility, VisibilityOff } from '@mui/icons-material';

export const PasswordField = ({ 
  value, 
  onChange, 
  error, 
  showPassword, 
  onTogglePassword 
}) => {
  const theme = useTheme();

  return (
    <>
      <Typography
        sx={{
          width: 337,
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{
          width: 337,
          height: 45,
          mb: 3,
          '& .MuiInputBase-root': {
            height: 45,
            borderRadius: '8px',
            bgcolor: theme.palette.background.paper,
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
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
                onClick={onTogglePassword}
                edge="end"
                size="small"
                disableRipple
                sx={{
                  outline: 'none',
                  '&:focus': { outline: 'none' },
                  '&:focus-visible': { outline: 'none' },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};