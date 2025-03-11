const mongoose = require("mongoose");
require("dotenv").config();
module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected To DB");
  } catch (err) {
    console.log(err);
  }
};
