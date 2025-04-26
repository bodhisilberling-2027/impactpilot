import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { text } = req.body;
    const suggestions = `🧪 QA Suggestions:\n- Fix tone in paragraph 2\n- Add citations to claims\n- Clarify goal in last sentence\n\nSample: "${text.slice(0, 40)}..."`;
  
    res.status(200).json({ suggestions });
  }