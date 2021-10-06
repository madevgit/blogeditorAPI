const mailSend = require("../mail/mailSender");

module.exports = async (req, res, next) => {
  let { message, tel: phone, object, firstname, lastname, mail } = req.body,
    receiver;
  switch (object) {
    case "sale":
      object = "commercial case";
      receiver = process.env.SMTP_SALES_MAIL;
      break;
    case "tech":
      object = "technical support";
      receiver = process.env.SMTP_TECHNICAL_MAIL;
      break;
    default:
      receiver = process.env.SMTP_SALES_MAIL;
      break;
  }
  mailSend({
    from: process.env.SMTP_NEWSLETTER_SENDER,
    to: "moukadimalassani@gmail.com",
    subject: object,
    template: "contact",
    templateVars: {
      lastname,
      firstname,
      mail,
      message,
      phone,
      object,
    },
  });
  res.status(200).json({
    message: "sent",
  });
};
