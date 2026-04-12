import {Box} from "@mui/material";
import {Sidebar} from "@features/main/Sidebar.jsx";
import {TopBar} from "@features/main/TopBar.jsx";

export const MainLayout = ({ children }) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateAreas: `
                    "sidebar topbar"
                    "sidebar content"
                `,
                gridTemplateColumns: "70px 1fr",
                gridTemplateRows: "70px 1fr",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <Box sx={{ gridArea: "sidebar", overflow: "auto" }}>
                <Sidebar />
            </Box>

            <Box sx={{ gridArea: "topbar" }}>
                <TopBar />
            </Box>

            <Box
                component="main"
                sx={{
                    gridArea: "content",
                    overflow: "auto",
                    p: 3
                }}
            >
                {children}
            </Box>
        </Box>
    );
};