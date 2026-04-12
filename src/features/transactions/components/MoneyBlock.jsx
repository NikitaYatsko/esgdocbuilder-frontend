import React from "react";
import {Box, Typography, styled} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MoneyIcon from "@mui/icons-material/Money";

export const BlocksRow = styled(Box)({
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
});
export const StyledMoneyBlock = styled(Box)({
    display: 'flex', alignItems: 'center', gap: 1, mb: 1
})

const iconMap = {
    "Касса": <MoneyIcon sx={{fontSize: 24, color: 'primary.main'}}/>,
    "Банк": <AccountBalanceIcon sx={{fontSize: 24, color: 'primary.main'}}/>,
};

const MoneyBlockBase = ({title, amount, className}) => {
    const icon = iconMap[title] || null;

    return (
        <Box className={className}>
            <StyledMoneyBlock>
                {icon}
                <Typography variant="h6" color="text.main">
                    {title}
                </Typography>

            </StyledMoneyBlock>

            <Typography variant="h6" color="primary" fontWeight="bold">
                {amount.toLocaleString()} MDL
            </Typography>

        </Box>
    );
};

export const MoneyBlock = styled(React.memo(MoneyBlockBase))(({theme}) => ({
    minWidth: 200,
    height: 100,
    borderRadius: 12,
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: theme.shadows[2],
}));