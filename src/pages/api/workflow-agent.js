import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { task } = req.body;
    const systemPrompt = 'You are a workflow automation expert. Analyze tasks and suggest efficient workflows, automation opportunities, and process improvements.';
    
    const response = await callClaude(task, systemPrompt);
    res.status(200).json({ workflow: response });
  } catch (error) {
    console.error('Error processing workflow:', error);
    res.status(500).json({ error: 'Failed to process workflow' });
  }
}