import React from "react";
import { Box, Typography, styled } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MoneyIcon from "@mui/icons-material/Money";

export const BlocksRow = styled(Box)({
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
});

const iconMap = {
    "Касса": <MoneyIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    "Банк": <AccountBalanceIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
};

const MoneyBlockBase = ({ title, amount, className }) => {
    const icon = iconMap[title] || null;

    return (
        <Box className={className}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {icon}
                <Typography variant="h6" color="text.primary">
                    {title}
                </Typography>
            </Box>

            <Typography variant="h5" color="primary" fontWeight="bold">
                {amount.toLocaleString()} MDL
            </Typography>
        </Box>
    );
};

export const MoneyBlock = styled(React.memo(MoneyBlockBase))(({ theme }) => ({
    minWidth: 200,
    height: 120,
    borderRadius: 12,
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: theme.shadows[2],
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[6],
    },
}));