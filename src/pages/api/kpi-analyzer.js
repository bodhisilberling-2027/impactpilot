import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { notes } = req.body;
    const table = `Metric       | Status\n------------ | ---------\nEngagement   | ✅ Good\nRevenue      | ⚠️ Watch\nRetention    | 🔴 Low\n\nNotes: ${notes.slice(0, 60)}...`;
  
    res.status(200).json({ table });
  }