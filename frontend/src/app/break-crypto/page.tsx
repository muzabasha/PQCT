"use client";

import { useState } from 'react';
import axios from 'axios';

export default function BreakCrypto() {
  const [keySize, setKeySize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const runAttack = async () => {
    setLoading(true);
    try {
      // First generate RSA key
      const rsaRes = await axios.post(`${API_URL}/api/rsa/generate`, { key_size: keySize });
      const n = rsaRes.data.public_key.n;

      // Then attack it with Shor
      const shorRes = await axios.post(`${API_URL}/api/shor/run`, { N: n });
      
      setResult({
        rsa: rsaRes.data,
        shor: shorRes.data
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-500">Break My Crypto Mode</h1>
        <p className="text-xl text-slate-400">Generate an RSA key and attack it with Shor's algorithm</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-4">
          <label className="text-slate-300">Key Size (small for simulation):</label>
          <input 
            type="number" 
            value={keySize} 
            onChange={(e) => setKeySize(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white w-24"
            max="32"
          />
          <button 
            onClick={runAttack}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            {loading ? 'Attacking...' : 'Generate & Attack'}
          </button>
        </div>

        {result && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-950 p-6 rounded-xl border border-blue-500/30">
              <h3 className="font-bold text-blue-400 mb-4">1. Classical Setup</h3>
              <p className="text-slate-300 mb-2">Public Key Modulus (N):</p>
              <div className="font-mono text-xl bg-slate-900 p-2 rounded">{result.rsa.public_key.n}</div>
              <p className="text-slate-300 mt-4 mb-2">Secret Primes (p, q):</p>
              <div className="font-mono text-xl bg-slate-900 p-2 rounded">{result.rsa.details.p}, {result.rsa.details.q}</div>
            </div>
            <div className="bg-slate-950 p-6 rounded-xl border border-red-500/30">
              <h3 className="font-bold text-red-400 mb-4">2. Quantum Attack</h3>
              <p className="text-slate-300 mb-2">Shor's Algorithm Output:</p>
              {result.shor.result ? (
                <div className="font-mono text-xl bg-red-900/30 text-red-400 p-2 rounded border border-red-500/30">
                  Factors Found: {result.shor.result[0]}, {result.shor.result[1]}
                </div>
              ) : (
                <div className="font-mono text-xl bg-slate-900 p-2 rounded text-slate-500">
                  Attack failed probabilistically. Try again.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
