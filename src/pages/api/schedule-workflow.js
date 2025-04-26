import { runAgent } from '../../lib/agent-engine';

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { task, deadline } = req.body;

  const prompt = `Given the task "${task}", break it down into steps and assign estimated dates based on this final deadline: ${deadline}.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: "You are a scheduling assistant that breaks tasks into steps and distributes them across a timeline." },
      { role: 'user', content: prompt }
    ]
  });

  res.status(200).json({ plan: completion.choices[0].message.content });
}