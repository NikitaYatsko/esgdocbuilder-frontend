// src/pages/SettingsPage/SettingsPage.jsx
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { StyledInput } from "@features/modal/StyledInput";
import { useState, useEffect } from "react";

const STORAGE_KEY = "vat_settings";

const SettingsPage = () => {
  const [vatPercent, setVatPercent] = useState(20);
  const [vatDivisor, setVatDivisor] = useState(120);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setVatPercent(data.vatPercent);
      setVatDivisor(data.vatDivisor);
    }
  }, []);

  const handleVatPercentChange = (e) => {
    const value = Number(e.target.value);
    setVatPercent(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ vatPercent: value, vatDivisor }));
  };

  const handleVatDivisorChange = (e) => {
    const value = Number(e.target.value);
    setVatDivisor(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ vatPercent, vatDivisor: value }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Настройки НДС
          </Typography>

          <StyledInput
            label="Процент НДС"
            type="number"
            value={vatPercent}
            onChange={handleVatPercentChange}
            helperText="Стандартное значение: 20"
          />

          <StyledInput
            label="Делитель для расчета НДС"
            type="number"
            value={vatDivisor}
            onChange={handleVatDivisorChange}
            helperText="Стандартное значение: 120"
          />

          <Box sx={{ mt: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Пример:</strong> При цене 1200 
              <br />
              НДС = 1200 × ({vatPercent} / {vatDivisor}) ={" "}
              <strong>{(1200 * (vatPercent / vatDivisor)).toFixed(2)}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SettingsPage;