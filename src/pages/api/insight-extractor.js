import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const { input } = req.body;
    const response = `🔍 Insight: Based on your input, a key focus might be "${input.slice(0, 40)}..."`;
  
    res.status(200).json({ response });
  }