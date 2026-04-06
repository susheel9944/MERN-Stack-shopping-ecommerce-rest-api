import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    console.log("Current ENV:", process.env.NODE_ENV);

    let DB_URI = "";

    if (process.env.NODE_ENV === "development") {
      DB_URI = process.env.DB_LOCAL_URI;
    } else {
      DB_URI = process.env.DB_URI;
    }

    if (!DB_URI) {
      throw new Error("Database URI is missing");
    }

    const con = await mongoose.connect(DB_URI);

    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};
