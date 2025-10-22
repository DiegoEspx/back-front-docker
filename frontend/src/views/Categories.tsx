// src/views/CategoriesView.tsx
import React, { useEffect, useState } from "react";
import { listCategories } from "../services/categories"; // asumo que lo tienes
import { getToken } from "../services/session";
import ClickCounter from "../components/ClickCounter";

type Category = {
  id: number;
  name: string;
  image?: string;
};

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Necesitas iniciar sesión para ver categorías");
      return;
    }

    setLoading(true);
    listCategories()
      .then((data) => {
        setCategories(data as Category[]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.data?.message ?? "Error al cargar categorías");
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>

        {loading && <p>Cargando categorías…</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{cat.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CategoriesView;
