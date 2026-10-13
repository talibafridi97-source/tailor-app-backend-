const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // e.g. White Threads, Gold Buttons
    category: { type: String, required: true }, // Fabric / Buttons / Threads / Scissors
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'Pcs' }, // Meters / Rolls / Pcs
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);