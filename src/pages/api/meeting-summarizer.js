import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { notes } = req.body;
    const summary = `📝 Summary: The meeting discussed key topics such as ${notes.slice(0, 40)}... Focused on priorities and next steps.`;
  
    res.status(200).json({ summary });
  }