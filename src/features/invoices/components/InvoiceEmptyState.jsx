import { Typography } from "@mui/material";

const InvoiceEmptyState = ({ hasSelectedInvoice, onAddItem }) => {
    if (hasSelectedInvoice) {
        return (
            <Typography sx={{ 
                textAlign: 'center', 
                py: 6, 
                color: 'text.secondary',
                fontSize: '1rem'
            }}>
                В этой смете пока нет товаров. Нажмите "Добавить товар"
            </Typography>
        );
    }
    
    return (
        <Typography sx={{ 
            textAlign: 'center', 
            py: 6, 
            color: 'text.secondary',
            fontSize: '1rem'
        }}>
            Выберите смету из списка или создайте новую
        </Typography>
    );
};

export default InvoiceEmptyState;