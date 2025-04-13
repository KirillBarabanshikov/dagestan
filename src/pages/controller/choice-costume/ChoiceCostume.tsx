import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper as SwiperType } from 'swiper';

import { CostumeSlider } from '@/pages/controller/choice-costume/CostumeSlider.tsx';
import { fetchCostumes, sendChoiceCostume, sendEvent } from '@/shared/api';
import { useControllerStore } from '@/shared/store';
import { Button } from '@/shared/ui';

import styles from './ChoiceCostume.module.scss';

export const ChoiceCostume = () => {
    const swiperRef = useRef<SwiperType | null>(null);
    const navigate = useNavigate();
    const { gender, costume, setCostume, setStatisticId } = useControllerStore((state) => state);
    const [isLoading, setIsLoading] = useState(false);

    const { data: costumes = [] } = useQuery({
        queryKey: ['costumes', gender],
        queryFn: () => fetchCostumes(gender!),
        enabled: !!gender,
    });

    const currentCostume = useMemo(
        () => costumes.find((c) => c.id === costume?.id) || costumes[0],
        [costume, costumes],
    );

    const currentSlide = useMemo(() => {
        const index = costumes.findIndex((c) => c.id === costume?.id);
        return index >= 0 ? index : 0;
    }, [costume, costumes]);

    useEffect(() => {
        const handleEvent = async () => {
            if (currentCostume) {
                try {
                    await sendEvent({ action: 'selectCostume', payload: currentCostume });
                } catch (error) {
                    console.error('Error sending event:', error);
                }
            }
        };

        handleEvent();
    }, [currentCostume]);

    const handleSelect = async () => {
        if (!currentCostume || isLoading) return;

        try {
            setIsLoading(true);
            const statisticId = await sendChoiceCostume(currentCostume.id);
            setStatisticId(statisticId);
            await sendEvent({ action: 'selectCostume', payload: currentCostume });
            setCostume(currentCostume);
            navigate('/controller/choice-scene');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSlideChange = async (swiper: SwiperType) => {
        const newCostume = costumes[swiper.realIndex];
        if (newCostume) setCostume(newCostume);
    };

    const handleBack = async () => {
        try {
            await sendEvent({ action: 'back' });
            navigate('/controller');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.choiceCostume}>
            <div className={styles.titleWrap}>
                {currentCostume && <h2>{currentCostume.title}</h2>}
                <Button theme={'lightgreen'} size={'sm'} onClick={handleBack} className={styles.button}>
                    назад
                </Button>
            </div>
            <div className={styles.sliderWrap}>
                <CostumeSlider
                    costumes={costumes}
                    onSlideChange={handleSlideChange}
                    swiperRef={swiperRef}
                    currentSlide={currentSlide}
                    handleSelect={handleSelect}
                />
            </div>
            {!!costumes.length && (
                <div className={styles.buttonsWrap}>
                    <Button theme={'white'} onClick={() => swiperRef.current?.slidePrev()} className={styles.prev}>
                        предыдущий
                    </Button>
                    <Button onClick={handleSelect}>выбрать</Button>
                    <Button theme={'white'} onClick={() => swiperRef.current?.slideNext()} className={styles.next}>
                        следующий
                    </Button>
                </div>
            )}
        </div>
    );
};
