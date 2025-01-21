import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup"; // Admin Signup page
import AdminDashboard from "./pages/AdminDashboard"; // Admin Dashboard
import AdminAddProduct from "./pages/AdminAddProduct"; // Add Product Page
import AdminProducts from "./pages/AdminProducts"; // Admin Manage Products Page
import Purchase from "./pages/Purchase"; // Purchase Page

const App = () => {
  const isAdmin = localStorage.getItem("adminToken"); // Check if admin is logged in

  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Product />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/purchase" element={<Purchase />} />{" "}
          {/* Purchase Page */}
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin/dashboard"
            element={
              isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />
            }
          />
          <Route
            path="/admin/products"
            element={
              isAdmin ? <AdminProducts /> : <Navigate to="/admin/login" />
            }
          />
          <Route
            path="/admin/add-product"
            element={
              isAdmin ? <AdminAddProduct /> : <Navigate to="/admin/login" />
            }
          />
          {/* Catch-all Route for Invalid Paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
