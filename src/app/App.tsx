import 'swiper/css';
import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router/router';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});

export const App = () => {
    useEffect(() => {
        navigator.mediaDevices?.enumerateDevices().then((devices) => console.log(devices));
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
