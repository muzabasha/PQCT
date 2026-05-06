"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AlgoType = {
  name: string;
  type: string;
  security: string;
  keySize: string;
  status: string;
};

export default function DashboardModule() {
  const [filter, setFilter] = useState('All');

  const algorithms: AlgoType[] = [
    { name: 'RSA-2048', type: 'Classical', security: 'Broken by Shor', keySize: '256 bytes', status: 'Deprecating' },
    { name: 'ECC-256', type: 'Classical', security: 'Broken by Shor', keySize: '32 bytes', status: 'Deprecating' },
    { name: 'AES-256', type: 'Symmetric', security: 'Safe (Grover weakens)', keySize: '32 bytes', status: 'Safe' },
    { name: 'Kyber (ML-KEM)', type: 'Lattice-Based', security: 'Quantum-Safe', keySize: '800-1568 bytes', status: 'NIST Standard' },
    { name: 'Dilithium (ML-DSA)', type: 'Lattice-Based', security: 'Quantum-Safe', keySize: '1312-2592 bytes', status: 'NIST Standard' },
    { name: 'SPHINCS+', type: 'Hash-Based', security: 'Quantum-Safe', keySize: '7.8 KB', status: 'NIST Standard' },
    { name: 'McEliece', type: 'Code-Based', security: 'Quantum-Safe', keySize: '1 MB+', status: 'Round 4' },
  ];

  const filteredAlgos = filter === 'All' ? algorithms : algorithms.filter(a => a.status === filter || a.type.includes(filter));

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 6: Comparative Dashboard
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Evaluating the migration path from vulnerable classical systems to Post-Quantum cryptographic standards.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="p-8 lg:p-10 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-950/50 gap-6 relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🎛️</span> Algorithm Comparison Matrix
          </h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner cursor-pointer"
          >
            <option value="All">All Algorithms</option>
            <option value="Classical">Classical</option>
            <option value="NIST Standard">NIST Standards</option>
            <option value="Lattice-Based">Lattice Based</option>
          </select>
        </div>
        
        <div className="overflow-x-auto relative z-10 p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sm uppercase tracking-wider text-slate-400">
                <th className="p-6 font-bold">Algorithm</th>
                <th className="p-6 font-bold">Family</th>
                <th className="p-6 font-bold">Quantum Security</th>
                <th className="p-6 font-bold">Key/Sig Size</th>
                <th className="p-6 font-bold">NIST Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {filteredAlgos.map((algo, i) => (
                  <motion.tr 
                    key={algo.name} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="p-6 font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{algo.name}</td>
                    <td className="p-6 text-slate-400 font-medium">{algo.type}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        algo.security.includes('Safe') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/30 shadow-red-500/20'
                      }`}>
                        {algo.security}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-sm text-slate-300 bg-slate-950/30">{algo.keySize}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        algo.status === 'NIST Standard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-blue-500/20' : 
                        algo.status === 'Deprecating' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-orange-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                      }`}>
                        {algo.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
