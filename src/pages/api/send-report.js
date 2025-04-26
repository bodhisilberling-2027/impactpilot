import { runAgent } from '../../lib/agent-engine';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // set this in your .env file

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, content } = req.body;

  if (!email || !content) {
    return res.status(400).json({ message: 'Missing email or content' });
  }

  try {
    const result = await resend.emails.send({
      from: 'impact@yourdomain.com',
      to: email,
      subject: 'Your Generated Impact Report',
      text: content,
    });

    return res.status(200).json({ message: 'Email sent', id: result.id });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}