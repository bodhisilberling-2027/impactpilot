import { runAgent } from '../../lib/agent-engine';

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { draft } = req.body;

  const prompt = `You are an expert in nonprofit impact reporting. Evaluate this draft and suggest improvements for clarity, structure, metrics, tone, and persuasiveness:\n\n${draft}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You help nonprofits write better impact reports.' },
      { role: 'user', content: prompt }
    ]
  });

  res.status(200).json({ feedback: completion.choices[0].message.content });
}