const mongoose = require("mongoose");
module.exports = async (callback) => {
  try {
    await mongoose.connect(
      "mongodb+srv://DimVision:NewLifeVision99@cluster0.mp1sh.mongodb.net/qoseditor",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("db connnection established");
    await callback();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
