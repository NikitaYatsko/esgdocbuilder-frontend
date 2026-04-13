import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Search, FilterList } from '@mui/icons-material';

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const SearchField = styled(TextField)(({ theme }) => ({
    flex: 1,
    maxWidth: 400,
    '& .MuiInputBase-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        height: 40,
    },
    '& .MuiInputBase-input': {
        padding: '10px 14px',
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        caretColor: theme.palette.text.primary,
        borderRadius: '8px',
    },
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    width: 40,
    height: 40,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:focus': { 
        outline: 'none' 
    },
    '&:focus-visible': { 
        outline: 'none' 
    },
}));

const InvoiceSearchBar = ({ onSearch, onFilter, placeholder = "Поиск смет..." }) => {
    return (
        <SearchContainer>
            <SearchField
                placeholder={placeholder}
                size="small"
                onChange={(e) => onSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />
            <FilterButton onClick={onFilter}>
                <FilterList />
            </FilterButton>
        </SearchContainer>
    );
};

export default InvoiceSearchBar;