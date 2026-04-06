import express from "express";

const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/dbConnection.js";
import errorMiddleare from "./middleware/errors.js";
import cookieParser from "cookie-parser";

//Handle Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shuting down due to uncaught exception");
  process.exit();
});

dotenv.config({ path: "./config/.env" });

// Connecting to database
connectDatabase();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 4000;
//middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

//import all routes here
import productRoute from "./routers/products.js";
import authRoute from "./routers/auth.js";
import orderRoute from "./routers/order.js";

app.use("/api/v1", productRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", orderRoute);
app.use(errorMiddleare);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

//Hanlde unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shuting down server du to unhandle Promise Rejection");
  server.close(() => {
    process.exit();
  });
});
