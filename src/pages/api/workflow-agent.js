import { runAgent } from '../../lib/agent-engine';

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { task } = req.body;

  const system = `You are a workflow optimization agent. Given a task, return a numbered list of steps to automate or streamline it.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: task }
    ]
  });

  res.status(200).json({ plan: completion.choices[0].message.content });
}