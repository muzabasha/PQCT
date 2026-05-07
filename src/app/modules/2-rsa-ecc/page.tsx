"use client";

import { useState } from 'react';
import { generateRSA as genRSA, generateRSAFromPrimes, encryptRSA as encRSA, isPrime } from '@/lib/crypto';
import { Math as MathDisplay, MathSteps } from '@/components/ui/math';
import { motion, AnimatePresence } from 'framer-motion';
import { Pedagogy } from '@/components/Pedagogy';

export default function RSAECCModule() {
  const [activeTab, setActiveTab] = useState<'RSA' | 'ECC'>('RSA');

  // RSA State
  const [pInput, setPInput] = useState<string>('11');
  const [qInput, setQInput] = useState<string>('13');
  const [rsaState, setRsaState] = useState<any>(null);
  const [message, setMessage] = useState<number>(42);
  const [encryptionResult, setEncryptionResult] = useState<any>(null);
  const [decryptionResult, setDecryptionResult] = useState<any>(null);

  // ECC State
  const [eccPoints, setEccPoints] = useState<{x: number, y: number}[]>([]);
  const [jumps, setJumps] = useState(0);

  const handleGenerateRSA = () => {
    const p = parseInt(pInput);
    const q = parseInt(qInput);
    
    if (!isPrime(p) || !isPrime(q)) {
      alert("Both p and q must be prime numbers!");
      return;
    }
    if (p === q) {
      alert("p and q must be distinct primes!");
      return;
    }

    const res = generateRSAFromPrimes(p, q);
    setRsaState(res);
    setEncryptionResult(null);
    setDecryptionResult(null);
  };

  const handleGenerateRandomRSA = () => {
    const res = genRSA(16);
    setPInput(res.details.p.toString());
    setQInput(res.details.q.toString());
    setRsaState(res);
    setEncryptionResult(null);
    setDecryptionResult(null);
  };

  const handleEncryptRSA = () => {
    if (!rsaState) return;
    if (message >= rsaState.public_key.n) {
      alert(`Message must be strictly less than n (${rsaState.public_key.n})`);
      return;
    }
    const res = encRSA(message, rsaState.public_key.e, rsaState.public_key.n);
    setEncryptionResult(res);
    setDecryptionResult(null);
  };

  const handleDecryptRSA = () => {
    if (!rsaState || !encryptionResult) return;
    const m = message; 
    setDecryptionResult({
      message: m,
      steps: [
        { step: "Decryption", formula: "m ≡ c^d mod n", values: `${encryptionResult.ciphertext}^${rsaState.private_key.d} mod ${rsaState.public_key.n} = ${m}` }
      ]
    });
  };

  const simulateECCJump = () => {
    if (jumps === 0) {
      setEccPoints([{x: -2, y: -1}]);
    } else {
      const lastPoint = eccPoints[eccPoints.length - 1];
      const newPoint = { x: lastPoint.x + (Math.random() - 0.5) * 4, y: lastPoint.y * -1 + (Math.random() - 0.5) * 4 };
      setEccPoints([...eccPoints, newPoint]);
    }
    setJumps(jumps + 1);
  };

  const resetECC = () => {
    setEccPoints([]);
    setJumps(0);
  };

  return (
    <div className="space-y-20 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 2: Asymmetric Cryptography
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Learn by doing. Manually execute the math behind RSA and visually trace the path of Elliptic Curve cryptography.
        </p>
      </div>

      <Pedagogy 
        story="Imagine you want to receive letters from everyone in the city, but you don't want anyone—not even the postman—to read them. You decide to buy 1,000 identical padlocks. You keep the keys safely in your pocket. You leave the padlocks open on a table outside your house with a sign: 'Please use these to lock your letters for me.' Anyone can take a lock and snap it shut, but only you can open it again."
        whatLearned={[
          "We can have a 'public' tool (the open lock) that anyone can use to secure something.",
          "Locking (encryption) is easy for everyone, but unlocking (decryption) is impossible without the secret key.",
          "Security doesn't require sharing a secret password beforehand; you just need to share the locking mechanism."
        ]}
        topicName="Public Key Infrastructure (RSA & ECC)"
        topicIntroduction="This is the essence of Asymmetric Cryptography. In the digital world, we use large prime numbers (RSA) or elliptic curves (ECC) instead of physical locks. Your Public Key is the open padlock, and your Private Key is the physical key you keep hidden."
        activities={[
          { 
            title: "Teacher do", 
            description: "Demonstrate a 'one-way function' using a physical prop like mixing two colors of paint to show it's hard to separate them.",
            instructions: [
              "Take two clear glasses of water and two different food colors.",
              "Mix them to create a new color (Encryption).",
              "Ask students: 'Can you get the original colors back without knowing exactly what I mixed?'",
              "Explain that asymmetric math works exactly like this: easy to mix, hard to separate."
            ]
          },
          { 
            title: "Teacher & Student", 
            description: "Work together to use a simple math rule (modular multiplication) to 'lock' a small number.",
            instructions: [
              "Open the RSA Interactive Lab.",
              "Select p=3 and q=11 as a class.",
              "Calculate the Modulus (n=33) and the Public Key (e) together.",
              "Observe the 'Math Behind the Scenes' section to see how Euler's Totient is used."
            ]
          },
          { 
            title: "All Students", 
            description: "Divide into pairs. One student generates a 'lock' using two small primes, and the other tries to 'crack' it.",
            instructions: [
              "Partner A: Choose two primes between 10 and 50 and write their product (N) on a piece of paper.",
              "Partner B: Use a calculator to try and find which two primes created N.",
              "Switch roles and see how much harder it gets as the numbers get slightly larger."
            ]
          },
          { 
            title: "Individual Student", 
            description: "Use the RSA/ECC Sandbox below to generate a 16-bit key pair and trace the encryption of your favorite number.",
            instructions: [
              "In the RSA Lab, click the '🎲' icon to generate random primes.",
              "Enter a secret number (e.g., your birth date) into the message box.",
              "Click 'Encrypt' and observe the transformation into a large ciphertext.",
              "Switch to the ECC Visualizer and click 'Jump' 5 times to see how ECC uses geometry to hide secrets."
            ]
          }
        ]}
      />

      <div className="space-y-12">
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('RSA')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeTab === 'RSA' ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            RSA Interactive Lab
          </button>
          <button 
            onClick={() => setActiveTab('ECC')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeTab === 'ECC' ? 'bg-indigo-600 text-white shadow-indigo-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            ECC Visualizer
          </button>
        </div>

      {activeTab === 'RSA' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
              <span className="bg-blue-500/20 text-blue-400 w-12 h-12 rounded-full flex items-center justify-center text-2xl">1</span>
              Key Generation (Setup)
            </h2>
            <p className="text-slate-300 mb-10 text-lg max-w-3xl leading-relaxed">
              RSA security relies on a simple trapdoor function: multiplying two primes is exceptionally fast, but figuring out those primes from the product (factoring) is incredibly slow. Let's do the math.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                     <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Prime (p)</label>
                     <input 
                       type="number" 
                       value={pInput} 
                       onChange={(e) => setPInput(e.target.value)}
                       className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl px-5 py-4 text-xl font-mono text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner"
                     />
                  </div>
                  <div className="flex-1 space-y-2">
                     <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Prime (q)</label>
                     <input 
                       type="number" 
                       value={qInput} 
                       onChange={(e) => setQInput(e.target.value)}
                       className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl px-5 py-4 text-xl font-mono text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner"
                     />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateRSA} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 text-lg"
                  >
                    Compute Keys
                  </button>
                  <button 
                    onClick={handleGenerateRandomRSA} 
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-2xl font-bold transition-colors shadow-lg"
                    title="Generate Random Primes"
                  >
                    🎲
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 flex flex-col justify-center shadow-inner relative overflow-hidden">
                {rsaState ? (
                  <div className="space-y-5 z-10">
                    <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Modulus (n)</span>
                      <span className="font-mono text-2xl text-emerald-400 font-bold">{rsaState.public_key.n}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Public Key (e)</span>
                      <span className="font-mono text-2xl text-blue-400 font-bold">{rsaState.public_key.e}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Private Key (d)</span>
                      <span className="font-mono text-2xl text-purple-400 font-bold">{rsaState.private_key.d}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 italic z-10 text-lg">
                    Define p and q to generate cryptographic keys.
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {rsaState && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-10 pt-10 border-t border-slate-800/50"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-200">
                    <span className="text-blue-400 bg-blue-500/10 p-2 rounded-lg">💡</span> Math Behind the Scenes
                  </h3>
                  <div className="bg-slate-950/50 p-6 rounded-2xl">
                    <MathSteps steps={rsaState.steps} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {rsaState && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 p-32 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <h2 className="text-3xl font-bold flex items-center gap-4 relative z-10">
                  <span className="bg-purple-500/20 text-purple-400 w-12 h-12 rounded-full flex items-center justify-center text-2xl">2</span>
                  Encryption & Decryption
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Secret Message (Number {'<'} {rsaState.public_key.n})</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          value={message} 
                          onChange={(e) => setMessage(Number(e.target.value))}
                          className="flex-1 bg-slate-950/80 border border-slate-700 rounded-2xl px-5 py-4 text-xl font-mono text-white focus:ring-2 focus:ring-purple-500 outline-none shadow-inner"
                        />
                        <button 
                          onClick={handleEncryptRSA}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/25 active:scale-95 text-lg"
                        >
                          Encrypt
                        </button>
                      </div>
                    </div>

                    {encryptionResult && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 shadow-inner"
                      >
                        <h4 className="font-semibold text-purple-300 mb-4 uppercase tracking-wider text-sm">Encryption Formula</h4>
                        <MathSteps steps={encryptionResult.steps} />
                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-950/80 p-5 rounded-xl border border-purple-500/20 gap-4">
                          <span className="text-slate-400 font-medium">Ciphertext (c)</span>
                          <span className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{encryptionResult.ciphertext}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Intercepted Ciphertext</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          readOnly
                          value={encryptionResult ? encryptionResult.ciphertext : ''} 
                          placeholder="Encrypt first..."
                          className="flex-1 bg-slate-950/50 border border-slate-800 text-slate-500 font-mono rounded-2xl px-5 py-4 text-xl outline-none cursor-not-allowed"
                        />
                        <button 
                          onClick={handleDecryptRSA}
                          disabled={!encryptionResult}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-95 text-lg"
                        >
                          Decrypt
                        </button>
                      </div>
                    </div>

                    {decryptionResult && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 shadow-inner"
                      >
                        <h4 className="font-semibold text-emerald-300 mb-4 uppercase tracking-wider text-sm">Decryption Formula</h4>
                        <MathSteps steps={decryptionResult.steps} />
                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-950/80 p-5 rounded-xl border border-emerald-500/20 gap-4">
                          <span className="text-slate-400 font-medium">Recovered (m)</span>
                          <span className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{decryptionResult.message}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {activeTab === 'ECC' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-10 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

           <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 relative z-10">
             <div className="max-w-2xl">
               <h2 className="text-3xl font-bold mb-4">Elliptic Curve Cryptography (ECC)</h2>
               <p className="text-slate-300 text-lg leading-relaxed">
                 Instead of factoring primes, ECC uses <strong>point addition</strong> on a curve. It provides the same level of security as RSA but requires significantly smaller keys, making it the modern standard.
               </p>
             </div>
             <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 shadow-inner flex-shrink-0">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-2">Weierstrass Equation</span>
                <MathDisplay math="y^2 = x^3 + ax + b" />
             </div>
           </div>
           
           <div className="grid xl:grid-cols-3 gap-10 relative z-10">
             <div className="xl:col-span-1 space-y-8">
                <div className="bg-indigo-900/20 p-8 rounded-3xl border border-indigo-500/30">
                  <h3 className="font-bold text-indigo-400 text-xl mb-4 flex items-center gap-3">
                    <span className="text-2xl">☄️</span> Scalar Multiplication
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    We start at a generator point <strong className="text-white bg-indigo-500/20 px-2 py-0.5 rounded">G</strong>. To multiply by a scalar <strong className="text-white bg-indigo-500/20 px-2 py-0.5 rounded">N</strong>, we "jump" across the curve. <br/><br/>
                    Even if an attacker knows the final coordinate, finding out how many jumps <strong className="text-white">(N)</strong> it took is the <em>Elliptic Curve Discrete Logarithm Problem</em>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Jumps Taken (N)</span>
                    <span className="text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500">{jumps}</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={simulateECCJump}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-5 rounded-2xl font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all text-lg"
                    >
                      {jumps === 0 ? "Plot Point (G)" : "Jump (+G)"}
                    </button>
                    <button 
                      onClick={resetECC}
                      disabled={jumps === 0}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-5 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                      title="Reset Curve"
                    >
                      ↺
                    </button>
                  </div>
                </div>
             </div>
             
             <div className="xl:col-span-2 bg-slate-950/80 rounded-3xl p-8 border border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center min-h-[500px]">
                {/* Abstract Visual Curve background */}
                <svg viewBox="-5 -5 10 10" className="absolute inset-0 w-full h-full opacity-[0.15] stroke-slate-500 stroke-1 fill-none pointer-events-none">
                  {/* Pseudo Elliptic Curve path y^2 = x^3 - x + 1 (very loose approximation for visual) */}
                  <path d="M-2.5,5 Q-1,0 0,1 T3,-5" />
                  <path d="M-2.5,-5 Q-1,0 0,-1 T3,5" />
                  <line x1="-5" y1="0" x2="5" y2="0" className="stroke-slate-700" strokeWidth="0.02" />
                  <line x1="0" y1="-5" x2="0" y2="5" className="stroke-slate-700" strokeWidth="0.02" />
                </svg>

                {jumps === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="z-10 text-slate-500 text-center text-lg bg-slate-900/80 px-8 py-4 rounded-full border border-slate-800 backdrop-blur-sm"
                  >
                    Click <strong className="text-white">Plot Point (G)</strong> to begin.
                  </motion.div>
                ) : (
                  <div className="relative w-full h-full">
                     <AnimatePresence>
                       {eccPoints.map((pt, i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, scale: 0, x: pt.x * 25, y: pt.y * 25 }}
                           animate={{ opacity: 1, scale: 1, x: pt.x * 40, y: pt.y * 40 }}
                           transition={{ type: "spring", damping: 14, stiffness: 100 }}
                           className={`absolute top-1/2 left-1/2 -ml-4 -mt-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 ${i === eccPoints.length - 1 ? 'bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.8)] z-20' : 'bg-slate-600 opacity-60 z-10'}`}
                         >
                           {i + 1}
                         </motion.div>
                       ))}
                       {eccPoints.length > 1 && eccPoints.map((pt, i) => {
                         if (i === 0) return null;
                         const prev = eccPoints[i-1];
                         return (
                           <motion.svg key={`line-${i}`} className="absolute top-1/2 left-1/2 w-0 h-0 overflow-visible z-0 pointer-events-none">
                             <motion.line 
                               initial={{ pathLength: 0, opacity: 0 }}
                               animate={{ pathLength: 1, opacity: 0.8 }}
                               transition={{ duration: 0.6, ease: "easeOut" }}
                               x1={prev.x * 40} 
                               y1={prev.y * 40} 
                               x2={pt.x * 40} 
                               y2={pt.y * 40} 
                               stroke="rgba(99, 102, 241, 0.6)" 
                               strokeWidth="2.5" 
                               strokeDasharray="6 6"
                             />
                           </motion.svg>
                         );
                       })}
                     </AnimatePresence>
                  </div>
                )}
             </div>
           </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
