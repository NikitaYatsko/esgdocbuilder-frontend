import { Alert } from '@mui/material';

export const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
    {message}
  </Alert>
);