import './AboutUs.css'; // Import the About Us-specific styles

const AboutUs = () => {
    return (
        <div className="about-container">
            <section className="about-header">
                <h1>About Trade Ledger</h1>
                <p>Your trusted platform for managing shop inventory and trading activities.</p>
            </section>

            <section className="about-content">
                <h2>Our Mission</h2>
                <p>
                    At Trade Ledger, our mission is to empower shop owners by providing a seamless platform for managing inventory, orders, and day-to-day business operations. 
                    We strive to make your business operations smooth and efficient.
                </p>
                <h2>Why Choose Us?</h2>
                <ul>
                    <li>Easy-to-use platform for shop and trade management.</li>
                    <li>Tailored features to suit your business needs.</li>
                    <li>Reliable support and regular updates to improve your experience.</li>
                </ul>
                <h2>Our Story</h2>
                <p>
                    Trade Ledger was founded with the vision of simplifying shop management for everyone. 
                    Whether you&apos;re managing a small shop or a larger trading operation, our platform is designed to cater to your needs.
                </p>
            </section>
        </div>
    );
};

export default AboutUs;
