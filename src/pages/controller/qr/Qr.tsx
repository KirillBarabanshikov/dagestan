import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchQr, sendEvent } from '@/shared/api';
import { useControllerStore } from '@/shared/store';
import { Button } from '@/shared/ui';

import styles from './Qr.module.scss';

export const Qr = () => {
    const [qr, setQr] = useState<string>('');
    const { faceSwapId } = useControllerStore((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (!faceSwapId) return;

        const handleQr = async () => {
            const qr = await fetchQr(faceSwapId);
            setQr(qr);
        };
        handleQr();
    }, [faceSwapId]);

    const handleBack = async () => {
        await sendEvent({ action: 'exit' });
        navigate('/controller');
    };

    return (
        <div className={styles.qr}>
            <div className={styles.wrap}>
                <h2>ПОЛУЧИТЕ ФОТО</h2>
                <p>Отсканируйте или сфотографируйте QR-КОД, чтобы получить цифровую версию фото</p>
                <div dangerouslySetInnerHTML={{ __html: qr }} className={styles.qrWrap} />
                <Button fullWidth onClick={handleBack}>
                    на главную
                </Button>
            </div>
        </div>
    );
};
