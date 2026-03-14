import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import {Typography, Box} from "@mui/material";
import {Sidebar} from "@features/main/Sidebar.jsx";
import {TopBar} from "@features/main/TopBar.jsx";

const CreateInvoicePage = () => {
    return (
        <Box>
            <Sidebar></Sidebar>
            <TopBar></TopBar>
            <ContentBlock>
                <Typography sx={{color: "black"}}>
                    Страница смет
                </Typography>
            </ContentBlock>
        </Box>
    )
}

export default CreateInvoicePage;