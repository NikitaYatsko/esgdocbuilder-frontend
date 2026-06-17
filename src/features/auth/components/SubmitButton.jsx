import { Button, CircularProgress } from '@mui/material';

export const SubmitButton = ({ loading, onClick }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    disabled={loading}
    sx={{
      width: 185,
      height: 45,
      borderRadius: '8px',
      textTransform: 'none',
      fontSize: '16px',
      fontWeight: 500,
      '&:focus': { outline: 'none' },
      '&:focus-visible': { outline: 'none' },
      '&.Mui-focusVisible': { outline: 'none' },
      '&:focus:not(:focus-visible)': { outline: 'none' },
    }}
  >
    {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
  </Button>
);