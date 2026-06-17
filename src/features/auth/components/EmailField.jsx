import { TextField, InputAdornment, Typography, useTheme } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';

export const EmailField = ({ value, onChange, error }) => {
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
        Введите email
      </Typography>

      <TextField
        fullWidth
        placeholder="Email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        autoFocus
        sx={{
          width: 337,
          height: 45,
          mb: 4,
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
              <PersonOutline sx={{ color: '#BDBDBD', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};