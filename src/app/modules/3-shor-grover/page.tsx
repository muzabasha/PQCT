"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopicTemplate } from '@/components/TopicTemplate';
import { runShor as simShor, runGrover as simGrover } from '@/lib/crypto';

// ─── Virtual Lab: Shor & Grover Simulator ────────────────────────────────────
function ShorGroverLab() {
  const [activeTab, setActiveTab] = useState<'Shor' | 'Grover'>('Shor');
  const [shorN, setShorN] = useState('15');
  const [shorResult, setShorResult] = useState<any>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [datasetSize, setDatasetSize] = useState(1000000);
  const [groverResult, setGroverResult] = useState<any>(null);
  const [aesKeySize, setAesKeySize] = useState(128);
  const [nistLevel, setNistLevel] = useState<'Level 1' | 'Level 3' | 'Level 5'>('Level 1');

  const runShor = () => {
    const N = parseInt(shorN);
    if (isNaN(N) || N <= 1) { alert("Enter a valid integer > 1."); return; }
    setShorResult(simShor(N));
  };

  const runGrover = () => setGroverResult(simGrover(datasetSize));

  // Quantum security measurement
  const quantumSecurityBits = (keySize: number) => {
    if (activeTab === 'Grover') {
      // Grover's halves effective security
      return Math.floor(keySize / 2);
    }
    return 0;
  };

  const nistKeySizeMap = { 'Level 1': 128, 'Level 3': 192, 'Level 5': 256 };
  const selectedBitSecurity = nistKeySizeMap[nistLevel];
  const groverSecurity = Math.floor(selectedBitSecurity / 2);
  const isBrokenByGrover = groverSecurity < 80;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Algorithm Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['Shor', 'Grover'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeTab === tab ? 'bg-secondary text-white shadow-lg shadow-secondary/25' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {tab === 'Shor' ? "⚛️ Shor's Algorithm (Exponential)" : "🔦 Grover's Algorithm (Quadratic)"}
          </button>
        ))}
      </div>

      {activeTab === 'Shor' && (
        <>
          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Number to Factor (N)</label>
              <input type="number" value={shorN} onChange={e => setShorN(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xl font-mono text-slate-900 focus:ring-2 focus:ring-secondary outline-none"
                placeholder="e.g. 15, 21, 35" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Quantum Circuit Size</label>
              <div className="h-[48px] flex items-center bg-white border border-slate-200 rounded-xl px-4">
                {shorN ? (
                  <span className="text-sm font-mono text-slate-700">
                    ~{Math.floor(2 * Math.pow(parseInt(shorN) || 15, 3)).toLocaleString()} quantum gates needed
                  </span>
                ) : (
                  <span className="text-sm text-slate-600 italic">Enter N to estimate</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">&nbsp;</label>
              <div className="flex gap-2">
                <button onClick={runShor}
                  className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                  ⚛️ Run Shor's Circuit
                </button>
                <button onClick={() => setShowSteps(!showSteps)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all">
                    {showSteps ? 'Hide Steps' : 'Show Steps'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Result Display */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[200px]">
              {shorResult ? (
                <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="space-y-4">
                  {shorResult.result ? (
                    <div className="space-y-3">
                      <div className="bg-success/10 border border-success/30 p-5 rounded-xl text-center">
                        <div className="text-success text-sm font-bold mb-2">✓ Prime Factors Found by Quantum Period Finding</div>
                        <div className="text-3xl md:text-4xl font-black font-mono text-success">
                          {shorResult.result[0]} × {shorResult.result[1]}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">= {parseInt(shorResult.result[0]) * parseInt(shorResult.result[1])}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-muted-foreground uppercase">Classical GNFS Steps</div>
                          <div className="text-lg font-black text-slate-700">
                            ~10^{Math.floor(Math.log10(parseInt(shorN) || 15) * 5)} 
                          </div>
                        </div>
                        <div className="bg-secondary/10 border border-secondary/30 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-secondary uppercase">Shor's Quantum Gates</div>
                          <div className="text-lg font-black text-secondary">
                            ~{Math.floor(2 * Math.pow(parseInt(shorN) || 15, 3)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl text-center">
                      <div className="text-destructive font-bold mb-1">Probabilistic Outcome — Period Was Odd</div>
                      <p className="text-xs text-slate-600">Shor's is probabilistic. Click "Run" again for a different random base 'a' that may yield an even period.</p>
                      <button onClick={runShor} className="mt-3 px-4 py-2 bg-destructive text-white rounded-xl font-bold text-xs hover:opacity-90">
                        Retry with New Random Base
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                  Enter N (e.g., 15, 21, 35, 77) and run the quantum circuit
                </div>
              )}
            </div>

            {/* Algorithm Steps Trace */}
            {showSteps && shorResult && shorResult.steps && (
              <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-secondary uppercase mb-2">Algorithm Trace</div>
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {shorResult.steps.map((s: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200/80 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-secondary mb-1">{s.step}</div>
                      {s.formula && <div className="text-[10px] font-mono text-slate-700">{s.formula}</div>}
                      {s.values && <div className="text-[9px] text-slate-600 mt-0.5">{s.values}</div>}
                      {s.message && <div className="text-[9px] text-slate-600 mt-0.5">{s.message}</div>}
                    </div>
                  ))}
                </div>
                <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-xl text-[9px] text-slate-600">
                  <span className="font-bold text-secondary">Key insight: </span>
                  Shor's changes the complexity class from exponential (classical) to polynomial (quantum) — this is the validated impact measurement.
                </div>
              </motion.div>
            )}
            {!shorResult && (
              <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-3xl mb-2">⚛️</div>
                  <p className="text-xs italic">Click "Run Shor's Circuit" to see the algorithm trace</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'Grover' && (
        <>
          {/* Grover's Control Panel - 2 column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Controls */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Search Space Size (N): {datasetSize.toLocaleString()}</label>
                  <input type="range" min="1000" max="100000000" step="1000" value={datasetSize}
                    onChange={e => setDatasetSize(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>1K</span>
                    <span>100M</span>
                  </div>
                </div>
                <button onClick={runGrover}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  🔦 Run Grover Search
                </button>
              </div>

              {/* AES Key Size Impact Studio */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">AES Key Size Impact Studio</div>
                <p className="text-[9px] text-slate-600">See how doubling AES key sizes thwarts Grover's attack:</p>
                <div className="grid grid-cols-3 gap-2">
                  {([128, 192, 256] as const).map(ks => (
                    <button key={ks} onClick={() => setAesKeySize(ks)}
                      className={`p-3 rounded-xl text-center transition-all ${aesKeySize === ks ? 'bg-primary/20 border border-primary/40 text-primary font-bold' : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'}`}>
                      <div className="text-lg font-black">{ks}</div>
                      <div className="text-[8px] uppercase">AES-{ks}</div>
                    </button>
                  ))}
                </div>
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Classical Security</span>
                    <span className="font-bold text-foreground">{aesKeySize} bits</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Grover's Effective Security</span>
                    <span className="font-bold text-primary">{Math.floor(aesKeySize / 2)} bits</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Quantum Vulnerability</span>
                    <span className={`font-bold ${aesKeySize / 2 < 80 ? 'text-destructive' : 'text-success'}`}>
                      {aesKeySize / 2 < 80 ? '⚠ VULNERABLE' : '✓ RESISTANT'}
                    </span>
                  </div>
                </div>
              </div>

              {/* NIST Level Impact */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">NIST Security Level Studio</div>
                <div className="flex gap-2">
                  {(['Level 1', 'Level 3', 'Level 5'] as const).map(lvl => (
                    <button key={lvl} onClick={() => setNistLevel(lvl)}
                      className={`flex-1 p-3 rounded-xl text-center transition-all ${nistLevel === lvl ? 'bg-secondary/20 border border-secondary/40 text-secondary font-bold' : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'}`}>
                      <div className="text-[9px] font-black">{lvl}</div>
                      <div className="text-[8px] text-muted-foreground">{nistKeySizeMap[lvl]} bits</div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-success/10 border border-success/20 p-2 rounded-lg text-center">
                    <div className="text-[8px] text-muted-foreground">Pre-Grover Security</div>
                    <div className="text-sm font-black text-success">{selectedBitSecurity} bits</div>
                  </div>
                  <div className={ `${isBrokenByGrover ? 'bg-destructive/10 border-destructive/20' : 'bg-success/10 border-success/20'} border p-2 rounded-lg text-center`}>
                    <div className="text-[8px] text-muted-foreground">Post-Grover Security</div>
                    <div className={`text-sm font-black ${isBrokenByGrover ? 'text-destructive' : 'text-success'}`}>{groverSecurity} bits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[200px]">
                {groverResult ? (
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Classical Steps (average)</div>
                          <div className="text-[9px] text-muted-foreground">Linear search: N / 2</div>
                        </div>
                        <div className="text-xl font-black font-mono text-slate-700">{Math.floor(groverResult.classical_average_steps).toLocaleString()}</div>
                      </div>
                      <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-primary uppercase font-bold">Grover's Quantum Steps</div>
                          <div className="text-[9px] text-primary/60">Optimal: (π/4)√N (BBBV theorem)</div>
                        </div>
                        <div className="text-xl font-black font-mono text-primary">{Math.floor(groverResult.quantum_steps).toLocaleString()}</div>
                      </div>
                      <div className="bg-success/10 border border-success/30 p-4 rounded-xl text-center">
                        <div className="text-[10px] text-success font-bold uppercase">Validated Speedup Factor</div>
                        <div className="text-2xl font-black text-success">
                          {(Math.floor(groverResult.classical_average_steps) / Math.floor(groverResult.quantum_steps)).toFixed(0)}×
                        </div>
                        <div className="text-[9px] text-success/60 mt-1">Quadratic speedup — confirmed optimal by BBBV theorem. No faster quantum search algorithm is possible.</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                    Adjust dataset size and run Grover's search to see the quadratic speedup
                  </div>
                )}
              </div>

              {/* Complexity Comparison Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Algorithm Complexity Comparison</div>
                <div className="space-y-2">
                  {[
                    { name: "Shor's vs Classical Factoring", classical: "Exponential (2^n)", quantum: "Polynomial (n³)", speedup: "Exponential 🏆" },
                    { name: "Grover's vs Classical Search", classical: "Linear (N)", quantum: "√N", speedup: "Quadratic ✓" },
                    { name: "Lattice SVP vs Classical", classical: "O(2^{0.292n})", quantum: "O(2^{0.297n})", speedup: "None (≈1×)" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200/80 rounded-lg p-3 text-[9px]">
                      <div className="font-bold text-slate-600 mb-1">{item.name}</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><span className="text-muted-foreground">Classical: </span><span className="text-slate-600">{item.classical}</span></div>
                        <div><span className="text-muted-foreground">Quantum: </span><span className="text-primary">{item.quantum}</span></div>
                        <div><span className="text-muted-foreground">Speedup: </span><span className={item.speedup.includes('Exponential') ? 'text-destructive font-bold' : item.speedup.includes('Quadratic') ? 'text-primary' : 'text-slate-600'}>{item.speedup}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[8px] text-slate-500 mt-3 italic">Only Shor's provides exponential speedup — explaining why RSA/ECC must be fully replaced while AES-256 only needs key size doubling.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const prerequisitesData = {
  topics: [
    "Complexity class measurement: P vs NP vs BQP — measuring feasibility by scaling behavior",
    "Gate complexity as a metric: counting quantum gates to compare algorithm difficulty",
    "Quantum advantage ratio: measuring T_classical / T_quantum as the impact metric",
    "Security level measurement: how bit security changes under quantum attack models",
    "Validated optimality: Grover's proven Ω(√N) lower bound as a measurement ceiling"
  ],
  mcqs: [
    {
      question: "How is gate complexity used to measure the impact of quantum algorithms?",
      options: ["By counting qubits", "Gate complexity = total number of elementary quantum operations needed. Shor's = O(n³) gates ~8.6B for RSA-2048. Classical GNFS = ~10³⁴ operations. The ratio 10³⁴/10⁹ = 10²⁵× IS the measured impact of Shor's", "By measuring runtime in seconds", "By counting algorithm steps"],
      correctIndex: 1,
      justification: "Gate complexity is the validated standard for cross-paradigm comparison. Shor's requires ~2n³ quantum gates. For n=2048: ~8.6×10⁹ gates. Classical GNFS: ~exp(n^{1/3}) ~10³⁴ operations. The 10²⁵× advantage ratio IS the measured impact — it converts 'impossible' to 'feasible'."
    },
    {
      question: "What does the validated Ω(√N) lower bound for Grover's algorithm measure?",
      options: ["The minimum time Grover's takes", "The proven optimality — no quantum algorithm can beat √N steps for unstructured search. This measurement ceiling means Grover's impact is fundamentally limited to quadratic speedup", "The maximum database size", "The number of Grover iterations"],
      correctIndex: 1,
      justification: "Validated optimality: Grover's is proven optimal — any quantum unstructured search algorithm requires at least Ω(√N) oracle calls. This measured ceiling means: (1) AES-256 (2^256) → 2^128 quantum ops → safe, (2) no 'better Grover's' will ever exist. This validated limit is why symmetric crypto only needs key size doubling."
    },
    {
      question: "What is the quantum advantage ratio for Shor's factoring RSA-2048?",
      options: ["10×", "10²⁵× — validated by comparing classical GNFS (~10³⁴ ops) to Shor's (~8.6×10⁹ gates). This 10²⁵ advantage is the largest measured speedup in any computational problem", "1000×", "Infinite"],
      correctIndex: 1,
      justification: "Validated measurement: Classical GNFS requires ~exp((64/9)^{1/3} * (ln 2048)^{1/3} * (ln ln 2048)^{2/3}) ≈ 10³⁴ operations. Shor's requires ~2*(2048)³ ≈ 8.6×10⁹ gates. Ratio = 10³⁴ / 10¹⁰ ≈ 10²⁴-10²⁵×. This IS the validated impact measurement — it changes factoring from 'never' to 'hours'."
    }
  ]
};

const recapData = {
  summary: [
    "Measured quantum advantage ratio: Shor's = 10²⁵× speedup over classical GNFS (validated O(n³) vs O(exp)); Grover's = √N speedup (validated optimal by BBBV theorem)",
    "Validated impact on security bits: Shor's reduces RSA/ECC from 128-bit classical to 0-bit quantum; Grover's halves symmetric bit security (AES-128 → 64-bit, AES-256 → 128-bit)",
    "Gate complexity measurement: Shor's requires ~2n³ gates = 8.6B for RSA-2048; Grover's requires (π/4)√N iterations = 785 for N=10⁶ — both validated by back-of-envelope complexity calculations",
    "Validated structural distinction: Shor's exploits algebraic periodicity (non-existent in AES), Grover's exploits amplitude amplification (applies to all unstructured problems) — this distinction IS the validation of why AES-256 survives but RSA dies",
    "Physical resource measurement: Shor's needs ~2n logical qubits → ~40M physical qubits with error correction for RSA-2048; validated against IBM/IonQ/Google hardware roadmaps → CRQC feasible 2030-2035",
    "BBBV theorem validated measurement: Ω(√N) is a proven lower bound — no future quantum algorithm can beat Grover's quadratic speedup for unstructured search, permanently capping the threat to symmetric crypto",
    "Key scaling measurement validated: Shor's is O(n³), so doubling RSA key size only adds 8× difficulty — the polynomial scaling is measured and confirmed, proving key size increase is futile against Shor's",
    "Total cost measurement for Grover's on AES-128: ~10⁴ gates/iteration × 2⁶⁴ iterations = ~10²⁰ total gates — validated to be infeasible for current and near-future hardware (millions of years at 1MHz gate speed)",
    "Quantum safety metric validated: an algorithm is quantum-safe if the best known quantum attack requires ≥ 2¹⁰⁰ operations and no polynomial-time quantum algorithm exists — RSA fails, Kyber passes, AES-256 passes with margin",
    "Combined impact measurement: Shor's necessitates full algorithm replacement for public-key crypto; Grover's requires key size doubling for symmetric crypto — this validated dual-threat assessment defines the global PQC migration roadmap"
  ],
  mcqs: [
    {
      question: "What validates that Shor's provides exponential speedup over classical factoring?",
      options: ["It has been tested on quantum hardware", "Validated by complexity analysis: Shor's O(n³) vs classical GNFS O(exp(n^{1/3})). For n=2048: 8.6×10⁹ gates vs 10³⁴ operations = 10²⁵× advantage. This mathematical complexity ratio IS the validated measurement", "It was proven in Shor's original paper", "Quantum computers are faster"],
      correctIndex: 1,
      justification: "Validated measurement: GNFS complexity ≈ exp((64/9)^{1/3} n^{1/3} (log n)^{2/3}) ≈ 10^34 for n=2048. Shor's complexity ≈ 2n³ ≈ 8.6×10^9 gates. The ratio 10^34 / 10^10 = 10^24× is a validated mathematical measurement — it doesn't depend on hardware existence. This IS the impact."
    },
    {
      question: "What validated proof establishes Grover's quadratic speedup as optimal?",
      options: ["Grover himself proved it", "The BBBV theorem (1997) proves Ω(√N) is the minimum number of oracle queries for any quantum unstructured search algorithm — this mathematical proof validates that Grover's is optimal and no 'better Grover's' will ever exist", "Empirical testing shows it", "It's widely believed"],
      correctIndex: 1,
      justification: "Validated by BBBV theorem: any quantum algorithm for unstructured search requires at least Ω(√N) queries. This is a mathematical proof, not a heuristic. The validated consequence: AES-256 will always require 2^128 quantum operations to break — permanently establishing it as quantum-safe regardless of future quantum hardware advances."
    },
    {
      question: "How do we measure the qubit requirements for running Shor's on a specific key?",
      options: ["Count the bits in the key", "Validated formula: total_physical_qubits = (2n) × error_correction_overhead (~10⁴). For RSA-2048 (n=2048): 4096 logical qubits × 10⁴ = ~40M physical qubits. This measurement validates current quantum hardware (10³ qubits) is 10⁴× short of CRQC capability", "Qubits = n + 100", "Qubits are not measurable"],
      correctIndex: 1,
      justification: "Validated measurement: Shor's requires ~2n logical qubits for n-bit factoring. Surface code error correction requires ~10⁴ physical qubits per logical qubit. RSA-2048: 2×2048 × 10⁴ ≈ 40M physical qubits. Current leaders: IBM 1,121 qubits (2024). This measurement gap of 10⁴× validates CRQC timeline projections of 2030-2035."
    }
  ]
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShorGroverModule() {
  return (
    <TopicTemplate
      topicId="3-1"
      topicName="Shor's & Grover's Quantum Algorithms"
      story={{
        title: "The X-Ray Glasses and the Magic Flashlight",
        content: "A master safecracker had tried every combination for years. Then a quantum physicist handed her two devices. The first: 'X-Ray Glasses' that didn't just look at the safe — they vibrated with every possible combination simultaneously and highlighted the one that matched the internal pattern. The safe opened in seconds. The second: a 'Magic Flashlight' for a warehouse of a million boxes — instead of checking each box, it made the box with the gold grow brighter every second until it glowed like a star.",
        analogy: "X-Ray Glasses = Shor's Algorithm (finds the hidden mathematical period using wave interference). Magic Flashlight = Grover's Algorithm (amplifies the correct answer's probability while suppressing wrong answers).",
        reflectiveQuestions: [
          "How is 'looking at all possibilities simultaneously' different from 'guessing randomly'?",
          "If you can amplify the right answer, why do you still need multiple iterations?",
          "Why does doubling the key size fix Grover's threat but NOT Shor's threat?"
        ],
        connectToTopic: "Shor's and Grover's are the two quantum algorithms that define the PQC threat landscape. This module validates the exact speedup each achieves — exponential (Shor's, 10²⁵×) vs quadratic (Grover's, √N) — and measures how these speedups translate into concrete security bit reductions: RSA/ECC → 0 bits, AES-128 → 64 bits, AES-256 → 128 bits. These validated measurements directly dictate which algorithms need full PQC replacement vs key size adjustment."
      }}
      mathModelling={{
        need: "Validating the precise quantum speedup for each algorithm family — exponential (Shor's, 10²⁵× for factoring) vs quadratic (Grover's, √N for search) — is the measurement that determines which cryptographic techniques require full PQC replacement and which only need key size adjustments.",
        motivation: "Without validated speedup measurements, the PQC migration strategy is guesswork. With them, we know: RSA/ECC → 0-bit quantum security (full PQC replacement), AES-128 → 64-bit effective quantum security (key doubling suffices), AES-256 → 128-bit (safe as-is). These validated security-bit measurements are the quantitative foundation of every organizational PQC roadmap.",
        challenges: {
          realWorld: "RSA-2048 protects trillions of dollars of internet commerce. A working CRQC running Shor's would invalidate all of it instantly.",
          technical: "Implementing Shor's requires thousands of logical qubits with error correction — currently beyond hardware capability, but advancing rapidly."
        },
        advantages: [
          "Exponential speedup for factoring (Shor's)",
          "Quadratic speedup for search (Grover's)",
          "Mathematically proven — not heuristic"
        ],
        limitations: [
          "Requires fault-tolerant quantum hardware",
          "Grover's threat is mitigable by doubling key size",
          "Shor's threat requires full algorithm replacement"
        ],
        equations: [
          {
            latex: "T_{Shor} = O\\left(n^3\\right) \\text{ vs } T_{Classical} = O\\left(e^{n^{1/3}(\\log n)^{2/3}}\\right)",
            symbols: {
              "T_{Shor}": "Time complexity of Shor's algorithm",
              "T_{Classical}": "Time complexity of GNFS (best classical factoring)",
              "n": "Number of bits in N (the number being factored)"
            },
            meaning: "Shor's is polynomial. Classical factoring is sub-exponential. For n=2048, this difference is the gap between hours and 300 trillion years.",
            whyNeeded: "This comparison quantifies exactly why RSA-2048 is 'classically secure' but 'quantum-broken'.",
            interpretation: "Shor's doesn't just speed things up — it changes the complexity class of the problem from exponential to polynomial.",
            numericalExample: "n = 2048 bits\nClassical GNFS ≈ 10^34 operations → ~300 trillion years on best supercomputer\nShor's QFT ≈ 2048^3 = 8.6 billion gate operations → ~8 hours on a CRQC\nSpeedup: ~10^25× (astronomical)"
          },
          {
            latex: "T_{Grover} = O\\left(\\sqrt{N}\\right) \\text{ vs } T_{Classical} = O\\left(N\\right)",
            symbols: {
              "T_{Grover}": "Grover's search complexity",
              "T_{Classical}": "Classical brute-force search",
              "N": "Size of the search space (2^k for k-bit key)"
            },
            meaning: "Grover's provides a quadratic speedup for any unstructured search — including brute-forcing a symmetric encryption key.",
            whyNeeded: "AES-128 has a search space of 2^128. Grover reduces this to 2^64, which is feasible. AES-256 under Grover is 2^128 — still infeasible.",
            interpretation: "Grover's threat doubles the required symmetric key size. AES-256 remains quantum-resistant; AES-128 does not.",
            numericalExample: "AES-128: N = 2^128\nClassical brute-force: 2^128 ≈ 3.4×10^38 operations (infeasible)\nGrover's search: √(2^128) = 2^64 ≈ 1.8×10^19 operations (feasible on future hardware)\n\nFix: Use AES-256 → Grover's cost = 2^128 (infeasible again)"
          }
        ],
        simulationResults: "The interactive lab below lets you run simulated versions of both algorithms and compare classical vs quantum step counts."
      }}
      abl={[
        {
          level: 1,
          title: "The Wave Interference Demo",
          objective: "Physically demonstrate how quantum interference cancels wrong answers and amplifies right ones.",
          time: "10 Mins",
          materials: ["Two speakers or audio app","Tone generator","Chalk"],
          instructions: [
            "Play two identical tones that are slightly out of phase using two phones.",
            "Show that they create a 'beat pattern' — amplification and cancellation.",
            "Explain: Shor's QFT works like this. It creates waves for every possible period, and only the correct period survives the interference.",
            "Draw the wave pattern on the board and label: 'Constructive = Right Answer, Destructive = Wrong Answer'."
          ],
          expectedOutput: "Students connect wave physics to quantum algorithm behavior.",
          assessmentRubrics: ["Can explain constructive/destructive interference","Maps analogy to QFT correctly"]
        },
        {
          level: 2,
          title: "Manual Period Finding for N=21",
          objective: "Manually compute the period of f(x) = 2^x mod 21.",
          time: "20 Mins",
          materials: ["Calculators","Graph paper"],
          instructions: [
            "Assign groups: a=2, N=21",
            "Calculate: 2^1 mod 21 = 2, 2^2 = 4, 2^3 = 8, 2^4 = 16, 2^5 = 11, 2^6 = 1 → PERIOD r = 6",
            "Compute GCD(2^3 + 1, 21) = GCD(9, 21) = 3",
            "Compute GCD(2^3 - 1, 21) = GCD(7, 21) = 7",
            "Verify: 3 × 7 = 21 ✓",
            "Discuss: How many steps did this take? QFT does it in O(n³) quantum gates."
          ],
          expectedOutput: "Every student successfully factors 21 = 3 × 7 using the Shor's classical simulation.",
          assessmentRubrics: ["Correct period detection","Correct GCD computation","Verified factorization"]
        },
        {
          level: 3,
          title: "Grover's Spotlight Game",
          objective: "Simulate amplitude amplification with physical cards.",
          time: "25 Mins",
          materials: ["50 index cards","1 red card (the target)","Probability chips"],
          instructions: [
            "Distribute 50 cards face-down (1 red hidden among 49 white).",
            "Classical: students must flip cards one by one. Average = 25 flips.",
            "Grover's simulation: mark probabilities. After each 'oracle call' (teacher secretly doubles chips on red card's pile), students guess based on probability.",
            "Run 7 rounds (~π/4 × √50 ≈ 5.5 rounds). Count average flips needed.",
            "Compare: ~25 classical vs ~7 quantum rounds."
          ],
          expectedOutput: "Students experience the √N speedup as a physical probability amplification game.",
          assessmentRubrics: ["Engagement with the simulation","Correct interpretation of speedup","Group collaboration quality"]
        },
        {
          level: 4,
          title: "Virtual Lab Analysis Report",
          objective: "Use the simulator below to generate data and write a 1-page analysis.",
          time: "20 Mins",
          materials: ["Virtual Lab (below)","Notebook"],
          instructions: [
            "Run Shor's on N=15. Record: factors found, steps taken.",
            "Run Shor's on N=35. Record: factors found, steps taken.",
            "Run Grover's for N=1,000 and N=1,000,000. Record classical vs quantum steps.",
            "Calculate the speedup ratio for each Grover run.",
            "Write: 'Given these results, what key size would you recommend for AES in 2030? Justify with the numbers.'"
          ],
          expectedOutput: "A written analysis demonstrating mastery of both algorithms' complexity implications.",
          assessmentRubrics: ["Accurate data recording","Correct speedup calculation","Justified key-size recommendation","Clarity of written argument"]
        }
      ]}
      pbl={{
        scope: "Build a 'Quantum Threat Dashboard' — a real-time web tool that shows which encryption algorithms are safe vs. vulnerable based on current CRQC progress estimates.",
        feasibility: "High — requires only front-end development with curated data sources.",
        risks: [
          {description:"Rapidly changing CRQC timeline estimates", level:"High"},
          {description:"Oversimplification of complex threat models", level:"Medium"},
          {description:"Browser performance for large N simulations", level:"Low"}
        ],
        budget: "₹0 — static site, hosted on GitHub Pages",
        timeline: "3 Weeks",
        objectives: [
          "Implement Shor's and Grover's simulations for small N",
          "Visualize classical vs quantum step counts as interactive charts",
          "Map NIST PQC standards to recommended algorithm replacements"
        ],
        outcomes: [
          "Live dashboard deployed at GitHub Pages URL",
          "User manual for non-technical audiences",
          "TRL-3 demonstration with 3 test users providing feedback"
        ],
        milestones: [
          {date:"Day 2", task:"Algorithm research and threat model definition"},
          {date:"Day 5", task:"Shor's simulation implementation"},
          {date:"Day 8", task:"Grover's simulation + comparison charts"},
          {date:"Day 12", task:"Dashboard UI and threat mapping table"},
          {date:"Day 16", task:"User testing and feedback collection"},
          {date:"Day 21", task:"Final deployment and report submission"}
        ],
        teamRoles: {
          "Quantum Analyst": "Research and define threat model accuracy",
          "Frontend Developer": "Build interactive simulation charts",
          "Data Curator": "Maintain CRQC timeline data and NIST standards table",
          "UX Designer": "Ensure dashboard is readable by non-technical stakeholders"
        }
      }}
      questions={[
        {
          type: "Conceptual",
          text: "Why does Shor's Algorithm need the Quantum Fourier Transform (QFT)?",
          answer: "The QFT converts the problem of period-finding from the 'time domain' to the 'frequency domain'. After applying the modular function in superposition, the QFT makes the period 'r' appear as a sharp peak in the measurement probabilities, allowing it to be extracted with high probability.",
          explanation: "Without the QFT, finding the period 'r' of f(x) = a^x mod N would still require checking each value one by one. The QFT creates constructive interference at multiples of 1/r and destructive interference elsewhere, revealing the period in a single measurement.",
          keyPoints: ["Period-finding in frequency domain","Constructive/destructive interference","Polynomial time extraction of r"],
          commonMistakes: ["Thinking QFT works like classical FFT on real data","Forgetting that measurement collapses superposition"],
          tips: ["QFT = the quantum 'hearing test' that detects the rhythm in the math."]
        },
        {
          type: "Numerical",
          text: "Grover's algorithm searches a database of N=1,000,000 items. How many steps does it take vs. classical search?",
          answer: "Classical: N/2 = 500,000 steps (average). Quantum: (π/4)√N ≈ (π/4) × 1000 ≈ 785 steps. Speedup ≈ 637×.",
          explanation: "(π/4)√(1,000,000) = (π/4) × 1000 = 785.4 iterations. Each iteration consists of an Oracle call + Diffusion operation.",
          keyPoints: ["√N iterations","Oracle + Diffusion per step","Quadratic — not exponential — speedup"],
          commonMistakes: ["Using N instead of √N","Forgetting the π/4 coefficient"],
          tips: ["Grover = square root. Always √N, never N."]
        },
        {
          type: "Application",
          text: "AES-128 is currently used to protect government classified data for 30 years. Is it quantum-safe? What should be used instead?",
          answer: "No. Grover's algorithm reduces AES-128's effective security from 128 bits to 64 bits (√2^128 = 2^64). 2^64 operations are feasible on near-future quantum hardware. AES-256 should be used instead, as Grover reduces it to 2^128 — still computationally infeasible.",
          explanation: "The data lifetime of 30 years means it must remain secure until 2056+. CRQCs are expected within 10-15 years. Grover's attack on AES-128 will then become feasible. NIST recommends AES-256 for all data with >10 year confidentiality requirements.",
          keyPoints: ["Effective bits after Grover = key_bits / 2","AES-256 remains safe","Data lifetime determines urgency"],
          commonMistakes: ["Thinking AES is immune to quantum attacks","Forgetting that threat models include future hardware"],
          tips: ["Rule of thumb: Grover halves your bit security. Double your key size."]
        },
        {
          type: "ProblemSolving",
          text: "Factor N=35 using Shor's algorithm by hand. Use a=2 and find the period of 2^x mod 35.",
          answer: "Factors are 5 and 7.",
          explanation: "2^1 mod 35=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32, 2^6=29, 2^7=23, 2^8=11, 2^9=22, 2^10=9, 2^11=18, 2^12=1 → r=12. GCD(2^6+1, 35)=GCD(65,35)=5. GCD(2^6-1, 35)=GCD(63,35)=7. ✓ 5×7=35.",
          keyPoints: ["Period detection at f(x)=1","GCD computation","Verification"],
          commonMistakes: ["Missing the period by stopping early","Arithmetic errors in modular reduction"],
          tips: ["The period ends when f(x) returns to 1. Always verify with GCD both ways."]
        }
      ]}
      virtualLab={{
        title: "Shor's & Grover's Interactive Simulator",
        description: "Run quantum algorithm simulations and compare step counts against classical counterparts.",
        controls: ["Switch Shor/Grover", "Run Quantum Circuit", "AES Key Size Studio", "NIST Level Selector", "Algorithm Steps Trace"],
        dataFlow: "Shor: N → Superposition → QFT → Period r → GCD → Factors | Grover: N → Oracle → Diffusion × √N → Target",
        processExplanation: "Shor's simulation uses classical period-finding to mimic the quantum result. Grover's computes exact step counts using the (π/4)√N formula, showing the speedup ratio in real time.",
        component: <ShorGroverLab />,
        procedure: [
          "Open Shor's mode and click 'Run Quantum Circuit' — observe how the period is extracted using QFT interference",
          "Record the number of gates required vs. the classical GNFS step count for the same bit size",
          "Switch to Grover's mode and click 'Run Grover Search' — note how Grover's reduces N searches to √N searches",
          "Adjust the search space size N and observe how the speedup ratio changes between Shor's and Grover's"
        ],
        observations: [
          { prompt: "What is the ratio of quantum gates to classical operations for Shor's on the given bit size?", hint: "Shor's = O(n³) gates, Classical GNFS = O(exp(n^{1/3})) operations" },
          { prompt: "For Grover's, what is the validated speedup ratio? How does it confirm the BBBV theorem?", hint: "Grover's = (π/4)√N, Classical = N. Ratio = √N. BBBV proves no quantum algorithm can do better than Ω(√N)" },
          { prompt: "Why does doubling AES key size fix Grover's threat but doubling RSA key size does NOT fix Shor's threat?", hint: "AES: double key from 128 to 256 → Grover's cost goes from 2^64 to 2^128 (still safe). RSA: double key from 2048 to 4096 → Shor's cost goes from O(n³) to O(8n³) (still polynomial, still broken)" }
        ],
        conclusion: "You measured the two fundamental quantum speedups: Shor's exponential (changes polynomial from exponential — breaks RSA/ECC completely) and Grover's quadratic (halves the security level — manageable by doubling key size). This validated complexity hierarchy (exponential > quadratic > none) is the complete quantum threat landscape and directly dictates which cryptographic algorithms need replacement (public-key) vs. just key size adjustment (symmetric)."
      }}
      summary={{
        insights: [
          "Validating the quantum speedup hierarchy: Shor's achieves 10²⁵× speedup (exponential, O(n³)) and Grover's achieves √N (quadratic, proven optimal by BBBV) — these validated measurements define the complete PQC threat landscape: public-key crypto requires full algorithm replacement, symmetric crypto only needs key doubling",
          "Measuring PQC security requirements: RSA/ECC provide 0-bit quantum security, AES-128 provides 64-bit effective quantum security, AES-256 provides 128-bit — this measured security hierarchy directly dictates the PQC migration strategy for every organization worldwide",
          "Everyday PQC impact measurement: every RSA/ECC-protected login has a validated HNDL risk; every AES-128 encrypted file has its effective security halved. These measured risks provide the quantitative justification for immediate PQC adoption, with Grover's cap validated by the BBBV theorem as the permanent ceiling on symmetric-key quantum threats"
        ],
        advantages: ["Proven speedups with mathematical guarantees","Motivates urgency for PQC migration","Provides precise threat quantification"],
        disadvantages: ["Requires fault-tolerant quantum hardware not yet available","Grover's threat overstated — quadratic not exponential","Error rates in current QC limit practical applicability"],
        futureScope: "As qubit counts and error correction improve (IBM 2029 roadmap: 100K physical qubits), Shor's attack becomes increasingly credible on RSA-2048.",
        industrialApps: ["National security threat modeling","Financial sector quantum risk assessments","Cryptographic protocol design","NIST PQC standardization rationale"],
        careerRelevance: "Critical knowledge for Quantum Security Analysts, Cryptographic Standards Auditors, and anyone designing secure systems beyond 2030."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      skills={[
        { icon: "🌊", name: "Quantum Algorithm Complexity Analysis", description: "Analyze gate complexity of Shor's (polynomial) and Grover's (quadratic) algorithms for cryptographic attacks" },
        { icon: "🔋", name: "Quantum Resource Estimation", description: "Budget logical qubits, total gates, and wall-clock time for attacking specific cryptographic key sizes" },
        { icon: "⚖️", name: "Security Margin Measurement", description: "Quantify the validated gap between NIST security levels and best-known quantum attacks using complexity metrics" },
        { icon: "📈", name: "Speedup Classification", description: "Distinguish exponential vs quadratic vs no quantum speedup — the validated hierarchy of cryptographic impact" },
      ]}
      nepAlignment={[
        { policy: "NEP 2020 — Experiential Learning", icon: "🇮🇳", description: "Interactive Grover's search explorer and Shor's period-finding simulator with real-time speedup visualization" },
        { policy: "STEM — Scientific Inquiry", icon: "🔬", description: "Compare classical vs quantum algorithm performance using real complexity data and gate-count benchmarks" },
        { policy: "Data Literacy", icon: "📊", description: "Interpret complexity graphs and speedup curves to make quantitative judgments about cryptographic security" },
        { policy: "Design Thinking", icon: "🧠", description: "Explore how algorithm design principles (interference, periodicity, amplitude amplification) solve cryptographic problems" },
      ]}
      miniActivity={{
        title: "Gate Counting — Estimate the Attack Cost",
        instructions: "Given a key size and algorithm type, estimate the total number of quantum gates needed to break the encryption using the complexity formulas from this module.",
        checkpoints: [
          "Identify which quantum algorithm applies (Shor's for RSA/ECC, Grover's for AES/SHA)",
          "Compute total G gates using the formula G = O(n³) for Shor's or G = O(√N) for Grover's",
          "Estimate the number of logical qubits required for the attack",
          "Estimate wall-clock time assuming a 1μs gate time"
        ],
        reflection: "Gate complexity is the universal currency for comparing cryptographic security across classical and quantum systems — it enables validated risk assessment."
      }}
      onNextTopic={() => { window.location.href = '/modules/4-shor-impact'; }}
    />
  );
}
