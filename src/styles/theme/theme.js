import {createTheme} from '@mui/material/styles'

const lightPalette = {
    primary: {main: '#0D47A1'},
    secondary: {main: '#1976D2'},
    background: {default: '#EAEFFF', paper: '#FFFFFF'},
    text: {primary: '#212121', white: '#FFFFFF'},
    divider: '#BDBDBD',
    error: {main: '#D32F2F'},
    warning: {main: '#ED6C02'},
    success: {main: '#2E7D32'},
};

const darkPalette = {
    primary: {main: '#90CAF9'},
    secondary: {main: '#64B5F6'},
    background: {default: '#121212', paper: '#1E1E1E'},
    text: {primary: '#FFFFFF', white: '#ffffff'},
    divider: '#424242',
    error: {main: '#EF5350'},
    warning: {main: '#FFA726'},
    success: {main: '#66BB6A'},
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
            fontFamily: 'Roboto, Arial, sans-serif',
            h1: {fontSize: '2rem', fontWeight: 500},
            body1: {fontSize: '1rem'},
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: mode === 'light' ? lightPalette.background.default : darkPalette.background.default,
                    },
                },
            },
        },
    });
};