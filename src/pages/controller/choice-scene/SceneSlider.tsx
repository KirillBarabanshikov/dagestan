import { motion } from 'framer-motion';
import { FC, MutableRefObject } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { API_URL } from '@/shared/consts';
import { IScene } from '@/shared/types';

import styles from './ChoiceScene.module.scss';

interface ISceneSliderProps {
    scenes: IScene[];
    onSlideChange: (swiper: SwiperType) => void;
    swiperRef: MutableRefObject<SwiperType | null>;
    currentSlide: number;
    handleSelect: (index: number) => void;
}

export const SceneSlider: FC<ISceneSliderProps> = ({
    scenes,
    onSlideChange,
    swiperRef,
    currentSlide,
    handleSelect,
}) => {
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={24}
            centeredSlides
            loop={scenes.length >= 4}
            onSlideChange={onSlideChange}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
            {scenes.map((scene, index) => {
                return (
                    <SwiperSlide key={scene.id} className={styles.slide}>
                        <motion.img
                            initial={false}
                            animate={{ scale: currentSlide === index ? 1 : 0.55 }}
                            src={API_URL + scene.image}
                            alt={'scene'}
                            draggable={false}
                            transition={{ damping: 0 }}
                            onClick={() => handleSelect(index)}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};
