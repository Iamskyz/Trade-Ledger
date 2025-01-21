const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (error) {
    console.log("Invalid token");
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
