"use client";

import { useState } from 'react';
import { Math as UIMath } from '@/components/ui/math';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function NeedPQCModule() {
  const [keySize, setKeySize] = useState(2048);

  // Generate data for the graph
  const data = [];
  for (let n = 512; n <= 4096; n += 256) {
    // Classical ~ O(exp(c * n^(1/3) * (log n)^(2/3))) -> simplified for visual
    const classical = Math.pow(2, n / 128); 
    // Quantum ~ O(n^3)
    const quantum = Math.pow(n / 100, 3);
    
    data.push({
      keySize: n,
      Classical: classical > 1000000 ? 1000000 : classical, // cap for graph
      Quantum: quantum
    });
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Module 1: Need for Post-Quantum Cryptography
        </h1>
        <p className="text-xl text-slate-400">Why classical cryptography fails against quantum computers</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Complexity Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Classical Attack (GNFS)</h3>
            <UIMath block math="O\left(\exp\left(\left(\frac{64}{9}\right)^{1/3} n^{1/3} (\log n)^{2/3}\right)\right)" />
            <p className="text-slate-300">Exponential time complexity. As key size grows, attack time grows incredibly fast.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400">Quantum Attack (Shor's)</h3>
            <UIMath block math="O(n^3)" />
            <p className="text-slate-300">Polynomial time complexity. As key size grows, attack time remains manageable.</p>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="keySize" stroke="#64748b" label={{ value: 'Key Size (bits)', position: 'insideBottom', offset: -5 }} />
              <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" label={{ value: 'Operations (Log Scale)', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
              <Legend />
              <Line type="monotone" dataKey="Classical" stroke="#60a5fa" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Quantum" stroke="#c084fc" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Interactive Simulation: RSA-2048 Break Time</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6 w-full">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Adjust Key Size (bits): {keySize}</label>
              <input 
                type="range" 
                min="512" 
                max="4096" 
                step="256" 
                value={keySize} 
                onChange={(e) => setKeySize(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400">Classical Supercomputer</div>
                <div className="text-2xl font-bold text-blue-400">
                  {keySize >= 2048 ? "300 Trillion Years" : keySize >= 1024 ? "100,000 Years" : "Few Months"}
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30">
                <div className="text-sm text-slate-400">Quantum Computer (Shor's)</div>
                <div className="text-2xl font-bold text-purple-400">
                  {keySize >= 4096 ? "24 Hours" : keySize >= 2048 ? "8 Hours" : "< 1 Hour"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span>💡</span> The Analogy
            </h3>
            <p className="text-slate-300">
              <strong>Classical Search:</strong> Searching for a specific grain of sand on a vast beach 🏖️. Exponentially hard.
              <br /><br />
              <strong>Quantum Search:</strong> Using a magical drone 🚁 that highlights the exact grain of sand instantly. Polynomial ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
