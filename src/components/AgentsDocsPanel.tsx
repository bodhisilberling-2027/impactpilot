import React, { useEffect, useState } from 'react';

// Define valid agent types
type AgentType = 'compose-email' | 'reporter' | 'summary' | 'volunteer-match';

const VALID_AGENTS: AgentType[] = ['compose-email', 'reporter', 'summary', 'volunteer-match'];

type AgentDoc = {
  name: AgentType;
  type: string;
  preview: string;
};

export default function AgentDocsPanel() {
  const [docs, setDocs] = useState<AgentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then((data: AgentDoc[]) => {
        console.log('API Response:', data);
        // Filter to only show valid agents
        const validDocs = data.filter(doc => {
          console.log('Checking doc:', doc.name, 'Valid:', VALID_AGENTS.includes(doc.name as AgentType));
          return VALID_AGENTS.includes(doc.name as AgentType);
        });
        console.log('Filtered Docs:', validDocs);
        setDocs(validDocs);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get('agent');
    const input = params.get('input');
    if (agent && input && VALID_AGENTS.includes(agent as AgentType)) {
      setInputs(prev => ({ ...prev, [agent]: input }));
      setExpanded(prev => ({ ...prev, [agent]: true }));
      setFilterType('');
      setSearch(agent);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleTest = async (agent: string) => {
    const input = inputs[agent] || '';
    const res = await fetch(`/api/${agent}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await res.json();
    const output = typeof data.response === 'string' ? data.response : JSON.stringify(data.response, null, 2);

    setResponses(prev => ({ ...prev, [agent]: output }));

    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, input, output })
    });

    const params = new URLSearchParams({ agent, input });
    setShareLinks(prev => ({ ...prev, [agent]: `${window.location.origin}/docs?${params.toString()}` }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleExpanded = (agent: string) => {
    setExpanded(prev => ({ ...prev, [agent]: !prev[agent] }));
  };

  const filteredDocs = docs.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType ? doc.type === filterType : true)
  );

  const allTypes = Array.from(new Set(docs.map(doc => doc.type)));

  if (loading) return <div className="text-gray-400">Loading agent documentation...</div>;

  return (
    <div className={`p-6 space-y-6 min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-indigo-400">🤖 Agent Documentation</h1>
        <div className="flex gap-3">
          <input
            className="text-sm px-2 py-1 rounded border border-gray-500"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm px-2 py-1 rounded border border-gray-500"
          >
            <option value="">All Types</option>
            {allTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <button onClick={toggleTheme} className="text-sm bg-yellow-500 text-black px-3 py-1.5 rounded">
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">Auto-generated documentation of all available agents.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocs.map((agent: AgentDoc) => (
          <div key={agent.name} className={`rounded-xl border p-4 shadow-md ${theme === 'dark' ? 'bg-[#121212] border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className="text-lg font-semibold text-indigo-400">{agent.name}</h2>
            <p className="text-xs text-gray-400 mb-2">Type: <code>{agent.type}</code></p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleExpanded(agent.name)}
                className="text-xs text-indigo-300 underline"
              >
                {expanded[agent.name] ? 'Collapse' : 'Expand'} Preview
              </button>
              <button
                onClick={() => handleCopy(agent.preview)}
                className="text-xs text-yellow-400 hover:underline"
              >
                📋 Copy
              </button>
            </div>
            {expanded[agent.name] && (
              <pre className={`mt-2 text-xs p-3 rounded overflow-x-auto whitespace-pre-wrap ${theme === 'dark' ? 'bg-[#1a1a1a] text-green-400' : 'bg-white text-gray-700 border border-gray-300'}`}>
                {agent.preview}
              </pre>
            )}

            <input
              placeholder="Try this agent with custom input..."
              className={`mt-3 w-full px-3 py-1.5 text-sm rounded border ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-600 text-white' : 'bg-white border-gray-400 text-black'}`}
              value={inputs[agent.name] || ''}
              onChange={(e) => setInputs(prev => ({ ...prev, [agent.name]: e.target.value }))}
            />
            <button
              onClick={() => handleTest(agent.name)}
              className="mt-2 w-full bg-indigo-600 text-white px-3 py-1.5 rounded text-sm"
            >
              ▶️ Run Agent
            </button>
            {responses[agent.name] && (
              <>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs font-semibold text-gray-400">Response</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(responses[agent.name])}
                      className="text-xs text-yellow-400 hover:underline"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => handleCopy(shareLinks[agent.name])}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      🔗 Copy Link
                    </button>
                  </div>
                </div>
                <pre className={`text-xs mt-1 p-3 rounded overflow-x-auto whitespace-pre-wrap ${theme === 'dark' ? 'bg-black text-green-300' : 'bg-gray-100 text-gray-800 border border-gray-300'}`}>
                  {responses[agent.name]}
                </pre>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}