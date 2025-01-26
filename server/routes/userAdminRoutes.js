const express = require("express");
const { getAllUsers, updateUser, deleteUser } = require("../Controllers/userAdminController");
const router = express.Router();

// Fetch all users
router.get("/", getAllUsers);

// Update user details
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
