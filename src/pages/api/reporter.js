import { callClaude } from '../../utils/claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input, config } = req.body;
    const systemPrompt = `You are a data reporting expert. Analyze and report on data with:
- Report type: ${config?.reportType || 'analysis'}
- Data format: ${config?.dataFormat || 'detailed'}
- Style: ${config?.style || 'professional'}`;
    
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
}
