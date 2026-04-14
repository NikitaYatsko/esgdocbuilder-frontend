import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderWrapper } from './providers/ThemeProviderWrapper';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { LoginPage } from '@pages/LoginPage/LoginPage.jsx';
import { useAuth } from '@contexts/AuthContext';

import { ProfilePage } from '@pages/ProfilePage/ProfilePage.jsx';
import { AuthProvider } from '@contexts/AuthContext.jsx';
import { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@features/main/FullScreenLoader.jsx';

import { MainLayout } from "@/layouts/MainLayout.jsx";
import UserList from "@pages/UserList/UserList.jsx";

const BankPage = lazy(() => import("@pages/Bank/BankPage.jsx"));
const CreateInvoicePage = lazy(() => import("@pages/CreateInvoicePage/CreateInvoicePage.jsx"));
const ProductsPage = lazy(() => import("@pages/ProductsPage/ProductsPage.jsx"));
const UserListPage = lazy(() => import("@pages/UserListPage/UserListPage.jsx"));
const InvoicePage = lazy(() => import("@pages/InvoicePage/InvoicePage.jsx"));
const SettingsPage = lazy(() => import("@pages/SettingsPage/SettingsPage.jsx"));


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
                <Route
                    path="/invoices/:id"
                    element={
                        <PrivateRoute>
                            <InvoicePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
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
