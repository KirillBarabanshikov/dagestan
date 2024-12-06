import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';

import styles from './SecretButton.module.scss';

interface ISecretButtonProps {
    onSecretAction: () => void;
    className?: string;
}

export const SecretButton: FC<ISecretButtonProps> = ({ onSecretAction, className }) => {
    const [clickCount, setClickCount] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleSecretAction = () => {
        setClickCount(0);
        onSecretAction();
    };

    const handleClick = () => {
        setClickCount((prev) => prev + 1);

        if (timer) clearTimeout(timer);

        setTimer(setTimeout(() => setClickCount(0), 2000));
    };

    useEffect(() => {
        if (clickCount === 3) {
            handleSecretAction();
        }
    }, [clickCount]);

    return <div className={clsx(styles.secretButton, className)} onClick={handleClick} />;
};
