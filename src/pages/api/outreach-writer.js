import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const systemPrompt = 'You are an outreach expert. Create engaging, personalized outreach messages that are compelling and likely to get a response.';
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ draft: response });
  } catch (error) {
    console.error('Error generating outreach message:', error);
    res.status(500).json({ error: 'Failed to generate outreach message' });
  }
}