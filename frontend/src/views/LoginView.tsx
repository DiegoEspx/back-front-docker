import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/auth';
import { setToken, getToken, clearToken } from '../services/session';

export default function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasToken = Boolean(getToken());

  const onLogout = () => {
    clearToken();
    navigate('/api/login', { replace: true });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(email, password);
      setToken(data.access_token);
      navigate('/api/products');
    } catch (err: any) {
      setError(err?.status === 401 ? 'Credenciales inválidas' : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-slate-800 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Login (API)</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
                className="w-full px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <div className="mt-6 p-2 text-xs bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
        <strong>Credenciales de prueba:</strong>
        <div className="mt-2">
          <div className="font-semibold text-blue-600 dark:text-blue-400">👨‍💼 Administrador:</div>
          <div>Email: <span className="font-mono">admin@mail.com</span></div>
          <div>Password: <span className="font-mono">admin123</span></div>
        </div>
        <div className="mt-2">
          <div className="font-semibold text-green-600 dark:text-green-400">🛍 Cliente:</div>
          <div>Email: <span className="font-mono">customer@mail.com</span></div>
          <div>Password: <span className="font-mono">customer123</span></div>
        </div>
      </div>
    </div>
  );
}