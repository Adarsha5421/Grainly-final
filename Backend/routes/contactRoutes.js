const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", contactController.submitContact);
router.get("/", authMiddleware, contactController.getAllContacts); // Optional: restrict to admin only

module.exports = router;
