import { Event, EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect, useState } from 'react';

import { JWT_TOKEN, SSE_URL } from '../consts';

type SSEOptions<T> = {
    onMessage?: (data: T) => void;
    onError?: (error: Event) => void;
};

export const useSSE = <T>({ onMessage, onError }: SSEOptions<T>) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const eventSource = new EventSourcePolyfill(SSE_URL, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`,
            },
            heartbeatTimeout: 45000,
            withCredentials: true,
        });

        setIsConnected(true);

        eventSource.onmessage = (event) => {
            const data: T = JSON.parse(event.data);
            if (onMessage) {
                onMessage(data);
            }
        };

        eventSource.onerror = (error) => {
            setIsConnected(false);
            console.error('SSE connection error:', error);
            if (onError) {
                onError(error);
            }
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [onMessage, onError]);

    return { isConnected };
};
