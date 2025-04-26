'use client';

import React from 'react';

interface AgentConfig {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  model?: string;
}

interface AgentConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  config: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

const defaultConfigs: Record<string, AgentConfig> = {
  faq: {
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are a helpful FAQ generator.',
    model: 'claude-3-opus-20240229',
  },
  summary: {
    temperature: 0.5,
    maxTokens: 1500,
    systemPrompt: 'You are a concise summarizer.',
    model: 'claude-3-opus-20240229',
  },
  explainer: {
    temperature: 0.8,
    maxTokens: 2500,
    systemPrompt: 'You are an expert at explaining complex topics.',
    model: 'claude-3-opus-20240229',
  },
  outreach: {
    temperature: 0.9,
    maxTokens: 1000,
    systemPrompt: 'You are a professional outreach message composer.',
    model: 'claude-3-opus-20240229',
  },
};

export default function AgentConfigPopup({ isOpen, onClose, agentName, config, onSave }: AgentConfigPopupProps) {
  const [localConfig, setLocalConfig] = React.useState<AgentConfig>(config);

  React.useEffect(() => {
    if (isOpen) {
      setLocalConfig(config || defaultConfigs[agentName] || {});
    }
  }, [isOpen, config, agentName]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#222] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-indigo-400 mb-4">
          Configure {agentName}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localConfig.temperature || 0.7}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-sm text-gray-400 mt-1">{localConfig.temperature}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Max Tokens</label>
            <input
              type="number"
              value={localConfig.maxTokens || 2000}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">System Prompt</label>
            <textarea
              value={localConfig.systemPrompt || ''}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
              rows={3}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Model</label>
            <select
              value={localConfig.model || 'claude-3-opus-20240229'}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, model: e.target.value }))}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 