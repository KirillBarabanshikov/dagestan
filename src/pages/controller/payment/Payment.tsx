import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { paymentEvent, sendEvent, sendStatisticPayed } from '@/shared/api';
import { printEvent } from '@/shared/api/queries.ts';
import { PAYMENT_PASSWORD, PHOTO_COST } from '@/shared/consts';
import { useControllerStore } from '@/shared/store';
import { AlertModal, Button, Keyboard, Modal, SecretButton } from '@/shared/ui';

import styles from './Payment.module.scss';

export const Payment = () => {
    const [alertState, setAlertState] = useState<'none' | 'success' | 'failed' | 'pending'>('none');
    const [showKeyboard, setShowKeyboard] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const statisticId = useControllerStore((state) => state.statisticId);
    const location = useLocation();
    const photoPath: string = location.state;

    const handlePayment = async () => {
        try {
            setAlertState('pending');
            const response = await paymentEvent();
            if (response.result === 'success') {
                setAlertState('success');
                await handlePaymentSuccess();
            } else {
                setAlertState('failed');
            }
        } catch (error) {
            console.error(error);
            setAlertState('failed');
        }
    };

    const handlePaymentSuccess = async () => {
        await sendEvent({ action: 'payed' });
        if (statisticId) await sendStatisticPayed(statisticId);
        await printEvent(photoPath);
    };

    const handlePasswordSubmit = async () => {
        if (inputRef.current?.value === PAYMENT_PASSWORD) {
            setAlertState('success');
            setShowKeyboard(false);
            try {
                await printEvent(photoPath);
            } catch (error) {
                console.warn(error);
            }
        }
    };

    return (
        <>
            <SecretButton onSecretAction={() => setShowKeyboard(true)} />

            <div className={styles.payment}>
                <div className={styles.wrap}>
                    <h2>Произведите оплату</h2>
                    <p>
                        Для получения фото необходимо произвести оплату. После оплаты вы сможете забрать напечатанную
                        фотографию, а также получить цифровую версии фото. Следуйте инструкции на экране.
                    </p>
                    <div className={styles.priceWrap}>
                        <div className={styles.priceLabel}>Сумма к оплате:</div>
                        <div className={styles.price}>{PHOTO_COST}₽</div>
                    </div>
                    <Button fullWidth onClick={handlePayment} className={styles.button}>
                        Оплатить
                    </Button>
                    <Button
                        theme={'lightgreen'}
                        fullWidth
                        onClick={() => {
                            navigate('/controller/photo');
                        }}
                        className={styles.button}
                    >
                        Назад
                    </Button>
                </div>
            </div>

            <AlertModal
                isOpen={alertState == 'success' || alertState === 'failed'}
                isError={alertState === 'failed'}
                onClose={() => setAlertState('none')}
                onSuccess={() => navigate('/controller/qr')}
                onError={async () => {
                    await sendEvent({ action: 'exit' });
                    navigate('/controller');
                }}
            />

            <Modal isOpen={showKeyboard} onClose={() => setShowKeyboard(false)}>
                <div className={styles.modalBody}>
                    <h3>Введите пароль</h3>
                    <input type={'password'} ref={inputRef} placeholder={'Пароль'} />
                    <Keyboard inputRef={inputRef} onEnter={handlePasswordSubmit} variant={'num'} />
                    <Button onClick={handlePasswordSubmit}>Отправить</Button>
                </div>
            </Modal>

            <Modal isOpen={alertState === 'pending'}>
                <div className={styles.modalBody}>
                    <h3>Произведите оплату</h3>
                    <p>
                        Для получения фото необходимо произвести оплату. После оплаты вы сможете забрать напечатанную
                        фотографию, а также получить цифровую версии фото. Следуйте инструкции на экране.
                    </p>
                </div>
            </Modal>
        </>
    );
};
