import { NextResponse } from 'next/server';
import { callClaude } from '@/utils/claude';

export async function POST(request, { params }) {
  const { agent } = params;
  const { input } = await request.json();

  // Agent implementations with Claude
  const agentHandlers = {
    meeting: async (input) => {
      const systemPrompt = 'You are a meeting notes processor. Extract key points, decisions, and action items from the meeting notes. Format the output in a clear, structured way.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    notetaker: async (input) => {
      const systemPrompt = 'You are a professional notetaker. Create well-structured, organized notes from the input. Include headings, bullet points, and highlight important information.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    "action-items": async (input) => {
      const systemPrompt = 'You are an action item extractor. Identify and list all action items from the input. For each action item, include who is responsible and any deadlines mentioned.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    persona: async (input) => {
      const systemPrompt = 'You are a persona generator. Create detailed user personas based on the input. Include demographics, goals, pain points, and behaviors.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    outreach: async (input) => {
      const systemPrompt = 'You are an outreach content generator. Create engaging outreach messages based on the input. Make them personalized and compelling.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    questioner: async (input) => {
      const systemPrompt = 'You are a question generator. Create relevant, insightful questions based on the input. Include both open-ended and specific questions.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    },
    explainer: async (input) => {
      const systemPrompt = 'You are an explainer. Break down complex concepts into clear, easy-to-understand explanations. Use examples and analogies when helpful.';
      const response = await callClaude(input, systemPrompt);
      return { response };
    }
  };

  try {
    const handler = agentHandlers[agent];
    if (!handler) {
      return NextResponse.json(
        { error: `Agent ${agent} not found` },
        { status: 404 }
      );
    }

    const result = await handler(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error processing agent ${agent}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 