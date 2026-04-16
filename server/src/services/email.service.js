/**
 * Service to simulate email notifications for the assignment.
 * In a real-world scenario, this would use Resend, SendGrid, or Nodemailer.
 */

exports.sendEmail = async ({ to, subject, html }) => {
  console.log("\n" + "=".repeat(60));
  console.log(`✉️ MULTIPART MOCK EMAIL NOTIFICATION`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("-".repeat(60));
  console.log(html.replace(/<[^>]+>/g, "")); // Strip basic HTML for terminal readability
  console.log("=".repeat(60) + "\n");
};

exports.sendConfirmationEmail = async (booking) => {
  return this.sendEmail({
    to: booking.email,
    subject: `Confirmed: ${booking.eventType.title} with you`,
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hi ${booking.name},</p>
      <p>Your meeting <strong>${booking.eventType.title}</strong> has been scheduled.</p>
      <hr />
      <p><strong>When:</strong> ${new Date(booking.startTime).toLocaleString()} (UTC)</p>
      <p><strong>Duration:</strong> ${booking.eventType.duration} mins</p>
      <br/>
      <p>Need to make a change? You can reschedule your meeting anytime using the dashboard.</p>
    `,
  });
};

exports.sendCancellationEmail = async (booking) => {
  return this.sendEmail({
    to: booking.email,
    subject: `Cancelled: ${booking.eventType.title}`,
    html: `
      <h2>Booking Cancelled</h2>
      <p>Hi ${booking.name},</p>
      <p>Your meeting <strong>${booking.eventType.title}</strong> has been cancelled.</p>
    `,
  });
};

exports.sendRescheduleEmail = async (booking) => {
  return this.sendEmail({
    to: booking.email,
    subject: `Rescheduled: ${booking.eventType.title}`,
    html: `
      <h2>Booking Rescheduled</h2>
      <p>Hi ${booking.name},</p>
      <p>Your meeting <strong>${booking.eventType.title}</strong> has been successfully rescheduled.</p>
      <hr />
      <p><strong>New Time:</strong> ${new Date(booking.startTime).toLocaleString()} (UTC)</p>
    `,
  });
};
