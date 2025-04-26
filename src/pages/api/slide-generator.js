import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const { input } = req.body;
  
    const outline = [
      "1. Executive Summary",
      "2. Problem Statement",
      "3. Solution Overview",
      "4. Key Metrics",
      "5. Call to Action"
    ].join('\n');
  
    res.status(200).json({ outline });
  }