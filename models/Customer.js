const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    measurements: { type: Map, of: String, default: {} }, // Dynamic Key-Value Pairs
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);