import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
  const { prompt, tone, recipient } = req.body;

  const instruction = `Write a ${tone} email to a ${recipient} based on the following context: "${prompt}". Make it clear, concise, and appropriate for that audience.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    messages: [
      { role: 'system', content: 'You are an expert nonprofit communication assistant.' },
      { role: 'user', content: instruction },
    ],
    max_tokens: 512,
  });

  res.status(200).json({ email: response.content });
}
