import type { NextApiRequest, NextApiResponse } from 'next';
import { runAgent } from '../../lib/agent-engine'; // adjust if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { agent } = req.query;
  const input = req.body.input || '';

  try {
    const result = await runAgent(agent as string, input);
    res.status(200).json({ response: result });
  } catch (err: any) {
    res.status(500).json({ error: `Agent '${agent}' failed: ${err.message}` });
  }
}