import { useEffect, useMemo, useState } from "react";
import { listProducts, createProduct } from "../services/products";
import { addItemToOrder, createOrder } from "../services/orders";
import { Link } from "react-router-dom";
import { getMe } from "../services/profile";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Selected = Record<number, { product: Product; quantity: number }>;

export default function ProductsView() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);

  // selección local
  const [selected, setSelected] = useState<Selected>({});
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts({ limit, offset: 0 });
      setItems(data);
    } catch (_err: any) {
      setError("No se pudo cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers de selección
  const addOne = (p: Product) => {
    setSelected((prev) => {
      const cur = prev[p.id]?.quantity ?? 0;
      return { ...prev, [p.id]: { product: p, quantity: cur + 1 } };
    });
  };

  const decOne = (p: Product) => {
    setSelected((prev) => {
      const cur = prev[p.id]?.quantity ?? 0;
      if (cur <= 1) {
        const { [p.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [p.id]: { product: p, quantity: cur - 1 } };
    });
  };

  const setQty = (p: Product, q: number) => {
    const qty = Math.max(1, Math.floor(q || 1));
    setSelected((prev) => ({ ...prev, [p.id]: { product: p, quantity: qty } }));
  };

  const removeSel = (id: number) => {
    setSelected((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearSel = () => setSelected({});

  const totalItems = useMemo(
    () => Object.values(selected).reduce((acc, s) => acc + s.quantity, 0),
    [selected]
  );

  const totalPrice = useMemo(
    () =>
      Object.values(selected).reduce(
        (acc, s) => acc + s.quantity * s.product.price,
        0
      ),
    [selected]
  );

  const submitOrder = async () => {
    if (!totalItems) return;
    setSending(true);
    setMsg(null);

    try {
      // 1) Obtener customerId del usuario autenticado
      const me = await getMe();
      const customerId: number | undefined = me?.customer?.id;
      if (!customerId)
        throw {
          data: { message: "No se encontró customerId para el usuario." },
        };

      // 2) Crear orden vacía
      const order = await createOrder(customerId); // { id, customerId, ... }
      const orderId = order.id;

      // 3) Agregar cada item (amount, no quantity)
      const items = Object.values(selected).map((s) => ({
        orderId,
        productId: s.product.id,
        amount: s.quantity,
      }));
      await Promise.all(items.map(addItemToOrder));

      clearSel();
      setMsg(`✅ Orden #${orderId} creada con éxito`);
    } catch (e: any) {
      setMsg(e?.data?.message ?? "❌ Error al crear la orden");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Productos disponibles</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Seleccione productos para ordenar y registrar su solicitud.
      </p>

      <div className="flex items-center gap-2">
        <label className="text-sm">Límite</label>
        <input
          type="number"
          value={limit}
          min={1}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-24 border rounded px-2 py-1 bg-white dark:bg-slate-900"
        />
        <button
          onClick={fetchData}
          className="px-3 py-1.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Aplicar
        </button>
      </div>

      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No hay resultados.</p>}

      {/* Grilla de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => {
          const sel = selected[p.id];
          return (
            <div
              key={p.id}
              className="border rounded p-3 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition"
            >
              <Link to={`/api/products/${p.id}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />
              </Link>

              <div className="mt-2 flex items-center justify-between">
                <Link
                  to={`/api/products/${p.id}`}
                  className="font-medium hover:underline"
                >
                  {p.name}
                </Link>
                <span className="text-emerald-600 font-semibold">
                  ${p.price}
                </span>
              </div>

              {/* Controles de selección */}
              {!sel ? (
                <button
                  onClick={() => addOne(p)}
                  className="mt-3 w-full rounded bg-emerald-600 hover:bg-emerald-700 text-white py-1.5"
                >
                  Agregar
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => decOne(p)}
                    className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="w-20 border rounded px-2 py-1 bg-white dark:bg-slate-900 text-center"
                    value={sel.quantity}
                    min={1}
                    onChange={(e) => setQty(p, Number(e.target.value))}
                  />
                  <button
                    onClick={() => addOne(p)}
                    className="px-2 py-1 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeSel(p.id)}
                    className="ml-auto px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Quitar
                  </button>
                </div>
              )}

              {/* Enlace de detalle */}
              <Link
                to={`/api/products/${p.id}`}
                className="mt-3 block text-sm text-slate-700 dark:text-slate-300 hover:underline"
              >
                Ver detalles →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Barra inferior resumen */}
      <div className="sticky bottom-4 left-0 right-0">
        {totalItems > 0 && (
          <div className="mx-auto max-w-3xl border rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 shadow-lg flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">Seleccionados: {totalItems}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Total: ${totalPrice.toFixed(2)}
              </div>
            </div>
            <button
              onClick={submitOrder}
              disabled={sending}
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {sending ? "Enviando…" : "Registrar orden"}
            </button>
            <button
              onClick={clearSel}
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Vaciar
            </button>
          </div>
        )}
      </div>

      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
