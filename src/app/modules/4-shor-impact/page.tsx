"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Pedagogy } from '@/components/Pedagogy';

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
    <div className="space-y-20 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 4: Impact of Shor
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          The impending timeline of classical security collapse and the threat of 'Harvest Now, Decrypt Later'.
        </p>
      </div>

      <Pedagogy 
        story="Imagine you found a way to send a locked chest to someone in the past—say, your grandfather in 1950. He can't open it because he doesn't have the key or the tools. But he doesn't throw it away; he keeps it in his attic. Decades later, you find that chest. Now, you have the modern tools (or the 'Quantum Key') to open it effortlessly. The secrets inside are no longer secret, even though they were safe for 70 years."
        whatLearned={[
          "Information doesn't have to be broken 'right now' to be at risk.",
          "Data with a long 'shelf-life' (like DNA or government secrets) is the most vulnerable.",
          "The 'Quantum Key' (CRQC) is being built while hackers are already collecting our 'locked chests'."
        ]}
        topicName="Harvest Now, Decrypt Later (HNDL)"
        topicIntroduction="This is the most urgent threat of the Quantum era. Adversaries are collecting encrypted traffic today, knowing that in 10-15 years, a Quantum computer will allow them to retroactively decrypt everything. Security isn't just about the present; it's about the future."
        activities={[
          { 
            title: "Teacher do", 
            description: "Demonstrate the 'Time Machine' logic using a sealed envelope that will be opened only when a future condition is met.",
            instructions: [
              "Seal a secret note in an envelope and label it 'Open in 2035'.",
              "Hand it to a student: 'This is secure today because you lack the key.'",
              "Now, ask: 'If a thief takes this envelope today and keeps it for 11 years, is it still secure?'",
              "Explain that this is exactly what hackers are doing with our encrypted traffic right now."
            ]
          },
          { 
            title: "Teacher & Student", 
            description: "Together, analyze the 'Security Collapse' chart below to estimate when different levels of encryption will fall.",
            instructions: [
              "Look at the Area Chart showing the decline of Quantum resistance.",
              "Identify the 'Q-Day' threshold (when the red line hits the bottom axis).",
              "Switch between RSA and ECC to see which one is projected to fall first."
            ]
          },
          { 
            title: "All Students", 
            description: "Brainstorm: which types of data need to remain secret for 20+ years? (Health records, banking history, etc.)",
            instructions: [
              "In groups, brainstorm 5 types of sensitive digital information.",
              "Estimate the 'Sensitivity Lifetime' for each (e.g., a one-time password is valid for 1 min, medical records are valid for 80 years).",
              "List the top 3 items that must be protected by PQC today to avoid future exposure."
            ]
          },
          { 
            title: "Individual Student", 
            description: "Use the 'Timeline Tool' below to see the impact on RSA-2048 and determine the urgency of migration.",
            instructions: [
              "Use the chart to find the projected year of RSA collapse (e.g., 2032).",
              "Subtract the 'Sensitivity Lifetime' of your data (e.g., 10 years).",
              "Calculate your 'Migration Deadline' (2032 - 10 = 2022).",
              "Note down if we have already passed the safe migration window for your data."
            ]
          }
         ]}
      />

      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
        <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-red-400">
              <span className="text-4xl">⚠️</span> Security Collapse Timeline
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Projected security resilience (<strong>Q-Day</strong>) as Quantum hardware scales towards Cryptographically Relevant Quantum Computers (CRQCs).
            </p>
          </div>
          <div className="flex gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shadow-inner flex-shrink-0">
            <button 
              onClick={() => setSelectedAlgo('RSA')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${selectedAlgo === 'RSA' ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              RSA-2048
            </button>
            <button 
              onClick={() => setSelectedAlgo('ECC')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${selectedAlgo === 'ECC' ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              ECC-256
            </button>
          </div>
        </div>

        <div className="h-[400px] w-full mb-10 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} itemStyle={{ fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="classical" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClassical)" name="Classical Attacks" animationDuration={1500} />
              <Area type="monotone" dataKey="quantum" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorQuantum)" name="Quantum Attacks" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-950/80 p-8 rounded-3xl border border-blue-500/20 shadow-inner group transition-all">
            <h3 className="font-bold text-xl mb-4 text-blue-400 flex items-center gap-2">
              <span className="text-2xl">🕵️‍♂️</span> Harvest Now, Decrypt Later (HNDL)
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Adversaries are actively storing your encrypted data today. The encryption might be secure right now, but once <strong>CRQCs</strong> are built (projected Q-Day), they will retroactively decrypt all the harvested data from the past.
            </p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="bg-red-950/30 p-8 rounded-3xl border border-red-500/30 shadow-inner group transition-all">
             <h3 className="font-bold text-xl mb-4 text-red-400 flex items-center gap-2">
               <span className="text-2xl">💥</span> Why {selectedAlgo} Falls
             </h3>
             <p className="text-slate-300 text-lg leading-relaxed">
               {selectedAlgo === 'RSA' 
                 ? "RSA relies on the difficulty of integer factorization. Shor's algorithm utilizes Quantum Fourier Transform to turn factorization into a period-finding problem, solving it in polynomial time and collapsing its security entirely."
                 : "ECC relies on the Elliptic Curve Discrete Logarithm Problem (ECDLP). Shor's algorithm solves the hidden subgroup problem underlying ECDLP even more efficiently than factorization, making ECC highly vulnerable."}
             </p>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
