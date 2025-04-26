import { runAgent } from '../lib/agent-engine';

const tests = [
  {
    agent: 'summary',
    input: 'The quick brown fox jumps over the lazy dog.',
    expect: (out) => out.includes('Summary')
  },
  {
    agent: 'faq',
    input: 'How does this product work?',
    expect: (out) => out.includes('question') && out.includes('answer')
  },
  {
    agent: 'translator',
    input: 'Translate this text.',
    expect: (out) => out.split('').reverse().join('') === out.output
  }
];

(async () => {
  let passed = 0;
  for (const test of tests) {
    try {
      const output = await runAgent(test.agent, test.input);
      const text = typeof output === 'string' ? output : JSON.stringify(output);
      const ok = test.expect(text);
      console.log(`✅ ${test.agent}: ${ok ? 'PASS' : 'FAIL'}`);
      if (ok) passed++;
    } catch (err) {
      console.error(`❌ ${test.agent} threw error:`, err);
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed.`);
})();
