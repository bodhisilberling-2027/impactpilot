'use client';

import React from 'react';

// Define valid agent types
type AgentType = 'compose-email' | 'reporter' | 'summary' | 'volunteer-match';

interface AgentConfig {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  model?: string;
  // Agent-specific fields
  tone?: string;
  style?: string;
  format?: string;
  length?: 'short' | 'medium' | 'long';
  purpose?: string;
  reportType?: string;
  dataFormat?: string;
  matchCriteria?: string[];
  skillLevel?: string;
  availability?: string;
  interestAreas?: string[];
}

interface AgentConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: AgentType;
  config: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

const defaultConfigs: Record<AgentType, AgentConfig> = {
  'compose-email': {
    temperature: 0.9,
    maxTokens: 1000,
    systemPrompt: 'You are a professional email composer.',
    model: 'claude-3-opus-20240229',
    tone: 'professional',
    purpose: 'connect',
    style: 'formal',
  },
  reporter: {
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are an expert data reporter and analyzer.',
    model: 'claude-3-opus-20240229',
    reportType: 'analysis',
    dataFormat: 'detailed',
    style: 'professional',
  },
  summary: {
    temperature: 0.5,
    maxTokens: 1500,
    systemPrompt: 'You are a concise summarizer.',
    model: 'claude-3-opus-20240229',
    style: 'concise',
    length: 'short',
  },
  'volunteer-match': {
    temperature: 0.8,
    maxTokens: 2000,
    systemPrompt: 'You are an expert volunteer matching assistant.',
    model: 'claude-3-opus-20240229',
    skillLevel: 'intermediate',
    availability: 'flexible',
    interestAreas: ['community', 'education'],
  },
};

const AgentSpecificFields = ({ agentName, config, onChange }: {
  agentName: AgentType;
  config: AgentConfig;
  onChange: (field: string, value: string | string[]) => void;
}) => {
  switch (agentName) {
    case 'compose-email':
      return (
        <>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Tone</label>
            <select
              value={config.tone || 'professional'}
              onChange={(e) => onChange('tone', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Purpose</label>
            <select
              value={config.purpose || 'connect'}
              onChange={(e) => onChange('purpose', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="connect">Connect</option>
              <option value="pitch">Sales Pitch</option>
              <option value="follow-up">Follow Up</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Style</label>
            <select
              value={config.style || 'formal'}
              onChange={(e) => onChange('style', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="formal">Formal</option>
              <option value="conversational">Conversational</option>
              <option value="direct">Direct</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </div>
        </>;

    case 'reporter':
      return (
        <>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Report Type</label>
            <select
              value={config.reportType || 'analysis'}
              onChange={(e) => onChange('reportType', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="analysis">Analysis</option>
              <option value="metrics">Metrics</option>
              <option value="trends">Trends</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Data Format</label>
            <select
              value={config.dataFormat || 'detailed'}
              onChange={(e) => onChange('dataFormat', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="detailed">Detailed</option>
              <option value="summary">Summary</option>
              <option value="visual">Visual</option>
              <option value="raw">Raw Data</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Style</label>
            <select
              value={config.style || 'professional'}
              onChange={(e) => onChange('style', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="professional">Professional</option>
              <option value="technical">Technical</option>
              <option value="executive">Executive</option>
              <option value="simplified">Simplified</option>
            </select>
          </div>
        </>;

    case 'summary':
      return (
        <>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Style</label>
            <select
              value={config.style || 'concise'}
              onChange={(e) => onChange('style', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
              <option value="bullet-points">Bullet Points</option>
              <option value="narrative">Narrative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Length</label>
            <select
              value={config.length || 'short'}
              onChange={(e) => onChange('length', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </>;

    case 'volunteer-match':
      return (
        <>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Skill Level</label>
            <select
              value={config.skillLevel || 'intermediate'}
              onChange={(e) => onChange('skillLevel', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Availability</label>
            <select
              value={config.availability || 'flexible'}
              onChange={(e) => onChange('availability', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="flexible">Flexible</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="full-time">Full Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Interest Areas</label>
            <select
              multiple
              value={config.interestAreas || ['community', 'education']}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                onChange('interestAreas', selected);
              }}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="community">Community</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="health">Health</option>
              <option value="arts">Arts</option>
              <option value="technology">Technology</option>
            </select>
          </div>
        </>;

    default:
      return null;
  }
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

  const handleFieldChange = (field: string, value: string | string[]) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
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
              onChange={(e) => handleFieldChange('temperature', e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-gray-400 mt-1">{localConfig.temperature}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Max Tokens</label>
            <input
              type="number"
              value={localConfig.maxTokens || 2000}
              onChange={(e) => handleFieldChange('maxTokens', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">System Prompt</label>
            <textarea
              value={localConfig.systemPrompt || ''}
              onChange={(e) => handleFieldChange('systemPrompt', e.target.value)}
              rows={3}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Model</label>
            <select
              value={localConfig.model || 'claude-3-opus-20240229'}
              onChange={(e) => handleFieldChange('model', e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2"
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>

          <AgentSpecificFields
            agentName={agentName}
            config={localConfig}
            onChange={handleFieldChange}
          />
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