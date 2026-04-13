import { Box, Switch, styled } from "@mui/material";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeSwitchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 12px',
    marginTop: 0,
    transition: theme.transitions.create('border-color', {
        duration: theme.transitions.duration.standard,
    }),
}));

const ThemeIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
    '& svg': {
        fontSize: '1.4rem',
    },
}));

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 58,
    height: 30,
    padding: 0,
    overflow: 'hidden',
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 0,
        top: '50%',
        left: 2,
        transform: 'translateY(-50%)',
        '&.Mui-checked': {
            transform: 'translate(26px, -50%)',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
            '& .MuiSwitch-thumb': {
                backgroundColor: theme.palette.primary.main,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 26,
        height: 26,
        backgroundColor: theme.palette.common.white,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: theme.transitions.create(['background-color', 'transform'], {
            duration: theme.transitions.duration.shortest,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        opacity: 1,
        transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.shortest,
        }),
    },
}));

export const ThemeToggle = ({ mode, onToggle }) => {
    return (
        <ThemeSwitchContainer>
            <ThemeIcon>
                {mode === 'light' ? <WbSunnyIcon /> : <DarkModeIcon />}
            </ThemeIcon>
            <ThemeSwitch
                checked={mode === 'dark'}
                onChange={onToggle}
            />
        </ThemeSwitchContainer>
    );
};