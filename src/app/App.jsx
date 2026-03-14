import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProviderWrapper} from './providers/ThemeProviderWrapper';
import {ThemeProvider, useThemeContext} from './contexts/ThemeContext';
import {LoginPage} from '@pages/LoginPage/LoginPage.jsx';
import {useAuth} from '@contexts/AuthContext';
import {CircularProgress, Box} from '@mui/material';
import {ProfilePage} from '@pages/ProfilePage/ProfilePage.jsx';
import {AuthProvider} from '@contexts/AuthContext.jsx';
import BankPage from "@pages/Bank/BankPage.jsx";
import { TopBar } from '@features/main/TopBar.jsx';
import { Sidebar } from '@features/main/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const PrivateRoute = ({children}) => {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

        return isAuthenticated ? 
        <MainLayout>{children}</MainLayout> : 
        <Navigate to="/login"/>;
};

const AppContent = () => {
    const {mode} = useThemeContext();

    return (
        <ThemeProviderWrapper mode={mode}>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/BankPage"
                    element={
                        <PrivateRoute>
                            <BankPage/>
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/profile"/>}/>
            </Routes>
        </ThemeProviderWrapper>
    );
};

const App = () => (
    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
                <AppContent/>
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
);

export default App;