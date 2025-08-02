const express = require("express");
const router = express.Router();
const pulsesController = require("../controllers/pulsesController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", pulsesController.getAllpulses);
router.get("/:id", pulsesController.getpulsesById);
router.post("/", authMiddleware, pulsesController.createpulses);
router.put("/:id", authMiddleware, pulsesController.updatepulses);
router.delete("/:id", authMiddleware, pulsesController.deletepulses);
router.get("/name/:name", pulsesController.getpulsesByName);

module.exports = router;
