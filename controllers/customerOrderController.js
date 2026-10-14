const Order = require('../models/Order');
const User = require('../models/User');
const { getMessaging } = require('firebase-admin/messaging');

const createCustomerOrder = async (req, res) => {
  try {
    const {
      clientName, phone, garment, measurements, materials,
      totalBill, advancePayment, dueAmount, deliveryDate, transactionId
    } = req.body;

    const shopUser = await User.findOne();
    if (!shopUser) {
      return res.status(404).json({ success: false, message: 'No shop owner found in system' });
    }

    const order = new Order({
      userId: shopUser._id,
      clientName: clientName || 'Online Customer',
      phone: phone || '',
      garment: garment || 'Custom',
      measurements: measurements || {},
      materials: materials || [],
      totalBill: totalBill || 0,
      advancePayment: advancePayment || 0,
      dueAmount: dueAmount || (totalBill - advancePayment),
      deliveryDate: deliveryDate || new Date(Date.now() + 7*24*60*60*1000),
      status: 'pending',
      isPinned: true,
      transactionId: transactionId || ''
    });

    const savedOrder = await order.save();

    if (shopUser.fcmToken) {
      try {
        await getMessaging().send({
          token: shopUser.fcmToken,
          notification: {
            title: '🌐 New Online Order & Payment!',
            body: `Order from ${clientName} (${garment}). TID: ${transactionId || 'Not provided'}`,
          },
          android: {
            notification: {
              sound: 'default',
              priority: 'high',
              channelId: 'high_importance_channel',
            },
          },
        });
        console.log('Customer Order & TID FCM Notification sent successfully!');
      } catch (notifErr) {
        console.error('Customer Order FCM Error:', notifErr.message);
      }
    }

    res.status(201).json({ success: true, message: 'Order submitted successfully', data: savedOrder });
  } catch (error) {
    console.error('Customer Order Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCustomerOrder };
