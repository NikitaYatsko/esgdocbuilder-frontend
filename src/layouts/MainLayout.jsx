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
                minHeight: "100vh", // Меняем height на minHeight
                // Убираем overflow: hidden
            }}
        >
            {/* Sidebar */}
            <Box
                sx={{
                    gridRow: "1 / span 2",
                    gridColumn: "1",
                    position: "sticky", // Возвращаем sticky
                    top: 0,
                    height: "100vh",
                }}
            >
                <Sidebar />
            </Box>

            {/* TopBar */}
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

            {/* Content - убираем overflow */}
            <Box
                sx={{
                    gridRow: "2",
                    gridColumn: "2",
                    height: "100%",
                    width:"100%",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};