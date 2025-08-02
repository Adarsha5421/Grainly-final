const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/my", authMiddleware, bookingController.getUserBookings);
router.get("/", authMiddleware, bookingController.getAllBookings); // Optional: protect with admin check
router.patch("/:id/status", authMiddleware, bookingController.updateBookingStatus);

module.exports = router;
