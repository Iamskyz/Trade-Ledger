import './Product.css'; // Import the Product Page-specific styles

const Product = () => {
    // Example product data (replace with API data later)
    const products = [
        { id: 1, name: 'Product 1', price: '$20', image: 'product1.jpg' },
        { id: 2, name: 'Product 2', price: '$30', image: 'product2.jpg' },
        { id: 3, name: 'Product 3', price: '$40', image: 'product3.jpg' },
        { id: 4, name: 'Product 4', price: '$50', image: 'product4.jpg' },
    ];

    return (
        <div className="product-page">
            <h1>Our Products</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                        <a href={`/product/${product.id}`} className="product-button">View Details</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
