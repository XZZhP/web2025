// src/api/showcase.js
import axios from '../utils/request';

export const createShowcase = (data) => {
    return axios.post('/api/showcase', data);
};

export const getShowcases = (params) => {
    return axios.get('/api/showcase', { params });
};

export const likeShowcase = (id) => {
    return axios.post(`/api/showcase/${id}/like`);
};

export const getUserShowcases = (userId) => {
    return axios.get(`/api/showcase/user/${userId}`);
};