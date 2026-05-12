import { Box, Button, Typography, useTheme } from "@mui/material";

const PaginationBox = ({
    page,
    totalPages,
    onNext,
    onPrev,
    label = "Страница"
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mt: 3,
                p: 2,
                width: 'fit-content',
                mx: 'auto',
            }}
        >
            <Button
                variant="contained"
                onClick={onPrev}
                disabled={page === 1}
                sx={{
                    minWidth: 110,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                }}
            >
                Назад
            </Button>

            <Typography
                sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    minWidth: 140,
                    textAlign: 'center',
                }}
            >
                {label} {page} из {totalPages || 1}
            </Typography>

            <Button
                variant="contained"
                onClick={onNext}
                disabled={page === totalPages}
                sx={{
                    minWidth: 110,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                }}
            >
                Вперёд
            </Button>
        </Box>
    );
};

export default PaginationBox;