import { useState, useEffect } from "react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    address: "",
  });
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  // Edit user
  const editUser = (user) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name,
      mobile_number: user.mobile_number,
      address: user.address,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${editingUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      alert(data.message); // Notify success
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            {editingUser === user.id ? (
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Mobile:
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Address:
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </label>
                <button type="submit">Save</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Mobile: {user.mobile_number || "N/A"}</p>
                <p>Address: {user.address || "N/A"}</p>
                <button onClick={() => editUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
