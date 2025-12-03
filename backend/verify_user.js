require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const verify = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admin = await Admin.findOne({ email: 'admin@example.com' });
        if (!admin) {
            console.log('Admin User NOT FOUND');
        } else {
            console.log('Admin User FOUND');
            const isMatch = await bcrypt.compare('admin123', admin.password);
            console.log('Password Match:', isMatch ? 'YES' : 'NO');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
