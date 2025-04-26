import { OpenAI } from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import { runAgent } from '../../lib/agent-engine';

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({ apiKey: process.env.API_KEY });

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const filePath = files.file[0].filepath;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You review uploaded reports for completeness, clarity, and missing impact sections.' },
        { role: 'user', content: `Here is the report:\n\n${fileContent}` }
      ]
    });

    res.status(200).json({ feedback: completion.choices[0].message.content });
  });
}