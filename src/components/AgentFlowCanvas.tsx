import React, { useEffect, useState } from 'react';
import { saveFlow, loadFlows, deleteFlow } from '../lib/flow-storage';
import { arrayMoveImmutable } from 'array-move';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FlowRecord {
  id: string;
  name: string;
  steps: string[];
  notes: Record<string, string>;
  createdAt?: string;
  forkedFrom?: string;
  version?: number;
  memoryEnabled?: boolean;
}

function SortableItem({ id, step, index, onRemove, note, onNoteChange }: {
  id: string;
  step: string;
  index: number;
  onRemove: (index: number) => void;
  note: string;
  onNoteChange: (id: string, value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-indigo-600 px-3 py-2 rounded relative">
      <span className="text-white text-xs">{step}</span>
      <textarea
        rows={2}
        value={note || ''}
        onChange={(e) => onNoteChange(step, e.target.value)}
        placeholder="Add a note..."
        className="mt-1 w-full text-xs bg-black text-gray-100 border border-gray-500 rounded p-1"
      />
      <button
        onClick={() => onRemove(index)}
        className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-600 rounded-bl"
      >✖</button>
    </div>
  );
}

export default function AgentFlowCanvas() {
  const [flow, setFlow] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<FlowRecord[]>([]);
  const [name, setName] = useState('');
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preflow = params.get('flow');
    const preinput = params.get('input');
    if (preflow) setFlow(preflow.split(','));
    if (preinput) setInput(preinput);
    loadFlows().then(setSaved);
  }, []);

  const handleRun = async () => {
    let value = input;
    const results: Record<string, string> = {};
    for (const agent of flow) {
      const res = await fetch(`/api/${agent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value, memory: memoryEnabled ? noteMap : {} })
      });
      const data = await res.json();
      value = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
      results[agent] = value;
    }
    setOutput(value);
    setStepOutputs(results);
  };

  const handleSave = async () => {
await saveFlow(name, flow, noteMap);    const updated = await loadFlows();
    setSaved(updated);
    setName('');
  };

  const forkFlow = (f: FlowRecord) => {
    setFlow(f.steps);
    setNoteMap(f.notes || {});
    setName(`${f.name} (Fork)`);
  };

  const generateLink = () => {
    const query = new URLSearchParams({ flow: flow.join(','), input });
    navigator.clipboard.writeText(`${window.location.origin}/flow?${query.toString()}`);
  };

  const autoGenerateFlow = async () => {
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Given the goal: "${input}", suggest a 2–4 step chain of agents using only their names.`
      })
    });
    const { response } = await res.json();
    const chain = response.match(/\b[a-zA-Z\-]+\b/g)?.filter((w: string) => ['faq', 'summary', 'explainer', 'outreach'].includes(w));
    if (chain?.length) setFlow(chain);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = flow.findIndex(id => id === active.id);
      const newIndex = flow.findIndex(id => id === over?.id);
      setFlow(arrayMoveImmutable(flow, oldIndex, newIndex));
    }
  };

  const updateNote = (id: string, val: string) => {
    setNoteMap(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold text-indigo-400 mb-4">🧱 Visual Flow Builder</h1>

      <textarea
        className="w-full mb-4 px-3 py-2 rounded bg-[#111] border border-gray-600"
        rows={2}
        placeholder="Start with a goal or input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-2 items-center mb-4">
        {['faq', 'summary', 'explainer', 'outreach'].map(a => (
          <button key={a} onClick={() => setFlow(prev => [...prev, a])} className="px-3 py-1 bg-gray-700 rounded hover:bg-indigo-500">{a}</button>
        ))}
        <label className="ml-auto text-xs flex items-center gap-2">
          <input type="checkbox" checked={memoryEnabled} onChange={() => setMemoryEnabled(!memoryEnabled)} /> Memory
        </label>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={flow} strategy={verticalListSortingStrategy}>
          <div className="flex gap-3 flex-wrap">
            {flow.map((step, i) => (
              <div key={step + i} className="w-full">
                <SortableItem
                  id={step + i}
                  step={step}
                  index={i}
                  note={noteMap[step]}
                  onNoteChange={updateNote}
                  onRemove={(idx) => setFlow(prev => prev.filter((_, j) => j !== idx))}
                />
                {stepOutputs[step] && (
                  <pre className="bg-[#111] text-green-400 text-xs border border-gray-700 rounded p-2 mt-1 whitespace-pre-wrap">
                    {stepOutputs[step]}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 my-6 flex-wrap">
        <button onClick={handleRun} className="bg-green-600 px-4 py-2 rounded text-sm font-semibold">▶️ Run Flow</button>
        <button onClick={generateLink} className="bg-yellow-500 text-black px-4 py-2 rounded text-sm font-semibold">🔗 Copy Link</button>
        <button onClick={autoGenerateFlow} className="bg-purple-600 px-4 py-2 rounded text-sm font-semibold">✨ Auto-Generate</button>
        <input placeholder="Save flow as..." value={name} onChange={(e) => setName(e.target.value)} className="bg-[#111] border border-gray-600 px-3 py-2 rounded" />
        <button onClick={handleSave} className="bg-blue-600 px-4 py-2 rounded">💾 Save</button>
      </div>

      <div className="mb-6">
        <h3 className="text-indigo-300 font-semibold mb-2">📁 Saved Flows</h3>
        <div className="space-y-2">
          {saved.map(f => (
            <div key={f.id} className="bg-[#222] p-3 rounded border border-gray-700">
              <div className="text-sm font-bold text-white">{f.name} {f.version ? `(v${f.version})` : ''}</div>
              <div className="text-xs text-gray-400">{f.steps.join(' → ')}</div>
              <div className="text-xs text-gray-500 mt-1">🧠 Memory: {f.memoryEnabled ? 'on' : 'off'} | 📝 Notes: {Object.keys(f.notes || {}).length}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setFlow(f.steps)} className="text-xs bg-green-700 px-2 py-1 rounded">Load</button>
                <button onClick={() => forkFlow(f)} className="text-xs bg-purple-700 px-2 py-1 rounded">Fork</button>
                <button onClick={() => deleteFlow(f.id).then(() => loadFlows().then(setSaved))} className="text-xs bg-red-700 px-2 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {output && (
        <pre className="bg-[#111] border border-gray-700 p-4 rounded whitespace-pre-wrap text-green-400 text-sm">
          {output}
        </pre>
      )}
    </div>
  );
}