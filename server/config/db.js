import mongoose from "mongoose";

const tryConnect = async (uri) => {
    return mongoose.connect(uri);
};

const connectDB = async () => {
    const configuredUri = process.env.MONGODB_URI;
    const localFallback = 'mongodb://127.0.0.1:27017/auth-reset';

    try {
        if (!configuredUri) {
            throw new Error('MONGODB_URI is not configured in environment variables');
        }
        await tryConnect(configuredUri);
        console.log('MongoDB connected successfully (Atlas)');
        return;
    } catch (err) {
        console.error('MongoDB Atlas connection error:', err.message);
        
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Database connection failed in production');
        }
        
        console.warn('Attempting to connect to local MongoDB at', localFallback);
        try {
            await tryConnect(localFallback);
            console.log('MongoDB connected successfully (local fallback)');
            return;
        } catch (localErr) {
            console.error('Local MongoDB connection failed:', localErr.message);
            throw new Error('All database connection attempts failed. Please check your configuration.'); 
        }
    }
};

export default connectDB;
