const nodemailer = require('nodemailer');

exports.sendMail = async (options) => {
  // 1 create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.verify();
  console.log('SMTP server is ready');

  // 2 create emailOptions

  const emailOptions = {
    from: 'Ahmed Faheem <A7medfaheem@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 2  send email
  await transporter.sendMail(emailOptions);
};
