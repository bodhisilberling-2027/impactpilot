import groupedAgents from '@/components/groupedAgents.config';
import { agentTags } from '@/components/agent-tags.config';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Grouped Agents:', groupedAgents);
  
  // Flatten the grouped agents into a single array
  const agents = Object.values(groupedAgents).flat();
  console.log('Flattened Agents:', agents);
  
  // Create documentation for each agent
  const docs = agents.map(agent => {
    const tags = agentTags[agent.id] || [];
    const preview = `Example usage of ${agent.id}:\n\n${agent.defaultConfig.systemPrompt}\n\nTags: ${tags.join(', ')}`;
    
    return {
      name: agent.id,
      type: tags[0] || 'general', // Use first tag as type
      preview
    };
  });

  console.log('Generated Docs:', docs);
  res.status(200).json(docs);
} 