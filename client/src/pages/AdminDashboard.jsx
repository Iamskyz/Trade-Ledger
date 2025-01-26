import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch Dashboard Summary
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        setError("Failed to fetch dashboard summary.");
      }
    };

    // Fetch Order Status Breakdown
    const fetchOrderStatuses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard/orders/status",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order statuses");
        }
        const data = await response.json();
        setOrderStatuses(data);
      } catch (err) {
        console.error("Error fetching order statuses:", err);
        setError("Failed to fetch order statuses.");
      }
    };

    // Fetch Recent Orders
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard/orders/recent",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recent orders");
        }
        const data = await response.json();
        setRecentOrders(data);
      } catch (err) {
        console.error("Error fetching recent orders:", err);
        setError("Failed to fetch recent orders.");
      }
    };

    // Fetch Low Stock Products
    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard/products/low-stock",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch low-stock products");
        }
        const data = await response.json();
        setLowStockProducts(data);
      } catch (err) {
        console.error("Error fetching low-stock products:", err);
        setError("Failed to fetch low-stock products.");
      }
    };

    fetchSummary();
    fetchOrderStatuses();
    fetchRecentOrders();
    fetchLowStockProducts();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <AdminSidebar />
      <main className="dashboard-content">
        <h2>Welcome to the Admin Dashboard</h2>

        {/* Error Display */}
        {error && <p className="error-message">{error}</p>}

        {/* Summary Section */}
        <div className="dashboard-widgets">
          <div className="widget">
            <h3>Total Users</h3>
            <p>{summary.totalUsers || 0}</p>
          </div>
          <div className="widget">
            <h3>Total Products</h3>
            <p>{summary.totalProducts || 0}</p>
          </div>
          <div className="widget">
            <h3>Total Orders</h3>
            <p>{summary.totalOrders || 0}</p>
          </div>
          <div className="widget">
            <h3>Total Revenue</h3>
            <p>${summary.totalRevenue?.toFixed(2) || 0}</p>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="order-status">
          <h3>Order Status Breakdown</h3>
          <ul>
            {orderStatuses.map((status) => (
              <li key={status.status}>
                {status.status}: {status.count}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <ul>
            {recentOrders.map((order) => (
              <li key={order.id}>
                Order ID: {order.id}, Product: {order.Product?.name}, Quantity:{" "}
                {order.quantity}, Status: {order.status}
              </li>
            ))}
          </ul>
        </div>

        {/* Low Stock Products */}
        <div className="low-stock-products">
          <h3>Low Stock Products</h3>
          <ul>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <li key={product.id}>
                  {product.name}: {product.quantity} left
                </li>
              ))
            ) : (
              <p>No low-stock products available.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
