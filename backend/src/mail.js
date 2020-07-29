const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

function createResetPasswordMail(resetLink) {
    return `
        <h2>Reset password</h2>

        <p>Click to the link below to reset password</p>

        <a href="${resetLink}">Reset now!</a>

        <p>Best luck</p>
    `;
}
  
module.exports = {
    transport,
    createResetPasswordMail
}