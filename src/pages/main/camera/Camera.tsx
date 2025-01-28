import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { sendEvent, sendUserFace } from '@/shared/api';
import Person from '@/shared/assets/icons/person.svg?react';
import { cameraSound, DEVICE_ID } from '@/shared/consts';
import { useSSE } from '@/shared/hooks';
import { ICostume, IScene, TSSEActions } from '@/shared/types';
import { Loader, Timer } from '@/shared/ui';

import styles from './Camera.module.scss';

export const Camera = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const scene = location.state as IScene;

    useSSE<{ action: TSSEActions; payload: ICostume }>({
        onMessage: (data) => {
            if (data.action === 'back') {
                navigate('/costume', { state: data.payload });
            }
            if (data.action === 'exit') {
                navigate('/');
            }
        },
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const videoHeight = 2160;
        const videoWidth = 3840;

        let animationFrameId: number;

        const drawToCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            const x = (canvas.width - video.videoWidth * scale) / 2;
            const y = (canvas.height - video.videoHeight * scale) / 2;

            ctx.save();
            ctx.translate(canvas.width, 0); // Зеркальное отображение
            ctx.scale(-1, 1);
            ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            ctx.restore();

            animationFrameId = requestAnimationFrame(drawToCanvas);

            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            // const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            // const x = (canvas.width - video.videoWidth * scale) / 2;
            // const y = (canvas.height - video.videoHeight * scale) / 2;
            //
            // ctx.save();
            // ctx.translate(canvas.width, 0); // Зеркальное отображение
            // ctx.scale(-1, 1);
            // ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            // ctx.restore();

            // animationFrameId = requestAnimationFrame(drawToCanvas);

            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            // const scale = Math.max(canvas.width / video.videoHeight, canvas.height / video.videoWidth);
            // const x = (canvas.width - video.videoHeight * scale) / 2;
            // const y = (canvas.height - video.videoWidth * scale) / 2;
            //
            // ctx.save();
            // ctx.translate(canvas.width / 2, canvas.height / 2);
            // ctx.rotate(-Math.PI / 2);
            // ctx.translate(-canvas.height / 2, -canvas.width / 2);
            // ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            // ctx.restore();
            //
            // animationFrameId = requestAnimationFrame(drawToCanvas);
        };

        const handleStream = (stream: MediaStream) => {
            const video = videoRef.current;
            if (!video) return;

            video.srcObject = stream;

            video.onloadedmetadata = () => {
                video
                    .play()
                    .then(() => {
                        drawToCanvas();
                        setShowTimer(true);
                    })
                    .catch((err) => console.error('Error playing video:', err));
            };
        };

        navigator.mediaDevices
            ?.getUserMedia({
                video: {
                    width: { ideal: videoWidth },
                    height: { ideal: videoHeight },
                    deviceId: DEVICE_ID,
                },
                audio: false,
            })
            .then(handleStream)
            .catch((err) => console.error('Error accessing camera:', err));

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (video.srcObject) {
                (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const createPhoto = (): Promise<File | undefined> => {
        const canvas = canvasRef.current;
        if (!canvas) return Promise.resolve(undefined);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    cameraSound.play();
                    setShowFlash(true);
                    const timerId = setTimeout(() => {
                        setShowFlash(false);
                        const photo = new File([blob], 'photo.png', { type: 'image/png' });
                        clearTimeout(timerId);
                        resolve(photo);
                    }, 200);
                } else {
                    console.error('Failed to create blob from canvas.');
                    resolve(undefined);
                }
            }, 'image/png');
        });
    };

    const handleTimerEnd = async () => {
        try {
            const photo = await createPhoto();
            setShowTimer(false);
            videoRef.current?.pause();
            if (photo) {
                await sendEvent({ action: 'photoLoading' });
                setIsLoading(true);
                const { faceSwapPhotoId } = await sendUserFace({ userFaceImage: photo, sceneId: scene.id });
                await sendEvent({ action: 'photoCreated', payload: faceSwapPhotoId });
                navigate('/result', { state: faceSwapPhotoId });
            }
        } catch (error) {
            console.error(error);
            await sendEvent({ action: 'photoError' });
        }
    };

    return (
        <div className={styles.camera}>
            <h2 className={styles.title}>Встаньте в область</h2>
            <canvas ref={canvasRef} width={2160} height={3840} />
            <video ref={videoRef} style={{ display: 'none' }} />
            {showFlash && <div className={styles.flash} />}
            <Person className={styles.person} />
            {showTimer && <Timer time={5} onEnd={handleTimerEnd} className={styles.timer} />}
            <Loader isLoading={isLoading} title={'Пожалуйста,подождите...'} variant={'main'} />
        </div>
    );
};
