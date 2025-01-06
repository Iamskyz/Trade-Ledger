import './AdminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <nav>
                <ul>
                    <li>
                        <Link to="/admin/dashboard">Overview</Link>
                    </li>
                    <li>
                        <Link to="/admin/users">Users</Link>
                    </li>
                    <li>
                        <Link to="/admin/products">Products</Link>
                    </li>
                    <li>
                        <Link to="/admin/orders">Orders</Link>
                    </li>
                    <li>
                        <Link to="/admin/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
