// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
//       auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//     });

//     const mailOptions = {
//       from: `"TravelX" <${process.env.EMAIL_USER}>`, // Sender address
//       to, // Recipient email
//       subject, // Subject line
//       html, // Email body
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     // throw new Error("Failed to send email.");
//     return false;
//   }
// };

// module.exports = sendEmail;



const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "TravelX",
          email: process.env.SENDER_EMAIL, // must be verified in Brevo
        },
        to: [
          {
            email: to, // dynamic recipient
          },
        ],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Email sent via Brevo:", response.data?.messageId);
    return true;
  } catch (error) {
    console.error(
      "Brevo error:",
      error.response?.data || error.message
    );
    return false;
  }
};

module.exports = sendEmail;
