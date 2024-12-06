import { motion } from 'framer-motion';
import { FC, MutableRefObject } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { API_URL } from '@/shared/consts';
import { ICostume } from '@/shared/types';

import styles from './ChoiceCostume.module.scss';

interface ICostumeSliderProps {
    costumes: ICostume[];
    onSlideChange: (swiper: SwiperType) => void;
    swiperRef: MutableRefObject<SwiperType | null>;
    currentSlide: number;
}

export const CostumeSlider: FC<ICostumeSliderProps> = ({ costumes, onSlideChange, swiperRef, currentSlide }) => {
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={24}
            centeredSlides
            loop={costumes.length >= 4}
            onSlideChange={onSlideChange}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            initialSlide={currentSlide}
        >
            {costumes.map((costume, index) => {
                return (
                    <SwiperSlide key={costume.id} className={styles.slide}>
                        <motion.img
                            initial={false}
                            animate={{ scale: currentSlide === index ? 1 : 0.55 }}
                            src={`${API_URL}${costume.image}`}
                            alt={costume.title}
                            draggable={false}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};
