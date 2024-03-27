const nodemailer = require('nodemailer');
import { envConfig } from '#configs/index';

export const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL.EMAIL_HOST,
  port: envConfig.EMAIL.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: envConfig.EMAIL.EMAIL_USER,
    pass: envConfig.EMAIL.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, message, attachment) => {
  try {
    const mailOptions = {
      from: `"Shantanu Mane" <${envConfig.EMAIL.EMAIL_HOST}>`,
      to,
      subject,
      html: message,
      attachments: attachment,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
