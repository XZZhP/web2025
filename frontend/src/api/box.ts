// src/api/box.ts
import axios from '../utils/request';

interface BoxItem {
    name: string;
    rarity: string;
    image: string;
    probability: number;
}

interface CreateBoxParams {
    name: string;
    description: string;
    price: number;
    stock: number;
    coverImage: string;
    items: BoxItem[];
}

export const createBox = async (boxData: CreateBoxParams) => {
    return axios.post('/api/box', boxData, {
        headers: {
            'Content-Type': 'application/json' // 改为 JSON 格式
        }
    });
};

export const getBoxes = async () => {
    return axios.get('/api/box');
};

export const getBoxDetails = async (id) => {
    return axios.get(`/api/box/${id}`);
}

export const purchaseBox = (data) => {
    return axios.post('/api/box/purchase', data);
};