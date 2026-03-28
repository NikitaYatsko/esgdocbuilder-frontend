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

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'customWidth' && prop !== 'customHeight'
})(({ theme, customWidth, customHeight }) => ({
  borderRadius: '8px',
  boxShadow: theme.shadows[2],
  margin: theme.spacing(2, 0),
  width: customWidth || '100%',
  maxHeight: customHeight || 400,
  overflowY: 'auto',
}));

const StyledTable = styled(Table)(({ customMinWidth }) => ({
  minWidth: customMinWidth || 1350,
  width: '100%',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  position: 'sticky',
  top: 0,
  zIndex: 2,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.white,
  fontWeight: 600,
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const StyledTableRow = styled(TableRow)(({ theme, rowtype }) => ({
  backgroundColor:
    rowtype === "Доход"
      ? "rgba(76, 175, 80, 0.1)"
      : rowtype === "Расход"
      ? "rgba(244, 67, 54, 0.1)"
      : "inherit",
}));

const ActionsContainer = styled('div')({
  display: 'flex',
  gap: '4px',
});

const TableRowComponent = React.memo(function TableRowComponent({
  row,
  columns,
  showActions,
  onEdit,
  onDelete,
  actionsColumn,
  onRowClick
}) {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(row);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(row);
  };

  return (
    <StyledTableRow
      rowtype={row.type}
      onClick={() => onRowClick?.(row)}
    >
      {columns.map((column) => {
        const value = row[column.id];

        if (column.id === actionsColumn && showActions) {
          return (
            <StyledBodyCell key={column.id} align={column.align || 'left'}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{value}</span>

                <ActionsContainer>
                  <IconButton size="small" onClick={handleEdit}>
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ActionsContainer>
              </div>
            </StyledBodyCell>
          );
        }

        return (
          <StyledBodyCell key={column.id} align={column.align || 'left'}>
            {value}
          </StyledBodyCell>
        );
      })}
    </StyledTableRow>
  );
});


const TableComponent = ({
  columns = [],
  rows = [],
  onRowClick,
  showActions = false,
  onEdit,
  onDelete,
  actionsColumn = 'vat',
  tableWidth,
  tableMinWidth,
  tableHeight
}) => {

  return (
    <StyledTableContainer
      component={Paper}
      customWidth={tableWidth}
      style={{ maxHeight: tableHeight }}
    >
      <StyledTable customMinWidth={tableMinWidth}>
        <StyledTableHead>
          <TableRow>
            {columns.map((column) => (
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
            <TableRowComponent
              key={row.id || `row-${index}`}  // Добавляем уникальный ключ
              row={row}
              columns={columns}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              actionsColumn={actionsColumn}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default React.memo(TableComponent);