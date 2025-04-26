import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agent } = req.query;
  const { input, memory } = req.body;

  try {
    const result = await runAgent(agent, input, memory);
    res.status(200).json({ response: result });
  } catch (err) {
    res.status(500).json({ error: `Agent error: ${err.message}` });
  }
}