"use client";

import { useState } from 'react';
import { simulateLattice as simLattice, simulateCode as simCode } from '@/lib/crypto';
import { Math as MathDisplay, MathSteps } from '@/components/ui/math';
import { motion, AnimatePresence } from 'framer-motion';
import { Pedagogy } from '@/components/Pedagogy';

export default function PQCModule() {
  const [activeTab, setActiveTab] = useState<'Lattice' | 'Code' | 'Multivariate' | 'Hash' | 'Isogeny'>('Lattice');

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
    <div className="space-y-20 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 5: Post-Quantum Cryptography
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Explore the new NIST standards. Math that even Quantum Computers cannot solve efficiently.
        </p>
      </div>

      <Pedagogy 
        story="Imagine standing in a perfectly straight forest where trees are planted in a grid. A treasure is buried at a tree, but I give you a 'Messy Map' where the directions are winding and every location is 'about 2 feet' off. Without the 'Secret Compass,' you get lost in the noise. Alternatively, imagine a 'Scrambled Library' where a book is mixed with junk pages. Only the librarian knows the rule to filter the junk and find the true story."
        whatLearned={[
          "Intentional mathematical 'noise' or 'errors' can be a powerful shield.",
          "Complex grids (Lattices) in high dimensions are a maze that Quantum computers can't map.",
          "Hiding a 'trapdoor' inside error-correction codes creates a lock that lasts forever."
        ]}
        topicName="Post-Quantum Cryptography (PQC)"
        topicIntroduction="PQC is a new generation of math designed to be 'Quantum Resistant.' Instead of relying on prime factors, it uses problems like 'Learning With Errors' (Lattice-based) or 'Decoding Noisy Codewords' (Code-based) which are NP-Hard even for the most powerful quantum machines."
        activities={[
          { 
            title: "Teacher do", 
            description: "Demonstrate how 'Noise' hides a signal by shifting points on a simple 2D grid.",
            instructions: [
              "Draw a grid of dots on the board.",
              "Circle a specific dot, then draw a new point slightly shifted from the original.",
              "Ask: 'If I didn't tell you, could you guess which grid intersection this belongs to?'",
              "Explain that PQC uses this 'fuzziness' (Noise) as a mathematical shield."
            ]
          },
          { 
            title: "Teacher & Student", 
            description: "Explore the Lattice simulation below and observe how increasing 'Noise Level' makes the keys more complex.",
            instructions: [
              "Go to the 'Lattice-Based' tab.",
              "Increase the 'Noise Level (e)' slider to its maximum.",
              "Click 'Generate Lattice Keys' and look at the 'A · s + e' formula.",
              "Discuss why even a Quantum Computer can't 'un-see' the noise without the secret key."
            ]
          },
          { 
            title: "All Students", 
            description: "Group Challenge: Try to 'decode' a short message that has been scrambled with 1 intentional error per word.",
            instructions: [
              "The teacher provides a sentence with 1 letter changed in every word (e.g., 'Tho quontum throot is rool').",
              "Try to decode it as fast as possible.",
              "Discuss how having a 'Codebook' (Trapdoor) makes this instant for the owner but hard for others."
            ]
          },
          { 
            title: "Individual Student", 
            description: "Use the sandboxes below to generate Lattice (LWE) keys and trace the math that filters out the noise.",
            instructions: [
              "Switch to the 'Code-Based' tab.",
              "Set Message Length to 8 and Error Weight to 2.",
              "Click 'Encode Message'.",
              "Trace the steps to see how the 'Fast Decoding' algorithm successfully removes the 2 errors you added."
            ]
          }
        ]}
      />

      <div className="space-y-12">
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

        {activeTab === 'Multivariate' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-32 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <div className="max-w-3xl">
               <h2 className="text-3xl font-bold text-orange-400 mb-4 flex items-center gap-3">
                 <span className="text-4xl">📐</span> Multivariate Cryptography
               </h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 Uses systems of non-linear polynomial equations over finite fields. Solving these systems (the MQ problem) is proven to be NP-Hard. While signatures like <strong>Rainbow</strong> have seen challenges, the field remains a vital pillar of PQC for high-speed signatures.
               </p>
             </div>
             <div className="bg-slate-950/80 p-8 rounded-3xl border border-orange-500/20 text-center italic text-slate-500">
               Interactive MQ-Solver simulation is being calibrated.
             </div>
          </motion.div>
        )}

        {activeTab === 'Hash' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <div className="max-w-3xl">
               <h2 className="text-3xl font-bold text-red-400 mb-4 flex items-center gap-3">
                 <span className="text-4xl">🧱</span> Hash-Based Cryptography
               </h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 The most 'conservative' PQC choice. It relies only on the security of cryptographic hash functions (like SHA-3). If the hash is secure, the signature (e.g., <strong>SPHINCS+</strong>) is secure. It is the gold standard for long-term digital signatures.
               </p>
             </div>
             <div className="bg-slate-950/80 p-8 rounded-3xl border border-red-500/20 text-center italic text-slate-500">
               Merkle Tree visualizer is being assembled.
             </div>
          </motion.div>
        )}

        {activeTab === 'Isogeny' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <div className="max-w-3xl">
               <h2 className="text-3xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                 <span className="text-4xl">🎢</span> Isogeny-Based Cryptography
               </h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 Uses maps (isogenies) between elliptic curves. It offers the smallest key sizes of all PQC candidates but is mathematically the most complex. Although SIDH was recently broken, newer variants like <strong>CSIDH</strong> are still being researched.
               </p>
             </div>
             <div className="bg-slate-950/80 p-8 rounded-3xl border border-purple-500/20 text-center italic text-slate-500">
               Isogeny graph explorer is under construction.
             </div>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
}
