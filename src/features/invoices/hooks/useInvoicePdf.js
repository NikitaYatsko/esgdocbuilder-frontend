import { useState, useCallback } from 'react';
import { invoiceApi } from '@features/invoices/api/invoiceApi';

export const useInvoicePdf = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const downloadPdf = useCallback(async (invoiceId, invoiceName = 'invoice') => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Запрос PDF для сметы ID:', invoiceId);
            
            const response = await invoiceApi.downloadPdfToMarg(invoiceId);
            
            console.log('Ответ получен:', {
                status: response.status,
                headers: response.headers,
                dataSize: response.data?.length
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${invoiceName}_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (err) {
            console.error('Ошибка при скачивании PDF:', err);
            
            // Пытаемся прочитать ошибку из response
            let errorMessage = 'Ошибка при скачивании PDF';
            
            if (err.response) {
                console.error('Статус:', err.response.status);
                console.error('Заголовки:', err.response.headers);
                
                // Пытаемся прочитать JSON ошибку из Blob
                if (err.response.data instanceof Blob && err.response.data.type === 'application/json') {
                    try {
                        const text = await err.response.data.text();
                        const errorData = JSON.parse(text);
                        console.error('Распарсенная ошибка:', errorData);
                        errorMessage = errorData.message || errorData.error || errorData.title || 'Ошибка сервера при генерации PDF';
                    } catch (e) {
                        console.error('Не удалось распарсить ошибку:', e);
                        errorMessage = 'Ошибка сервера при генерации PDF';
                    }
                } else if (err.response.data && typeof err.response.data === 'object') {
                    errorMessage = err.response.data.message || err.response.data.error || 'Ошибка сервера';
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const openPdfInNewTab = useCallback(async (invoiceId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await invoiceApi.downloadPdf(invoiceId);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Очищаем URL через секунду
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            
            return { success: true };
        } catch (err) {
            let errorMessage = 'Ошибка при открытии PDF';
            
            if (err.response?.data instanceof Blob && err.response.data.type === 'application/json') {
                try {
                    const text = await err.response.data.text();
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorData.error || 'Ошибка сервера';
                } catch (e) {
                    errorMessage = 'Ошибка сервера при генерации PDF';
                }
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return { downloadPdf, openPdfInNewTab, loading, error };
};