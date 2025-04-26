import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { transcript } = req.body;
    const summary = `🔊 Voice Summary: Key speaker emphasized "${transcript.slice(0, 50)}..."`;
  
    res.status(200).json({ summary });
  }