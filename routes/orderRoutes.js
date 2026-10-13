const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');
const { getMessaging } = require('firebase-admin/messaging');

// 1. Naya Order Save karna
router.post('/', protect, async (req, res) => {
  try {
    const { 
      clientName, phone, garment, measurements, materials, 
      totalBill, advancePayment, dueAmount, orderDate, 
      deliveryDate, isPinned, karigarName, fcmToken
    } = req.body;

    const order = new Order({
      userId: req.user.id,
      clientName: clientName || 'Unknown',
      phone: phone || '0000000000',
      garment: garment || 'Custom',
      measurements: measurements || {},
      materials: materials || [],
      totalBill: totalBill || 0,
      advancePayment: advancePayment || 0,
      dueAmount: dueAmount || 0,
      orderDate: orderDate || Date.now(),
      deliveryDate: deliveryDate || Date.now(),
      isPinned: isPinned || false,
      karigarName: karigarName || '' // <--- Karigar Name yahan save hoga
    });

    const savedOrder = await order.save();
    const user = await User.findById(req.user.id);
    const tokenToUse = fcmToken || (user && user.fcmToken);

    if (tokenToUse) {
      try {
        await getMessaging().send({
          token: tokenToUse,
          notification: {
            title: '📦 New Order Created!',
            body: `Order for ${clientName || 'Client'} has been added successfully.`,
          },
        });
        console.log('FCM Notification sent successfully!');
      } catch (notificationError) {
        console.error('Order Notification Error:', notificationError.message);
      }
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Save Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 2. Saare Orders mangwana
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Order Update / Edit karna (Isi se Karigar change hota hai)
router.put('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not authorized' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 4. Order Delete karna
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;