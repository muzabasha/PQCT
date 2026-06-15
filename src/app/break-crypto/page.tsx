"use client";

import { useState } from 'react';
import { generateRSA, runShor } from '@/lib/crypto';
import { motion } from 'framer-motion';

export default function BreakCrypto() {
  const [keySize, setKeySize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runAttack = async () => {
    setLoading(true);
    setResult(null);
    
    // Slight delay for animation effect
    setTimeout(() => {
      try {
        const rsaRes = generateRSA(keySize);
        const n = rsaRes.public_key.n;
        const shorRes = runShor(n);
        
        setResult({
          rsa: rsaRes,
          shor: shorRes
        });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-800 drop-shadow-sm flex justify-center items-center gap-4">
          <span className="text-4xl">⚔️</span> Break My Crypto
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Play the role of an adversary. Generate a classical RSA key and instantly shatter it using Shor's Algorithm.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/85 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 lg:p-12 shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/95 p-6 rounded-2xl border border-slate-200 relative z-10 shadow-inner">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-slate-600 text-sm font-semibold uppercase tracking-wider ml-1">Target Key Size (bits)</label>
            <input 
              type="number" 
              value={keySize} 
              onChange={(e) => setKeySize(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xl font-mono text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-inner"
              max="32"
            />
          </div>
          <div className="flex-1 w-full pt-6 sm:pt-0">
            <button 
              onClick={runAttack}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex justify-center items-center gap-2 ${loading ? 'bg-slate-100 text-slate-600 cursor-wait' : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-red-500/30 active:scale-95'}`}
            >
              {loading ? <span className="animate-pulse">Injecting Qubits...</span> : <span>Initiate Attack</span>}
            </button>
          </div>
        </div>

        {result && (
          <div className="grid lg:grid-cols-2 gap-10 mt-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 p-8 rounded-3xl border-2 border-blue-500/30 shadow-inner space-y-6"
            >
              <h3 className="font-bold text-2xl text-blue-400 flex items-center gap-3">
                <span className="text-3xl">🛡️</span> 1. Classical Target
              </h3>
              <p className="text-slate-600 text-sm">We generated a vulnerable RSA public key.</p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs uppercase tracking-wider text-slate-600 font-bold mb-1">Public Modulus (N)</div>
                  <div className="font-mono text-2xl text-blue-300 break-all">{result.rsa.public_key.n}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs uppercase tracking-wider text-slate-600 font-bold mb-1">Hidden Primes (p, q)</div>
                  <div className="font-mono text-xl text-slate-600">{result.rsa.details.p}, {result.rsa.details.q}</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-red-950/20 p-8 rounded-3xl border-2 border-red-500/50 shadow-inner space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>

              <h3 className="font-bold text-2xl text-red-400 flex items-center gap-3 relative z-10">
                <span className="text-3xl">💥</span> 2. Quantum Attack
              </h3>
              <p className="text-slate-600 text-sm relative z-10">Shor's algorithm intercepted and factored N.</p>
              
              <div className="h-full relative z-10">
                {result.shor.result ? (
                  <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="bg-red-900/40 border border-red-500 p-6 rounded-xl text-center h-full flex flex-col justify-center"
                  >
                    <div className="text-sm uppercase tracking-wider text-red-300 font-bold mb-3">Target Compromised. Factors Found:</div>
                    <div className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-400">
                      {result.shor.result[0]} &times; {result.shor.result[1]}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="bg-white p-6 rounded-xl border border-slate-200 text-center h-full flex flex-col justify-center"
                  >
                    <div className="text-slate-600 font-bold mb-2">Probabilistic Failure</div>
                    <div className="text-slate-600 text-sm">
                      Quantum mechanics is probabilistic. The circuit didn't collapse to the right factors this time. Fire again.
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
