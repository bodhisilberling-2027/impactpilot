import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { facts } = req.body;
    const recommendation = `✅ Based on: ${facts.slice(0, 50)}...\n→ Recommend Action Path A > B > Final Step`;
  
    res.status(200).json({ recommendation });
  }