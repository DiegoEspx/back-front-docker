import { request } from './http';

// Lista productos (público o protegido, según tu backend)
export const listProducts = (q?: Record<string, string | number>) => {
  const qs = q ? '?' + new URLSearchParams(q as any).toString() : '';
  return request('/products' + qs);
};

// Detalle de producto
export const getProduct = (id: number) => request(`/products/${id}`);

// Crear producto (admin) — COINCIDE con tu Joi
export const createProduct = (dto: {
  name: string;
  price: number;
  description: string;
  image: string;      // URI (string), ¡no array!
  categoryId: number;
}) =>
  request('/products', { method: 'POST', body: dto, auth: true });
