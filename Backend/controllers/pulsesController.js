const Pulses = require("../models/Pulses");

exports.createpulses = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const newpulses = await Pulses.create({ name, description, pricePerGram, stock, image });
    res.status(201).json(newpulses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllpulses = async (req, res) => {
  try {
    console.log("Fetching all pulses...");
    const pulses = await Pulses.find();
    console.log("pulses fetched:", pulses);
    res.json(pulses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getpulsesById = async (req, res) => {
  try {
    const pulse = await Pulses.findById(req.params.id);
    res.json(pulse);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updatepulses = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const updatedData = { name, description, pricePerGram, stock, image };
    const updated = await Pulses.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deletepulses = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    await Pulses.findByIdAndDelete(req.params.id);
    res.json({ msg: "pulses deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getpulsesByName = async (req, res) => {
  const { name } = req.params;
  const pulse = await Pulses.findOne({ name });
  if (!pulse) return res.status(404).json({ msg: "pulses bean not found" });
  res.json(pulse);
};
