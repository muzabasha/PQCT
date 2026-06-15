"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const progressData = [
  { module: 'M1 Threat', completed: 100, score: 92 },
  { module: 'M2 RSA/ECC', completed: 80, score: 78 },
  { module: 'M3 Shor/Grover', completed: 60, score: 71 },
  { module: 'M4 HNDL', completed: 40, score: 85 },
  { module: 'M5 PQC', completed: 20, score: 0 },
];

const radarData = [
  { subject: 'Storytelling', A: 90 },
  { subject: 'Math Model', A: 72 },
  { subject: 'Virtual Lab', A: 85 },
  { subject: 'ABL', A: 78 },
  { subject: 'PBL', A: 60 },
  { subject: 'Questions', A: 88 },
];

const algoComparison = [
  { name: 'RSA-2048',   classical: 112, quantum: 0,   keySize: 256,  speed: 95 },
  { name: 'ECC-256',    classical: 128, quantum: 0,   keySize: 32,   speed: 40 },
  { name: 'Kyber-512',  classical: 128, quantum: 128, keySize: 800,  speed: 25 },
  { name: 'Dilithium2', classical: 128, quantum: 128, keySize: 1312, speed: 30 },
  { name: 'SPHINCS+-S', classical: 128, quantum: 128, keySize: 64,   speed: 5  },
];

export default function AnalyticsPage() {
  const [view, setView] = useState<'progress' | 'algorithms'>('progress');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-0">
        <div className="space-y-2 md:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest">
            Learning Analytics
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">Analytics Dashboard</h1>
          <p className="text-sm md:text-xl text-muted-foreground">Track progress, visualize mastery, and compare cryptographic algorithms.</p>
        </div>
        <div className="flex gap-2">
          {(['progress', 'algorithms'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all capitalize ${view === v ? 'bg-secondary text-white' : 'glass text-slate-600 hover:text-foreground'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === 'progress' && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Modules Started', value: '5/6', color: 'text-primary' },
              { label: 'Topics Completed', value: '12/24', color: 'text-secondary' },
              { label: 'Average Score', value: '82%', color: 'text-success' },
              { label: 'HITL Reviews', value: '3/6', color: 'text-accent' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="glass p-4 md:p-6 rounded-2xl text-center">
                <div className={`text-2xl md:text-4xl font-black font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Progress Bar Chart */}
            <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
              <h2 className="text-base md:text-xl font-bold mb-4 md:mb-6">Module Completion</h2>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="module" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="completed" name="Completed %" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="score" name="Score %" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Radar */}
            <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
              <h2 className="text-base md:text-xl font-bold mb-4 md:mb-6">Learning Dimension Mastery</h2>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name="Mastery" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Module Progress List */}
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6">
            <h2 className="text-base md:text-xl font-bold">Module Progress Detail</h2>
            {progressData.map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{m.module}</span>
                  <span className="text-muted-foreground">{m.completed}% complete {m.score > 0 ? `· Score: ${m.score}%` : ''}</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.completed}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }} viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'algorithms' && (
        <div className="space-y-8">
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 overflow-x-auto">
            <h2 className="text-base md:text-xl font-bold mb-4 md:mb-6">Algorithm Comparison Matrix</h2>
            <table className="w-full text-[10px] md:text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {['Algorithm', 'Classical Security (bits)', 'Quantum Security (bits)', 'Public Key (bytes)', 'Relative Speed'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {algoComparison.map((alg, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold font-mono">{alg.name}</td>
                    <td className="py-4 px-4">
                      <span className="text-success font-bold">{alg.classical}</span>
                    </td>
                    <td className="py-4 px-4">
                      {alg.quantum === 0
                        ? <span className="text-destructive font-bold">0 (Broken)</span>
                        : <span className="text-success font-bold">{alg.quantum}</span>
                      }
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700">{alg.keySize}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px]">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${alg.speed}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{alg.speed}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-base md:text-xl font-bold mb-4 md:mb-6">Key Size Comparison</h2>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={algoComparison} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="keySize" name="Public Key Size (bytes)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Note: PQC algorithms have larger keys than classical algorithms, but provide quantum resistance. AES-256 (symmetric) is not shown as it uses shared keys.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
