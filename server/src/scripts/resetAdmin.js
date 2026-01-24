
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: '.env' });

const resetAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const email = 'noman.dev@admin';
        const password = 'noman.admin';

        let admin = await Admin.findOne({ email });

        if (!admin) {
            console.log('Admin not found. Creating...');
            admin = await Admin.create({
                email,
                password, // Model pre-save hook handles hashing
                role: 'admin'
            });
        } else {
            console.log('Admin found. Updating password...');
            admin.password = password; // Marks as modified
            admin.role = 'admin';
            await admin.save(); // Model pre-save hook handles hashing
        }

        console.log(`SUCCESS: Admin reset. Email: ${email}, Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
