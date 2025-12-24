import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        const adminEmail = 'noman.dev@admin';
        const adminPassword = 'noman.admin';

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`🌱 Admin user exists (${adminEmail}). Checking role...`);
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ User role updated to admin.');
            }
            // Optional: reset password if needed, but safe to skip to avoid overwriting user's changed password
            // For dev/debug, we force reset:
            // existingAdmin.password = adminPassword;
            // await existingAdmin.save();
            // console.log('✅ Admin password reset to default.');
        } else {
            console.log('🌱 Creating new admin user...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log(`✅ Admin initialized: ${adminEmail} / ${adminPassword}`);
        }
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
    }
};

export default seedAdmin;
