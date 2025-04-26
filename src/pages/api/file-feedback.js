import { callClaude } from '../../utils/claude';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    const systemPrompt = 'You are a document review expert. Provide constructive feedback on content, structure, and clarity while maintaining a supportive tone.';
    
    const response = await callClaude(content, systemPrompt);
    res.status(200).json({ feedback: response });
  } catch (error) {
    console.error('Error providing feedback:', error);
    res.status(500).json({ error: 'Failed to provide feedback' });
  }
}