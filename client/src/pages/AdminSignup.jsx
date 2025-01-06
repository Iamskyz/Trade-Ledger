import { useState } from 'react';
import api from '../services/api'; // Axios instance for API requests
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use navigate for redirect after successful signup

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/signup', formData); // Send the signup request
            console.log('Signup Successful:', response.data);
            alert('Signup successful! You can now login as admin.');
            navigate('/admin/login'); // Redirect to admin login page after signup
        } catch (err) {
            console.error('Signup Failed:', err.response?.data.message || err.message);
            setError(err.response?.data.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h1>Admin Signup</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default AdminSignup;
