const Subscriber = require("../models/Subscriber");
module.exports = {
  create: async (req, res, next) => {
    let { email, canal, agreeNews, agreeBlog } = req.body;
    let user;
    let exist = await Subscriber.findOne({ email, canal }).catch(next);
    if (!exist) {
      let newSubscriber = new Subscriber({
        email,
        canal,
        agreeNews,
        agreeBlog,
      });
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
