const mongoose = require("mongoose");

const connectDB = async (uri) => mongoose.connect(uri);

module.exports = connectDB;
