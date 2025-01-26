import { useEffect, useState } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch orders from the backend
  const fetchOrders = async () => {
    console.log("Frontend: Fetching orders"); // Log before fetching
    try {
      const response = await fetch("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Log token
        },
      });

      console.log("Frontend: Response status", response.status); // Log response status

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log("Frontend: Orders fetched successfully", data); // Log data
      setOrders(data);
    } catch (err) {
      console.error("Frontend: Error fetching orders", err); // Log error
      setError("Failed to fetch orders. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-orders">
      <h1>Manage Orders</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <h2>Order #{order.id}</h2>
            <p>Product: {order.Product?.name || "N/A"}</p>
            <p>User: {order.User?.name || "Guest"}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Total: ${order.total_price}</p>
            <p>Status: {order.status}</p>
            <button>Edit Status</button>
            <button>Delete Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
