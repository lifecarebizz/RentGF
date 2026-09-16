// ─── Base layout wrapper ───────────────────────────────────────────────────
function baseLayout(content: string, previewText = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RentGF</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Preview text (hidden, shows in inbox preview) -->
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;color:#f4f4f5;">${previewText}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>` : ""}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;display:inline-block;"></div>
                <span style="font-size:22px;font-weight:700;color:#1e1b4b;letter-spacing:-0.5px;">RentGF</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">RentGF &mdash; Premium Companionship Marketplace</p>
              <p style="margin:0 0 8px;font-size:12px;color:#d1d5db;">18+ Only &bull; Non-Sexual &bull; Safe &amp; Verified</p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                <a href="#" style="color:#d1d5db;text-decoration:underline;">Unsubscribe</a>
                &nbsp;&bull;&nbsp;
                <a href="#" style="color:#d1d5db;text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Reusable components ────────────────────────────────────────────────────
function heroBanner(title: string, subtitle?: string) {
  return `
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 40px 32px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${title}</h1>
      ${subtitle ? `<p style="margin:0;font-size:15px;color:#c7d2fe;">${subtitle}</p>` : ""}
    </div>`;
}

function ctaButton(text: string, url: string) {
  return `
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,#4f46e5,#7c3aed);">
          <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">${text}</a>
        </td>
      </tr>
    </table>`;
}

function infoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size:13px;color:#9ca3af;width:40%;">${label}</td>
            <td style="font-size:14px;font-weight:600;color:#111827;text-align:right;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function divider() {
  return `<div style="height:1px;background:#f3f4f6;margin:24px 0;"></div>`;
}

// ─── 1. Email Verification ──────────────────────────────────────────────────
export function emailVerificationTemplate(name: string, verifyUrl: string) {
  const content = `
    ${heroBanner("Verify your email", "One quick step to activate your account")}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">
        Thanks for joining RentGF! Please verify your email address to complete your registration and start exploring verified companions.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("Verify Email Address", verifyUrl)}
      </div>
      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
        Button not working? Copy and paste this link into your browser:<br />
        <a href="${verifyUrl}" style="color:#4f46e5;word-break:break-all;">${verifyUrl}</a>
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#d1d5db;">Link expires in 24 hours.</p>
    </div>`;
  return baseLayout(content, `Hi ${name}, please verify your email to activate your RentGF account.`);
}

// ─── 2. Password Reset ──────────────────────────────────────────────────────
export function passwordResetTemplate(resetUrl: string) {
  const content = `
    ${heroBanner("Reset your password", "We received a request to reset your password")}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi there,</p>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">
        Click the button below to reset your password. If you didn't request this, you can safely ignore this email — your password won't change.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("Reset My Password", resetUrl)}
      </div>
      ${divider()}
      <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">This link expires in <strong>1 hour</strong>.</p>
      <p style="margin:0;font-size:13px;color:#9ca3af;">
        Or copy: <a href="${resetUrl}" style="color:#4f46e5;word-break:break-all;">${resetUrl}</a>
      </p>
    </div>`;
  return baseLayout(content, "Reset your RentGF password — link expires in 1 hour.");
}

// ─── 3. Booking Confirmation (Customer) ─────────────────────────────────────
export interface BookingDetails {
  companionName: string;
  date: string;
  time: string;
  duration: string;
  activityType?: string;
  amount: string;
  bookingId: string;
  dashboardUrl: string;
}

export function bookingConfirmationTemplate(customerName: string, booking: BookingDetails) {
  const content = `
    ${heroBanner("Booking Confirmed! 🎉", "Your companion has been notified")}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 20px;font-size:16px;color:#374151;">
        Hi <strong>${customerName}</strong>, your booking is confirmed!
      </p>

      <!-- Booking summary card -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Booking Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow("Companion", booking.companionName)}
          ${infoRow("Date", booking.date)}
          ${infoRow("Time", booking.time)}
          ${infoRow("Duration", booking.duration)}
          ${booking.activityType ? infoRow("Activity", booking.activityType) : ""}
          ${infoRow("Amount Paid", `INR ${booking.amount}`)}
        </table>
        <div style="margin-top:12px;padding-top:12px;border-top:2px solid #e5e7eb;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:13px;color:#6b7280;">Booking ID</td>
              <td style="font-size:12px;font-family:monospace;color:#9ca3af;text-align:right;">${booking.bookingId}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("View Booking Details", booking.dashboardUrl)}
      </div>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
        Need to cancel or have questions? Visit your dashboard or reply to this email.
      </p>
    </div>`;
  return baseLayout(content, `Your booking with ${booking.companionName} is confirmed for ${booking.date}.`);
}

