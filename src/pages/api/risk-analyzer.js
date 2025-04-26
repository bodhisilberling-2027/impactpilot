import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const assessment = `⚠️ Risk Assessment:\n- Financial: Moderate\n- Reputational: Low\n- Operational: High\n\nContext: ${input.slice(0, 50)}...`;
  
    res.status(200).json({ assessment });
  }