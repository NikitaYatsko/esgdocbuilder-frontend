import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { StyledSelect } from "./styled/StyledComponents";

const InvoiceSelector = ({ invoices, selectedInvoice, onSelectInvoice }) => {
    return (
        <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Выберите смету</InputLabel>
            <StyledSelect
                value={selectedInvoice?.id || ''}
                onChange={(e) => {
                    const invoice = invoices.find(inv => inv.id === e.target.value);
                    onSelectInvoice(invoice);
                }}
                label="Выберите смету"
            >
                <MenuItem value="">-- Выберите смету --</MenuItem>
                {invoices.map((invoice) => (
                    <MenuItem key={invoice.id} value={invoice.id}>
                        {invoice.invoiceName || `Смета №${invoice.id}`}
                    </MenuItem>
                ))}
            </StyledSelect>
        </FormControl>
    );
};

export default InvoiceSelector;