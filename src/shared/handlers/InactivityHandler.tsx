import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { sendEvent } from '@/shared/api';

interface IInactivityHandlerProps extends PropsWithChildren {
    timeout: number;
}

export const InactivityHandler: FC<IInactivityHandlerProps> = ({ timeout, children }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            console.log('navigate');
            sendEvent({ action: 'timeout' }).then(() => navigate('/controller'));
        }, timeout);
    };

    useEffect(() => {
        window.addEventListener('click', resetTimer);

        resetTimer();

        return () => {
            window.removeEventListener('click', resetTimer);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [navigate, timeout]);

    return <>{children}</>;
};
