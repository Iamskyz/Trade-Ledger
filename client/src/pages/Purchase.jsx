import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Purchase.css";

const Purchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(""); // New state for address
  const [error, setError] = useState("");

  if (!product) {
    return <p>Product not found. Please go back to the product page.</p>;
  }

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure minimum quantity is 1
    setQuantity(value);
  };

  const handlePlaceOrder = async () => {
    console.log("Sending Order Data:", {
      product_id: product.id,
      quantity,
      total_price: product.price * quantity,
      address,
    });
    console.log(
      "Sending Authorization Header:",
      `Bearer ${localStorage.getItem("userToken")}`
    );

    try {
      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          total_price: product.price * quantity,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      alert(data.message);
      navigate("/");
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="purchase-page">
      <h1>Confirm Your Purchase</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="product-details">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image"
          />
        )}
        <h2>{product.name}</h2>
        <p>{product.description || "No description available."}</p>
        <p>Price per unit: ${product.price.toFixed(2)}</p>
      </div>
      <div className="quantity-section">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <p>Total Price: ${(product.price * quantity).toFixed(2)}</p>
      </div>
      <div className="address-section">
        <label htmlFor="address">Delivery Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
          required
        ></textarea>
      </div>
      <button className="place-order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Purchase;
