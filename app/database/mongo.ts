import mongoose from "mongoose";
import { MONGO_URI } from "../utils/environment";
import { err, log, solidLogger } from "../utils/globals";
import dotenv from "dotenv";
dotenv.config();

export const MongoConnect = async () => {
  try {
    console.log("trying to connect to MongoDB -------");
    await mongoose.connect(MONGO_URI);
    log("=====================================");
    solidLogger("Connected to MongoDB");
    log("=====================================");
  } catch (error) {
    err("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};
