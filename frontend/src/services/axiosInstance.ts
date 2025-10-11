import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const axiosInstance = axios.create({
    baseURL : "http://192.168.100.38:5000/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;