// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import ProductsView from "../views/ProductsView";
import ProductDetailView from "../views/ProductDetailView"; // <-- NUEVO
import NewProductView from "../views/NewProductView"; // <-- opcional (admin)
import MyOrdersView from "../views/MyOrdersView"; // <-- opcional
import LoginView from "../views/LoginView";
import HomePage from "../views/HomePage";
import ThreeDemoView from "../views/ThreeDemoView";
import LayoutsView from "../views/LayoutsView";
import SpeechDemoView from "../views/SpeechDemoView";
import GeometryExplorer from "../views/GeometryExplorer";
import SettingsView from "../views/SettingsView";
import TablasMul from "../views/TablasMul";
import ConversorUnid from "../views/ConversorUnid";
import ValidContrasena from "../views/ValidContrasena";
import ContadorClics from "../views/ContadorClics";
import ListaTareas from "../views/ListaTareas";
import CategoriesView from "../views/Categories";
import ProfileView from "../views/Profile";
import { Protected } from "./protected"; // ¡ojo a la P mayúscula!

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="three" element={<ThreeDemoView />} />
        <Route path="layouts" element={<LayoutsView />} />
        <Route path="tts" element={<SpeechDemoView />} />
        <Route path="three_2" element={<GeometryExplorer />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="tablasmul" element={<TablasMul />} />
        <Route path="conversorunid" element={<ConversorUnid />} />
        <Route path="validcontrasena" element={<ValidContrasena />} />
        <Route path="contadorclics" element={<ContadorClics />} />
        <Route path="listareas" element={<ListaTareas />} />

        {/* públicas */}
        <Route path="api/login" element={<LoginView />} />

        {/* protegidas */}
        <Route
          path="api/products"
          element={
            <Protected>
              <ProductsView />
            </Protected>
          }
        />

        {/* --- PON ESTA ESTÁTICA ANTES DE :id --- */}
        <Route
          path="api/products/newProduct"
          element={
            <Protected>
              <NewProductView />
            </Protected>
          }
        />

        {/* --- LUEGO LA DINÁMICA --- */}
        <Route
          path="api/products/:id"
          element={
            <Protected>
              <ProductDetailView />
            </Protected>
          }
        />
        <Route
          path="api/categories"
          element={
            <Protected>
              <CategoriesView />
            </Protected>
          }
        />
        <Route
          path="api/profile"
          element={
            <Protected>
              <ProfileView />
            </Protected>
          }
        />
        <Route
          path="api/myOrders" // <-- opcional (mis órdenes)
          element={
            <Protected>
              <MyOrdersView />
            </Protected>
          }
        />
      </Route>
    </Routes>
  );
}
