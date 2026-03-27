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
  InputAdornment,
  Alert
} from "@mui/material";
import AddButton from '../../products/components/AddButton.jsx';
import { useBank } from "@features/transactions/hooks/useBank"; 

const TransactionCard = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  width: '100%',
  minWidth: 350,
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

const CreateTransaction = ({ accounts = [], onCreate }) => {
  const [formData, setFormData] = useState({
    type: '',
    account: '',
    amount: '',
    comment: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type' || name === 'amount') {
      setError('');
    }
    
    if (name === 'type' && formData.amount) {
      const amountValue = parseFloat(formData.amount);
      if (value === 'Доход' && amountValue < 0) {
        setError('Сумма дохода не может быть отрицательной');
      } else if (value === 'Расход' && amountValue > 0) {
        setError('Для расхода укажите положительную сумму (знак будет учтен автоматически)');
      } else {
        setError('');
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const amountValue = parseFloat(value);
    
    if (formData.type === 'Доход' && amountValue < 0) {
      setError('Сумма дохода не может быть отрицательной');
    } else if (formData.type === 'Расход' && amountValue < 0) {
      setError('');
    } else if (formData.type === 'Расход' && amountValue > 0) {
      setError('Для расхода используйте отрицательное число или оставьте сумму положительной (знак будет применен автоматически)');
    } else {
      setError('');
    }
    
    setFormData(prev => ({ ...prev, amount: value }));
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.account || !formData.amount || !formData.comment) return;
    
    const amountValue = parseFloat(formData.amount);
    
    if (formData.type === 'Доход' && amountValue <= 0) {
      setError('Сумма дохода должна быть положительной');
      return;
    }
    
    if (formData.type === 'Расход' && amountValue >= 0) {
      setError('Сумма расхода должна быть отрицательной');
      return;
    }

    try {
        await onCreate(formData); 
        setFormData({ type: '', account: '', amount: '', comment: '' });
        setError('');
    } catch (e) {
        console.error("Ошибка при добавлении:", e);
        setError('Ошибка при создании операции');
    }
  };

  const isFormValid = () => {
    if (!formData.type || !formData.account || !formData.amount || !formData.comment) return false;
    
    const amountValue = parseFloat(formData.amount);
    
    if (formData.type === 'Доход' && amountValue <= 0) return false;
    if (formData.type === 'Расход' && amountValue >= 0) return false;
    
    return true;
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
        onChange={handleAmountChange}
        fullWidth
        error={!!error}
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

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
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