// ─── 4. New Booking Alert (Companion) ───────────────────────────────────────
export function newBookingAlertTemplate(companionName: string, booking: BookingDetails & { customerName: string }) {
  const content = `
    ${heroBanner("New Booking Request", "A customer has booked your time")}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 20px;font-size:16px;color:#374151;">
        Hi <strong>${companionName}</strong>, you have a new confirmed booking!
      </p>

      <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Booking Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow("Customer", booking.customerName)}
          ${infoRow("Date", booking.date)}
          ${infoRow("Time", booking.time)}
          ${infoRow("Duration", booking.duration)}
          ${booking.activityType ? infoRow("Activity", booking.activityType) : ""}
          ${infoRow("Your Earnings", `INR ${booking.amount}`)}
        </table>
      </div>

      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("View in Dashboard", booking.dashboardUrl)}
      </div>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
        Please be available at the scheduled time. Contact the customer via the messaging system if needed.
      </p>
    </div>`;
  return baseLayout(content, `New booking from ${booking.customerName} on ${booking.date}.`);
}

// ─── 5. Booking Cancelled ───────────────────────────────────────────────────
export function bookingCancelledTemplate(
  recipientName: string,
  booking: { companionName: string; date: string; reason?: string },
  dashboardUrl: string
) {
  const content = `
    <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:40px 40px 32px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;">Booking Cancelled</h1>
      <p style="margin:0;font-size:15px;color:#fca5a5;">We're sorry to inform you</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi <strong>${recipientName}</strong>,</p>
      <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
        Your booking with <strong>${booking.companionName}</strong> on <strong>${booking.date}</strong> has been cancelled.
        ${booking.reason ? `<br /><br />Reason: <em>${booking.reason}</em>` : ""}
      </p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:14px;color:#991b1b;">If a payment was made, a refund will be processed within 5-7 business days.</p>
      </div>
      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("Browse Companions", dashboardUrl)}
      </div>
    </div>`;
  return baseLayout(content, `Your booking with ${booking.companionName} has been cancelled.`);
}

// ─── 6. Welcome Email ───────────────────────────────────────────────────────
export function welcomeEmailTemplate(name: string, dashboardUrl: string) {
  const content = `
    ${heroBanner("Welcome to RentGF! 👋", "Your account is ready")}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
      <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
        Welcome! You're now part of India's premium non-sexual companionship platform. Here's what you can do:
      </p>

      <!-- Feature list -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        ${[
          ["🔍", "Discover companions", "Browse verified companions by city, interests, and availability"],
          ["📅", "Book with ease", "Simple booking flow with secure Razorpay payments"],
          ["💬", "Message directly", "Chat with companions before booking"],
          ["⭐", "Leave reviews", "Share your experience after each booking"],
        ].map(([icon, title, desc]) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:24px;padding-right:16px;vertical-align:top;width:40px;">${icon}</td>
                  <td>
                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#111827;">${title}</p>
                    <p style="margin:0;font-size:13px;color:#9ca3af;">${desc}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`).join("")}
      </table>

      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("Start Exploring", dashboardUrl)}
      </div>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af;">Questions? Just reply to this email.</p>
    </div>`;
  return baseLayout(content, `Welcome to RentGF, ${name}! Start exploring verified companions.`);
}

// ─── 7. Review Request ──────────────────────────────────────────────────────
export function reviewRequestTemplate(
  customerName: string,
  companionName: string,
  reviewUrl: string
) {
  const content = `
    ${heroBanner("How was your experience?", `Your booking with ${companionName}`)}
    <div style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi <strong>${customerName}</strong>,</p>
      <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
        Your booking with <strong>${companionName}</strong> has been marked as completed. We'd love to hear your feedback!
        Your review helps other users and rewards great companions.
      </p>

      <!-- Stars row (decorative) -->
      <div style="text-align:center;margin-bottom:24px;font-size:32px;">⭐⭐⭐⭐⭐</div>

      <div style="text-align:center;margin-bottom:32px;">
        ${ctaButton("Leave a Review", reviewUrl)}
      </div>
      ${divider()}
      <p style="margin:0;font-size:13px;color:#d1d5db;">Takes less than a minute.</p>
    </div>`;
  return baseLayout(content, `How was your booking with ${companionName}? Leave a quick review!`);
}
