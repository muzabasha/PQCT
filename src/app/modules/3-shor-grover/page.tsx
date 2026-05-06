"use client";

import { useState } from 'react';
import { runShor as simShor, runGrover as simGrover } from '@/lib/crypto';
import { Math, MathSteps } from '@/components/ui/math';

export default function ShorGroverModule() {
  const [datasetSize, setDatasetSize] = useState(1000000);
  const [groverResult, setGroverResult] = useState<any>(null);
  const [shorN, setShorN] = useState(15);
  const [shorResult, setShorResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runShor = async () => {
    setLoading(true);
    try {
      const res = simShor(shorN);
      setShorResult(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const runGrover = async () => {
    setLoading(true);
    try {
      const res = simGrover(datasetSize);
      setGroverResult(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Module 3: Shor & Grover Algorithms
        </h1>
        <p className="text-xl text-slate-400">How quantum computers break classical security</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Shor's Algorithm */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Shor's Algorithm</h2>
            <p className="text-slate-300">Factorizes large numbers exponentially faster than classical algorithms. Threatens RSA and ECC.</p>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-xl">
            <Math block math="f(x) = a^x \pmod N" />
            <p className="text-sm text-slate-400 mt-2 text-center">Finds the period of this function using Quantum Fourier Transform</p>
          </div>

          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              value={shorN} 
              onChange={(e) => setShorN(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white w-full"
              placeholder="Number to factor (e.g. 15)"
            />
            <button 
              onClick={runShor}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap"
            >
              Run Shor
            </button>
          </div>

          {shorResult && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold border-b border-slate-800 pb-2">Execution Steps</h3>
              <MathSteps steps={shorResult.steps} />
              {shorResult.result ? (
                <div className="bg-green-900/30 text-green-400 p-4 rounded-xl border border-green-500/30 text-center text-xl font-bold">
                  Factors Found: {shorResult.result[0]} and {shorResult.result[1]}
                </div>
              ) : (
                <div className="bg-red-900/30 text-red-400 p-4 rounded-xl border border-red-500/30 text-center font-bold">
                  Failed. Try again (Quantum algorithms are probabilistic).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grover's Algorithm */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Grover's Algorithm</h2>
            <p className="text-slate-300">Provides quadratic speedup for unstructured search. Threatens AES and Hashes (requires doubling key size).</p>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🔦</div>
            <p className="text-slate-300 italic">"Turning the spotlight brighter on the correct answer"</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400">Dataset Size (N): {datasetSize.toLocaleString()}</label>
            <input 
              type="range" 
              min="1000" 
              max="10000000" 
              step="1000" 
              value={datasetSize} 
              onChange={(e) => setDatasetSize(Number(e.target.value))}
              className="w-full accent-blue-500 mb-4"
            />
            <button 
              onClick={runGrover}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors w-full"
            >
              Simulate Grover Search
            </button>
          </div>

          {groverResult && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 mb-1">Classical Steps (avg)</div>
                  <div className="text-xl text-slate-300 font-bold">{groverResult.classical_average_steps.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 text-center">
                  <div className="text-xs text-slate-500 mb-1">Quantum Steps</div>
                  <div className="text-xl text-blue-400 font-bold">{groverResult.quantum_steps.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                </div>
              </div>
              <MathSteps steps={groverResult.steps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
