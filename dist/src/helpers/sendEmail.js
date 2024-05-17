import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendVerificationToken = (email, subject, content) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: content,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(`Verification Email Sent: ${info.response}`);
        }
    });
};
export default sendVerificationToken;
