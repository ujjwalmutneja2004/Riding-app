const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, firstName) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: '"TravelX" <your-email@example.com>', // Sender address
      to, // Recipient email
      subject: "Welcome to TravelX!", // Subject line
      html: `
        <h1>Welcome to TravelX, Captain ${firstName}!</h1>
        <p>We are thrilled to have you on board as a captain in our TravelX family.</p>
        <p>Start your journey with us and make every ride a memorable one!</p>
        <p>Happy Riding,<br/>The TravelX Team</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email.");
  }
};

module.exports = sendWelcomeEmail;