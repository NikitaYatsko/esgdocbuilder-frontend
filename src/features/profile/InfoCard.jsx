import { Box, Typography, styled } from "@mui/material";

const CardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2), 
    marginBottom: theme.spacing(2), 
}));

const IconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: theme.palette.action.hover,
    '& svg': {
        color: theme.palette.primary.main,
        fontSize: 20,
    },
}));

export const InfoCard = ({ icon: Icon, label, value }) => (
    <CardContainer>
        <IconContainer>
            <Icon />
        </IconContainer>
        <Box>
            <Typography variant="body2" color="text.primary">
                {label}
            </Typography>
            <Typography variant="body1">
                {value}
            </Typography>
        </Box>
    </CardContainer>
);