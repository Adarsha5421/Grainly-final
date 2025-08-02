const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require('../models/User');

// User profile
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// Admin: get all users, block/unblock
router.get("/", authMiddleware, userController.getAllUsers);
router.patch("/:id/block", authMiddleware, userController.blockUser);
router.patch("/:id/unblock", authMiddleware, userController.unblockUser);

// 2FA routes
router.post("/2fa/generate", authMiddleware, userController.generate2FA);
router.post("/2fa/confirm", authMiddleware, userController.confirm2FA);
router.post("/2fa/disable", authMiddleware, userController.disable2FA);
router.post("/2fa/verify", userController.verify2FA);

// 2FA backup code routes
router.post("/2fa/backup/generate", authMiddleware, userController.generateBackupCodes);
router.get("/2fa/backup", authMiddleware, userController.getBackupCodes);
router.post("/2fa/backup/use", userController.useBackupCode);

// Email management routes
router.post("/emails", authMiddleware, userController.addEmail);
router.get("/emails/verify/:token", userController.verifyEmail);
router.delete("/emails", authMiddleware, userController.removeEmail);

module.exports = router; 