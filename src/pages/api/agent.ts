import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { prompts } from './prompt';
import { json } from 'stream/consumers';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  let body;
  if (typeof req.body === 'string') {
    body = JSON.parse(req.body);
  } else {
    body = req.body;
  }
  const { type: agent } = body;
  const input = body[agent];
  
  let prompt;
  try {
    prompt = prompts[agent];
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
    console.log({response: response.content});
    res.status(200).json({ response: response.content });
  } catch (err: any) {
    res.status(500).json({ error: `Task '${agent}' failed: ${err.message}` });
  }
}