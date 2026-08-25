const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `Ahmed Faheem <${process.env.WebEmail}>`;
    this.name = user.name.split(' ')[0];
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1- render temaplate
    const html = pug.renderFile(
      path.join(__dirname, `../views/email/${template}.pug`),
      { name: this.name, url: this.url, subject: this.subject },
    );
    //2- define email options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: convert(html, { wordwrap: 130 }),
    };

    //3- create transporter and send
    await this.newTransporter().sendMail(emailOptions);
  }

  async sendWelcomeEmail() {
    await this.send('welcome', 'Welcome to Natours Family');
  }

  async sendPasswordResetEmail() {
    await this.send(
      'passwordReset',
      'Your Password Reset Token valid for 10 minutes',
    );
  }
};
