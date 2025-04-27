import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { prompts } from './prompt';
import type { ContentBlock, TextBlock } from '@anthropic-ai/sdk/resources/messages';

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY,
});

function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text';
}

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
  const { type: agent, context } = body;
  const input = body[agent];
  
  let prompt;
  try {
    prompt = prompts[agent];
  } catch (err: any) {
    res.status(500).json({ error: `Task '${agent}' does not exist: ${err.message}`});
  }

  let history = context
    .map(c => JSON.stringify(c))
    .join('');

  let claude_prompt = `${prompt}
  
  The user may or may not refer to previous chats' content.
  Use your own judgement to determine if the user's messages reference any previous content, and respond appropriately.
  Here are the last one or more chats:

  ${history}

  Finally, here is the user input you must respond to:
  ${input}.
  `;
  console.log(claude_prompt);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      messages: [
        { role: 'user', content: claude_prompt },
      ],
      max_tokens: 512,
    });
    console.log(response);

    const blocks: ContentBlock[] = response.content;
    const fullText = blocks
      .filter(isTextBlock)
      .map(b => b.text)
      .join('');
    console.log(fullText);

    res.status(200).json({ response: fullText });
  } catch (err: any) {
    res.status(500).json({ error: `Task '${agent}' failed: ${err.message}` });
  }
}