// import nodemailer from "nodemailer";

import nodemailer from 'nodemailer';
// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function sendDeliveryOtpEmail(
  email: string,
  otp: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Order Delivery" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Delivery OTP",
      html: `
        <div style="font-family:Arial,sans-serif;padding:10px">
          <h2 style="color:#333;">Delivery Verification</h2>
          
          <p>Your order delivery OTP is:</p>
          
          <h1 style="letter-spacing:4px;color:#4f46e5;">
            ${otp}
          </h1>

          <p style="color:#555;">
            This OTP is valid for 10 minutes.
          </p>

          <p style="font-size:12px;color:gray;">
            Do not share this OTP with anyone.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId);

    return { success: true, message: "Email sent successfully" };

  } catch (error: any) {
    console.error("❌ Email Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to send email",
    };
  }
}