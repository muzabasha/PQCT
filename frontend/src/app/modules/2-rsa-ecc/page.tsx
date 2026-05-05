"use client";

import { useState } from 'react';
import axios from 'axios';
import { Math, MathSteps } from '@/components/ui/math';

export default function RSAECCModule() {
  const [rsaState, setRsaState] = useState<any>(null);
  const [message, setMessage] = useState(42);
  const [encryptionResult, setEncryptionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'RSA' | 'ECC'>('RSA');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const generateRSA = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/rsa/generate`, { key_size: 16 });
      setRsaState(res.data);
      setEncryptionResult(null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const encryptRSA = async () => {
    if (!rsaState) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/rsa/encrypt`, { 
        message, 
        e: rsaState.public_key.e, 
        n: rsaState.public_key.n 
      });
      setEncryptionResult(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Module 2: RSA & ECC Working
        </h1>
        <p className="text-xl text-slate-400">Interactive simulation of classical encryption</p>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('RSA')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'RSA' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          RSA Simulator
        </button>
        <button 
          onClick={() => setActiveTab('ECC')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'ECC' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          ECC Simulator
        </button>
      </div>

      {activeTab === 'RSA' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">RSA Setup</h2>
            <p className="text-slate-300 mb-4">RSA relies on the mathematical difficulty of factoring the product of two large prime numbers.</p>
            <div className="flex gap-4">
              <button 
                onClick={generateRSA} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Small RSA Key'}
              </button>
            </div>
          </div>

          {rsaState && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">Step-by-Step Key Generation</h3>
              <MathSteps steps={rsaState.steps} />

              <div className="mt-8 pt-8 border-t border-slate-800">
                <h3 className="text-xl font-semibold mb-4">Try Encrypting</h3>
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-slate-300">Message (m) &lt; {rsaState.public_key.n}:</label>
                  <input 
                    type="number" 
                    value={message} 
                    onChange={(e) => setMessage(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white w-32"
                  />
                  <button 
                    onClick={encryptRSA}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                  >
                    Encrypt
                  </button>
                </div>

                {encryptionResult && (
                  <div className="bg-slate-950 p-6 rounded-xl border border-purple-500/30">
                    <h4 className="font-semibold text-purple-400 mb-4">Encryption Steps</h4>
                    <MathSteps steps={encryptionResult.steps} />
                    <div className="mt-4 text-xl">
                      Ciphertext: <strong className="text-white bg-purple-900/50 px-3 py-1 rounded">{encryptionResult.ciphertext}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ECC' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
           <h2 className="text-2xl font-bold mb-4">Elliptic Curve Cryptography (ECC)</h2>
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <p className="text-slate-300">ECC relies on the algebraic structure of elliptic curves over finite fields.</p>
                <div className="bg-slate-950 p-4 rounded-xl">
                   <h3 className="text-blue-400 font-semibold mb-2">The Curve Equation</h3>
                   <Math block math="y^2 = x^3 + ax + b" />
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mt-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <span>💡</span> The Analogy
                  </h3>
                  <p className="text-slate-300">
                    <strong>Scalar Multiplication:</strong> Think of "jumping across stones on a curved river 🪨". 
                    If you jump 100 times, it's easy to trace your steps forward, but if I only see where you ended up, it's almost impossible to calculate how many jumps you took.
                  </p>
                </div>
             </div>
             <div className="bg-slate-950 flex items-center justify-center rounded-xl p-8 border border-slate-800">
                <div className="text-center text-slate-500">
                   {/* Here you could embed a D3 visualization or a static image of an elliptic curve */}
                   <div className="w-48 h-48 border-2 border-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                      ECC Graph Visual
                   </div>
                   <p>Interactive ECC points coming soon</p>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
