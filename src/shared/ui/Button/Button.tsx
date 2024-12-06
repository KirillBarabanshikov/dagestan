import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC } from 'react';

import { clickSound } from '@/shared/consts';

import styles from './Button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: 'green' | 'lightgreen' | 'white' | 'blur';
    size?: 'default' | 'sm' | 'lg';
    fullWidth?: boolean;
}

export const Button: FC<IButtonProps> = ({
    theme = 'green',
    size = 'default',
    fullWidth = false,
    className,
    children,
    onClick,
    ...props
}) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!clickSound.playing()) clickSound.play();
        onClick && onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(styles.button, styles[theme], styles[size], fullWidth && styles.fullWidth, className)}
            {...props}
        >
            {children}
        </button>
    );
};
