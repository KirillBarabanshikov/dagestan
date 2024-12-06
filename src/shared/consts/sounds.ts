import { Howl } from 'howler';

export const clickSound = new Howl({
    src: ['/click.mp3'],
    volume: 1,
});

export const cameraSound = new Howl({
    src: ['/zvuk-zatvora.mp3'],
    volume: 1,
});
