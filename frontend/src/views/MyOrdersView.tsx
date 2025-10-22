// src/views/MyOrdersView.tsx
import { useEffect, useState } from "react";
import { myOrders } from "../services/orders";

type OrderItem = {
  amount: number;
  price: number;
  product: { title?: string; name?: string };
};
type Order = {
  id: number;
  total?: number;
  createdAt: string;
  items: OrderItem[];
};

export default function MyOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    myOrders()
      .then((data) =>
        setOrders(
          Array.isArray(data)
            ? data.map((o) => ({
                id: o.id,
                total: Number(o.total ?? 0),
                createdAt:
                  o.createdAt ?? o.created_at ?? new Date().toISOString(),
                items: Array.isArray(o.items ?? o.orderItems)
                  ? (o.items ?? o.orderItems)
                  : [],
              }))
            : []
        )
      )
      .catch((e) => setErr(e?.data?.message ?? "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (err) return <p className="text-red-600">{err}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Mis órdenes</h1>
      {orders.length === 0 ? (
        <p>No tienes órdenes registradas.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border rounded p-3 bg-white dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>Orden #{o.id}</div>
                <div className="text-sm text-slate-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 font-semibold">
                Total: ${o.total?.toFixed(2) ?? 0}
              </div>
              <ul className="mt-2 list-disc list-inside text-sm">
                {o.items?.map((it, idx) => (
                  <li key={idx}>
                    {it.product.title ?? it.product.name ?? "Producto"} ×{" "}
                    {it.amount} — ${it.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
