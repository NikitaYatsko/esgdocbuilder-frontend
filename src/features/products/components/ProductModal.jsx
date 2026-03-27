import {
    Typography,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
    StyledModal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from "@features/modal/StyledModal";

import { StyledInput } from "@features/modal/StyledInput";
import { StyledButton } from "@features/modal/StyledButton";

const ProductModal = ({ open, onClose, product }) => {

    const isEdit = Boolean(product);

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>

                <ModalHeader>
                    <ModalTitle>
                        <Typography variant="h6">
                            {isEdit ? "Редактировать товар" : "Добавить товар"}
                        </Typography>

                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <StyledInput
                        label="Название"
                        defaultValue={product?.name || ""}
                    />
                    <StyledInput
                        label="Цена закупки"
                        defaultValue={product?.purchasePrice || ""}
                    />
                    <StyledInput
                        label="Цена продажи"
                        defaultValue={product?.salePrice || ""}
                    />
                    <StyledInput
                        label="НДС"
                        defaultValue={product?.vat || ""}
                    />
                </ModalBody>

                <ModalFooter>
                    <StyledButton variant="outlined" onClick={onClose}>
                        Отмена
                    </StyledButton>

                    <StyledButton variant="contained">
                        {isEdit ? "Сохранить" : "Добавить"}
                    </StyledButton>
                </ModalFooter>

            </ModalContent>
        </StyledModal>
    );
};

export default ProductModal;