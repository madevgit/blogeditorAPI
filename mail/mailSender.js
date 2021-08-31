const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const { htmlToText } = require("html-to-text");
const juice = require("juice");

const smtp = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
});

module.exports = ({
  template: templateName,
  templateVars,
  ...restOfOptions
}) => {
  const templatePath = `${__dirname}/template/${templateName}.html`;

  const options = {
    ...restOfOptions,
  };

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, templateVars);
    const text = htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
    options.text = text;
    
  }
  smtp
    .sendMail(options)
    .then((result) => console.log(result))
    .catch((reason) => console.log(reason));
};
