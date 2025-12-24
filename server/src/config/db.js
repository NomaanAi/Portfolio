import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'portfolio',
      serverSelectionTimeoutMS: 5000, // Fail fast if no connection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    // console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
