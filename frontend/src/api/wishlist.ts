// src/api/wishlist.js
import axios from '../utils/request';

export const addToWishlist = (userId:number, boxId:number) => {
    return axios.post('/api/wishlist', { userId, boxId });
};

export const removeFromWishlist = (userId:number, boxId:number) => {
    return axios.delete('/api/wishlist', { data:{userId, boxId}});
};

export const getWishlist = (userId) => {
    return axios.get(`/api/wishlist/${userId}`);
};