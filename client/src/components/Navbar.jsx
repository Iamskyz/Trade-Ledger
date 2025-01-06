import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'; // Custom styles for Navbar

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Check login status when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token'); // Check for token in localStorage
        if (token) {
            setIsLoggedIn(true); // Set login state to true if token exists
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        setIsLoggedIn(false); // Update state to reflect logout
        navigate('/'); // Redirect to the home page after logout
    };

    return (
        <nav className="navbar">
            {/* Left Side: Project Name */}
            <div className="navbar-left">
                <h2>Trade Ledger</h2>
            </div>

            {/* Center: Navigation Links */}
            <div className="navbar-center">
                <ul>
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'active' : ''}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            className={location.pathname === '/products' ? 'active' : ''}
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about-us"
                            className={location.pathname === '/about-us' ? 'active' : ''}
                        >
                            About Us
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right Side: Login or Logout Button */}
            <div className="navbar-right">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="login-button">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
