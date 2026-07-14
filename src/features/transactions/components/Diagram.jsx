import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

// Генерация цветов для категорий
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#C9CBCF',
];

export default function Diagram({ operations = [], categories = [] }) {
  // Фильтруем только расходы
  const expenseOps = operations.filter(op => op.type === 'Расход');

  // Группировка по категориям
  const categoryMap = new Map();
  expenseOps.forEach(op => {
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


  if (chartData.length === 0) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Нет расходов за выбранный период
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 6 }}>
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
              outerRadius: 140,
              paddingAngle: 1,
            },
          ]}
          slotProps={{
            legend: {
              direction: 'row', 
              position: { vertical: 'bottom', horizontal: 'middle' }, 
              labelStyle: { fontSize: 12 },
              itemMarkWidth: 15,
              itemMarkHeight: 15,
              markGap: 5,
              itemGap: 10,
            },
          }}
          margin={{ bottom: 80 }} 
        >
          <PieCenterLabel>Расходы</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}