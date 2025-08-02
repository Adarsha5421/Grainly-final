require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const { activityLogger } = require("./middleware/activityLogger");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Helmet with relaxed COOP & COEP
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

// ✅ Custom CSP for Vite (localhost:5173)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "http://localhost:5173"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "http://localhost:5173"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "http://localhost:5173"],
    imgSrc: ["'self'", "data:", "http://localhost:5000", "http://localhost:5173"],
    connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "http://localhost:5173"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// ✅ CORS to allow frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ Serve /uploads with CORS headers
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Enhanced Activity Logging Middleware
app.use(activityLogger);

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pulses", require("./routes/pulsesRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/activity", require("./routes/activityRoutes"));

// ✅ Legacy activity logs route (for backward compatibility)
app.get("/api/users/activity-logs", async (req, res) => {
  try {
    const { user } = req.query;
    const filter = user ? { user } : {};
    const ActivityLog = require("./models/ActivityLog");
    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('user', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
