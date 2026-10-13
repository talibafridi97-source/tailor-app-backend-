require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeApp, cert } = require('firebase-admin/app');

let serviceAccount;
try {
  if (process.env.FIREBASE_CONFIG_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
  } else {
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (err) {
      console.warn("Warning: serviceAccountKey.json not found locally.");
    }
  }
} catch (e) {
  console.error("Firebase Service Account Load Error:", e.message);
}

if (serviceAccount) {
  try {
    initializeApp({ credential: cert(serviceAccount) });
    console.log("Firebase Admin Initialized Successfully.");
  } catch (initErr) {
    console.error("Firebase Init Error:", initErr.message);
  }
} else {
  console.log("Running without Firebase Admin (Push notifications disabled).");
}

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/customer/orders', require('./routes/customerOrderRoutes'));
app.use('/api/inventory', require('./routes/inventoryRouter'));
app.use('/api/expenses', require('./routes/expenseRouter'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`Unable to start server: ${error.message}`);
  process.exitCode = 1;
});
