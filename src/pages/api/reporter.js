import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
  const { req_type, report } = JSON.parse(req.body);

  const instruction = `Evaluate this draft and suggest improvements for clarity, structure, metrics, tone, and persuasiveness:\n\n${report}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    messages: [
      { role: 'user', content: instruction },
    ],
    max_tokens: 512,
  });

  res.status(200).json({ response : response.content });
  const { res_type, text } = response.content[0];
}
