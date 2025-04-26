import type { NextApiRequest, NextApiResponse } from 'next';
import { callClaude } from '../../utils/claude';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { agent } = req.query;
  const input = req.body.input || '';

  try {
    const systemPrompt = `You are an expert ${agent} assistant. Provide detailed, accurate responses based on the input.`;
    const response = await callClaude(input, systemPrompt);
    res.status(200).json({ response });
  } catch (err: any) {
    res.status(500).json({ error: `Agent '${agent}' failed: ${err.message}` });
  }
}