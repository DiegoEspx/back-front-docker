import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCube,
  FaColumns,
  FaMicrophone,
  FaShapes,
  FaCalculator,
  FaRuler,
  FaKey,
  FaMouse,
  FaList,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { clearToken, getToken } from "../services/session";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome /> },
  { label: "Three.js Demo", route: "/three", icon: <FaCube /> },
  { label: "Responsive Layouts", route: "/layouts", icon: <FaColumns /> },
  { label: "Text-to-Speech", route: "/tts", icon: <FaMicrophone /> },
  { label: "Figuras Geométricas", route: "/three_2", icon: <FaShapes /> },
];

const exerciseItems: SidebarItem[] = [
  { label: "Tablas de Multiplicar", route: "/tablasmul", icon: <FaCalculator /> },
  { label: "Conversor de Unidades", route: "/conversorunid", icon: <FaRuler /> },
  { label: "Validador de Contraseñas", route: "/validcontrasena", icon: <FaKey /> },
  { label: "Contador de Clics con Almacenamiento", route: "/contadorclics", icon: <FaMouse /> },
  { label: "Lista de Tareas", route: "/listareas", icon: <FaList /> },
  { label: "Login (API)", route: "/api/login", icon: <FaKey /> },
  { label: "Productos (API)", route: "/api/products", icon: <FaShoppingCart /> },
  { label: "Categorías (API)", route: "/api/categories", icon: <FaList /> },
  { label: "Perfil (API)", route: "/api/profile", icon: <FaUser /> },
  { label: "Nuevos productos", route: "api/products/newProduct", icon: <FaUser /> },
  { label: "Mis ordenes", route: "/api/myOrders", icon: <FaUser /> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Detecta si hay token
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate("/api/login");
  };

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
         hover:bg-slate-50 dark:hover:bg-slate-800 
         ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}`
      }
    >
      <div className="flex items-center gap-2">
        {icon} {label}
      </div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-3 space-y-1">
        {/* Acordeón Main Items */}
        <button
          onClick={() => setOpenMain(!openMain)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Menú Principal
          <span>{openMain ? "▲" : "▼"}</span>
        </button>
        {openMain && <div className="pl-4 space-y-1">{mainItems.map(renderNavItem)}</div>}

        {/* Acordeón Ejercicios */}
        <button
          onClick={() => setOpenExercises(!openExercises)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Ejercicios - Jtest
          <span>{openExercises ? "▲" : "▼"}</span>
        </button>
        {openExercises && <div className="pl-4 space-y-1">{exerciseItems.map(renderNavItem)}</div>}

        {/* --- Botón de Cerrar Sesión --- */}
        {isLoggedIn && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center rounded-lg px-3 py-2 bg-red-100 text-red-700 
                         hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition"
            >
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
