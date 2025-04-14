import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchFaceSwapPhoto, sendEvent } from '@/shared/api';
import { API_URL } from '@/shared/consts';
import { useControllerStore } from '@/shared/store';
import { Button, PhotoPreview } from '@/shared/ui';

import styles from './Photo.module.scss';

export const Photo = () => {
    const navigate = useNavigate();
    const { costume, setScene, faceSwapId, setFaceSwapId } = useControllerStore((state) => state);

    const { data: photo } = useQuery({
        queryKey: ['photo', faceSwapId],
        queryFn: () => fetchFaceSwapPhoto(faceSwapId!),
        enabled: !!faceSwapId,
    });

    const handleRetry = async () => {
        try {
            await sendEvent({ action: 'retry', payload: costume });
            setScene(undefined);
            setFaceSwapId(undefined);
            navigate('/controller/choice-costume');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.photo}>
            <div className={styles.wrap}>
                <h2>Ваша фотография</h2>
                <p>
                    Вы можете сохранить фото и перейти к оплате чтобы получить полноцветную версию, или попробовать ещё
                    раз
                </p>
                <div className={styles.buttons}>
                    <Button onClick={() => navigate('/controller/payment', { state: API_URL + photo?.imagePrint })}>
                        сохранить и напечатать
                    </Button>
                    <Button onClick={handleRetry}>повторить</Button>
                </div>
            </div>
            {photo && <PhotoPreview src={API_URL + photo.image} variant={'controller'} />}
        </div>
    );
};
