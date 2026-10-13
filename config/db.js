const mongoose = require('mongoose');
const dns = require('node:dns');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Add your MongoDB connection string to .env.');
  }

  const dnsServers = process.env.MONGO_DNS_SERVERS
    ? process.env.MONGO_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
    : [];

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;