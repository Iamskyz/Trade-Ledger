import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
});

export default api;
