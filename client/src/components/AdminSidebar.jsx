import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" activeClassName="active-link">
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" activeClassName="active-link">
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" activeClassName="active-link">
              Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" activeClassName="active-link">
              Manage Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/profile" activeClassName="active-link">
              Profile Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
