import { createBrowserRouter } from 'react-router-dom';

import {
    ChoiceCostume,
    ChoiceScene,
    ControllerPage,
    ControllerScreensaver,
    Payment,
    Photo,
    Qr,
} from '@/pages/controller';
import { Camera, Costume, MainPage, MainScreensaver, Result } from '@/pages/main';
import { INACTIVITY_TIMEOUT } from '@/shared/consts';
import { InactivityHandler } from '@/shared/handlers';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        children: [
            {
                path: '',
                element: <MainScreensaver />,
            },
            {
                path: 'costume',
                element: <Costume />,
            },
            {
                path: 'camera',
                element: <Camera />,
            },
            {
                path: 'result',
                element: <Result />,
            },
        ],
    },
    {
        path: '/controller',
        element: <ControllerPage />,
        children: [
            {
                path: '',
                element: <ControllerScreensaver />,
            },
            {
                path: 'choice-costume',
                element: (
                    <InactivityHandler timeout={INACTIVITY_TIMEOUT}>
                        <ChoiceCostume />
                    </InactivityHandler>
                ),
            },
            {
                path: 'choice-scene',
                element: (
                    <InactivityHandler timeout={INACTIVITY_TIMEOUT}>
                        <ChoiceScene />
                    </InactivityHandler>
                ),
            },
            {
                path: 'photo',
                element: (
                    <InactivityHandler timeout={INACTIVITY_TIMEOUT}>
                        <Photo />
                    </InactivityHandler>
                ),
            },
            {
                path: 'payment',
                element: (
                    <InactivityHandler timeout={INACTIVITY_TIMEOUT}>
                        <Payment />
                    </InactivityHandler>
                ),
            },
            {
                path: 'qr',
                element: (
                    <InactivityHandler timeout={INACTIVITY_TIMEOUT}>
                        <Qr />
                    </InactivityHandler>
                ),
            },
        ],
    },
]);
