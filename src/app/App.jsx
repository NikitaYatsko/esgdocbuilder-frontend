import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderWrapper } from './providers/ThemeProviderWrapper';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { LoginPage } from '@pages/LoginPage/LoginPage.jsx';
import { useAuth } from '@contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { ProfilePage } from '@pages/ProfilePage/ProfilePage.jsx';
import { AuthProvider } from '@contexts/AuthContext.jsx';
import { TopBar } from '@features/main/TopBar.jsx';
import { Sidebar } from '@features/main/Sidebar';
import { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@features/main/FullScreenLoader.jsx';

const BankPage = lazy(() => import("@pages/Bank/BankPage.jsx"));
const CreateInvoicePage = lazy(() => import("@pages/CreateInvoicePage/CreateInvoicePage.jsx"));
const ProductsPage = lazy(() => import("@pages/ProductsPage/ProductsPage.jsx"));
const UserList = lazy(() => import("@pages/UserList/UserList.jsx"));

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
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <FullScreenLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <MainLayout>
            <Suspense fallback={<FullScreenLoader />}>
                {children}
            </Suspense>
        </MainLayout>
    );
};

const AppContent = () => {
    const { mode } = useThemeContext();

    return (
        <ThemeProviderWrapper mode={mode}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bank"
                    element={
                        <PrivateRoute>
                            <BankPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <PrivateRoute>
                            <ProductsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/invoice"
                    element={
                        <PrivateRoute>
                            <CreateInvoicePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <UserList />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/profile" />} />
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
