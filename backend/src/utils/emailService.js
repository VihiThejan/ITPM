import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const sendOtpEmail = async (toEmail, firstName, otp) => {
  const mailOptions = {
    from: `"SLIIT Nest" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your SLIIT Nest Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1a1a2e; margin-bottom: 4px;">SLIIT Nest</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Boarding Management System</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="color: #111827; font-size: 16px;">Hi <strong>${firstName}</strong>,</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Thank you for registering with SLIIT Nest. Use the verification code below to activate your account.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background: #f3f4f6; border: 1px dashed #9ca3af; border-radius: 8px; padding: 20px 40px;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase;">Verification Code</p>
            <p style="margin: 8px 0 0; font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #1a1a2e;">${otp}</p>
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This code expires in <strong>10 minutes</strong>.
        </p>
      </div>
    `
  };

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("\n⚠️ Email credentials not configured. Skipping email send.");
    console.warn(`[MOCK EMAIL] To: ${toEmail} | OTP Code: ${otp}\n`);
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};
