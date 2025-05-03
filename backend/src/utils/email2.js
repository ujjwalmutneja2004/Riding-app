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
              <!-- Optional Logo Here -->
            </div>
            <div class="content">
              <h2>Welcome aboard, ${firstName}!</h2>
              <p>Thank you for joining the TravelX family! We're excited to have you on board and can’t wait for you to start exploring amazing travel opportunities.</p>
              <p>To get started, simply log in to your account and browse through our exciting travel options. Whether you're going on a business trip or a weekend getaway, we've got you covered!</p>
              <p>We look forward to making your travel experiences smooth and enjoyable.</p>
              <p>Happy travels!<br>The TravelX Team</p>
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
