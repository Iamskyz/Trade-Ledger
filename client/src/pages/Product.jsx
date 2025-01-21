import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    navigate("/purchase", { state: { product } }); // Navigate to the Purchase Page with product data
  };

  return (
    <div className="product-page">
      <h1>Our Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="no-products-message">No products available.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
              />
            )}
            <h2>{product.name}</h2>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>{product.description || "No description available."}</p>
            <button
              className="buy-now-button"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
