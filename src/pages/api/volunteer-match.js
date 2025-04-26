import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { description } = req.body;
    const matches = `🙋 Suggested Volunteer Profiles:\n1. Community Builder\n2. Logistics Coordinator\n3. Outreach Specialist\n\nBased on: ${description.slice(0, 60)}...`;
  
    res.status(200).json({ matches });
  }