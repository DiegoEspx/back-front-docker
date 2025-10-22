import { useState } from 'react';
import { createProduct } from '../services/products';

export default function NewProductView() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // Validaciones mínimas alineadas con Joi
    if (name.trim().length < 3) return setMsg('El nombre debe tener al menos 3 caracteres');
    if (!Number.isInteger(price) || price < 10) return setMsg('El precio debe ser entero y >= 10');
    if (description.trim().length < 10) return setMsg('La descripción debe tener al menos 10 caracteres');
    if (!/^https?:\/\//i.test(image.trim())) return setMsg('La imagen debe ser una URL válida (http/https)');
    if (!Number.isInteger(categoryId) || categoryId <= 0) return setMsg('categoryId debe ser un entero válido');

    setSending(true);
    try {
      const dto = {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image: image.trim(),     // string (uri), NO array
        categoryId: Number(categoryId),
      };
      const created = await createProduct(dto);
      setMsg(`✅ Producto creado (id: ${created?.id ?? '—'})`);
      setName(''); setPrice(10); setCategoryId(1); setImage(''); setDescription('');
    } catch (e: any) {
      setMsg(e?.data?.message ?? '❌ Error al crear (¿token/rol admin? ¿payload Joi?)');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-lg">
      <h1 className="text-xl font-semibold">Nuevo producto (admin)</h1>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Nombre (min 3, max 15)"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="w-full border rounded px-3 py-2"
        type="number"
        placeholder="Precio (entero ≥ 10)"
        value={price}
        min={10}
        step={1}
        onChange={e => setPrice(Number(e.target.value))}
      />

      <input
        className="w-full border rounded px-3 py-2"
        type="number"
        placeholder="Category ID (entero)"
        value={categoryId}
        min={1}
        step={1}
        onChange={e => setCategoryId(Number(e.target.value))}
      />

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="URL de imagen (http/https)"
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Descripción (min 10 chars)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button
        disabled={sending}
        className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {sending ? 'Enviando…' : 'Crear'}
      </button>

      {msg && <p className="text-sm mt-1">{msg}</p>}
    </form>
  );
}
