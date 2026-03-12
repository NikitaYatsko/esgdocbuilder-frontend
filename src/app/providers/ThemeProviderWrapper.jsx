import { ThemeProvider, CssVarsProvider } from "@mui/material";
import { getTheme } from "@styles/theme/theme";

export const ThemeProviderWrapper = ({ children, mode }) => {
    const theme = getTheme(mode);

    return (
        <ThemeProvider theme={theme}>
            <CssVarsProvider theme={theme}>
                {children}
            </CssVarsProvider>
        </ThemeProvider>
    );
}