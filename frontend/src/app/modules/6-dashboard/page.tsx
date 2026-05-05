"use client";

import { useState } from 'react';

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
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Module 6: Comparative Dashboard
        </h1>
        <p className="text-xl text-slate-400">Evaluating the migration to Post-Quantum standards</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold">Algorithm Comparison Matrix</h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Algorithms</option>
            <option value="Classical">Classical</option>
            <option value="NIST Standard">NIST Standards</option>
            <option value="Lattice-Based">Lattice Based</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 font-semibold text-slate-300">Algorithm</th>
                <th className="p-4 font-semibold text-slate-300">Family</th>
                <th className="p-4 font-semibold text-slate-300">Quantum Security</th>
                <th className="p-4 font-semibold text-slate-300">Key/Sig Size</th>
                <th className="p-4 font-semibold text-slate-300">NIST Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAlgos.map((algo, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-medium">{algo.name}</td>
                  <td className="p-4 text-slate-400">{algo.type}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      algo.security.includes('Safe') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {algo.security}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-400">{algo.keySize}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      algo.status === 'NIST Standard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      algo.status === 'Deprecating' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {algo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
