import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript } = req.body;
    const systemPrompt = 'You are a professional notetaker. Create well-structured, organized notes from the transcript. Include key points, action items, and important details.';
    
    const response = await callClaude(transcript, systemPrompt);
    res.status(200).json({ notes: response });
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ error: 'Failed to generate notes' });
  }
}