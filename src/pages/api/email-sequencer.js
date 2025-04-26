import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const sequence = [
      `Email 1: Introduction\nSubject: Quick Intro\nBody: Here's why this matters: ${input.slice(0, 60)}...`,
      "Email 2: Follow-up",
      "Email 3: Final nudge"
    ].join('\n\n');
  
    res.status(200).json({ sequence });
  }