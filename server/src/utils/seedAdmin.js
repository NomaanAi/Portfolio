import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const isDev = process.env.NODE_ENV === 'development';

const seedAdmin = async () => {
    try {
        const adminEmail = 'noman.dev@admin';
        const adminPassword = 'noman.admin';

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            if (isDev) console.log(`🌱 Admin user exists (${adminEmail}). Checking role...`);
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                if (isDev) console.log('✅ User role updated to admin.');
            }
        } else {
            if (isDev) console.log('🌱 Creating new admin user...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            if (isDev) console.log(`✅ Admin initialized: ${adminEmail} / ${adminPassword}`);
        }
    } catch (error) {
        // Errors during admin seeding are critical enough to log
        console.error('❌ Admin seed failed:', error);
    }
};

export default seedAdmin;
