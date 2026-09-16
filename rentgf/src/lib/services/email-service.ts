import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "noreply@rentgf.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your RentGF email",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#4f46e5">Welcome to RentGF, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${link}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Verify Email</a>
        <p style="color:#6b7280;font-size:14px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your RentGF password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#4f46e5">Password Reset</h2>
        <p>You requested to reset your password. Click below to proceed.</p>
        <a href="${link}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password</a>
        <p style="color:#6b7280;font-size:14px">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendBookingConfirmationEmail(email: string, bookingDetails: {
  companionName: string;
  date: string;
  duration: string;
  amount: string;
  bookingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Booking Confirmed - ${bookingDetails.companionName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#4f46e5">Booking Confirmed!</h2>
        <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0">
          <p><strong>Companion:</strong> ${bookingDetails.companionName}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Duration:</strong> ${bookingDetails.duration}</p>
          <p><strong>Amount:</strong> INR ${bookingDetails.amount}</p>
          <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        </div>
        <a href="${APP_URL}/customer/dashboard" style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View Booking</a>
      </div>
    `,
  });
}
