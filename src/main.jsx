import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000, 
            retry: 1,
            refetchOnWindowFocus: false, 
        }
    }
});

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
)
