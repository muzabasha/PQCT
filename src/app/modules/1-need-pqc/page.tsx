"use client";

import { useState } from 'react';
import { Math as MathDisplay } from '@/components/ui/math';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

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
    <div className="space-y-12 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 1: Need for Post-Quantum Cryptography
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Understand why classical cryptography fails exponentially fast against quantum computers.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">📈</span> Complexity Comparison
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2"><span className="text-2xl">💻</span> Classical Attack (GNFS)</h3>
            <MathDisplay block math="O\left(\exp\left(\left(\frac{64}{9}\right)^{1/3} n^{1/3} (\log n)^{2/3}\right)\right)" />
            <p className="text-slate-400 mt-4 leading-relaxed"><strong>Exponential time complexity.</strong> As key size grows, the attack time required by classical supercomputers grows so fast it becomes practically infinite.</p>
          </div>
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2"><span className="text-2xl">⚛️</span> Quantum Attack (Shor's)</h3>
            <MathDisplay block math="O(n^3)" />
            <p className="text-slate-400 mt-4 leading-relaxed"><strong>Polynomial time complexity.</strong> As key size grows, the attack time required by a quantum computer remains incredibly manageable.</p>
          </div>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 shadow-inner h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="keySize" stroke="#64748b" label={{ value: 'Key Size (bits)', position: 'bottom', offset: 0 }} />
              <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" label={{ value: 'Operations (Log Scale)', angle: -90, position: 'left' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }} itemStyle={{ fontWeight: 'bold' }} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="Classical" stroke="#60a5fa" strokeWidth={4} dot={false} animationDuration={1500} />
              <Line type="monotone" dataKey="Quantum" stroke="#c084fc" strokeWidth={4} dot={false} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 p-32 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">⏱️</span> Interactive Simulation: Break Time
        </h2>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="space-y-4 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Adjust Key Size: <span className="text-white text-lg">{keySize} bits</span></label>
              <input 
                type="range" 
                min="512" 
                max="4096" 
                step="256" 
                value={keySize} 
                onChange={(e) => setKeySize(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <motion.div key={`classical-${keySize}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner text-center">
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Classical Supercomputer</div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {keySize >= 2048 ? "300 Trillion Yrs" : keySize >= 1024 ? "100,000 Years" : "Few Months"}
                </div>
              </motion.div>
              <motion.div key={`quantum-${keySize}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30 shadow-inner text-center">
                <div className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-2">Quantum (Shor's)</div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {keySize >= 4096 ? "24 Hours" : keySize >= 2048 ? "8 Hours" : "< 1 Hour"}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800 shadow-inner h-full flex flex-col justify-center">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
              <span className="bg-slate-800 p-2 rounded-lg">💡</span> The Analogy
            </h3>
            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed text-lg flex gap-4">
                <span className="text-2xl">🏖️</span> 
                <span><strong>Classical Search:</strong> Searching for a specific grain of sand on a vast beach. It's exponentially hard.</span>
              </p>
              <div className="h-px w-full bg-slate-800"></div>
              <p className="text-slate-300 leading-relaxed text-lg flex gap-4">
                <span className="text-2xl">🚁</span> 
                <span><strong>Quantum Search:</strong> Using a magical drone that highlights the exact grain of sand instantly. It's polynomial ease.</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
