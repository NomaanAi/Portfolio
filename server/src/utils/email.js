import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
  constructor(user, url = '') {
    this.to = user.email;
    this.name = user.name || 'User';
    this.from = `Portfolio <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }

  // Create a transporter
  newTransport() {
    if (process.env.EMAIL_SERVICE === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject, templateVars = {}) {
    try {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(
        `${__dirname}/../views/emails/${template}.pug`,
        {
          name: this.name,
          url: this.url,
          subject,
          ...templateVars,
        }
      );

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.error('Error sending email:', err);
      throw new Error('There was an error sending the email. Please try again later.');
    }
  }

  // Contact form submission
  async sendContactForm(message) {
    await this.send('contact', 'New Contact Form Submission', { message });
  }

  // Send welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to My Portfolio!');
  }

  // Send password reset email
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for 10 minutes)');
  }
}

export default Email;
