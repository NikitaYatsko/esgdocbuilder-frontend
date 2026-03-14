import { Modal, Box, styled } from "@mui/material";

export const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    boxShadow: theme.shadows[24],
    padding: theme.spacing(4),
    width: '100%',
    maxWidth: 500,
    outline: 'none',
    border: '1px solid',
    borderColor: theme.palette.divider,
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const ModalTitle = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

export const ModalBody = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const ModalFooter = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
}));