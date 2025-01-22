import dotenv from "dotenv";
dotenv.config();

const env = process.env;

export const MONGO_URI = env.MONGO_URI || "";
export const PORT = env.PORT;
export const MORALIS_API = env.MORALIS_API;
export const REDIS_PASSWORD = env.REDIS_PASSWORD;
export const REDIS_PORT = env.PORT || 6379;
