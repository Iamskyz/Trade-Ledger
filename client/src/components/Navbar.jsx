import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon
import "./Navbar.css"; // Custom styles for Navbar

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  ); // Check initial login status
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Watch for token changes to update UI instantly
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userToken"));
    };

    window.addEventListener("storage", handleStorageChange); // Listen for storage changes
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
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
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={location.pathname === "/products" ? "active" : ""}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/about-us"
              className={location.pathname === "/about-us" ? "active" : ""}
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side: Login/Profile */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="profile-container">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/my-orders" className="myorder-button"  onClick={() => setShowDropdown(false)}>
                  My Orders
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
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
