import type { NextApiRequest, NextApiResponse } from 'next';
import { getAgentDocs } from '../../lib/agent-engine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = getAgentDocs();
  res.status(200).json(docs);
}