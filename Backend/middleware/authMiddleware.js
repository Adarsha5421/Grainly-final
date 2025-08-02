const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1];
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required" });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Admin access required" });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
