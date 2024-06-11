import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationToken = async (email: string, subject: string, content: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification Email Sent: ${info.response}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};

export default sendVerificationToken;
