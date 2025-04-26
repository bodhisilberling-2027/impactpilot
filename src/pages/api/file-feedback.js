import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

export default async function handler(req, res) {
  const { type, report } = req.body;

  const instruction = `Evaluate this draft and suggest improvements for clarity, structure, metrics, tone, and persuasiveness:\n\n${report}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    messages: [
      { role: 'system', content: "You are an expert in nonprofit impact reporting." },
      { role: 'user', content: instruction },
    ],
    max_tokens: 512,
  });

  res.status(200).json({ feedback : response.content });
}
