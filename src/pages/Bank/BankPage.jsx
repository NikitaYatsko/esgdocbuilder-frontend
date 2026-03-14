import {Box, Typography, styled} from "@mui/material";
import {Sidebar} from "@features/main/Sidebar.jsx";
import {TopBar} from "@features/main/TopBar.jsx";
import ContentBlock from "@features/auth/components/ContentBlock.jsx";


const CountBlock = styled(Box)(({theme}) => ({
    width: 300,
    height: 150,
    borderRadius: 10,
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
}));

const BankPage = () => {
    return (
        <ContentBlock>

            <Sidebar/>
            <TopBar/>
            <CountBlock>
                <Typography variant="h6">
                    Касса
                </Typography>
            </CountBlock>

            <CountBlock>
                <Typography variant="h6">
                    Банк
                </Typography>
            </CountBlock>
        </ContentBlock>


    )
        ;
};

export default BankPage;