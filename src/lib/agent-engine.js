'use client';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const agentTemplates = {
  faq: (input) => ({
    type: 'faq',
    data: [
      { question: 'What is this about?', answer: `${input.slice(0, 50)}...` },
      { question: 'Who is this for?', answer: 'Nonprofits and teams' }
    ]
  }),

  persona: (input) => ({
    type: 'persona',
    data: {
      description: `Target persona for: ${input}`
    }
  }),

  summary: (text) => ({
    type: 'summary',
    text: `Summary: ${text.slice(0, 80)}...`
  }),

  checklist: (task) => ({
    type: 'checklist',
    steps: [
      `✅ Define: ${task}`,
      '📅 Set deadline',
      '🧠 Assign roles'
    ]
  }),

  sequence: (input) => ({
    type: 'email-sequence',
    emails: [
      `Email 1: ${input}`,
      'Email 2: Follow-up',
      'Email 3: Last call'
    ]
  }),

  metrics: () => ({
    type: 'metrics',
    values: {
      engagement: 'Good',
      revenue: 'Okay',
      retention: 'Poor'
    }
  }),

  event: (input) => ({
    type: 'event-description',
    text: `📅 Event Description: "${input.slice(0, 60)}..." - Confirm date & time.`
  }),

  "elevator-pitch": (input) => ({
    type: 'pitch',
    pitch: `🎤 Pitch: "${input.slice(0, 80)}..." — Compelling and clear.`
  }),

  "file-feedback": (input) => ({
    type: 'feedback',
    feedback: `📝 Feedback: Consider structure, tone, and clarity.\nExcerpt: "${input.slice(0, 70)}..."`
  }),

  timeline: (input) => ({
    type: 'timeline',
    phases: [
      'Start',
      'Midpoint',
      'Review',
      'Completion'
    ],
    context: input
  }),

  "action-items": (input) => ({
    type: 'actions',
    items: [
      'Follow up with team',
      'Schedule next meeting',
      'Clarify goals'
    ]
  }),

  outreach: (input) => ({
    type: 'email-draft',
    draft: `📨 Outreach Email:\nHi, I'm reaching out about "${input.slice(0, 60)}...". Let’s connect.`
  }),

  openai: async (input) => {
    await delay(1200);
    return { type: 'ai', response: `🤖 AI simulation of: "${input.slice(0, 60)}..."` };
  },

  reporter: (input) => ({
    type: 'report',
    report: `🗞️ Executive Summary Report: ${input.slice(0, 100)}...`
  }),

  explainer: (input) => ({
    type: 'explainer',
    explanation: `📚 Here's a breakdown of "${input}":\n- Concept\n- Implications\n- Next Steps`
  }),

  translator: (input) => ({
    type: 'translated',
    output: `🌐 Translated: ${input.split('').reverse().join('')}`
  }),

  classifier: (input) => ({
    type: 'classification',
    tags: ['Finance', 'Strategy', 'CSR'].filter(t => input.toLowerCase().includes(t.toLowerCase()))
  }),

  questioner: (input) => ({
    type: 'questions',
    list: [
      `❓ What is the core goal of "${input}"?`,
      '❓ Who are the stakeholders?',
      '❓ What metrics define success?'
    ]
  })
};

export function runAgent(name, input) {
  const agent = agentTemplates[name];
  if (!agent) return { type: 'error', message: `❌ Agent '${name}' not found.` };
  return typeof agent === 'function' ? agent(input) : agent.run(input);
}

export function getAgentDocs() {
  return Object.keys(agentTemplates).map((key) => {
    const exampleInput = 'example input';
    const output = agentTemplates[key](exampleInput);
    return {
      name: key,
      type: output?.type || 'text',
      preview: JSON.stringify(output, null, 2).slice(0, 200) + '...',
    };
  });
}
