import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { facts } = req.body;
    const systemPrompt = 'You are a decision tree expert. Analyze the facts and create a clear decision tree with recommended actions and their potential outcomes.';
    
    const response = await callClaude(facts, systemPrompt);
    res.status(200).json({ recommendation: response });
  } catch (error) {
    console.error('Error generating decision tree:', error);
    res.status(500).json({ error: 'Failed to generate decision tree' });
  }
}