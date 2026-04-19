import {Avatar, Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const getUserColumns = (handleDelete) => [
    {
        id: 'imageUrl',
        label: 'Аватар',
        align: 'center',
        render: (value) => (
            <Avatar
                src={value}
                alt="user"
                sx={{width: 40, height: 40, mx: 'auto'}}
            />
        ),
    },
    {id: 'id', label: 'ID', align: 'left'},
    {id: 'fullName', label: 'Имя', align: 'left'},
    {id: 'email', label: 'Email', align: 'left'},
    {id: 'phone', label: 'Телефон', align: 'left'},
    {id: 'role', label: 'Роль', align: 'center'},
    {
        id: 'actions',
        label: 'Действия',
        align: 'center',
        render: (_, row) => (
            <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon/>}
                onClick={() => handleDelete(row.email)}
                sx={{borderRadius: 2}}
            >
                Удалить
            </Button>
        )
    },
];