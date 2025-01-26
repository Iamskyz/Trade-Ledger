import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminAddProduct from "../pages/AdminAddProduct";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Define admin routes within AdminLayout */}
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-product" element={<AdminAddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
        <Outlet /> {/* Fallback for future nested routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
