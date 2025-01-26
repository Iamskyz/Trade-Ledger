const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "mobile_number", "address"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, mobile_number, address } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.mobile_number = mobile_number || user.mobile_number;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
