import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: theme.shadows[2],
  margin: theme.spacing(2, 0),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 1200,
  borderCollapse: 'collapse',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.white,
  fontWeight: 600,
  fontSize: '1rem',
  borderBottom: `2px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderRight: 'none', 
  },
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRight: 'none',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default,
  },
  '&:hover': {
    backgroundColor: theme.palette.action?.hover || '#f5f5f5',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CellContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
});

const ActionsContainer = styled('div')({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: '4px',
  '&:hover': {
    backgroundColor: theme.palette.action?.hover,
  },
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
  '&.Mui-focusVisible': {
    outline: 'none',
  },
}));

const TableComponent = ({ 
  columns = [], 
  rows = [], 
  onRowClick,
  showActions = false,
  onEdit,
  onDelete,
  actionsColumn = 'vat' 
}) => {
  const allColumns = columns;

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    if (onEdit) onEdit(row);
  };

  const handleDeleteClick = (e, row) => {
    e.stopPropagation();
    if (onDelete) onDelete(row);
  };

  const renderCellContent = (row, column) => {
    const value = row[column.id];
    
    if (column.id === actionsColumn && showActions) {
      return (
        <CellContent>
          <span>{value}</span> 
          <ActionsContainer>
            <StyledIconButton 
              size="small"
              onClick={(e) => handleEditClick(e, row)}
              aria-label="edit"
            >
              <EditIcon fontSize="small" />
            </StyledIconButton>
            <StyledIconButton 
              size="small"
              onClick={(e) => handleDeleteClick(e, row)}
              aria-label="delete"
            >
              <DeleteIcon fontSize="small" />
            </StyledIconButton>
          </ActionsContainer>
        </CellContent>
      );
    }
    
    return value;
  };

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable aria-label="simple table">
        <StyledTableHead>
          <TableRow>
            {allColumns.map((column) => (
              <StyledHeaderCell
                key={column.id}
                align={column.align || 'left'}
              >
                {column.label}
              </StyledHeaderCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow
              key={row.id || index}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {allColumns.map((column) => (
                <StyledBodyCell
                  key={`${row.id || index}-${column.id}`}
                  align={column.align || 'left'}
                >
                  {renderCellContent(row, column)}
                </StyledBodyCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default TableComponent;