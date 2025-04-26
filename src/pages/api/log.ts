import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { agent, input, output } = req.body;

  const { error } = await supabase.from('agent_logs').insert([
    { agent, input, output }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}