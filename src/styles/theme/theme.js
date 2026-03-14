import {createTheme} from '@mui/material/styles'

const lightPalette = {        // Светлая тема для сайта
    primary: {main: '#0D47A1'},
    secondary: {main: '#1976D2'},
    background: {default: '#EAEFFF', paper: '#FFFFFF'},
    text: {primary: '#212121', white: '#FFFFFF'},
    divider: '#BDBDBD',
    error: {main: '#D32F2F'},
    warning: {main: '#ED6C02'},
    success: {main: '#2E7D32'},
};

const darkPalette = {   // Темная тема для сайта
    primary: {main: '#90CAF9'},
    secondary: {main: '#64B5F6'},
    background: {default: '#121212', paper: '#1E1E1E'},
    text: {primary: '#FFFFFF', white: '#ffffff'},
    divider: '#424242',
    error: {main: '#EF5350'},
    warning: {main: '#FFA726'},
    success: {main: '#66BB6A'},
}

export const getTheme = (mode = 'light') =>
    createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif', // Основной шрифт для сайта
            h1: {fontSize: '2rem', fontWeight: 500},
            body1: {fontSize: '1rem'},
        },
    });