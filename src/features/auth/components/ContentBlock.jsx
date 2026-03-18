import { Box, styled } from "@mui/material";

const StyledContentBlock = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    marginLeft: '50px',
    marginTop: '50px',
    width: '100%',
    minHeight: '100%',
    overflow: 'visible',
    padding: 24,
    display: 'flex',
    justifyContent: 'center',
}));

const ContentBlock = ({ children }) => {
    return (
        <StyledContentBlock>
            {children}
        </StyledContentBlock>
    )
}


export default ContentBlock;