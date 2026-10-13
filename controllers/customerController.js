const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, gender, measurements } = req.body;
    const customer = new Customer({
      userId: req.user.id,
      name: name || 'Unknown Customer',
      phone: phone || '0000000000',
      address: address || '',
      gender: gender ? (gender.charAt(0).toUpperCase() + gender.slice(1)) : 'Male',
      measurements: measurements || {},
    });
    const savedCustomer = await customer.save();
    res.status(201).json({ message: 'Customer added successfully', customer: savedCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NAYA UPDATE FUNCTION ---
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Security: Check owner
      { $set: req.body },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id 
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateCustomer ko exports mein lazmi add karein
module.exports = { createCustomer, getCustomers, updateCustomer, deleteCustomer };