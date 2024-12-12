import { FC } from 'react';

import ErrorIcon from '@/shared/assets/icons/error.svg?react';
import SuccessIcon from '@/shared/assets/icons/success.svg?react';
import { Button, Modal } from '@/shared/ui';

import styles from './AlertModal.module.scss';

interface IAlertModalProps {
    isOpen: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
    onError: () => void;
    isError?: boolean;
    withClose?: boolean;
    title?: string;
    subtitle?: string;
}

export const AlertModal: FC<IAlertModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onError,
    isError,
    withClose = true,
    title,
    subtitle,
}) => {
    return (
        <Modal isOpen={isOpen}>
            <div className={styles.body}>
                {isError ? <ErrorIcon className={styles.icon} /> : <SuccessIcon className={styles.icon} />}
                {title ? <h3>{title}</h3> : <h3>{isError ? 'Произошла ошибка' : 'Оплата прошла успешно'}</h3>}
                {subtitle ? (
                    <p>{subtitle}</p>
                ) : (
                    <p>
                        {isError
                            ? 'Пожалуйста, попробуйте еще раз.'
                            : 'Нажмите продолжить, чтобы получить цифровую версию фото'}
                    </p>
                )}

                <div className={styles.buttons}>
                    {isError ? (
                        <>
                            {withClose && <Button onClick={onClose}>назад</Button>}
                            <Button theme={'lightgreen'} onClick={onError}>
                                на главную
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onSuccess}>продолжить</Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
