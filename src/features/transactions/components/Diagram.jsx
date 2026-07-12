import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

// Генерация цветов для категорий (можно расширить)
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#C9CBCF',
];

export default function Diagram({ operations = [], categories = [] }) {
  const [view, setView] = React.useState('expense'); // 'expense' или 'income'

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Фильтруем операции по типу
  const filteredOps = operations.filter(op => {
    if (view === 'expense') return op.type === 'Расход';
    if (view === 'income') return op.type === 'Доход';
    return true;
  });

  // Группировка по категориям
  const categoryMap = new Map();
  filteredOps.forEach(op => {
    const catName = op.category || 'Без категории';
    const amount = parseFloat(op.amount) || 0;
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount);
  });

  // Преобразуем в формат для диаграммы
  const chartData = Array.from(categoryMap.entries())
    .filter(([, value]) => value > 0)
    .map(([label, value], index) => ({
      id: label,
      label: label,
      value: value,
      color: COLORS[index % COLORS.length],
    }));

  // Общая сумма
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Если нет данных – показываем сообщение
  if (chartData.length === 0) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Нет операций за выбранный период
        </Typography>
      </Box>
    );
  }

  const centerLabel = view === 'expense' ? 'Расходы' : 'Доходы';

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 6 }}>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={view}
        exclusive
        onChange={handleViewChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="expense">Расходы</ToggleButton>
        <ToggleButton value="income">Доходы</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', justifyContent: 'center', height: 400 }}>
        <PieChart
          series={[
            {
              data: chartData,
              arcLabel: (item) => `${((item.value / total) * 100).toFixed(1)}%`,
              arcLabelRadius: '70%',
              valueFormatter: ({ value }) => `${value.toLocaleString()} MDL`,
              highlightScope: { fade: 'global', highlight: 'item' },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
              innerRadius: 40,
              outerRadius: 160,
              paddingAngle: 1,
            },
          ]}
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'middle', horizontal: 'right' },
              labelStyle: { fontSize: 12 },
            },
          }}
        >
          <PieCenterLabel>{centerLabel}</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}