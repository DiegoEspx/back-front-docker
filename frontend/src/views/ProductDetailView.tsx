// src/views/ProductDetailView.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/products';

type Product = {
  id: number;
  name?: string;
  title?: string;
  price: number;
  image?: string;
  description?: string;
};

export default function ProductDetailView() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const pid = Number(id);
    if (Number.isNaN(pid)) { setErr('ID inválido'); setLoading(false); return; }
    getProduct(pid)
      .then(setP)
      .catch(() => setErr('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!p) return <p>No encontrado.</p>;

  const title = p.name ?? p.title ?? `Producto #${p.id}`;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{title}</h1>
      {p.image && <img src={p.image} alt={title} className="w-full max-w-lg rounded" />}
      <div className="text-emerald-600 font-medium">${p.price}</div>
      {p.description && <p className="text-slate-600">{p.description}</p>}
    </div>
  );
}
