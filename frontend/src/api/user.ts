// src/api/user.js
import axios from '../utils/request'


export const getUserItems = (userId) => {
    return axios.get(`api/user/items/${userId}`);
};