import express from "express";

const app = express();

import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/dbConnection.js";
import errorMiddleare from "./middleware/errors.js";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Handle Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shuting down due to uncaught exception");
  process.exit();
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/.env" });
}

// Connecting to database
connectDatabase();
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 4000;
//middleware
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);

app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
import paymentRoute from "./routers/payment.js";

app.use("/api/v1", productRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);
app.use(errorMiddleare);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/my-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend/my-project/dist/index.html"),
    );
  });
}

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
