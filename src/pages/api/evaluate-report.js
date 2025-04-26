import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { report } = req.body;
    const systemPrompt = 'You are an evaluation expert. Analyze reports and provide detailed feedback on content, structure, and recommendations for improvement.';
    
    const response = await callClaude(report, systemPrompt);
    res.status(200).json({ evaluation: response });
  } catch (error) {
    console.error('Error evaluating report:', error);
    res.status(500).json({ error: 'Failed to evaluate report' });
  }
}