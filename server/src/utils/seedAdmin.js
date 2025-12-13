import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        const newEmail = 'noman.dev@admin';
        const newPassword = 'noman.admin';
        const oldEmail = 'admin@noman.dev';

        // Check if the new admin already exists
        const targetAdmin = await Admin.findOne({ email: newEmail });

        if (targetAdmin) {
            console.log('🌱 Admin exists (noman.dev@admin). Updating password...');
            targetAdmin.password = newPassword;
            // Pre-save hook in Admin model should handle hashing
            await targetAdmin.save();
            console.log('✅ Admin credentials updated.');
        } else {
            // Check for old admin to migrate
            const oldAdmin = await Admin.findOne({ email: oldEmail });
            if (oldAdmin) {
                console.log('🔄 Migrating old admin (admin@noman.dev) to new credentials...');
                oldAdmin.email = newEmail;
                oldAdmin.password = newPassword;
                await oldAdmin.save();
                console.log('✅ Admin credentials updated to noman.dev@admin');
            } else {
                console.log('🌱 Creating new admin...');
                await Admin.create({
                    name: 'Admin',
                    email: newEmail,
                    password: newPassword
                });
                console.log('✅ Admin initialized: noman.dev@admin');
            }
        }
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
    }
};

export default seedAdmin;
