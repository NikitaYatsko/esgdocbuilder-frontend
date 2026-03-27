import { ThemeProvider, CssVarsProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@styles/theme/theme";

export const ThemeProviderWrapper = ({ children, mode }) => {
    const theme = getTheme(mode);

    return (
        <ThemeProvider theme={theme}>
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </ThemeProvider>
    );
}