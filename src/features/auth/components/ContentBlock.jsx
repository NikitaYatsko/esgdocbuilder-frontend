import {Box, styled} from "@mui/material";

const StyledContentBlock = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    marginLeft: '70px',
    marginTop: '70px',
    width: 'calc(100% - 70px)',
    height: 'calc(100vh - 70px)',
    overflow: 'auto',
    padding: 24,

}));

const ContentBlock = ({children}) => {
    return (
        <StyledContentBlock>
            {children}
        </StyledContentBlock>
    )
}


export default ContentBlock;