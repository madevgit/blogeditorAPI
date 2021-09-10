const mailSender = require("../mail/mailSender");
modules.export = {
  contact: async (req, res, next) => {
    let { mail, message, number, subject, firstname, lastname } = req.query;
  },
};
