import { useEffect, useState } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch orders from the backend
  const fetchOrders = async () => {
    console.log("Frontend: Fetching orders");
    try {
      const response = await fetch("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      console.log("Frontend: Response status", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log("Frontend: Orders fetched successfully", data);
      setOrders(data);
    } catch (err) {
      console.error("Frontend: Error fetching orders", err);
      setError("Failed to fetch orders. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Delete Order Function
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order.");
      }

      // Remove order from UI after successful deletion
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  return (
    <div className="admin-orders">
      <h1>Manage Orders</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h2>Order #{order.id}</h2>
              <p>
                <strong>Product:</strong> {order.Product?.name || "N/A"}
              </p>
              <p>
                <strong>User:</strong> {order.User?.name || "Guest"}
              </p>
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.total_price.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>

              {/* ✅ Delete Order Button */}
              <button
                className="delete-button"
                onClick={() => handleDeleteOrder(order.id)}
              >
                Delete Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
