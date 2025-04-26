import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const bio = `🎯 Target Persona:\n• Demographic: Young professionals\n• Goals: ${input}\n• Frustrations: Lack of tools\n• Channels: LinkedIn, Email`;
  
    res.status(200).json({ bio });
  }