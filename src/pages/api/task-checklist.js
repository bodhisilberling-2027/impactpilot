import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { task } = req.body;
    const checklist = `✅ Checklist for: ${task}\n- Define goal\n- List milestones\n- Assign roles\n- Set deadline`;
  
    res.status(200).json({ checklist });
  }