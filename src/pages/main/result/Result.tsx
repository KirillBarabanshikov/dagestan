import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchFaceSwapPhoto } from '@/shared/api';
import { API_URL } from '@/shared/consts';
import { useSSE } from '@/shared/hooks';
import { TSSEActions } from '@/shared/types';
import { Button, PhotoPreview } from '@/shared/ui';

import styles from './Result.module.scss';

export const Result = () => {
    const [isPayed, setIsPayed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state as number;

    useSSE<{ action: TSSEActions; payload: any }>({
        onMessage: (data) => {
            if (data.action === 'retry') {
                navigate('/costume', { state: data.payload });
            }
            if (data.action === 'exit') {
                navigate('/');
            }
            if (data.action === 'payed') {
                setIsPayed(true);
            }
        },
    });

    const { data: photo } = useQuery({
        queryKey: ['photo', id],
        queryFn: () => fetchFaceSwapPhoto(id),
        enabled: !!id,
    });

    if (!photo) return <></>;

    return (
        <div className={styles.result}>
            <PhotoPreview src={API_URL + photo.image} variant={'main'} isPayed={isPayed} />
            {!isPayed && (
                <div className={styles.buttons}>
                    <Button size={'lg'} theme={'blur'}>
                        Сохранить и напечатать
                    </Button>
                    <Button size={'lg'} theme={'blur'}>
                        повторить
                    </Button>
                </div>
            )}
        </div>
    );
};
