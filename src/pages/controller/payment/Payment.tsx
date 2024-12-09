import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { sendEvent, sendStatisticPayed } from '@/shared/api';
import { PAYMENT_PASSWORD, PAYMENT_URL, PHOTO_COST } from '@/shared/consts';
import { useControllerStore } from '@/shared/store';
import { AlertModal, Button, Keyboard, Modal, SecretButton } from '@/shared/ui';

import styles from './Payment.module.scss';

export const Payment = () => {
    const [alertState, setAlertState] = useState<'none' | 'success' | 'failed' | 'pending'>('none');
    const [showKeyboard, setShowKeyboard] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const statisticId = useControllerStore((state) => state.statisticId);

    const paymentEvent = async () => {
        const data = [
            {
                title: 'Фото в телеграм',
                count: 1,
                price: PHOTO_COST,
            },
        ];
        try {
            setAlertState('pending');
            const response = await axios.post<{ result: string }>(PAYMENT_URL, data, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            if (response.data.result === 'success') {
                if (statisticId) {
                    await sendStatisticPayed(statisticId);
                }
                await sendEvent({ action: 'payed' });
                setAlertState('success');
            } else {
                setAlertState('failed');
            }
        } catch (error) {
            console.error(error);
            setAlertState('failed');
        }
    };

    const onSubmit = () => {
        if (!inputRef.current) return;
        if (inputRef.current.value === PAYMENT_PASSWORD) {
            setAlertState('success');
            setShowKeyboard(false);
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
                    <Button fullWidth onClick={paymentEvent} className={styles.button}>
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
                    <Keyboard inputRef={inputRef} onEnter={onSubmit} />
                    <Button onClick={onSubmit}>Отправить</Button>
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
