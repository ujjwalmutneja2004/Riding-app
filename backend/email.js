const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, firstName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail business email, e.g., ridewithTravelx@gmail.com
        pass: process.env.EMAIL_PASS,  // Use an App Password, NOT your Gmail login password
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
            .content { font-size: 16px; color: #333333; line-height: 1.6; }
            .footer { font-size: 12px; color: #999999; text-align: center; margin-top: 20px; }
            .button { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TravelX</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, Captain ${firstName}!</h2>
              <p>We’re thrilled to welcome you to the TravelX family. As a captain, you play an important role in making sure every ride is safe, smooth, and enjoyable.</p>
              <p>Start your journey today and let’s create amazing travel experiences together!</p>
              <p>Happy riding!<br>The TravelX Team</p>
            </div>
            <div class="footer">
              &copy; 2025 TravelX, All rights reserved.
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
