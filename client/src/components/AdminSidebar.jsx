import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Manage Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Manage Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
