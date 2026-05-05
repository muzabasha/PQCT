"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ShorImpactModule() {
  const [selectedAlgo, setSelectedAlgo] = useState<'RSA' | 'ECC'>('RSA');

  const data = [
    { year: 2024, classical: 100, quantum: 100 },
    { year: 2026, classical: 100, quantum: 90 },
    { year: 2028, classical: 100, quantum: 60 },
    { year: 2030, classical: 100, quantum: 20 }, // Q-Day threshold approaching
    { year: 2032, classical: 100, quantum: 0 },  // Broken
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
          Module 4: Impact of Shor
        </h1>
        <p className="text-xl text-slate-400">The impending timeline of classical security collapse</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Security Collapse Timeline (Q-Day)</h2>
            <p className="text-slate-400">Projected security level over time as Quantum hardware scales.</p>
          </div>
          <div className="flex gap-2 bg-slate-950 p-1 rounded-lg">
            <button 
              onClick={() => setSelectedAlgo('RSA')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedAlgo === 'RSA' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              RSA-2048
            </button>
            <button 
              onClick={() => setSelectedAlgo('ECC')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedAlgo === 'ECC' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ECC-256
            </button>
          </div>
        </div>

        <div className="h-80 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'Security %', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
              <Area type="monotone" dataKey="classical" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClassical)" name="Classical Attacks" />
              <Area type="monotone" dataKey="quantum" stroke="#ef4444" fillOpacity={1} fill="url(#colorQuantum)" name="Quantum Attacks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-lg mb-2 text-blue-400">Harvest Now, Decrypt Later (HNDL)</h3>
            <p className="text-slate-300 text-sm">
              Adversaries are currently storing encrypted data. Once Cryptographically Relevant Quantum Computers (CRQCs) are available, they will retroactively decrypt all harvested data.
            </p>
          </div>
          <div className="bg-red-950/20 p-6 rounded-xl border border-red-500/20">
             <h3 className="font-bold text-lg mb-2 text-red-400">Why {selectedAlgo} Falls</h3>
             <p className="text-slate-300 text-sm">
               {selectedAlgo === 'RSA' 
                 ? "RSA relies on the difficulty of integer factorization. Shor's algorithm solves this in polynomial time, collapsing the security entirely."
                 : "ECC relies on the Discrete Logarithm Problem (DLP). Shor's algorithm solves DLP even more efficiently than factorization, making ECC highly vulnerable."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
