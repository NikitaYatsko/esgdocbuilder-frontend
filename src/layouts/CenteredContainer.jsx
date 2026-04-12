import {Box} from "@mui/material";

export const CenteredContainer = ({children, fullHeight = false, width}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: width + "px",
                margin: "0 auto",
                height: fullHeight ? "100%" : "auto",
            }}
        >
            {children}
        </Box>
    );
};