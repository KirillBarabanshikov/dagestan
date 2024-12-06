import { ICostume, TGender, TSSEActions } from '../types';
import { instance } from './instance';

export async function fetchCostumes(gender: TGender) {
    try {
        const response = await instance.get<ICostume[]>(`/costumes?gender=${gender}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch costumes: ${error}`);
    }
}

export async function sendEvent(body: { action: TSSEActions; payload?: any }) {
    try {
        await instance.post('/events', body);
    } catch (error) {
        throw new Error(`Failed to send event: ${error}`);
    }
}

export async function sendChoiceCostume(costumeId: number) {
    try {
        const response = await instance.get<number>(`/statistic/${costumeId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send costume: ${error}`);
    }
}

export async function sendChoiceScene(statisticId: number, sceneId: number) {
    try {
        const response = await instance.get<number>(`/statistic/${statisticId}/scene/${sceneId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send scene: ${error}`);
    }
}

export async function sendStatisticPayed(statisticId: number) {
    try {
        await instance.get<number>(`/statistic/${statisticId}/payed`);
    } catch (error) {
        throw new Error(`Failed to send scene: ${error}`);
    }
}

export async function sendUserFace(body: { userFaceImage: File; sceneId: number }) {
    try {
        const formData = new FormData();
        formData.append('userFaceImage', body.userFaceImage);
        formData.append('sceneId', body.sceneId.toString());

        const response = await instance.post<{ faceSwapPhotoId: number }>('/user_faces', formData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send user face: ${error}`);
    }
}

export async function fetchFaceSwapPhoto(id: number) {
    try {
        const response = await instance.get<{ id: number; image: string }>(`/face_swap_photos/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch swap photo: ${error}`);
    }
}

export async function fetchQr(id: number) {
    try {
        const response = await instance.post<string>('/qr', { faceSwapsId: [id] });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch qr: ${error}`);
    }
}
