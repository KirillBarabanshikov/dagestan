import { Outlet, useNavigate } from 'react-router-dom';

import { useSSE } from '@/shared/hooks';
import { ICostume, TSSEActions } from '@/shared/types';

import styles from './MainPage.module.scss';

export const MainPage = () => {
    const navigate = useNavigate();

    useSSE<{ action: TSSEActions; payload: ICostume }>({
        onMessage: (data) => {
            if (data.action === 'timeout') {
                navigate('/');
            }
        },
    });

    return (
        <div className={styles.mainPage}>
            <Outlet />
        </div>
    );
};
