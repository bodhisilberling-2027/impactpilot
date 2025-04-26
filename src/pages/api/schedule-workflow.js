import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflow } = req.body;
    const systemPrompt = 'You are a workflow scheduling expert. Analyze tasks and create optimized schedules with realistic timelines and dependencies.';
    
    const response = await callClaude(workflow, systemPrompt);
    res.status(200).json({ schedule: response });
  } catch (error) {
    console.error('Error scheduling workflow:', error);
    res.status(500).json({ error: 'Failed to schedule workflow' });
  }
}