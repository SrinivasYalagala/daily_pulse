import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const DB_URL = process.env.LOCAL_DB_URL;
        const connection = await mongoose.connect(DB_URL);
        console.log('MongoDB Connected successfully ✅ 🚀');
        return "Hoah!,Connected to your database.";
    } catch (error) {
        console.error('DB Error:', error.message);
        return "Oh snap!. Failed to connect."
    }
};

export default connectDb;