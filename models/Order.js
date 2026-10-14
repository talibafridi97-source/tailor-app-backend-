const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Customer' 
    },
    clientName: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    garment: { 
      type: String, 
      required: true 
    },
    measurements: { 
      type: Map, 
      of: String, 
      default: {} 
    },
    materials: [{ 
      type: String 
    }],
    totalBill: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    advancePayment: { 
      type: Number, 
      default: 0 
    },
    dueAmount: { 
      type: Number, 
      default: 0 
    },
    orderDate: { 
      type: Date, 
      default: Date.now 
    },
    deliveryDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'complete', 'delivered'], 
      default: 'pending' 
    },
    isPinned: { 
      type: Boolean, 
      default: false 
    },
    karigarName: {
      type: String,
      default: ''
    },
    transactionId: {
      type: String,
      default: '' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
