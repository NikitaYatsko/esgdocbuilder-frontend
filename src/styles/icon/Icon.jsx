import { styled } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const ProfileIcon = styled(PersonOutlineIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '2rem !important',
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));

export const ProductIcon = styled(InventoryIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '2rem !important',
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));

export const InvoiceIcon = styled(DescriptionIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '2rem !important',
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));

export const BankIcon = styled(AccountBalanceIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '2rem !important',
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));