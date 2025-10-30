const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendTemporaryPasswordEmail(email, tempPassword) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Temporary Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Temporary Password</h2>
        <p>You requested a password reset. Here is your temporary password:</p>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; 
                    border-radius: 5px; font-size: 24px; font-weight: bold; 
                    text-align: center; letter-spacing: 2px;">
          ${tempPassword}
        </div>
        <p><strong>Important:</strong> Please log in with this temporary password and change it immediately in your profile settings.</p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please contact support immediately.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendTemporaryPasswordEmail };