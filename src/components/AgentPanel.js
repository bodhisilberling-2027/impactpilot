'use client';

import React from 'react';

export default function AgentPanel({ id, api, input, output, loading, duration, onChange, onRun }) {
  return (
    <div className="bg-[#1c1c1c] p-6 border border-gray-700 rounded-xl">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">✨ {id.charAt(0).toUpperCase() + id.slice(1)} Agent</h2>

      <textarea
        className="w-full h-48 p-4 rounded-lg bg-[#0f0f0f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none shadow-inner mb-4"
        placeholder={`Enter input for ${id}...`}
        value={input}
        onChange={e => onChange(id, e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <button
          onClick={() => onRun(api, id)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          🔁 Run Agent
        </button>
        {duration && <span className="text-sm text-gray-400">⚡ {duration} ms</span>}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-yellow-400 animate-pulse text-sm">⏳ Generating...</div>
        ) : (
          <pre className="mt-4 text-green-400 bg-black p-4 rounded-lg overflow-auto whitespace-pre-wrap text-sm border border-gray-700">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}