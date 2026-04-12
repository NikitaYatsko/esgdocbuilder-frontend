// MainLayout.jsx
import {Sidebar} from "@features/main/Sidebar.jsx";
import {TopBar} from "@features/main/TopBar.jsx";
import {Box} from "@mui/material";

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
                overflow: "auto ",
            }}
        >
            <Box sx={{ gridArea: "sidebar", overflow: "auto",position:"sticky" }}>
                <Sidebar />
            </Box>

            <Box sx={{ gridArea: "topbar" }}>
                <TopBar />
            </Box>

            <Box
                component="main"
                sx={{
                    gridArea: "content",
                    p: 3
                }}
            >
                {children}
            </Box>
        </Box>
    );
};