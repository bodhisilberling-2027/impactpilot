import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const systemPrompt = 'You are an email composition assistant. Create professional, engaging emails based on the given context.';
    
    const response = await callClaude(prompt, systemPrompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error composing email:', error);
    res.status(500).json({ error: 'Failed to compose email' });
  }
}
