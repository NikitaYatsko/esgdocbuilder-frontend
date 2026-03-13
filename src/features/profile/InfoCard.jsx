import { Box, Typography } from "@mui/material";

export const InfoCard = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'action.hover',
        }}>
            <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
        </Box>
        <Box>
            <Typography variant="body2" color="text.primary">
                {label}
            </Typography>
            <Typography variant="body1">
                {value}
            </Typography>
        </Box>
    </Box>
);