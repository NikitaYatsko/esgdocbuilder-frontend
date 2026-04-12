// MainLayout.jsx
import {Sidebar} from "@features/main/Sidebar.jsx";
import {TopBar} from "@features/main/TopBar.jsx";
import {Box} from "@mui/material";

export const MainLayout = ({ children }) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "70px 1fr",
                gridTemplateRows: "70px 1fr",
                minHeight: "100vh",

            }}
        >

            <Box
                sx={{
                    gridRow: "1 / span 2",
                    gridColumn: "1",
                    position: "sticky",
                    height: "100vh",
                }}
            >
                <Sidebar />
            </Box>


            <Box
                sx={{
                    gridRow: "1",
                    gridColumn: "2",
                    position: "sticky",
                    top: 0,
                    zIndex: 1200,

                }}
            >
                <TopBar />
            </Box>


            <Box
                sx={{
                    gridRow: "2",
                    gridColumn: "2",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};