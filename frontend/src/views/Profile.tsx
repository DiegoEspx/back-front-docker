// src/views/ProfileView.tsx
import React, { useEffect, useState } from "react";
import { getMe, getMyOrders } from "../services/profile";
import { clearToken, getToken } from "../services/session";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  name?: string;
  role: string;
};

type OrderItem = {
  productId: number;
  amount: number;
  price: number;
  product: { title: string };
};

type Order = {
  id: number;
  total?: number;
  items: OrderItem[];
  createdAt: string;
};

const ProfileView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/api/login", { replace: true });
      return;
    }

    // ProfileView.tsx (dentro del useEffect)
    Promise.all([getMe(), getMyOrders()])
      .then(([u, os]) => {
        const norm = Array.isArray(os) ? os.map(normalizeOrder) : [];
        setUser(u as User);
        setOrders(norm as Order[]);
      })
      .catch((err) => {
        clearToken();
        setError("Sesión inválida. Por favor, ingresa de nuevo.");
        navigate("/api/login", { replace: true });
      });

    // Fuera del componente o arriba:
    function normalizeOrder(o: any): Order {
      const rawItems = o.items ?? o.orderItems ?? o.OrderItems ?? []; // si no viene, queda []

      return {
        id: o.id,
        total: Number(o.total ?? 0),
        createdAt: o.createdAt ?? o.created_at ?? new Date().toISOString(),
        items: rawItems.map((it: any) => ({
          productId: it.productId ?? it.product_id,
          amount: it.amount,
          price: it.price,
          product: {
            title:
              it.product?.title ??
              it.product?.name ??
              it.title ??
              it.name ??
              "Producto",
          },
        })),
      };
    }
  }, [navigate]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Cargando perfil…</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Mis Órdenes</h3>
        {orders.length === 0 ? (
          <p>No has realizado órdenes aún.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="border rounded-lg p-4 shadow-sm">
                <p>
                  <strong>Orden #:</strong> {o.id}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(o.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ${o.total?.toFixed(2)}
                </p>
                <div className="mt-2">
                  <p className="font-semibold">Ítems:</p>
                  <ul className="list-disc list-inside ml-4">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        {it.product.title} × {it.amount} — ${it.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfileView;
