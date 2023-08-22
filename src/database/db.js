import mongoose from "mongoose";

import { MONGO_URI } from "../utils/config.js";

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.log(`${MONGO_URI} is not defined in the env`);
  }

  try {
    mongoose.set("strictQuery", false);
    const res = await mongoose.connect(MONGO_URI);
    if (res.connection.readyState === 1)
      console.log("DB connection is successfully!");
    else console.log("DB connecting");
  } catch (error) {
    console.log("DB connection is failed");
    throw new Error(error);
  }
};
