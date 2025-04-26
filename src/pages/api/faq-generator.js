import { runAgent } from '../../lib/agent-engine';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { input } = req.body;
    const faqs = [
      `Q: What is this about?\nA: ${input.slice(0, 50)}...`,
      "Q: Who should use this?\nA: Nonprofits, teams, or students.",
      "Q: How can I get started?\nA: Just paste your content and run."
    ].join('\n\n');
  
    res.status(200).json({ faqs });
  }