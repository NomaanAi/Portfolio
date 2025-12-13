
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../src/models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
// dirname is server/scripts, we need to go up one level to find .env in server (or root?)
// User's .env seems to be in d:\MyPortfilio\server\.env.
// script is in d:\MyPortfilio\server\scripts\createAdmin.js
// so we need path.join(__dirname, '../.env')

const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        console.log('🔄 Connecting to DB...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        const adminEmail = 'admin@noman.dev';
        const adminPassword = 'adminpassword123';
        const adminName = 'Nomaan Shaikh';

        // Check if exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️  Admin already exists. Updating password/name...');
            // Optional: Update existing if user ran script to "reset"
            existingAdmin.name = adminName;
            existingAdmin.password = adminPassword; // Pre-save hook will hash this
            await existingAdmin.save();
            console.log('✅ Admin updated successfully.');
        } else {
            console.log('🆕 Creating new Admin...');
            await Admin.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword
            });
            console.log('✅ Admin created successfully.');
        }

        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
