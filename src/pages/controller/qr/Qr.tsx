import { useNavigate } from 'react-router-dom';

import { sendEvent } from '@/shared/api';
import { AlertModal, Button, Keyboard } from '@/shared/ui';

import styles from './Qr.module.scss';
import { useRef, useState } from 'react';
import { instance } from '@/shared/api/instance.ts';
import { useControllerStore } from '@/shared/store';

export const Qr = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const { faceSwapId } = useControllerStore((state) => state);
    const [showAlert, setShowAlert] = useState<'none' | 'success' | 'error'>('none');
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = async () => {
        await sendEvent({ action: 'exit' });
        navigate('/controller');
    };

    const onEnter = async () => {
        if (!inputRef.current) return;

        try {
            setIsLoading(true);
            await instance.post('/email', {
                faceSwapsId: [faceSwapId],
                email: inputRef.current.value.trim(),
            });
            setShowAlert('success');
        } catch (error) {
            console.error(error);
            setShowAlert('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.qr}>
            <div className={styles.wrap}>
                <h2>ПОЛУЧИТЕ ФОТО</h2>
                <p>Введите email, чтобы получить цифровую версию фото</p>
                <input type='text' ref={inputRef} className={styles.input} placeholder={'Email'} />
                <Keyboard inputRef={inputRef} onEnter={onEnter} className={styles.keyboard} isLoading={isLoading} />
                <Button fullWidth onClick={handleBack} disabled={isLoading}>
                    на главную
                </Button>
            </div>
            <AlertModal
                isOpen={showAlert !== 'none'}
                isError={showAlert === 'error'}
                onError={handleBack}
                onClose={() => setShowAlert('none')}
                onSuccess={handleBack}
                title={showAlert === 'error' ? 'Произошла ошибка' : 'Успешно отправлено'}
                subtitle={showAlert === 'error' ? 'Пожалуйста, попробуйте еще раз.' : 'Фото отправлено на email'}
            />
        </div>
    );
};
