"use client";

import { useState } from 'react';
import { runShor as simShor, runGrover as simGrover } from '@/lib/crypto';
import { Math as MathDisplay, MathSteps } from '@/components/ui/math';
import { motion, AnimatePresence } from 'framer-motion';
import { Pedagogy } from '@/components/Pedagogy';

export default function ShorGroverModule() {
  const [activeTab, setActiveTab] = useState<'Shor' | 'Grover'>('Shor');

  // Shor State
  const [shorN, setShorN] = useState<string>('15');
  const [shorResult, setShorResult] = useState<any>(null);
  
  // Grover State
  const [datasetSize, setDatasetSize] = useState(1000000);
  const [groverResult, setGroverResult] = useState<any>(null);

  const handleRunShor = () => {
    const N = parseInt(shorN);
    if (isNaN(N) || N <= 1) {
      alert("Please enter a valid integer greater than 1.");
      return;
    }
    const res = simShor(N);
    setShorResult(res);
  };

  const handleRunGrover = () => {
    const res = simGrover(datasetSize);
    setGroverResult(res);
  };

  return (
    <div className="space-y-20 max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          Module 3: Shor & Grover Algorithms
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Experience how quantum computers exploit interference and entanglement to break classical cryptography.
        </p>
      </div>

      <Pedagogy 
        story="Imagine a scientist invents 'X-Ray Glasses.' When you look at a locked box through these glasses, you don't see the metal; you see the internal pattern of the tumblers. Suddenly, what took years of trial and error now takes seconds. The metal isn't 'broken'—the glasses simply bypass the struggle by seeing a hidden pattern. Similarly, in a dark warehouse, a 'Magic Flashlight' doesn't just shine on one box; it makes the box with the gold coin grow brighter while others get darker."
        whatLearned={[
          "Something 'impossible' can become 'easy' if we change how we look at the problem.",
          "Finding hidden 'patterns' or 'periods' is the secret to breaking math-based locks.",
          "We can 'amplify' the right answer and cancel out the wrong ones using interference."
        ]}
        topicName="Shor's and Grover's Algorithms"
        topicIntroduction="These are the two pillars of Quantum Advantage. Shor's Algorithm uses 'X-Ray' logic to find periods in math, breaking RSA/ECC. Grover's Algorithm uses the 'Magic Flashlight' to amplify correct answers in unsorted data, doubling the required key size for symmetric encryption."
        activities={[
          { 
            title: "Teacher do", 
            description: "Show a repeating sequence of numbers and explain how finding the 'period' (pattern) is the key to the lock.",
            instructions: [
              "Draw a simple repeating sequence on the board (e.g., 2, 4, 8, 6, 2, 4, 8, 6).",
              "Ask the class: 'What is the pattern length?'",
              "Explain that a Quantum computer doesn't count 1-2-3-4; it uses interference to see the 'frequency' of the whole pattern at once."
            ]
          },
          { 
            title: "Teacher & Student", 
            description: "Use the Shor simulation to factor a small number and observe the 'wave' pattern detection.",
            instructions: [
              "Enter the number 15 into the Shor's simulation box.",
              "Click 'Run Quantum Circuit'.",
              "Review the 'Execution Trace' to see how the factors 3 and 5 are derived from the discovered period."
            ]
          },
          { 
            title: "All Students", 
            description: "Play a 'Period Finding' game: guess the next number in a complex modular sequence.",
            instructions: [
              "Teacher provides a starting number (e.g., 7) and a rule (multiply by 7 and take remainder of 15).",
              "Students manually calculate the next 4 numbers: 7, 4, 13, 1...",
              "Discuss how a Quantum computer finds the '1' (the end of the period) exponentially faster than humans."
            ]
          },
          { 
            title: "Individual Student", 
            description: "Run the Grover search below to see the 'spotlight' effect on a database of 1 million items.",
            instructions: [
              "Switch to the Grover's Algorithm tab.",
              "Set the database size slider to 100,000,000.",
              "Click 'Run Grover Search' and compare the Classical (50M steps) vs Quantum (7.8K steps) results.",
              "Observe how the 'Magic Flashlight' provides a quadratic speedup for searching secrets."
            ]
          }
        ]}
      />

      <div className="space-y-12">
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('Shor')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeTab === 'Shor' ? 'bg-purple-600 text-white shadow-purple-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            Shor's Algorithm (Breaks RSA)
          </button>
          <button 
            onClick={() => setActiveTab('Grover')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeTab === 'Grover' ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            Grover's Algorithm (Breaks AES/Hashes)
          </button>
        </div>

      {activeTab === 'Shor' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
            <span className="text-4xl">🌊</span>
            Period Finding via QFT
          </h2>
          <p className="text-slate-300 mb-10 text-lg max-w-3xl leading-relaxed">
            Shor's algorithm turns factoring into a "period finding" problem. It evaluates a modular exponential function for all possible inputs simultaneously, then uses the <strong>Quantum Fourier Transform (QFT)</strong> to find the repeating pattern (period) in one shot.
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                <MathDisplay block math="f(x) = a^x \pmod N" />
                <p className="text-sm text-slate-400 mt-4 text-center">Finding the period <strong className="text-slate-300">r</strong> where <strong className="text-slate-300">f(x+r) = f(x)</strong></p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                   <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Number to Factor (N)</label>
                   <input 
                     type="number" 
                     value={shorN} 
                     onChange={(e) => setShorN(e.target.value)}
                     className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl px-5 py-4 text-xl font-mono text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-inner"
                     placeholder="e.g. 15, 21, 35"
                   />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleRunShor} 
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/25 active:scale-95 text-lg whitespace-nowrap"
                  >
                    Run Quantum Circuit
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[300px]">
              {shorResult ? (
                <div className="space-y-6 z-10">
                  <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Quantum Output</h3>
                  {shorResult.result ? (
                    <motion.div 
                      initial={{ scale: 0.9 }} animate={{ scale: 1 }} 
                      className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl text-center"
                    >
                      <div className="text-emerald-400 font-medium mb-2">Prime Factors Found</div>
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        {shorResult.result[0]} &times; {shorResult.result[1]}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.9 }} animate={{ scale: 1 }} 
                      className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl text-center"
                    >
                      <div className="text-red-400 font-bold mb-2">Probabilistic Failure</div>
                      <div className="text-slate-300 text-sm">
                        Quantum mechanics is inherently probabilistic. The period found was odd or didn't yield factors. Try running the circuit again!
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500 italic z-10 text-lg">
                  Initialize superposition to begin factoring.
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {shorResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-10 pt-10 border-t border-slate-800/50"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-200">
                  <span className="text-purple-400 bg-purple-500/10 p-2 rounded-lg">⚙️</span> Step-by-Step Execution trace
                </h3>
                <div className="bg-slate-950/50 p-6 rounded-2xl">
                  <MathSteps steps={shorResult.steps} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {activeTab === 'Grover' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden space-y-10"
        >
          <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
              <span className="text-4xl">🔦</span>
              Amplitude Amplification
            </h2>
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">
              Grover's algorithm searches unstructured databases in <strong className="text-blue-400">O(√N)</strong> time instead of <strong className="text-slate-400">O(N)</strong>. It does this by repeatedly inverting the target item's phase and inverting all probabilities around the mean, slowly amplifying the correct answer like turning up a spotlight.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider ml-1">Database Size (N): {datasetSize.toLocaleString()}</label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000000" 
                  step="1000" 
                  value={datasetSize} 
                  onChange={(e) => setDatasetSize(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button 
                onClick={handleRunGrover}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-lg"
              >
                Run Grover Search
              </button>

              <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                 <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Grover Operator</h4>
                 <MathDisplay block math="U = (2|s\rangle\langle s| - I)O" />
                 <p className="text-xs text-slate-400 mt-4 text-center">Oracle (<strong className="text-slate-300">O</strong>) + Diffusion (<strong className="text-slate-300">2|s⟩⟨s| - I</strong>)</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              {groverResult ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                      className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-inner text-center"
                    >
                      <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider font-bold">Classical Steps (avg)</div>
                      <div className="text-3xl font-mono font-black text-slate-300">{Math.floor(groverResult.classical_average_steps).toLocaleString()}</div>
                      <div className="text-xs text-slate-500 mt-2">N / 2</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                      className="bg-blue-900/20 p-6 rounded-3xl border border-blue-500/30 shadow-inner text-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                      <div className="text-sm text-blue-400 mb-2 uppercase tracking-wider font-bold relative z-10">Quantum Steps</div>
                      <div className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 relative z-10">
                        {Math.floor(groverResult.quantum_steps).toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-300/70 mt-2 relative z-10">(π/4)√N</div>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="bg-slate-950/50 p-6 rounded-2xl"
                  >
                    <MathSteps steps={groverResult.steps} />
                  </motion.div>
                </div>
              ) : (
                <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 shadow-inner h-full flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-slate-500 italic text-lg">
                    Adjust the dataset size and run the search to compare classical vs quantum efficiency.
                  </div>
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
