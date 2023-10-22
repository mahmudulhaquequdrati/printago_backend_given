const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connt = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${connt.connection.host}`);
  } catch (error) {
    console.error(`error ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
