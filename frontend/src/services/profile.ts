import { request } from './http';
export const getMe = () => request('/profile/my-user', { auth: true });
export const getMyOrders = () => request('/profile/my-orders', { auth: true });