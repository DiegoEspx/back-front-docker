import { request } from './http';

// Mis órdenes (usuario autenticado)
export const myOrders = () =>
  request('/profile/my-orders', { auth: true });

// (si además usas estos)
export const createOrder = (customerId: number) =>
  request('/orders', { method: 'POST', body: { customerId }, auth: true });

export const addItemToOrder = (dto: { orderId: number; productId: number; amount: number }) =>
  request('/orders/add-item', { method: 'POST', body: dto, auth: true });

// Admin (opcional)
export const listAllOrders = () => request('/orders', { auth: true });
export const listOrdersByUser = (userId: number) =>
  request(`/orders/by-user/${userId}`, { auth: true });
