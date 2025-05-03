const nodemailer = require("nodemailer");

const sendEmail=async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });     
                            
        const mailOptions = {
            from: `"TravelX" <${process.env.EMAIL_USER}>`, // Sender address
            to, // Recipient email
            subject, // Subject line
            html, // Email body
          };
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully!");
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Failed to send email.");
        }
      };
      module.exports = sendEmail;