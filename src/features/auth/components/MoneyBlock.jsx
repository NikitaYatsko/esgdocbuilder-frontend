import { Box, Typography, styled } from "@mui/material";

export const BlocksRow = styled(Box)({
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
});

export const MoneyBlock = styled(({ title, amount, ...props }) => (
        <Box {...props}>
            <Typography variant="h6" color="text.primary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
                {amount} MDL
            </Typography>
        </Box>
))(({ theme }) => ({
    width: 200,
    height: 100,
    borderRadius: 8,
    padding: 16,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: theme.shadows[2],
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[4],
    },
}));