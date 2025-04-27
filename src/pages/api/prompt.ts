// READ IN CSV HERE AND PASS TO PROMPTS - maybe a function that prompts call?!

export const prompts: Record<string,string> = {
    email: 'You are an email composition assistant. Create professional, engaging emails based on the given context.',
    report: 'Evaluate this draft and suggest improvements for clarity, structure, metrics, tone, and persuasiveness:',
    summary: 'You are a summarization expert. Create a concise, informative summarie of this information that best captures the key points and main ideas.',
    volunteer: 'Given the list of volunteers, their locations, and their interests, pick the top 5 that best match our non-profits goals and values. List their names, location, and location.',
}