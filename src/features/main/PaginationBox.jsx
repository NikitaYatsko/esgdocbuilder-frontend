import { Box } from "@mui/material";

const PaginationBox = ({
    page,
    totalPages,
    onNext,
    onPrev,
    label = "Страница"
}) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <button onClick={onPrev} disabled={page === 1}>
                Назад
            </button>

            <Box>
                {label} {page} из {totalPages || 1}
            </Box>

            <button onClick={onNext} disabled={page === totalPages}>
                Вперёд
            </button>
        </Box>
    );
};

export default PaginationBox;