import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { prompts } from 'prompts';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { agent, input } = JSON.parse(req.body);
  
  try {
    const prompt = prompts[agent];
  } catch (err: any) {
    res.status(500).json({ error: `Task '${agent}' does not exist: ${err.message}`});
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      messages: [
        { role: 'user', content: `${prompt}\n\nHere is the user input: ${input}` },
      ],
      max_tokens: 512,
    });
    res.status(200).json({ response });
  } catch (err: any) {
    res.status(500).json({ error: `Task '${agent}' failed: ${err.message}` });
  }
}