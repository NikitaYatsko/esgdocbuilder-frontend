import {createTheme} from '@mui/material/styles'

const lightPalette = {
    primary: {main: '#1E40AF'},      // Глубокий синий (корпоративный)
    secondary: {main: '#3B82F6'},    // Спокойный голубой
    background: {default: '#F8FAFC', paper: '#FFFFFF'},
    text: {primary: '#1E293B', secondary: '#475569', white: '#FFFFFF'},
    divider: '#E2E8F0',
    error: {main: '#EF4444'},
    warning: {main: '#F59E0B'},
    success: {main: '#10B981'},
};

const darkPalette = {
    primary: {main: '#1154bd'},      // Синий (но светлее для темной темы)
    secondary: {main: '#60A5FA'},
    background: {default: '#0F172A', paper: '#1E293B'},
    text: {primary: '#F1F5F9', secondary: '#CBD5E1', white: '#FFFFFF'},
    divider: '#334155',
    error: {main: '#F87171'},
    warning: {main: '#FBBF24'},
    success: {main: '#34D399'},
}

export const getTheme = (mode = 'light') => {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.setAttribute('data-theme', mode);

        document.body.setAttribute('data-theme', mode);
    }

    return createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: {
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            h1: {fontSize: '2rem', fontWeight: 600},
            h2: {fontSize: '1.5rem', fontWeight: 600},
            h3: {fontSize: '1.25rem', fontWeight: 600},
            body1: {fontSize: '0.875rem', fontWeight: 400},
            body2: {fontSize: '0.8125rem', fontWeight: 400},
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: mode === 'light' ? lightPalette.background.default : darkPalette.background.default,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
    });
};