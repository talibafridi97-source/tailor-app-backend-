const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// 1. Saare kharche mangwana (Sirf usi user ke jo login hai)
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Naya Kharcha add karna
router.post('/', protect, async (req, res) => {
  try {
    const expense = await Expense.create({ 
      ...req.body, 
      userId: req.user.id 
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Kharcha UPDATE (Edit) karna
router.put('/:id', protect, async (req, res) => {
  try {
    // Pehle check karein ke ye kharcha isi user ka hai
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Kharcha nahi mila' });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Kharcha DELETE karna
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!expense) return res.status(404).json({ message: 'Kharcha nahi mila' });
    res.status(200).json({ message: 'Removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;