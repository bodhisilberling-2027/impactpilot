'use client';

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import groupedAgents from './groupedAgents.config';
import AgentPanel from './AgentPanel';
import { io } from 'socket.io-client';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';

export default function AnalyticsDashboard() {
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io();
    socket.current.on('agent-update', ({ id, value }) => {
      setInputs(prev => ({ ...prev, [id]: value }));
    });
    return () => socket.current.disconnect();
  }, []);

  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState({});
  const [search, setSearch] = useState('');
  const [collabUsers, setCollabUsers] = useState(['You', 'Alex', 'Taylor']);
  const [theme, setTheme] = useState('dark');
  const [agentUsage, setAgentUsage] = useState({});
  const [notes, setNotes] = useState({});
  const dashboardRef = useRef(null);

  const [inputs, setInputs] = useState(() => JSON.parse(localStorage.getItem('impactpilot-inputs') || '{}'));
  const [outputs, setOutputs] = useState(() => JSON.parse(localStorage.getItem('impactpilot-outputs') || '{}'));
  const [autoRun, setAutoRun] = useState(true);
  const [startTime, setStartTime] = useState({});
  const [duration, setDuration] = useState({});
  const [history, setHistory] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    localStorage.setItem('impactpilot-inputs', JSON.stringify(inputs));
    localStorage.setItem('impactpilot-outputs', JSON.stringify(outputs));
  }, [inputs, outputs]);

  const handleChange = (id, value) => {
    if (socket.current) socket.current.emit('agent-update', { id, value });
    setUndoStack(prev => [...prev, { inputs, outputs }]);
    setRedoStack([]);
    const updated = { ...inputs, [id]: value };
    setInputs(updated);
    if (autoRun && id in outputs) handleAgent(`/api/${id}`, id);
  };

  const handleAgent = async (url, field, inputKey = 'input', outputKey = 'response') => {
    setStartTime(prev => ({ ...prev, [field]: Date.now() }));
    setLoading(prev => ({ ...prev, [field]: true }));
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [inputKey]: inputs[field] })
    });
    const data = await res.json();
    const timestamp = new Date().toLocaleString();
    setOutputs(prev => ({ ...prev, [field]: data[outputKey] }));
    const nextAgent = agentChains[field];
    if (nextAgent) {
      setInputs(prev => ({ ...prev, [nextAgent]: data[outputKey] }));
    }
    setHistory(prev => [{ id: field, timestamp, output: data[outputKey] }, ...prev.slice(0, 15)]);
    setDuration(prev => ({ ...prev, [field]: Date.now() - startTime[field] }));
    setLoading(prev => ({ ...prev, [field]: false }));

    const summaryText = data[outputKey].slice(0, 150) + '...';
    setSummaries(prev => ({ ...prev, [field]: summaryText }));
    setAgentUsage(prev => ({ ...prev, [field]: (prev[field] || 0) + 1 }));
  };

  const agentChains = {
    meeting: 'notetaker',
    notetaker: 'action-items',
    persona: 'outreach',
    questioner: 'explainer'
  };
  const exportPDF = async () => {
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save(); // ❌ likely source of your bug
  };

  const saveWorkspace = () => {
    const blob = new Blob([JSON.stringify({ inputs, outputs, history, notes })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impactpilot-workspace.json';
    a.click();
  };

  const onDrop = useDropzone({
    accept: '.csv, .pdf, .json',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (file.name.endsWith('.csv')) {
            const parsed = parse(reader.result, { header: true });
            setInputs(prev => ({ ...prev, csv: JSON.stringify(parsed.data.slice(0, 5)) }));
          } else if (file.name.endsWith('.json')) {
            try {
              const json = JSON.parse(reader.result);
              setInputs(prev => ({ ...prev, json: JSON.stringify(json) }));
            } catch {
              alert('Invalid JSON file');
            }
          } else if (file.name.endsWith('.pdf')) {
            setInputs(prev => ({ ...prev, summary: `PDF Uploaded: ${file.name}` }));
          }
        };
        reader.readAsText(file);
      });
    }
  });

  const loadWorkspace = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { inputs: inData, outputs: outData, history: hist, notes: savedNotes } = JSON.parse(reader.result);
        setInputs(inData || {});
        setOutputs(outData || {});
        setHistory(hist || []);
        setNotes(savedNotes || {});
      } catch {
        alert('Invalid workspace');
      }
    };
    reader.readAsText(file);
  };

  const exportHistory = (format = 'json') => {
    const content = format === 'csv'
      ? 'Agent,Timestamp,Output\n' + history.map(h => `${h.id},${h.timestamp},"${h.output.replace(/"/g, '""')}"`).join('\n')
      : JSON.stringify(history, null, 2);
    const blob = new Blob([content], { type: 'text/' + format });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impactpilot-history.${format}`;
    a.click();
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'high-contrast' : 'dark';
    setTheme(next);
    localStorage.setItem('impactpilot-theme', next);
  };

  return (
    <div className={`p-6 min-h-screen font-sans ${theme === 'dark' ? 'bg-[#101010] text-white' : theme === 'light' ? 'bg-white text-black' : 'bg-yellow-100 text-black'}`}>
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">ImpactPilot</h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button onClick={() => exportHistory('json')} className="bg-gray-800 text-white text-xs px-3 py-1 rounded">📤 Export JSON</button>
          <button onClick={() => exportHistory('csv')} className="bg-gray-800 text-white text-xs px-3 py-1 rounded">📊 Export CSV</button>
        </div>
        <button onClick={saveWorkspace} className="bg-blue-600 px-4 py-1.5 rounded text-sm">💾 Save</button>
        <label className="bg-green-600 px-4 py-1.5 rounded text-sm cursor-pointer">
          📂 Load
          <input type="file" onChange={loadWorkspace} className="hidden" />
        </label>
        <button onClick={exportPDF} className="bg-purple-600 px-4 py-1.5 rounded text-sm">📄 Export</button>
        <button onClick={toggleTheme} className="ml-auto bg-yellow-500 text-black text-sm px-3 py-1.5 rounded">🎨 Theme</button>
        <input
          className="px-3 py-1.5 rounded bg-[#1a1a1a] border border-gray-700 text-sm"
          placeholder="🔍 Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value.toLowerCase())}
        />
      </div>

      <div className="text-sm text-indigo-300 mb-4">
        👥 Collaborators online: {collabUsers.join(', ')}
      </div>

      <div className="mt-4 text-sm text-gray-400">📉 Most Used Agents: {Object.entries(agentUsage).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k} (${v})`).join(', ')}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(groupedAgents).map(([group, agentList]) => {
          const filtered = agentList.filter(agent => agent.id.toLowerCase().includes(search));
          if (!filtered.length) return null;
          return (
            <div key={group} className="bg-[#161616] border border-gray-700 p-4 rounded-xl">
              <h2 className="text-lg text-indigo-300 font-semibold mb-2">{group}</h2>
              <div className="flex flex-wrap gap-2">
                {filtered.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => setTab(agent.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${tab === agent.id ? 'bg-indigo-500 text-white' : 'bg-[#1f1f1f] text-gray-300 border border-gray-600 hover:bg-[#2a2a2a]'}`}
                  >
                    {agent.id} ({agentUsage[agent.id] || 0})
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        {tab === 'dashboard' && (
          <div ref={dashboardRef} className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">📊 Dashboard</h2>
            <p className="text-sm text-gray-400 mb-3">Live feed of actions and agent responses.</p>
            {history.map((h, i) => (
              <div key={i} className="mt-4 text-sm text-gray-400 border-t border-gray-700 pt-2">
                <strong>{h.id}</strong> @ {h.timestamp}
                <pre className="text-green-300 bg-black p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">{h.output}</pre>
                {summaries[h.id] && (
                  <div className="text-yellow-300 text-xs mt-1">
                    <strong>Summary:</strong> {summaries[h.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab && tab !== 'dashboard' && (
          <AgentPanel
            id={tab}
            api={`/api/${tab}`}
            input={inputs[tab] || ''}
            output={outputs[tab] || ''}
            loading={loading[tab]}
            duration={duration[tab]}
            notes={notes[tab] || ''}
            onChange={handleChange}
            onRun={handleAgent}
            onNoteChange={(text) => setNotes(prev => ({ ...prev, [tab]: text }))}
          />
        )}
      </div>
    </div>
  );
}
