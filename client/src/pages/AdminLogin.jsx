import { useState } from 'react';
import api from '../services/api'; // Axios instance for API requests

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/login', formData);
            localStorage.setItem('adminToken', response.data.token); // Store JWT token
            window.location.href = "/admin/dashboard"; // Redirect to the admin dashboard
        } catch (err) {
            // Check if error has response and then set error message
            if (err.response) {
                setError(err.response.data.message || 'Something went wrong');
            } else {
                setError('Error: ' + err.message);
            }
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don&apos;t have an admin account?{' '}
                <a href="/admin/signup">Sign up here</a> {/* Signup link */}
            </p>
        </div>
    );
};

export default AdminLogin;
