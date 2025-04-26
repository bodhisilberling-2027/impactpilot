import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const systemPrompt = 'You are a presentation expert. Create a detailed slide deck outline with clear sections, key points, and suggested visuals based on the input.';
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ outline: response });
  } catch (error) {
    console.error('Error generating slide outline:', error);
    res.status(500).json({ error: 'Failed to generate slide outline' });
  }
}