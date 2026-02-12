import nodemailer from "nodemailer";

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  if (SMTP_PASS.includes("REPLACE_WITH_GMAIL_APP_PASSWORD")) {
    throw new Error("SMTP_PASS is not configured with a real Gmail App Password");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async ({ to, otpCode }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[OTP DEV] OTP for ${to}: ${otpCode}`);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject: "Verify your Chat App account",
    text: `Your Chat App OTP is ${otpCode}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h2>Chat App Verification</h2>
        <p>Your OTP code is:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px;">${otpCode}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};
