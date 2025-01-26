import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Purchase.css";

const Purchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!product) {
    return <p>Product not found. Please go back to the product page.</p>;
  }

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure minimum quantity is 1
    setQuantity(value);
  };

  const handlePayment = async () => {
    try {
      // Call backend to create an order
      const response = await fetch(
        "http://localhost:5000/api/orders/razorpay-order",
        {
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
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to process payment.");
      }

      // Initialize Razorpay payment
      const razorpayOptions = {
        key: "rzp_test_ZOaKBf5pfPgbIQ", // Replace with your Razorpay key ID
        amount: data.amount,
        currency: data.currency,
        name: "Shop Management System",
        description: `Purchase of ${product.name}`,
        order_id: data.id,
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/orders/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            alert("Payment successful!");
            navigate("/");
          } catch (err) {
            console.error("Payment verification failed:", err);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Your Name",
          email: "your-email@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment. Please try again.");
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
      <button className="place-order-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Purchase;
