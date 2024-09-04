import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Email to the user confirming receipt of their message
    const reply = {
      to: email,
      from: 'contact@qmshealthcare.org',
      subject: `We received your message, ${name}`,
      text: "We received your message, and our team will contact you soon.",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Thank you for contacting us, ${name}!</h2>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p style="margin-top: 20px;">Here is a copy of your message:</p>
          <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; margin: 20px 0; color: #555;">
            ${message}
          </blockquote>
          <p>Best regards,</p>
          <p>The QMS Healthcare Team</p>
        </div>
      `,
    };

    // Email to your team with the user's message
    const msg = {
      to: 'info@qmshealthcare.org',
      from: 'contact@qmshealthcare.org',
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="margin-top: 20px;"><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; margin: 20px 0; color: #555;">
            ${message}
          </blockquote>
          <p>Please follow up with the contact as soon as possible.</p>
        </div>
      `,
    };

    try {
      // Send confirmation email to the user
      await resend.emails.send(reply);

      // Send notification email to the team
      await resend.emails.send(msg);

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'Failed to send emails' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
