import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const { transcript } = req.body;
  
    const notes = transcript
      .split('.')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 5)
      .map((s, i) => `• Note ${i + 1}: ${s}`)
      .join('\n');
  
    res.status(200).json({ notes });
  }