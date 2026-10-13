const Inventory = require('../models/Inventory');

// 1. Saara stock mangwane ke liye
const getItems = async (req, res) => {
  try {
    const items = await Inventory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Naya item add karne ke liye
const addItem = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;
    const item = new Inventory({
      userId: req.user.id,
      name,
      category,
      quantity: Number(quantity),
      unit
    });
    const savedItem = await item.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Item delete karne ke liye
const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, addItem, deleteItem };