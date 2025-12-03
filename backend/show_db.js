require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const showDb = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('\n--- Database Content ---');

        const collections = await mongoose.connection.db.listCollections().toArray();

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} documents`);
        }

        console.log('------------------------\n');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

showDb();
