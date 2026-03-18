import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  styled,
  InputAdornment
} from "@mui/material";
import AddButton from './AddButton.jsx';
import { useBank } from "@features/auth/hooks/useBank"; 

const TransactionCard = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: 350,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
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

const CreateTransaction = ({ accounts = [] }) => {
  const { createOperation } = useBank(); 
  const [formData, setFormData] = useState({
    type: '',
    account: '',
    amount: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.account || !formData.amount || !formData.comment) return;

    try {
        await createOperation(formData); 
        setFormData({ type: '', account: '', amount: '', comment: '' });
    } catch (e) {
        console.error("Ошибка при добавлении:", e);
    }
  };

  const isFormValid = () => {
    return formData.type && formData.account && formData.amount && formData.comment;
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
        type="number"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">MDL</InputAdornment>,
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

      <AddButton onClick={handleSubmit} disabled={!isFormValid()}>
        Создать операцию
      </AddButton>
    </TransactionCard>
  );
};

export default CreateTransaction;