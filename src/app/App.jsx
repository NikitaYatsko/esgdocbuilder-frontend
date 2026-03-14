import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderWrapper } from './providers/ThemeProviderWrapper';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { LoginPage } from '@pages/LoginPage/LoginPage.jsx';
import { DashboardPage } from '@pages/MainPage/DashboardPage.jsx';
import { useAuth } from '@contexts/AuthContext'; 
import { CircularProgress, Box } from '@mui/material';
import { ProfilePage } from '@pages/ProfilePage/ProfilePage.jsx';
import { AuthProvider } from '@contexts/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { mode } = useThemeContext();
  
  return (
    <ThemeProviderWrapper mode={mode}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProviderWrapper>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider> 
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;