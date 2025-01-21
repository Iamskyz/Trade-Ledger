import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image_url: "", // Added image_url field for editing
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data.message);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      image_url: product.image_url || "", // Ensure image_url is editable
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data.message);
      setEditingProduct(null); // Close edit form
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-products">
      <h1>Manage Products</h1>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            {editingProduct === product.id ? (
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="image_url">Image URL</label>
                  <input
                    id="image_url"
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="Image URL"
                  />
                </div>
                <button type="submit">Save</button>
                <button onClick={() => setEditingProduct(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <h2>{product.name}</h2>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <p>{product.description}</p>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <Link to="/admin/add-product" className="add-product-button">
        Add New Product
      </Link>
    </div>
  );
};

export default AdminProducts;
