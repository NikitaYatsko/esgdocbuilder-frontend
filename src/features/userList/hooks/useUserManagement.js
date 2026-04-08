import { useState, useCallback } from 'react';
import { authApi } from '@features/auth/api/authApi';
import * as yup from 'yup';

const createUserSchema = yup.object({
    email: yup.string().email('Неверный формат email').required('Email обязателен'),
    firstName: yup.string().required('Имя обязательно'),
    lastName: yup.string().required('Фамилия обязательна'),
    password: yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Пароль обязателен'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно'),
    phone: yup.string().nullable(),
});

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
            setError('Не удалось загрузить список пользователей');
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData) => {
        try {
            await createUserSchema.validate(userData, { abortEarly: false });

            setLoading(true);
            setError(null);

            const requestData = {
                email: userData.email,
                firstName: userData.firstName,  
                lastName: userData.lastName,    
                password: userData.password,
                confirmPassword: userData.confirmPassword, 
                phone: userData.phone || null,
                role: "USER"  
            };

            console.log("Отправляемые данные:", requestData);

            const response = await authApi.createUser(requestData);

            await fetchUsers();

            setModalOpen(false);
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Ошибка создания пользователя:", error);
            
            if (error.response) {
                console.error("Детали ошибки от сервера:", error.response.data);
                const serverMessage = error.response.data?.message || 
                                     error.response.data?.error ||
                                     'Не удалось создать пользователя';
                setError(serverMessage);
                return { success: false, error: serverMessage };
            }

            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setError(validationErrors);
                return { success: false, errors: validationErrors };
            }

            const errorMessage = error.message || 'Не удалось создать пользователя';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const deleteUser = useCallback(async (email) => {
        try {
            setLoading(true);
            setError(null);

            await authApi.deleteUser(email);

            await fetchUsers();

            return { success: true };
        } catch (error) {
            console.error("Ошибка удаления пользователя:", error);
            
            if (error.response) {
                console.error("Детали ошибки от сервера:", error.response.data);
                const serverMessage = error.response.data?.message || 'Не удалось удалить пользователя';
                setError(serverMessage);
                return { success: false, error: serverMessage };
            }
            
            const errorMessage = error.response?.data?.message || 'Не удалось удалить пользователя';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const openModal = useCallback(() => {
        setModalOpen(true);
        setError(null);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setError(null);
    }, []);

    return {
        users,
        loading,
        modalOpen,
        error,
        fetchUsers,
        createUser,
        deleteUser,
        openModal,
        closeModal,
    };
};