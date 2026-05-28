
import mongoose from "mongoose";
import logger from "../logger/logger.js";


const MONGODB_URI =
    process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shipQuote-db";

export const connectDB = async () => {
    await mongoose
        .connect(MONGODB_URI)
        .then((db) => logger.info(`MongoDB connected: `, { message: db.connection.host }))
        .catch((error) => logger.error(`error MongoDB: `, { message: error }));
};