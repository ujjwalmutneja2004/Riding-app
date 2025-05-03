// const nodemailer = require("nodemailer");

// const sendWelcomeEmail = async (to, firstName) => {
//   try {
//     // Configure the transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
//       auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//       debug: true, // Enable debug output
//       logger: true, 
//     });

//     // Email content
//     const mailOptions = {
//       from: `"TravelX" <${process.env.EMAIL_USER}>`, // Sender address
//       to, // Recipient email
//       subject: "Welcome to TravelX!", // Subject line
//       html: `
//         <h1>Welcome to TravelX, Captain ${firstName}!</h1>
//         <p>We are thrilled to have you on board as a captain in our TravelX family.</p>
//         <p>Start your journey with us and make every ride a memorable one!</p>
//         <p>Happy Riding,<br/>The TravelX Team</p>
//       `,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     console.log("Welcome email sent successfully!");
//   } catch (error) {
//     console.error("Error sending welcome email:", error);
//     throw new Error("Failed to send welcome email.");
//   }
// };


//<a href="https://riding-app-vwiu.vercel.app/captain-login" class="button">Get Started</a>
// module.exports = sendWelcomeEmail;

const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, firstName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TravelX" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to TravelX!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Welcome to TravelX</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
            .container { background-color: #ffffff; width: 90%; max-width: 600px; margin: 30px auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .header { text-align: center; padding-bottom: 20px; }
            .header img { max-width: 150px; }
            .content { font-size: 16px; color: #333333; line-height: 1.6; }
            .footer { font-size: 12px; color: #999999; text-align: center; margin-top: 20px; }
            .button { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
   
            </div>
            <div class="content">
              <h2>Welcome aboard, Captain ${firstName}!</h2>
              <p>We’re thrilled to welcome you to the TravelX family. As a captain, you play an important role in making sure every ride is safe, smooth, and enjoyable.</p>
              <p>Start your journey today and let’s create amazing travel experiences together!</p>
           
              <p>Happy riding!<br>The TravelX Team</p>
            </div>
            <div class="footer">
              &copy; 2025 TravelX, All rights reserved.<br>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email.");
  }
};

module.exports = sendWelcomeEmail;
