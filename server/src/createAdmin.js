
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '.env') });

const createAdmin = async () => {
    try {
        console.log('🔄 Starting Admin Reset...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ DB Connected');

        const adminEmail = 'noman.admin@dev';
        const adminPassword = 'admin.noman';

        // Force Delete
        await User.deleteOne({ email: adminEmail });
        console.log('🗑️  Existing admin deleted (if any)');

        // Create Fresh
        const admin = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log('✅ Admin Created Successfully');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
};

createAdmin();
