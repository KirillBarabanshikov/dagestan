import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { API_URL } from '@/shared/consts';
import { useSSE } from '@/shared/hooks';
import { ICostume, TSSEActions } from '@/shared/types';

import styles from './Costume.module.scss';

export const Costume = () => {
    const location = useLocation();
    const costume = location.state as ICostume;
    const navigate = useNavigate();
    const [selectedCostume, setSelectedCostume] = useState(costume);

    useSSE<{ action: TSSEActions; payload: any }>({
        onMessage: (data) => {
            if (data.action === 'back') {
                navigate('/');
            }
            if (data.action === 'selectCostume') {
                setSelectedCostume(data.payload);
            }
            if (data.action === 'selectScene') {
                navigate('/camera', { state: data.payload });
            }
        },
    });

    return (
        <div className={styles.costume}>
            {selectedCostume && (
                <video key={selectedCostume.id} autoPlay loop muted playsInline>
                    <source src={`${API_URL}${selectedCostume.videoName}`} />
                </video>
            )}
        </div>
    );
};
