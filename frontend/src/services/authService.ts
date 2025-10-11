import axiosInstance from './axiosInstance';
import { setToken, clearToken } from '../utils/tokenUtils';

export const login = async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const token = response.data.access_token;
    if (token) {
        setToken(token);
    }
    console.log(response.data);
    return response.data;
};

export const register = async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/register', {
        username,
        password,
    });

    const token = response.data.access_token;
    console.log(response.data);
    if (token) {
        setToken(token);
    }

    return response.data;
};

export const logout = () => {
    clearToken();
};

export const getMyProfile = async () => {
    const response = await axiosInstance.get('/user/me');
    return response.data;
};