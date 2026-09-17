import { Resend } from "resend";
import {
  emailVerificationTemplate,
  passwordResetTemplate,
  bookingConfirmationTemplate,
  newBookingAlertTemplate,
  bookingCancelledTemplate,
  welcomeEmailTemplate,
  reviewRequestTemplate,
  type BookingDetails,
} from "./email-templates";

// Lazily initialized to avoid crashing at build time when env vars are absent
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM || "noreply@rentgf.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const DEFAULT_HEADERS = {
  "X-Entity-Ref-ID": `rentgf-${Date.now()}`,
};

// ─── Auth emails ─────────────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Verify your RentGF email address",
    html: emailVerificationTemplate(name, verifyUrl),
    headers: DEFAULT_HEADERS,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Reset your RentGF password",
    html: passwordResetTemplate(resetUrl),
    headers: DEFAULT_HEADERS,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to RentGF, ${name}!`,
    html: welcomeEmailTemplate(name, `${APP_URL}/discover`),
    headers: DEFAULT_HEADERS,
  });
}

// ─── Booking emails ───────────────────────────────────────────────────────────

export async function sendBookingConfirmationEmail(
  email: string,
  customerName: string,
  booking: BookingDetails
) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Booking Confirmed — ${booking.companionName} on ${booking.date}`,
    html: bookingConfirmationTemplate(customerName, booking),
    headers: DEFAULT_HEADERS,
  });
}

export async function sendNewBookingAlertEmail(
  companionEmail: string,
  companionName: string,
  booking: BookingDetails & { customerName: string }
) {
  await getResend().emails.send({
    from: FROM,
    to: companionEmail,
    subject: `New Booking from ${booking.customerName} — ${booking.date}`,
    html: newBookingAlertTemplate(companionName, booking),
    headers: DEFAULT_HEADERS,
  });
}

export async function sendBookingCancelledEmail(
  email: string,
  recipientName: string,
  booking: { companionName: string; date: string; reason?: string }
) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Booking Cancelled — ${booking.companionName} on ${booking.date}`,
    html: bookingCancelledTemplate(recipientName, booking, `${APP_URL}/discover`),
    headers: DEFAULT_HEADERS,
  });
}

export async function sendReviewRequestEmail(
  email: string,
  customerName: string,
  companionName: string,
  bookingId: string
) {
  const reviewUrl = `${APP_URL}/customer/dashboard?review=${bookingId}`;
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `How was ${companionName}? Leave a review`,
    html: reviewRequestTemplate(customerName, companionName, reviewUrl),
    headers: DEFAULT_HEADERS,
  });
}
