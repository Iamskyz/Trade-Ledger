# Shop Management System

## Overview
The **Shop Management System** is a full-stack project that allows users and admins to manage products, orders, and shop-related activities. The project features a user-friendly frontend built with React and a robust backend powered by Node.js, Express, and MySQL.

---

## Features

### User Features:
- User registration and login with secure authentication.
- Browse products and place orders.
- View order history.

### Admin Features:
- Admin login to access the dashboard.
- Manage products (Add, Update, Delete).
- Manage orders (View and update status).
- Generate QR codes for products.

---

## Prerequisites
Ensure the following are installed on your system:
- Node.js
- MySQL
- Git

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Backend Setup
Navigate to the `server` folder:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory with the following content:
```env
DB_NAME=shop_management_system
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
PORT=5000
JWT_SECRET=yourSecretKey
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the `client` folder:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

---

## Dependencies

### Backend:
```bash
npm install express sequelize mysql2 dotenv bcrypt jsonwebtoken cors
npm install --save-dev nodemon
```

### Frontend:
```bash
npm install react react-dom react-router-dom axios
```

---

## Database Setup

1. Log in to MySQL:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE shop_management_system;
USE shop_management_system;
```

3. Sync the database tables automatically via Sequelize by running the backend server.

---

## Usage

### Starting the Servers
- **Backend**: Run the following command in the `server` directory:
  ```bash
  npm run dev
  ```
- **Frontend**: Run the following command in the `client` directory:
  ```bash
  npm start
  ```

### Access the Application
- User Interface: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## API Endpoints

### User Endpoints:
- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: User login.

### Admin Endpoints:
- `POST /api/admin/login`: Admin login.
- `POST /api/admin/register`: Admin registration.

### Product Endpoints:
- `GET /api/products`: Get all products.
- `POST /api/products`: Add a new product.
- `PUT /api/products/:id`: Update a product.
- `DELETE /api/products/:id`: Delete a product.

### Order Endpoints:
- `GET /api/orders`: Get all orders.
- `POST /api/orders`: Place a new order.
- `PUT /api/orders/:id`: Update order status.

---

## License
This project is licensed under the MIT License.
