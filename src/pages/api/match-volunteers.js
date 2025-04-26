import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { nonprofit, volunteers } = await req.json();

    if (!nonprofit || !volunteers || !Array.isArray(volunteers)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const prompt = `
      As a volunteer matching specialist, analyze the compatibility between a nonprofit and potential volunteers.
      
      Nonprofit Information:
      - Name: ${nonprofit.name}
      - Mission: ${nonprofit.mission}
      - Required Skills: ${nonprofit.requiredSkills.join(', ')}
      - Cause Areas: ${nonprofit.causes.join(', ')}
      - Location: ${nonprofit.location}
      - Time Commitment: ${nonprofit.timeCommitment}
      
      For each volunteer below, provide a compatibility score (0-100) and explanation:
      
      ${volunteers.map(v => `
        Volunteer: ${v.name}
        - Skills: ${v.skills.join(', ')}
        - Causes: ${v.causes.join(', ')}
        - Location: ${v.location}
        - Availability: ${Object.entries(v.availability)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(', ')}
        - Experience: ${v.experience}
      `).join('\n')}
      
      For each volunteer, consider:
      1. Skill match with nonprofit needs
      2. Alignment with nonprofit's cause areas
      3. Location compatibility
      4. Availability matching time commitment
      5. Relevant experience
      
      Provide a structured response with scores and detailed explanations for each volunteer.
    `;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    
    // Parse Claude's response to extract scores and explanations
    const matches = volunteers.map(volunteer => {
      // In a real implementation, we would parse Claude's response more carefully
      const score = Math.random() * 100; // Placeholder for demo
      return {
        volunteer,
        score,
        explanation: data.content[0].text
      };
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error matching volunteers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 