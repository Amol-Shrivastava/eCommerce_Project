require("express-async-errors");
require("dotenv").config();

const express = require("express");
const consola = require("consola");

//IMPORTS
const connectDB = require("./connectDB");

const PORT = process.env.PORT || 4000;

//MIDDLEWARE
const app = express();

//ROUTES

app.use(express.json());

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
