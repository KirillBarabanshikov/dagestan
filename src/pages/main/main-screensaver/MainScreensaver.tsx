import { useNavigate } from 'react-router-dom';

import { useSSE } from '@/shared/hooks';
import { ICostume, TSSEActions } from '@/shared/types';

import styles from './MainScreensaver.module.scss';

export const MainScreensaver = () => {
    const navigate = useNavigate();

    useSSE<{ action: TSSEActions; payload: ICostume }>({
        onMessage: (data) => {
            if (data.action === 'selectCostume') {
                navigate('/costume', { state: data.payload });
            }
        },
    });

    return (
        <div className={styles.mainScreensaver}>
            <video autoPlay loop muted playsInline>
                <source src={'/video.webm'} type='video/webm' />
            </video>
            <h1>Примерим Дагестанский костюм?</h1>
        </div>
    );
};
