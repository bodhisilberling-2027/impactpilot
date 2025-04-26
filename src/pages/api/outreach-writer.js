import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const draft = `Hi there,\n\nI'm reaching out because ${input.slice(0, 70)}...\nLet’s chat!`;
  
    res.status(200).json({ draft });
  }