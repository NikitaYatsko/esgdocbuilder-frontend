import { Box, CircularProgress } from '@mui/material';

export const FullScreenLoader = () => (
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.6)',
            zIndex: 9999,
        }}
    >
        <CircularProgress />
    </Box>
);