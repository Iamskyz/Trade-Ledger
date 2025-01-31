const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log

    // ✅ Fetch user details from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = { id: user.id, email: user.email }; // ✅ Attach email to req.user
    console.log("Authenticated user:", req.user); // Debug log

    next();
  } catch (error) {
    console.error("Invalid token:", error); // Debug log
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
