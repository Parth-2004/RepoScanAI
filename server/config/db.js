const mongoose = require('mongoose');

const connectDB = async () => {
    // Skip if no URI provided in dev
    if (!process.env.MONGO_URI) {
        console.log('MongoDB: MONGO_URI not provided. Running in memory mode or without DB.');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
