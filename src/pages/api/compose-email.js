import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import { runAgent } from '../../lib/agent-engine';

export default async function handler(req, res) {
  const { prompt, tone, recipient } = req.body;

  const instruction = `Write a ${tone} email to a ${recipient} based on the following context: "${prompt}". Make it clear, concise, and appropriate for that audience.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert nonprofit communication assistant.' },
      { role: 'user', content: instruction }
    ]
  });

  res.status(200).json({ email: completion.choices[0].message.content });
}