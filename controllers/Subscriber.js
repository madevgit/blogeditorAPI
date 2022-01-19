const Subscriber = require("../models/Subscriber");
module.exports = {
  create: async (req, res, next) => {
    let email = req.body.email,
      user;
    let exist = await Subscriber.findOne({ email }).catch(next);
    if (!exist) {
      let newSubscriber = new Subscriber({ email });
      user = await newSubscriber.save().catch(next);
    }
    return res.status(200).json({
      user,
    });
  },
  delete: async (req, res, next) => {
    let email = req.query.email;
    await Subscriber.findOneAndDelete({ email }).catch(next);
    res.status(200).json({
      message: `${email} unsubscribe successfull`,
    });
  },
};
