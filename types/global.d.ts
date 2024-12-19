declare global {
    interface Window {
        API_URL: string;
        SSE_URL: string;
        JWT_TOKEN: string;
        PAYMENT_PASSWORD: string;
        INACTIVITY_TIMEOUT: number;
        DEVICE_ID: string;
        PAYMENT_URL: string;
        PRINT_URL: string;
        PHOTO_COST: number;
    }
}

export {};
