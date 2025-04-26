import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const systemPrompt = 'You are an FAQ generator. Create relevant, comprehensive FAQs based on the input. Include both common and specific questions with clear, helpful answers.';
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ faqs: response });
  } catch (error) {
    console.error('Error generating FAQs:', error);
    res.status(500).json({ error: 'Failed to generate FAQs' });
  }
}