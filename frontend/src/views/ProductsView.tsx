import { useEffect, useState } from 'react';
import { listProducts } from '../services/products';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductsView() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts({ limit, offset: 0 });
      setItems(data);
    } catch (err: any) {
      setError('No se pudo cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Productos (API)</h1>
      <div className="flex items-center gap-2">
        <label className="text-sm">Límite</label>
        <input type="number" value={limit} min={1} onChange={(e) => setLimit(Number(e.target.value))}
               className="w-24 border rounded px-2 py-1 bg-white dark:bg-slate-900" />
        <button onClick={fetchData} className="px-3 py-1.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          Aplicar
        </button>
      </div>
      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No hay resultados.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="border rounded p-3 bg-white dark:bg-slate-800">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium">{p.name}</span>
              <span className="text-emerald-600">${p.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}