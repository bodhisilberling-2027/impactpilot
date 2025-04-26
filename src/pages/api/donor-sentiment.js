import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const sentiment = input.toLowerCase().includes('thank') ? '💚 Positive' : '🤔 Mixed';
  
    res.status(200).json({ sentiment });
  }