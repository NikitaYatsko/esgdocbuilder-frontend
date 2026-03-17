import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { Typography, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import TableComponent from "@features/auth/components/TableComponent.jsx";


const ProductsPage = () => {

    const columns = [
        { id: 'name', label: 'Наименование', align: 'left' },
        { id: 'purchasePrice', label: 'Цена Закупки', align: 'left' },
        { id: 'salePrice', label: 'Цена Продажи', align: 'left' },
        { id: 'margin', label: 'Маржинальность', align: 'left' },
        { id: 'vat', label: 'НДС', align: 'left' },
    ];

    const rows = [
        { id: 1, name: 'Модель А', purchasePrice: '60 000', salePrice: '75 000', margin: '25%', vat: '18' },
        { id: 2, name: 'Модель Б', purchasePrice: '35 000', salePrice: '45 000', margin: '28.6%', vat: '18' },
        { id: 3, name: 'Модель В', purchasePrice: '6 000', salePrice: '8 500', margin: '31.7%', vat: '18' },
        { id: 4, name: 'Модель Г', purchasePrice: '2 500', salePrice: '3 200', margin: '28%', vat: '18' },
        { id: 5, name: 'Модель Д', purchasePrice: '20 000', salePrice: '28 000', margin: '40%', vat: '18' },
    ];

    const handleRowClick = (row) => {
        console.log('Выбрана строка:', row);
    };

    const handleEdit = (row) => {
        console.log('Редактировать:', row);
    };

    const handleDelete = (row) => {
        console.log('Удалить:', row);
    };

    return (
        <ContentBlock>
            <TableComponent
                columns={columns}
                rows={rows}
                onRowClick={handleRowClick}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </ContentBlock>
    )
}
export default ProductsPage;