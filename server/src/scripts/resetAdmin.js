
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: '.env' });

const resetAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const email = 'noman.dev@admin';
        const password = 'noman.admin';

        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating...');
            const hashedPassword = await bcrypt.hash(password, 12);
            user = await User.create({
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin'
            });
        } else {
            console.log('User found. Updating password...');
            user.password = await bcrypt.hash(password, 12);
            user.role = 'admin';
            await user.save();
        }

        console.log(`SUCCESS: Admin reset. Email: ${email}, Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
