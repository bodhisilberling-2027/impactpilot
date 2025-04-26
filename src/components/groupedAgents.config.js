const groupedAgents = {
  Communication: [{
    id: 'compose-email',
    defaultConfig: {
      temperature: 0.7,
      maxTokens: 2000,
      model: 'claude-3-sonnet',
      systemPrompt: 'You are an expert email composer. Write clear, professional emails that achieve the user\'s goals.'
    }
  }],
  Research: [{
    id: 'reporter',
    defaultConfig: {
      temperature: 0.3,
      maxTokens: 4000,
      model: 'claude-3-sonnet',
      systemPrompt: 'You are a thorough researcher. Analyze information and provide detailed, accurate reports.'
    }
  }, {
    id: 'summary',
    defaultConfig: {
      temperature: 0.4,
      maxTokens: 1500,
      model: 'claude-3-sonnet',
      systemPrompt: 'You are a concise summarizer. Create clear, accurate summaries of content while preserving key information.'
    }
  }],
  User: [{
    id: 'volunteer-match',
    defaultConfig: {
      temperature: 0.6,
      maxTokens: 2000,
      model: 'claude-3-sonnet',
      systemPrompt: 'You are a volunteer matching specialist. Help connect users with volunteer opportunities that match their interests and skills.'
    }
  }]
};

export default groupedAgents;