import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        const adminEmail = 'noman.dev@admin';
        const adminPassword = 'noman.admin';

        console.log('🌱 Checking for admin user...');
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('✅ Admin already exists.');
            // Optional: Update password if needed, but for now just ensure role
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Admin role enforced.');
            }
        } else {
            console.log('🌱 Creating new admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin initialized: ' + adminEmail);
        }
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
    }
};

export default seedAdmin;
