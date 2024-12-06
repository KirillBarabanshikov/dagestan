import clsx from 'clsx';
import { FC } from 'react';

import styles from './PhotoPreview.module.scss';

interface IPhotoPreviewProps {
    src: string;
    variant: 'main' | 'controller';
    isPayed?: boolean;
}

export const PhotoPreview: FC<IPhotoPreviewProps> = ({ src, variant, isPayed }) => {
    return (
        <img src={src} alt={'preview'} className={clsx(styles.preview, isPayed && styles.isPayed, styles[variant])} />
    );
};
