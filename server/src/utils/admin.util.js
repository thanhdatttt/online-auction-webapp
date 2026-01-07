import nodemailer from "nodemailer";
import { config } from "../configs/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_APP,
    pass: config.PASSWORD_EMAIL_APP,
  },
});

const styles = {
  container: `background-color: #f3f4f6; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;`,
  wrapper: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`,
  header: `background-color: #2563eb; padding: 24px; text-align: center;`,
  headerText: `color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 1px;`,
  body: `padding: 32px; color: #374151; line-height: 1.6; font-size: 16px;`,
  buttonContainer: `text-align: center; margin-top: 32px; margin-bottom: 16px;`,
  button: `display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;`,
  footer: `background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;`,
  highlight: `color: #2563eb; font-weight: 600;`,
  blockquote: `border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 20px 0; color: #6b7280; font-style: italic;`,
  infoBox: `background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;`,
};

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Your Auctiz" <${config.EMAIL_APP}>`,
    to,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async (user, newPassword) => {
  const userName = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.username;

  await sendEmail(
    user.email,
    "[Auctiz] Your Password Has Been Reset",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #111827;">Password Reset Notification</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>An administrator has reset your password. You can now login with the following temporary password:</p>
          
          <div style="${styles.infoBox}">
            <p style="text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2563eb; margin: 10px 0;">
              ${newPassword}
            </p>
          </div>

          <p>Please login and change your password immediately for security reasons.</p>

          <div style="${styles.buttonContainer}">
            <a href="${config.CLIENT_URL}/signin" style="${styles.button}">Login Now</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};