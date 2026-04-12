/*
import { Box, styled } from "@mui/material";

const StyledContentBlock = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$centered'
})(({ theme, $centered }) => ({
    backgroundColor: theme.palette.background.default,
    marginLeft: '70px',
    marginTop: '70px',
    width: '100%',
    minHeight: '100%',
    overflow: 'visible',
    padding: 24,
    display: 'flex',
    justifyContent: $centered ? 'center' : 'flex-start',
}));

const ContentBlock = ({ children, centered = false }) => {
    return (
        <StyledContentBlock $centered={centered}>
            {children}
        </StyledContentBlock>
    )
}


export default ContentBlock;*/
