import {useState} from 'react';
import {
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    styled,
    InputAdornment,
    Alert
} from "@mui/material";
import AddButton from '../../products/components/AddButton.jsx';

const TransactionCard = styled(Paper)(({theme}) => ({
    padding: 24,
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    minWidth: 250,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
}));

const CardTitle = styled(Typography)(({theme}) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 8,
}));

const StyledFormControl = styled(FormControl)({
    width: '100%',
});

const AmountTextField = styled(TextField)({
    '& input[type=number]': {
        MozAppearance: 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
});

const CreateTransaction = ({accounts = [], onCreate}) => {
    const [formData, setFormData] = useState({
        type: '',
        account: '',
        amount: '',
        comment: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'type') {
            setError('');
        }

        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAmountChange = (e) => {
        const {value} = e.target;
        let cleanedValue = value.replace(/[^0-9.]/g, '');

        
        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            cleanedValue = parts[0] + '.' + parts.slice(1).join('');
        }

        
        if (parts.length === 2 && parts[1].length > 2) {
            cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
        }

        
        if (cleanedValue.startsWith('.')) {
            cleanedValue = '0' + cleanedValue;
        }

       
        if (cleanedValue === '.') {
            cleanedValue = '0.';
        }

        setError('');
        setFormData(prev => ({...prev, amount: cleanedValue}));
    };

    const handleSubmit = async () => {
        if (!formData.type || !formData.account || !formData.amount || !formData.comment) return;

        const amountValue = parseFloat(formData.amount);
        if (!(amountValue > 0)) {
            setError('Сумма должна быть больше нуля');
            return;
        }

        try {
            await onCreate(formData);
            setFormData({type: '', account: '', amount: '', comment: ''});
            setError('');
        } catch (e) {
            console.error("Ошибка при добавлении:", e);
            setError('Ошибка при создании операции');
        }
    };

    const isFormValid = () => {
        return (
            formData.type &&
            formData.account &&
            formData.amount &&
            formData.comment &&
            parseFloat(formData.amount) > 0
        );
    };

    return (
        <TransactionCard>
            <CardTitle>Новая операция</CardTitle>

            <StyledFormControl fullWidth>
                <InputLabel id="type-label">Тип операции</InputLabel>
                <Select name="type" value={formData.type} onChange={handleChange} label="Тип операции">
                    <MenuItem value="Доход">Доход</MenuItem>
                    <MenuItem value="Расход">Расход</MenuItem>
                </Select>
            </StyledFormControl>

            <StyledFormControl fullWidth>
                <InputLabel id="account-label">Счет</InputLabel>
                <Select name="account" value={formData.account} onChange={handleChange} label="Счет">
                    {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.name}>
                            {account.name === 'Cashbox' ? 'Касса' : 'Банк'} : {account.balance} MDL
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>

            <AmountTextField
                name="amount"
                label="Сумма"
                type="text"
                value={formData.amount}
                onChange={handleAmountChange}
                fullWidth
                error={!!error}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {formData.type === 'Доход' ? '+' : formData.type === 'Расход' ? '-' : ''}
                        </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">MDL</InputAdornment>,
                }}
                inputProps={{
                    inputMode: 'decimal',
                }}
            />

            <TextField
                name="comment"
                label="Комментарий"
                value={formData.comment}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Например: аренда офиса"
            />

            {error && (
                <Alert severity="error" sx={{mt: 1}}>
                    {error}
                </Alert>
            )}

            <AddButton onClick={handleSubmit} disabled={!isFormValid()}>
                Создать операцию
            </AddButton>
        </TransactionCard>
    );
};

export default CreateTransaction;