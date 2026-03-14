import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext({ mode: 'light', togle: () => {} }) // пока просто создали контекст, но он не используется

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light'); // состояние для хранения текущей темы
    const togle = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')); // функция для переключения темы

    return (
        <ThemeContext.Provider value={{ mode, togle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => useContext(ThemeContext);