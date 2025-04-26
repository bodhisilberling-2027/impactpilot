import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input, config } = req.body;
    const systemPrompt = `You are a volunteer matching expert. Match volunteers to opportunities based on skills, interests, and availability. Consider:
- Skill level: ${config?.skillLevel || 'any'}
- Availability: ${config?.availability || 'flexible'}
- Interest areas: ${config?.interestAreas?.join(', ') || 'all areas'}`;
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error matching volunteers:', error);
    res.status(500).json({ error: 'Failed to match volunteers' });
  }
}