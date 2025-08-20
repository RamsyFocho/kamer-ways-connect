import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                   
                    <App />
                    
                </NotificationProvider>
            </AuthProvider>
        </QueryClientProvider>
    </HelmetProvider>
);

