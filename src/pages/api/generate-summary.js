import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    const systemPrompt = 'You are a summarization expert. Create concise, informative summaries that capture the key points and main ideas.';
    
    const response = await callClaude(content, systemPrompt);
    res.status(200).json({ summary: response });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}