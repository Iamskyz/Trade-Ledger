import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Axios instance for API requests
import './Login.css'; // Custom styles for the login page

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(''); // State for error message
    const [success, setSuccess] = useState(''); // State for success message
    const navigate = useNavigate(); // Navigation hook for redirecting

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        setSuccess(''); // Reset success message
        try {
            const response = await api.post('/users/login', formData); // Send login request to backend
            console.log('Login Successful:', response.data);

            // Save JWT token in localStorage
            localStorage.setItem('token', response.data.token);

            // Set success message and redirect to home page
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/'); // Redirect to home page
            }, 2000); // Wait for 2 seconds before redirecting
        } catch (err) {
            console.error('Login Failed:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid credentials!');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
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
                <button type="submit" className="login-submit-button">Login</button>
            </form>

            {/* Display success or error messages */}
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}

            <p className="signup-link">
                Dont have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
