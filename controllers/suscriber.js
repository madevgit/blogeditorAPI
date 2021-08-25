const Suscriber = require("../models/Suscriber");
module.exports = {
  create: async (req, res, next) => {
    let email = req.body.email,
      user;
    let exist = await Suscriber.findOne({ email }).catch(next);
    if (!exist) {
      let newSuscriber = new Suscriber({ email });
      user = await newSuscriber.save().catch(next);
    }
    return res.status(200).json({
      user,
    });
  },
  delete: async (req, res, next) => {
    let email = req.query.email;
    await Suscriber.findOneAndDelete({ email }).catch(next);
    res.status(200).json({
      message: "Unsuscribe succesfull",
    });
  },
};
