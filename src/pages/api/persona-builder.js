import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const systemPrompt = 'You are a persona development expert. Create detailed user personas that include demographics, goals, pain points, behaviors, and preferences.';
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ bio: response });
  } catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ error: 'Failed to generate persona' });
  }
}