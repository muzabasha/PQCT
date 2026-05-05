"use client";

import { useState } from 'react';
import axios from 'axios';
import { Math, MathSteps } from '@/components/ui/math';

export default function PQCModule() {
  const [activeTab, setActiveTab] = useState<'Lattice' | 'Code'>('Lattice');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const simulateLattice = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/pqc/lattice`, { dimension: 4, noise_level: 0.5 });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const simulateCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/pqc/code`, { message_length: 8, error_weight: 2 });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Module 5: Post-Quantum Cryptography
        </h1>
        <p className="text-xl text-slate-400">Math that even Quantum Computers cannot solve efficiently</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['Lattice', 'Code', 'Multivariate', 'Hash', 'Isogeny'].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab as any); setResult(null); }}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {tab}-Based
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[400px]">
        {activeTab === 'Lattice' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-emerald-400">Lattice-Based Cryptography (LWE)</h2>
             <p className="text-slate-300">Learning With Errors (LWE) adds intentional mathematical noise to linear equations.</p>
             
             <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
               <Math block math="\mathbf{A} \cdot \mathbf{s} + \mathbf{e} = \mathbf{b} \pmod q" />
               <ul className="mt-4 space-y-2 text-sm text-slate-400 list-disc list-inside">
                 <li><Math math="\mathbf{A}" />: Public matrix</li>
                 <li><Math math="\mathbf{s}" />: Secret vector</li>
                 <li><Math math="\mathbf{e}" />: Small random noise</li>
                 <li><Math math="\mathbf{b}" />: Public key</li>
               </ul>
             </div>

             <button 
                onClick={simulateLattice}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
             >
                {loading ? 'Simulating...' : 'Simulate LWE Generation'}
             </button>
          </div>
        )}

        {activeTab === 'Code' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-emerald-400">Code-Based Cryptography</h2>
             <p className="text-slate-300">Relies on the hardness of decoding general linear codes (e.g., McEliece cryptosystem).</p>
             
             <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
               <Math block math="\mathbf{c} = \mathbf{mG} + \mathbf{e}" />
               <p className="mt-4 text-sm text-slate-400">Without the trapdoor, finding the message from the noisy codeword is an NP-hard problem.</p>
             </div>

             <button 
                onClick={simulateCode}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
             >
                {loading ? 'Simulating...' : 'Simulate Code Encoding'}
             </button>
          </div>
        )}

        {['Multivariate', 'Hash', 'Isogeny'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-slate-300">Interactive {activeTab} Simulation Coming Soon</h3>
            <p className="text-slate-500 mt-2 max-w-md">The mathematical sandbox for this PQC algorithm is currently being calibrated in the quantum lab.</p>
          </div>
        )}

        {result && (
           <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-xl font-semibold mb-4">Simulation Steps</h3>
              <MathSteps steps={result.steps} />
           </div>
        )}
      </div>
    </div>
  );
}
