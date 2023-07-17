require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const consola = require("consola");

//IMPORTS
const connectDB = require("./connectDB");
const { authHandler } = require("./middleware/user");

//ROUTES
const userRouter = require("./routes/user");
const productRouter = require("./routes/products");
const categoryRouter = require("./routes/category");
const commentRoute = require("./routes/comments");
const addressRouter = require("./routes/address");

const PORT = process.env.PORT || 4000;

//MIDDLEWARE
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
// app.get("/api/auth", authHandler);
app.use("/api/v1/", authHandler);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/comments", commentRoute);

const start = async () => {
  try {
    //1. connect DB
    await connectDB(process.env.MONGO_DB_URI);
    consola.success(`Connected to DB`);
    //2. start server
    app.listen(PORT, (err) => {
      if (err) consola.error(err);
      else consola.success(`Server is running at port ${PORT}`);
    });
  } catch (error) {
    consola.error(error);
  }
};

try {
  start();
} catch (error) {}
