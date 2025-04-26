import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const systemPrompt = 'You are a risk analysis expert. Evaluate potential risks across different categories (financial, operational, reputational, etc.) and provide detailed assessments with mitigation strategies.';
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ assessment: response });
  } catch (error) {
    console.error('Error analyzing risks:', error);
    res.status(500).json({ error: 'Failed to analyze risks' });
  }
}