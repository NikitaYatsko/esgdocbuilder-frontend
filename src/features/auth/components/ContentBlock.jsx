import {Box, styled} from "@mui/material";

const StyledContentBlock = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    marginLeft: '50px',
    marginTop: '50px',
    width: 'calc(100% - 50px)',
    height: 'calc(100vh - 50px)',
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