const mongoose = require("mongoose");
const URI = process.env.DEV_ENV
  ? process.env.TEST_DB_URI
  : process.env.PROD_DB_URI;
module.exports = async (callback) => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("db connnection established");
    await callback();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
