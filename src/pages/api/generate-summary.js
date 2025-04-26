import { OpenAI } from 'openai';
import { runAgent } from '../../lib/agent-engine';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { text, tone } = req.body;

  const system = `You are a report summarization assistant. Return a one-paragraph summary in a ${tone} tone.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: text }
    ]
  });

  res.status(200).json({ summary: completion.choices[0].message.content });
}