import './Home.css'; // Import the Home-specific styles

const Homepage = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <h1>Welcome to Trade Ledger</h1>
                <p>Your trusted platform for managing your shop and trading activities!</p>
                <a href="/products" className="cta-button">Browse Products</a>
            </section>

            <section className="features-section">
                <h2>Why Choose Trade Ledger?</h2>
                <div className="features-list">
                    <div className="feature-item">
                        <h3>Wide Range of Products</h3>
                        <p>Explore various categories of products tailored to your business needs.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Easy Order Management</h3>
                        <p>Manage your orders with ease and track them in real-time.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Reliable Support</h3>
                        <p>Our support team is here to assist you with any issues you may face.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Start Shopping Today!</h2>
                <a href="/products" className="cta-button">Shop Now</a>
            </section>
        </div>
    );
};

export default Homepage;
