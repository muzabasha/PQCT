"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AlgoType = {
  name: string;
  type: string;
  security: string;
  keySize: string;
  status: string;
};

type ModuleProgress = {
  name: string;
  icon: string;
  storyReflections: number;
  checkpointsDone: number;
  checkpointsTotal: number;
  insightsSaved: number;
  skillRatings: string;
};

const moduleMeta: Omit<ModuleProgress, 'storyReflections' | 'checkpointsDone' | 'checkpointsTotal' | 'insightsSaved' | 'skillRatings'>[] = [
  { name: 'The Quantum Threat', icon: '⚛️' },
  { name: 'RSA & Elliptic Curves', icon: '🔐' },
  { name: "Shor's & Grover's", icon: '🌊' },
  { name: 'Harvest Now, Decrypt Later', icon: '⏳' },
  { name: 'Post-Quantum Cryptography', icon: '🛡️' },
  { name: 'Quantum Lab Setup', icon: '🔬' },
];

export default function DashboardModule() {
  const [filter, setFilter] = useState('All');
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);

  useEffect(() => {
    const modules = moduleMeta.map(m => {
      const key = m.name.toLowerCase().replace(/\s+/g, '-').replace(/['&]/g, '');
      const reflections = localStorage.getItem(`story-reflections-${key}`);
      const refCount = reflections ? Object.keys(JSON.parse(reflections)).length : 0;
      const checkpoints = localStorage.getItem(`mini-checkpoints-${key}`);
      const cps = checkpoints ? Object.values(JSON.parse(checkpoints) as Record<string, boolean>) : [];
      const cpsDone = cps.filter(Boolean).length;
      const cpsTotal = cps.length;
      const insightsRaw = localStorage.getItem(`saved-insights-${key}`);
      const insights = insightsRaw ? JSON.parse(insightsRaw) : [];
      const skillRaw = localStorage.getItem(`skill-ratings-${key}`);
      const skills = skillRaw ? Object.values(JSON.parse(skillRaw) as Record<string, number>) : [];
      const avgSkill = skills.length > 0 ? (skills.reduce((a, b) => a + b, 0) / skills.length).toFixed(1) : '—';
      return { ...m, storyReflections: refCount, checkpointsDone: cpsDone, checkpointsTotal: cpsTotal, insightsSaved: insights.length, skillRatings: avgSkill };
    });
    setModuleProgress(modules);
  }, []);

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

  const overallProgress = moduleProgress.length > 0
    ? Math.round(
        moduleProgress.reduce((sum, m) => {
          let score = 0;
          if (m.storyReflections > 0) score += 25;
          if (m.checkpointsTotal > 0) score += 25 * (m.checkpointsDone / m.checkpointsTotal);
          if (m.insightsSaved > 0) score += 25;
          if (m.skillRatings !== '—') score += 25;
          return sum + score;
        }, 0) / moduleProgress.length
      )
    : 0;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 6: Comparative Dashboard
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Evaluating the migration path from vulnerable classical systems to Post-Quantum cryptographic standards.
        </p>
      </div>

      {/* PROGRESS TRACKER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/85 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-10 shadow-2xl"
      >
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
          <span className="text-3xl">📈</span> Your Learning Progress
        </h2>
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span className="font-bold">Overall Progress</span>
            <span className="font-bold text-cyan-400">{overallProgress}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleProgress.map((m, i) => {
            const moduleScore = moduleProgress.length > 0
              ? Math.round(
                  ((m.storyReflections > 0 ? 25 : 0) +
                    (m.checkpointsTotal > 0 ? 25 * (m.checkpointsDone / m.checkpointsTotal) : 0) +
                    (m.insightsSaved > 0 ? 25 : 0) +
                    (m.skillRatings !== '—' ? 25 : 0))
                )
              : 0;
            return (
              <div key={i} className="bg-slate-100/60 border border-slate-200/80 rounded-xl p-4 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{m.icon}</span>
                  <h3 className="font-bold text-sm text-foreground">{m.name}</h3>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mb-2">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${moduleScore}%` }} />
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <span>Reflections: {m.storyReflections} · </span>
                  <span>Checkpoints: {m.checkpointsDone}/{m.checkpointsTotal} · </span>
                  <span>Insights: {m.insightsSaved} · </span>
                  <span>Avg Skill: {m.skillRatings}/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/85 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="p-8 lg:p-10 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-white/80 gap-6 relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🎛️</span> Algorithm Comparison Matrix
          </h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-5 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner cursor-pointer"
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
              <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-600">
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
                    className="hover:bg-slate-100/60 transition-colors group"
                  >
                    <td className="p-6 font-bold text-lg text-foreground group-hover:text-cyan-400 transition-colors">{algo.name}</td>
                    <td className="p-6 text-slate-600 font-medium">{algo.type}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        algo.security.includes('Safe') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/30 shadow-red-500/20'
                      }`}>
                        {algo.security}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-sm text-slate-700 bg-white/60">{algo.keySize}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        algo.status === 'NIST Standard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-blue-500/20' : 
                        algo.status === 'Deprecating' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-orange-500/20' :
                        'bg-slate-500/10 text-slate-600 border border-slate-500/30'
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
