import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

export default async function handler(req, res) {
  const { report } = req.body;

  const instruction = `Evaluate this draft and suggest improvements for clarity, structure, metrics, tone, and persuasiveness:\n\n${report}`;

  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 500,
    system: "You are an expert in nonprofit impact reporting.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: instruction
          }
        ]
      }
    ]
  });
  console.log(response.content);

  res.status(200).json({ feedback : response.content });
}
