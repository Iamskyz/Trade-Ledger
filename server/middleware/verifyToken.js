const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded); // Debug log
    next();
  } catch (error) {
    console.error("Invalid token:", error); // Debug log
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
