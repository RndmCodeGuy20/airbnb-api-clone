const nodemailer = require('nodemailer');
import { envConfig } from '#configs/index';

const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL.EMAIL_HOST,
  port: envConfig.EMAIL.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: envConfig.EMAIL.EMAIL_USER,
    pass: envConfig.EMAIL.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: `"Shantanu Mane" <${envConfig.EMAIL.EMAIL_HOST}>`,
  // html: message,
  // attachments: attachment,
};

/**
 * Send email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @return {Promise<void>}
 */
export const mailer = {
  sendEmailVerificationToken: async (email, token) => {
    try {
      const message = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Verification</title>
</head>
<body>
	<h1>Email Verification</h1>
	<p>Click on the link below to verify your email</p>
	<a href="http://localhost:5500/api/v1.0/auth/verify/${token}">Verify Email</a>
</body>
</html>`;
      mailOptions.to = email;
      mailOptions.subject = 'Email Verification';
      mailOptions.html = message;
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  },
};
