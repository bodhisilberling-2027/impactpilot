'use client';

import React from 'react';
import groupedAgents from './groupedAgents.config';

export default function AgentPanel({ id, api, input, output, loading, duration, onChange, onRun }) {
  // Find the agent config to get the display name
  const agentConfig = Object.values(groupedAgents)
    .flat()
    .find(agent => agent.id === id);
  const displayName = agentConfig ? agentConfig.displayName : id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <div className="bg-[#1c1c1c] p-6 border border-gray-700 rounded-xl">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">✨ {displayName}</h2>

      <textarea
        className="w-full h-48 p-4 rounded-lg bg-[#0f0f0f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none shadow-inner mb-4"
        placeholder={`Enter input for ${displayName}...`}
        value={input}
        onChange={e => onChange(id, e.target.value)}
      />

      <button
        onClick={() => onRun(api, id)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
      >
        🔁 Run Agent
      </button>

      {loading ? (
        <div className="mt-6 text-yellow-400 animate-pulse text-sm">⚡ Generating...</div>
      ) : output ? (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">Output:</div>
            {duration ? (
              <div className="text-sm text-gray-400">⚡ {duration} ms</div>
              ) : null}
          </div>
          <pre className="text-green-400 bg-black p-4 rounded-lg overflow-auto whitespace-pre-wrap text-sm border border-gray-700">
            {output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}