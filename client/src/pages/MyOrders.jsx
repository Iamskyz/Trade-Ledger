import { useEffect, useState } from "react";
import "./MyOrders.css"; // Add styles later

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch orders.");

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    console.log("📥 Downloading invoice for Order ID:", orderId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("❌ Failed to fetch invoice:", errorMessage);
        throw new Error(errorMessage.message || "Failed to download invoice.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("✅ Invoice downloaded successfully.");
    } catch (err) {
      console.error("❌ Error downloading invoice:", err);
      setError("Failed to download invoice. Please try again.");
    }
  };

  return (
    <div className="my-orders">
      <h1>My Orders</h1>
      {error && <p className="error-message">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.unique_order_code}</td>
                <td>
                  <img
                    src={order.Product?.image_url}
                    alt={order.Product?.name}
                    className="product-image"
                  />
                  {order.Product?.name}
                </td>
                <td>{order.quantity}</td>
                <td>₹{order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleDownloadInvoice(order.id)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
