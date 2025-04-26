import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AgentConfig {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  model?: string;
  // Agent-specific fields
  tone?: string;
  style?: string;
  format?: string;
  audience?: string;
  length?: 'short' | 'medium' | 'long';
  complexity?: 'simple' | 'moderate' | 'technical';
  purpose?: string;
}

export async function saveFlow(
  name: string, 
  steps: string[], 
  notes: Record<string, string> = {},
  configs: Record<string, AgentConfig> = {}
) {
  const { error } = await supabase.from('agent_flows').insert({ 
    name, 
    steps, 
    notes,
    configs,
    created_at: new Date().toISOString()
  });
  if (error) throw new Error(error.message);
}

export async function loadFlows() {
  const { data, error } = await supabase.from('agent_flows').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteFlow(id: string) {
  const { error } = await supabase.from('agent_flows').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function loadFlowsPaginated(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('agent_flows')
    .select('*')
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data;
}

export async function searchFlowsByName(query: string) {
  const { data, error } = await supabase
    .from('agent_flows')
    .select('*')
    .ilike('name', `%${query}%`);
  if (error) throw new Error(error.message);
  return data;
}

export async function getFlowById(id: string) {
  const { data, error } = await supabase.from('agent_flows').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateFlow(id: string, updates: { name?: string; steps?: any[]; notes?: Record<string, any> }) {
  const { error } = await supabase.from('agent_flows').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getUserFlows(userId: string) {
  const { data, error } = await supabase
    .from('agent_flows')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
}

