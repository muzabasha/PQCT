"use client";

import { useState } from 'react';
import { simulateLattice as simLattice, simulateCode as simCode } from '@/lib/crypto';
import { Math as MathDisplay, MathSteps } from '@/components/ui/math';
import { motion, AnimatePresence } from 'framer-motion';

export default function PQCModule() {
  const [activeTab, setActiveTab] = useState<'Lattice' | 'Code'>('Lattice');
  const [result, setResult] = useState<any>(null);

  // Lattice State
  const [dimension, setDimension] = useState(4);
  const [noiseLevel, setNoiseLevel] = useState(0.5);

  // Code State
  const [msgLength, setMsgLength] = useState(8);
  const [errWeight, setErrWeight] = useState(2);

  const handleSimulateLattice = () => {
    const res = simLattice(dimension, noiseLevel);
    setResult(res);
  };

  const handleSimulateCode = () => {
    const res = simCode(msgLength, errWeight);
    setResult(res);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 5: Post-Quantum Cryptography
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Explore the new NIST standards. Math that even Quantum Computers cannot solve efficiently.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {['Lattice', 'Code', 'Multivariate', 'Hash', 'Isogeny'].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab as any); setResult(null); }}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeTab === tab ? 'bg-emerald-600 text-white shadow-emerald-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            {tab}-Based
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden min-h-[500px]">
        {activeTab === 'Lattice' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="max-w-3xl">
               <h2 className="text-3xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                 <span className="text-4xl">🌐</span> Lattice-Based Cryptography (LWE)
               </h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 Learning With Errors (LWE) hides data by adding intentional mathematical "noise" to linear equations. Without the secret key, filtering out the noise to find the message is mathematically equivalent to the shortest vector problem in a multi-dimensional lattice.
               </p>
             </div>
             
             <div className="grid lg:grid-cols-2 gap-10">
               <div className="space-y-8">
                 <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">LWE Equation</h4>
                   <MathDisplay block math="\mathbf{A} \cdot \mathbf{s} + \mathbf{e} = \mathbf{b} \pmod q" />
                   <ul className="mt-6 space-y-3 text-sm text-slate-400">
                     <li className="flex items-center gap-2"><strong className="text-emerald-400 text-lg">•</strong> <MathDisplay math="\mathbf{A}" />: Public random matrix</li>
                     <li className="flex items-center gap-2"><strong className="text-emerald-400 text-lg">•</strong> <MathDisplay math="\mathbf{s}" />: Secret vector (Private Key)</li>
                     <li className="flex items-center gap-2"><strong className="text-emerald-400 text-lg">•</strong> <MathDisplay math="\mathbf{e}" />: Small random noise</li>
                     <li className="flex items-center gap-2"><strong className="text-emerald-400 text-lg">•</strong> <MathDisplay math="\mathbf{b}" />: Public key</li>
                   </ul>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Lattice Dimension</label>
                     <input type="number" value={dimension} onChange={(e) => setDimension(Number(e.target.value))} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Noise Level (e)</label>
                     <input type="number" step="0.1" value={noiseLevel} onChange={(e) => setNoiseLevel(Number(e.target.value))} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                 </div>

                 <button onClick={handleSimulateLattice} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-lg">
                    Generate Lattice Keys
                 </button>
               </div>

               <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                 {result && result.technique === 'Lattice-Based (LWE)' ? (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="z-10 space-y-6">
                     <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Simulation Steps</h3>
                     <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                       <MathSteps steps={result.steps} />
                     </div>
                   </motion.div>
                 ) : (
                   <div className="text-center text-slate-500 italic z-10 text-lg">
                     Configure parameters and generate the lattice to trace the math.
                   </div>
                 )}
               </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'Code' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="max-w-3xl">
               <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                 <span className="text-4xl">🧬</span> Code-Based Cryptography
               </h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 Relies on the NP-hardness of decoding general linear codes (like the McEliece cryptosystem). The message is encoded, and errors are injected. Only the private key holder knows the fast algorithm to correct the errors.
               </p>
             </div>
             
             <div className="grid lg:grid-cols-2 gap-10">
               <div className="space-y-8">
                 <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Encoding Equation</h4>
                   <MathDisplay block math="\mathbf{c} = \mathbf{mG} + \mathbf{e}" />
                   <p className="mt-4 text-sm text-slate-400">Without the trapdoor matrix, finding the message <strong className="text-slate-300">m</strong> from the noisy codeword <strong className="text-slate-300">c</strong> is computationally infeasible for both classical and quantum computers.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Message Length</label>
                     <input type="number" value={msgLength} onChange={(e) => setMsgLength(Number(e.target.value))} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Error Weight</label>
                     <input type="number" value={errWeight} onChange={(e) => setErrWeight(Number(e.target.value))} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                   </div>
                 </div>

                 <button onClick={handleSimulateCode} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all text-lg">
                    Encode Message
                 </button>
               </div>

               <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                 {result && result.technique === 'Code-Based' ? (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="z-10 space-y-6">
                     <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Simulation Steps</h3>
                     <div className="bg-cyan-900/20 border border-cyan-500/30 p-6 rounded-2xl">
                       <MathSteps steps={result.steps} />
                     </div>
                   </motion.div>
                 ) : (
                   <div className="text-center text-slate-500 italic z-10 text-lg">
                     Configure parameters and encode to trace the math.
                   </div>
                 )}
               </div>
             </div>
          </motion.div>
        )}

        {['Multivariate', 'Hash', 'Isogeny'].includes(activeTab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="text-8xl mb-6 drop-shadow-lg">🚧</div>
            <h3 className="text-3xl font-bold text-slate-300 mb-4">{activeTab} Simulation Coming Soon</h3>
            <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
              The mathematical sandbox for this PQC algorithm is currently being calibrated in the quantum lab. Check back later for interactive experimental learning.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
