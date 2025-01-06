import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            {/* Header */}
            <AdminHeader />

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="dashboard-content">
                <h2>Welcome to the Admin Dashboard</h2>
                <div className="dashboard-widgets">
                    <div className="widget">
                        <h3>Total Users</h3>
                        <p>150</p>
                    </div>
                    <div className="widget">
                        <h3>Total Products</h3>
                        <p>320</p>
                    </div>
                    <div className="widget">
                        <h3>Total Orders</h3>
                        <p>75</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
