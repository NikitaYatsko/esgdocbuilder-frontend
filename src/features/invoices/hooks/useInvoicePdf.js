import { useState, useCallback } from 'react';
import { invoiceApi } from '@features/invoices/api/invoiceApi';

export const useInvoicePdf = () => {
    const [loadingNormal, setLoadingNormal] = useState(false);
    const [loadingMargin, setLoadingMargin] = useState(false);
    const [error, setError] = useState(null);

    const downloadPdf = useCallback(async (invoiceId, invoiceName = 'invoice') => {
        setLoadingNormal(true);
        setError(null);

        try {
            const response = await invoiceApi.downloadPdf(invoiceId);

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

            let errorMessage = 'Ошибка при скачивании PDF';

            if (err.response) {
                if (err.response.data instanceof Blob && err.response.data.type === 'application/json') {
                    try {
                        const text = await err.response.data.text();
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || errorData.error || errorData.title || 'Ошибка сервера при генерации PDF';
                    } catch (e) {
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
            setLoadingNormal(false);
        }
    }, []);

    const downloadPdfWithMargin = useCallback(async (invoiceId, invoiceName = 'invoice') => {
        setLoadingMargin(true);
        setError(null);

        try {
            const response = await invoiceApi.downloadPdfToMarg(invoiceId);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${invoiceName}_${invoiceId}_with_margin.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (err) {
            console.error('Ошибка при скачивании PDF с маржой:', err);

            let errorMessage = 'Ошибка при скачивании PDF с маржой';

            if (err.response) {
                if (err.response.data instanceof Blob && err.response.data.type === 'application/json') {
                    try {
                        const text = await err.response.data.text();
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || errorData.error || errorData.title || 'Ошибка сервера при генерации PDF';
                    } catch (e) {
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
            setLoadingMargin(false);
        }
    }, []);

    return {
        downloadPdf,
        downloadPdfWithMargin,
        pdfLoadingNormal: loadingNormal,
        pdfLoadingMargin: loadingMargin,
        error
    };
};