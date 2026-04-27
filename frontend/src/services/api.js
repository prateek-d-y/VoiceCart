import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getActiveCalls = () => api.get('/calls/active');
export const endCall = (id) => api.post(`/calls/${id}/end`);
export const lookupUser = (phone) => api.get(`/users/lookup?phone=${encodeURIComponent(phone)}`);
export const createUser = (userData) => api.post('/users', userData);
export const getProducts = () => api.get('/products');
export const placeOrder = (orderData) => api.post('/orders', orderData);

export default api;
