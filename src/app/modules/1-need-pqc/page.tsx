"use client";

import { TopicTemplate } from '@/components/TopicTemplate';
import { useState } from 'react';
import { motion } from 'framer-motion';

const prerequisitesData = {
  topics: [
    "Security metrics: bit security, operations count, and complexity classes",
    "Measuring cryptographic strength: classical vs quantum security levels",
    "NIST security level framework (Level 1–5) for comparing algorithm strength",
    "Risk measurement: threat likelihood, impact severity, and data sensitivity classification",
    "Validation methodologies: benchmarking, test vectors, and conformance testing"
  ],
  mcqs: [
    {
      question: "What does 'bit security' measure in cryptography?",
      options: ["The number of bits in the key", "The logarithm (base 2) of the number of operations needed to break the algorithm", "The encryption speed in bits per second", "The algorithm's memory usage"],
      correctIndex: 1,
      justification: "Bit security quantifies cryptographic strength as log₂(operations needed). 128-bit security means 2^128 operations are required to break it. This allows fair comparison across different algorithm types."
    },
    {
      question: "What is NIST Security Level 1?",
      options: ["The lowest acceptable security for any application", "Equivalent to breaking AES-128 — at least 2^128 operations required", "Equivalent to breaking RSA-1024", "A security level with no quantum resistance"],
      correctIndex: 1,
      justification: "NIST Level 1 = brute-force attack on AES-128 requires ~2^128 operations. All NIST PQC candidates must provide at least this level of quantum security. This is the standard benchmark for PQC impact measurement."
    },
    {
      question: "What is the 'complexity class' of a problem and why does it matter for PQC impact?",
      options: ["A classification based on programming difficulty", "A categorization of time/space requirements as input grows — P matters because Shor's moves factoring from exponential to polynomial class", "A measure of code complexity", "A security classification level"],
      correctIndex: 1,
      justification: "Complexity class determines feasibility: P (polynomial) = feasible for large inputs. Shor's moves factoring from NP/intermediate to BQP (quantum polynomial). This class change IS the impact — it transforms impossible into possible."
    }
  ]
};

const recapData = {
  summary: [
    "Measured impact of Shor's: moves factoring from exponential (10³⁴ ops for RSA-2048) to polynomial (8.6×10⁹ ops) — a 10²⁴× quantum advantage ratio",
    "The validated threat metric: RSA-2048 provides 0 bits of quantum security — validated by the mathematical existence of Shor's, not by hardware availability",
    "Complexity class migration: factoring in BQP (quantum polynomial) vs NP/intermediate classically — the change of complexity class IS the impact measurement",
    "NIST security level benchmark: RSA-2048 offers ~112-bit classical security but fails NIST Level 1 quantum security (requires 2¹²⁸ quantum security), confirming immediate replacement need",
    "Data sensitivity lifetime metric determines true impact: medical records (80yr) have already exceeded safe migration; short-lived session data (minutes) has near-zero impact",
    "Gate complexity comparison: Shor's requires ~2n³ gates for n-bit factoring — for n=2048, this is 8.6B gates vs GNFS requiring 10³⁴ operations",
    "Quantum advantage ratio: T_classical / T_quantum = 300 trillion years / 8 hours ≈ 3.4×10²³× — the most dramatic measured speedup in computer science",
    "Validation by NIST standardization: NIST selected CRYSTALS-Kyber and Dilithium specifically because their security assumptions (LWE, SVP) resist the QFT-based period-finding that breaks RSA",
    "HNDL impact measurement: cost of collection today = near-zero (passive network interception); cost of decryption = future CRQC; risk = data value × urgency factor",
    "Security margin validation: PQC algorithms provide provable security margins against Shor's because lattice problems lack the algebraic periodicity that QFT exploits — validated by 30+ years of cryptanalysis"
  ],
  mcqs: [
    {
      question: "What is the most important metric for measuring the impact of Shor's on RSA?",
      options: ["The number of qubits needed", "The complexity class change from exponential to polynomial — this transforms an impossible problem into a feasible one", "The year Shor's was discovered", "The temperature of the quantum computer"],
      correctIndex: 1,
      justification: "Impact measurement = change in feasibility. Shor's moves factoring from exponential (infeasible for 2048-bit numbers — would take 300 trillion years) to polynomial (feasible — about 8 hours). This class change IS the impact, not the hardware details."
    },
    {
      question: "Why is RSA-2048's quantum security rated as '0 bits' in PQC impact assessments?",
      options: ["Because quantum computers don't exist yet", "Because Shor's algorithm mathematically breaks RSA regardless of key size — there is no quantum security in classical public-key algorithms", "Because RSA uses small keys", "Because quantum computers are too slow"],
      correctIndex: 1,
      justification: "Quantum security rating = log₂(operations needed for best quantum attack). Shor's factors RSA-2048 in O(n³) ≈ 8.6×10^9 gates. log₂(8.6×10^9) ≈ 33 bits. But any attacker who runs Shor's succeeds with high probability — the rated 'security' is effectively 0 because the attack is polynomial and will run instantly on a CRQC."
    },
    {
      question: "How do we measure the urgency of PQC migration for a specific organization?",
      options: ["By the organization's budget", "By computing: Impact Score = (Data Sensitivity Lifetime) × (Value at Risk) / (Migration Time Remaining) where T_migrate = T_QDay - T_DataLifetime", "By the number of employees", "By the type of encryption used"],
      correctIndex: 1,
      justification: "Urgency = (Lifetime × Value) / TimeRemaining. T_migrate = T_QDay - T_DataLifetime. If T_migrate < CurrentYear, the organization is already overdue. This formula is the standard impact measurement for HNDL risk assessment."
    }
  ]
};

const ShorSimulation = () => {
    const [x, setX] = useState(1);
    const [baseA, setBaseA] = useState(7);
    const [modN, setModN] = useState(15);
    const [history, setHistory] = useState<any[]>([]);
    const [autoRun, setAutoRun] = useState(false);
    const [period, setPeriod] = useState<number | null>(null);

    const step = () => {
      const result = (Math.pow(baseA, x) % modN);
      const newEntry = { x, result };
      const newHistory = [...history, newEntry];
      setHistory(newHistory);
      setX(prev => prev + 1);

      // Period detection: check if result repeats
      const first = newHistory.find(h => h.x < x && h.result === result);
      if (first) {
        const detectedPeriod = x - first.x;
        setPeriod(detectedPeriod);
        setAutoRun(false);
      }
    };

    const reset = () => {
      setX(1); setHistory([]); setPeriod(null); setAutoRun(false);
    };

    const toggleAuto = () => {
      if (autoRun) { setAutoRun(false); return; }
      setAutoRun(true);
      const interval = setInterval(() => {
        setX(prev => {
          setHistory(h => {
            const r = Math.pow(baseA, prev) % modN;
            const entry = { x: prev, result: r };
            const nh = [...h, entry];
            const first = nh.find(e => e.x < prev && e.result === r);
            if (first) {
              setPeriod(prev - first.x);
              setAutoRun(false);
              clearInterval(interval);
            }
            return nh;
          });
          return prev + 1;
        });
      }, 500);
    };

    const quantumSteps = period ? 1 : '?';
    const classicalMaxSteps = period || modN;

    return (
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base md:text-xl font-bold text-primary">Shor's Period Finding Simulator</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Base (a)</label>
            <input type="number" min={2} max={modN - 1} value={baseA} onChange={e => { reset(); setBaseA(Number(e.target.value)); }}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-slate-900 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Modulus (N)</label>
            <input type="number" min={3} max={999} value={modN} onChange={e => { reset(); setModN(Number(e.target.value)); }}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-slate-900 focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={step} disabled={period !== null || autoRun}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-30">
            Compute f(x) Step
          </button>
          <button onClick={toggleAuto} disabled={period !== null}
            className="px-5 py-2 bg-secondary text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-30">
            ▶ Auto-Run
          </button>
          <button onClick={reset}
            className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
            ↺ Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8">
          <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-lg md:rounded-xl">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mb-2 md:mb-4">
              Sequence: f(x) = {baseA}^x mod {modN}
            </div>
            <div className="space-y-1 md:space-y-2 max-h-[180px] overflow-y-auto">
              {history.length === 0 && (
                <div className="text-[10px] text-slate-500 italic">Click 'Compute' to build the sequence</div>
              )}
              {history.map((h, i) => (
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i}
                  className="flex justify-between text-[11px] md:text-sm font-mono border-b border-slate-200 pb-1">
                  <span className="text-slate-600">f({h.x})</span>
                  <span className="text-primary font-bold">{h.result}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white border border-slate-200 p-4 md:p-6 rounded-lg md:rounded-xl space-y-3">
            {period ? (
              <>
                <div className="text-3xl md:text-5xl font-black text-success mb-1">r = {period}</div>
                <div className="text-[10px] md:text-xs text-success uppercase font-bold tracking-widest">✓ Period Detected</div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase">Classical Steps</div>
                    <div className="text-lg font-black text-slate-700">{classicalMaxSteps}</div>
                  </div>
                  <div className="bg-success/10 rounded-xl p-3 text-center border border-success/20">
                    <div className="text-[9px] text-success uppercase">Quantum Steps (QFT)</div>
                    <div className="text-lg font-black text-success">1</div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-slate-600 mt-1">
                  QFT finds period r = {period} in one operation. Classical needs up to {classicalMaxSteps} steps.
                  Speedup: <span className="text-success font-bold">{classicalMaxSteps}×</span>
                  {period % 2 === 0 && period > 0 && (
                    <span className="block mt-1 text-[9px]">
                      gcd({baseA}^{period/2} ± 1, {modN}) would recover the factors.
                    </span>
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl md:text-4xl font-black text-slate-500 mb-1">r = ?</div>
                <div className="text-[10px] md:text-xs text-slate-600 uppercase font-bold tracking-widest">Awaiting Period Detection</div>
                <p className="text-[10px] text-center text-slate-500 mt-1">
                  Keep computing until the sequence repeats — that repeat distance is the period.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

// ─── Quantum Computing Fundamentals ───────────────────────────────────────────

function formatComplex(c: { re: number; im: number }): string {
  if (Math.abs(c.im) < 0.001) return c.re.toFixed(3);
  if (Math.abs(c.re) < 0.001) return `${c.im.toFixed(3)}i`;
  const sign = c.im >= 0 ? '+' : '';
  return `${c.re.toFixed(3)}${sign}${c.im.toFixed(3)}i`;
}

function QubitVisual({ prob0, prob1, alpha, beta, size = 180 }: { prob0: number; prob1: number; alpha: { re: number; im: number }; beta: { re: number; im: number }; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const x0 = cx + r * Math.cos(Math.PI), y0 = cy + r * Math.sin(Math.PI);
  const x1 = cx + r * Math.cos(0), y1 = cy + r * Math.sin(0);
  const p0 = (prob0 * 100).toFixed(0);
  const p1 = (prob1 * 100).toFixed(0);
  const phase = Math.atan2(beta.im, beta.re) - Math.atan2(alpha.im, alpha.re);
  const phaseDeg = (phase * 180 / Math.PI).toFixed(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size }} className="mx-auto drop-shadow-lg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.15} />
        {prob0 > 0.01 && (
          <path d={`M ${x0} ${y0} A ${r} ${r} 0 ${prob0 > 0.5 ? 1 : 0} 0 ${x1} ${y1} L ${cx} ${cy} Z`} fill="rgba(99,102,241,0.5)" />
        )}
        {prob1 > 0.01 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${prob1 > 0.5 ? 1 : 0} 1 ${x0} ${y0} L ${cx} ${cy} Z`} fill="rgba(236,72,153,0.4)" />
        )}
        <text x={cx} y={cy - 24} textAnchor="middle" fill="rgb(129,140,248)" fontSize={12} fontWeight="bold">|0⟩ {p0}%</text>
        <text x={cx} y={cy + 34} textAnchor="middle" fill="rgb(244,114,182)" fontSize={12} fontWeight="bold">|1⟩ {p1}%</text>
        <text x={cx} y={cy + 5} textAnchor="middle" fill="rgb(148,163,184)" fontSize={20} fontFamily="monospace" fontWeight="bold">
          {prob0 > 0.99 ? "|0⟩" : prob1 > 0.99 ? "|1⟩" : "↻"}
        </text>
      </svg>
      <div className="text-[10px] font-mono text-slate-600 text-center leading-relaxed">
        <div>ψ = {formatComplex(alpha)}|0⟩ + {formatComplex(beta)}|1⟩</div>
        <div className={Math.abs(phase) > 0.01 ? 'text-amber-500 font-bold' : 'text-slate-500'}>
          φ = {phaseDeg}°
        </div>
      </div>
    </div>
  );
}

function QuantumFundamentals() {
  const [qubit, setQubit] = useState<{ alpha: { re: number; im: number }; beta: { re: number; im: number } }>({
    alpha: { re: 1, im: 0 },
    beta: { re: 0, im: 0 }
  });
  const [measureResult, setMeasureResult] = useState<number | null>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [searchSize, setSearchSize] = useState(1000000);
  const [activeCase, setActiveCase] = useState(0);

  const prob0 = qubit.alpha.re * qubit.alpha.re + qubit.alpha.im * qubit.alpha.im;
  const prob1 = qubit.beta.re * qubit.beta.re + qubit.beta.im * qubit.beta.im;
  const probs = { prob0, prob1 };

  const apply = (gate: string) => {
    setMeasureResult(null);
    const sqrt2 = Math.SQRT1_2;
    if (gate === 'X') {
      setQubit(q => ({ alpha: q.beta, beta: q.alpha }));
      setOperationLog(o => [...o, 'X']);
    } else if (gate === 'H') {
      setQubit(q => ({
        alpha: { re: (q.alpha.re + q.beta.re) * sqrt2, im: (q.alpha.im + q.beta.im) * sqrt2 },
        beta: { re: (q.alpha.re - q.beta.re) * sqrt2, im: (q.alpha.im - q.beta.im) * sqrt2 }
      }));
      setOperationLog(o => [...o, 'H']);
    } else if (gate === 'Z') {
      setQubit(q => ({ alpha: q.alpha, beta: { re: -q.beta.re, im: -q.beta.im } }));
      setOperationLog(o => [...o, 'Z']);
    } else if (gate === 'S') {
      setQubit(q => ({ alpha: q.alpha, beta: { re: -q.beta.im, im: q.beta.re } }));
      setOperationLog(o => [...o, 'S']);
    } else if (gate === 'Measure') {
      const p0 = qubit.alpha.re * qubit.alpha.re + qubit.alpha.im * qubit.alpha.im;
      const result = Math.random() < p0 ? 0 : 1;
      setMeasureResult(result);
      setQubit(result === 0 ? { alpha: { re: 1, im: 0 }, beta: { re: 0, im: 0 } } : { alpha: { re: 0, im: 0 }, beta: { re: 1, im: 0 } });
      setOperationLog(o => [...o, 'Measure']);
    } else if (gate === 'Reset') {
      setQubit({ alpha: { re: 1, im: 0 }, beta: { re: 0, im: 0 } });
      setMeasureResult(null);
      setOperationLog([]);
    }
  };

  const cases = [
    {
      title: "Case 1: Searching a Database",
      classical: Math.floor(searchSize / 2),
      quantum: Math.ceil(Math.PI / 4 * Math.sqrt(searchSize)),
      unit: "steps",
      icon: "🔍",
      explanation: `Classical search checks items one by one — O(N). Grover's algorithm checks only √N items using amplitude amplification. For ${searchSize.toLocaleString()} items, classical needs ${(searchSize / 2).toLocaleString()} checks on average; quantum needs just ${Math.ceil(Math.PI / 4 * Math.sqrt(searchSize)).toLocaleString()}. That's a ${(Math.floor(searchSize / 2) / Math.ceil(Math.PI / 4 * Math.sqrt(searchSize))).toFixed(0)}× speedup.`
    },
    {
      title: "Case 2: Factoring an RSA Number",
      classical: "300 trillion years",
      quantum: "~8 hours",
      unit: "time",
      icon: "🔐",
      explanation: "Classical computers use the General Number Field Sieve (GNFS), which scales exponentially with bit-length. RSA-2048 (617 decimal digits) would take ~300 trillion years to factor. Shor's algorithm scales polynomially O(n³) — the same RSA-2048 could be factored in ~8 hours on a cryptographically relevant quantum computer (CRQC). This is why RSA dies."
    },
    {
      title: "Case 3: Password Cracking (AES-128)",
      classical: "2¹²⁸ operations",
      quantum: "2⁶⁴ operations",
      unit: "ops",
      icon: "🔑",
      explanation: "AES-128 has 128-bit keys = 2¹²⁸ possible values. Classical brute-force requires 2¹²⁸ tries in worst case. Grover's algorithm reduces this to 2⁶⁴ — a square-root speedup. While 2⁶⁴ is still too large for today's computers, NIST recommends AES-256 (2¹²⁸ quantum security) as the conservative choice. Grover's doesn't break AES — it weakens it by exactly half the bit-length."
    },
    {
      title: "Case 4: Traveling Salesman (Optimization)",
      classical: "O(n!) factorial",
      quantum: "O(1.728ⁿ)",
      unit: "complexity",
      icon: "🗺️",
      explanation: "Finding the shortest route through 50 cities has classical complexity O(50!) = 3×10⁶⁴ operations — impossible. Quantum annealing and QAOA provide heuristic speedups, reducing to roughly O(1.728ⁿ). For 50 cities, that's 1.728⁵⁰ ≈ 1.8×10¹² — still large but feasible. This demonstrates that quantum speedup varies by problem: exponential for Shor's, quadratic for Grover's, and somewhere in-between for optimization."
    }
  ];

  const classicalSteps = Math.floor(searchSize / 2);
  const quantumSteps = Math.ceil(Math.PI / 4 * Math.sqrt(searchSize));
  const speedup = Math.floor(classicalSteps / quantumSteps);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 space-y-24">

      {/* ── SECTION 0A: QUBIT BASICS ── */}
      <section className="pt-20 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-sm font-bold uppercase tracking-widest mb-4">
            ⚛️ Quantum Computing Fundamentals
          </div>
          <h1 className="text-6xl font-black font-outfit tracking-tighter">What Makes a Quantum Computer Different?</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Before we understand the threat, we must understand the machine. This section explains qubits, superposition, 
            and why quantum computers can solve certain problems exponentially faster than any classical computer.
          </p>
          <div className="h-2 w-24 bg-indigo-500/50 mx-auto rounded-full" />
        </div>

        {/* Classical vs Quantum Bit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl border-2 border-slate-200">
            <div className="text-4xl mb-4">💡</div>
            <h2 className="text-2xl font-bold mb-4">Classical Bit</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A classical bit is like a <strong className="text-foreground">light switch</strong> — it is either <strong className="text-primary">ON (1)</strong> or <strong className="text-primary">OFF (0)</strong>. 
              There is no in-between. Every transistor in your phone, laptop, or supercomputer stores information this way.
            </p>
            <div className="flex justify-center gap-8 p-6 bg-white rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                  <span className="text-2xl text-slate-600">0</span>
                </div>
                <div className="text-xs text-slate-600 mt-2">OFF (0)</div>
              </div>
              <div className="text-3xl text-slate-500 flex items-center">or</div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                  <span className="text-2xl text-primary">1</span>
                </div>
                <div className="text-xs text-slate-600 mt-2">ON (1)</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 text-center">
              A classical bit can only be <strong className="text-slate-700">one value at a time</strong> — 0 or 1.
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <div className="text-4xl mb-4">⚛️</div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Quantum Bit (Qubit)</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A qubit is like a <strong className="text-foreground">spinning coin</strong> — while it is spinning, it is <strong className="text-indigo-600">BOTH heads and tails simultaneously</strong>. 
              Only when you catch it (measure it) does it randomly pick one. This "both-at-once" property is called <strong className="text-indigo-600">superposition</strong>.
            </p>
            <div className="flex justify-center gap-8 p-6 bg-white/80 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500 animate-pulse">
                  <span className="text-2xl text-indigo-600">↻</span>
                </div>
                <div className="text-xs text-indigo-600/60 mt-2">Spinning</div>
              </div>
              <div className="text-3xl text-slate-500 flex items-center">→</div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-500">
                  <span className="text-xl text-pink-600">?%</span>
                </div>
                <div className="text-xs text-pink-600/60 mt-2">Measured</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-indigo-600/60 text-center">
              A qubit can be <strong className="text-indigo-600">both 0 and 1 at once</strong> — until you measure it.
            </div>
          </div>
        </div>

        {/* Interactive Qubit Playground */}
        <div className="glass rounded-3xl p-8 border-2 border-indigo-500/10">
          <h2 className="text-2xl font-bold mb-2">🎮 Interactive Qubit Playground</h2>
          <p className="text-slate-600 text-sm mb-8">Click gate buttons to manipulate a qubit. Watch how probabilities and phase change — the φ display shows the relative phase that drives quantum interference.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <QubitVisual prob0={probs.prob0} prob1={probs.prob1} alpha={qubit.alpha} beta={qubit.beta} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button onClick={() => apply('X')}
                  className="bg-white border border-indigo-500/30 hover:bg-indigo-500/10 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-lg font-black text-indigo-600 font-mono">X</div>
                  <div className="text-[8px] text-slate-600">NOT (Flip)</div>
                </button>
                <button onClick={() => apply('Z')}
                  className="bg-white border border-purple-500/30 hover:bg-purple-500/10 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-lg font-black text-purple-600 font-mono">Z</div>
                  <div className="text-[8px] text-slate-600">Phase Flip</div>
                </button>
                <button onClick={() => apply('H')}
                  className="bg-white border border-pink-500/30 hover:bg-pink-500/10 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-lg font-black text-pink-600 font-mono">H</div>
                  <div className="text-[8px] text-slate-600">Superpose</div>
                </button>
                <button onClick={() => apply('S')}
                  className="bg-white border border-emerald-500/30 hover:bg-emerald-500/10 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-lg font-black text-emerald-600 font-mono">S</div>
                  <div className="text-[8px] text-slate-600">90° Phase</div>
                </button>
                <button onClick={() => apply('Measure')}
                  className="bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-base font-black text-amber-600">🎲</div>
                  <div className="text-[8px] text-amber-500/60">Measure</div>
                </button>
                <button onClick={() => apply('Reset')}
                  className="bg-white border border-slate-200 hover:bg-slate-100 rounded-xl p-3 text-center transition-all hover:scale-[1.02] active:scale-95">
                  <div className="text-base font-black text-slate-600">↺</div>
                  <div className="text-[8px] text-slate-600">Reset</div>
                </button>
              </div>

              {measureResult !== null && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                  <div className="text-xs text-amber-500 font-bold uppercase mb-1">Measurement Collapsed to</div>
                  <div className="text-5xl font-black font-mono text-foreground">|{measureResult}⟩</div>
                  <div className="text-xs text-slate-600 mt-2">
                    The superposition is gone — the qubit chose a definite state.
                  </div>
                </div>
              )}

              {operationLog.length > 0 && (
                <div className="bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5">
                  <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Operation Sequence</div>
                  <div className="flex flex-wrap gap-1">
                    {operationLog.map((op, i) => (
                      <span key={i} className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        op === 'X' ? 'bg-indigo-100 text-indigo-600' :
                        op === 'Z' ? 'bg-purple-100 text-purple-600' :
                        op === 'H' ? 'bg-pink-100 text-pink-600' :
                        op === 'S' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>{op}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/80 border border-slate-200 p-3 md:p-4 rounded-xl text-[10px] md:text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-indigo-500">Try These Experiments:</p>
                <p>1. <strong className="text-foreground">X</strong> — flips from |0⟩ to |1⟩ (like a classical NOT gate)</p>
                <p>2. <strong className="text-foreground">H</strong> — creates superposition: 50% |0⟩ + 50% |1⟩</p>
                <p>3. <strong className="text-foreground">Z</strong> — phase flip: probabilities unchanged, but φ flips to 180° (phase matters for interference!)</p>
                <p>4. <strong className="text-foreground">S</strong> — 90° phase: adds i phase to |1⟩, φ shifts to 90°</p>
                <p>5. <strong className="text-foreground">H → Z → H</strong> — apply H then Z then H: observe how Z's phase flip causes cancellation to |1⟩ (quantum interference!)</p>
                <p>6. <strong className="text-foreground">H → S → H</strong> — same but with S: observe partial interference (different phase → different result)</p>
                <p>7. <strong className="text-foreground">🎲 Measure</strong> — collapses superposition to either |0⟩ or |1⟩ at random</p>
                <p className="text-indigo-500/80 mt-2">Key Insight: Phase gates (Z, S) don't change measurement probabilities, but they control how subsequent gates interfere — this is the secret to quantum algorithms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 0B: WHY QUANTUM IS FAST ── */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black font-outfit">Why Is Quantum Computing Faster?</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            The key is not that qubits are "faster transistors." The key is that they can <strong className="text-foreground">process many possibilities simultaneously</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border-2 border-destructive/20">
              <h3 className="text-xl font-bold text-destructive mb-4">❌ Classical: Serial Processing</h3>
              <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <p>A classical computer checks possibilities <strong>one at a time</strong>, like trying every key on a keyring:</p>
                <div className="flex gap-2 items-center flex-wrap p-4 bg-white rounded-xl">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono ${i < 3 ? 'bg-destructive/20 text-destructive' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </span>
                  ))}
                  <span className="text-slate-600 text-xs"> ... N</span>
                </div>
                <p className="text-slate-600 italic">"Check key 1… no. Check key 2… no. Check key 3… no. Check key 4…"</p>
                <p><strong>Time complexity:</strong> O(N) — the work grows linearly with the problem size.</p>
              </div>
            </div>
            <div className="glass p-8 rounded-3xl border-2 border-success/20">
              <h3 className="text-xl font-bold text-success mb-4">✅ Quantum: Parallel Processing</h3>
              <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <p>A quantum computer checks <strong>all possibilities at once</strong> using superposition, then uses <strong>interference</strong> to amplify the correct answer:</p>
                <div className="flex gap-2 items-center flex-wrap p-4 bg-white rounded-xl">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono bg-indigo-500/20 text-indigo-600 border border-indigo-500/30">
                      {i + 1}
                    </span>
                  ))}
                  <span className="text-indigo-600/60 text-xs"> ... ALL</span>
                </div>
                <p className="text-indigo-600/60 italic">"Evaluate all inputs simultaneously. The QFT extracts just the period we need."</p>
                <p><strong>Time complexity:</strong> O(poly(log N)) or O(√N) — exponentially or quadratically faster.</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl font-bold">🔬 The Three Quantum Superpowers</h3>
            <div className="space-y-6">
              {[
                { name: 'Superposition', icon: '🌀', desc: 'A qubit exists in multiple states simultaneously (like a spinning coin). With n qubits, you can represent 2ⁿ values at once. A 300-qubit computer holds more values than atoms in the universe.', color: 'text-indigo-600' },
                { name: 'Interference', icon: '🌊', desc: 'Quantum waves can add up (constructive) or cancel out (destructive). Algorithms carefully design interference so correct answers are amplified and wrong answers cancel out.', color: 'text-pink-600' },
                { name: 'Entanglement', icon: '🔗', desc: 'Two qubits can be linked so measuring one instantly determines the other — even if light-years apart. This enables correlations that classical systems cannot replicate.', color: 'text-emerald-600' },
              ].map(superpower => (
                <div key={superpower.name} className="flex gap-4 p-4 bg-white/80 rounded-xl border border-slate-200">
                  <span className="text-3xl flex-shrink-0">{superpower.icon}</span>
                  <div>
                    <h4 className={`font-bold ${superpower.color} mb-1`}>{superpower.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{superpower.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 0C: CASE STUDIES ── */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black font-outfit">Classical vs Quantum: Speed Comparison</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Real case studies showing the magnitude of quantum advantage across different problem types.
          </p>
        </div>

        {/* Explorer Tool */}
        <div className="glass rounded-3xl p-8 border-2 border-secondary/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold mb-4">📊 Interactive Speed Explorer</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Drag the slider to change the database size and see how classical and quantum search times compare.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Database Size (N): {searchSize.toLocaleString()}</label>
                <input type="range" min={1000} max={100000000} step={1000} value={searchSize}
                  onChange={e => setSearchSize(Number(e.target.value))}
                  className="w-full accent-secondary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
                  <div className="text-[10px] text-destructive uppercase font-bold mb-1">Classical</div>
                  <div className="text-2xl font-black font-mono text-destructive">{classicalSteps.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-600">steps (N/2 average)</div>
                </div>
                <div className="bg-success/10 border border-success/20 p-4 rounded-xl">
                  <div className="text-[10px] text-success uppercase font-bold mb-1">Quantum (Grover's)</div>
                  <div className="text-2xl font-black font-mono text-success">{quantumSteps.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-600">steps ((π/4)√N)</div>
                </div>
                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-secondary uppercase font-bold">Speedup Factor</div>
                  <div className="text-3xl font-black text-secondary">{speedup.toLocaleString()}×</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold">📋 Four Case Studies</h3>
              <div className="flex flex-wrap gap-2">
                {cases.map((c, i) => (
                  <button key={i} onClick={() => setActiveCase(i)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCase === i ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {c.icon} {c.title}
                  </button>
                ))}
              </div>

              <motion.div key={activeCase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{cases[activeCase].icon}</span>
                  <h4 className="text-xl font-bold">{cases[activeCase].title}</h4>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-destructive/5 border border-destructive/20 p-5 rounded-xl text-center">
                    <div className="text-[10px] text-destructive uppercase font-bold mb-2">Classical</div>
                    <div className="text-2xl font-black font-mono text-destructive">{cases[activeCase].classical}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{cases[activeCase].unit}</div>
                  </div>
                  <div className="bg-success/5 border border-success/20 p-5 rounded-xl text-center">
                    <div className="text-[10px] text-success uppercase font-bold mb-2">Quantum</div>
                    <div className="text-2xl font-black font-mono text-success">{cases[activeCase].quantum}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{cases[activeCase].unit}</div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{cases[activeCase].explanation}</p>

                <div className={`text-xs p-3 rounded-lg ${activeCase === 1 ? 'bg-destructive/10 border border-destructive/20 text-destructive' : 'bg-slate-100/80 text-slate-600'}`}>
                  {activeCase === 1
                    ? "⚠️ This is why RSA, ECC, and Diffie-Hellman are considered broken on a quantum computer — the speedup is exponential."
                    : activeCase === 2
                      ? "🔑 Grover's provides quadratic speedup — AES-256 remains safe; AES-128 is borderline."
                      : "💡 The magnitude of speedup depends on the mathematical structure of the problem."}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Speedup Scale Visual */}
        <div className="glass rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold">📈 The Speedup Spectrum</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'Exponential', icon: '🚀', algo: "Shor's Algorithm", speed: 'O(n³) vs O(exp)', impact: 'Breaks RSA, ECC, DH completely', color: 'text-destructive', border: 'border-destructive/20' },
              { type: 'Quadratic', icon: '🔦', algo: "Grover's Algorithm", speed: 'O(√N) vs O(N)', impact: 'Weakens AES, SHA — double key sizes', color: 'text-amber-600', border: 'border-amber-500/20' },
              { type: 'Negligible / None', icon: '🛡️', algo: 'PQC Algorithms', speed: 'No known quantum speedup', impact: 'Lattice, code, hash-based are safe', color: 'text-success', border: 'border-success/20' },
            ].map(item => (
              <div key={item.type} className={`bg-white/80 border ${item.border} p-6 rounded-2xl text-center space-y-3`}>
                <div className="text-3xl">{item.icon}</div>
                <h4 className={`font-bold ${item.color}`}>{item.type}</h4>
                <div className="text-xs font-mono text-slate-700 bg-slate-100 rounded-lg py-2">{item.speed}</div>
                <p className="text-xs text-slate-600">{item.algo}</p>
                <p className="text-xs text-slate-600 italic">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 0D: IMPACT ON CRYPTOGRAPHY ── */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black font-outfit">Impact on Modern Cryptography</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Not all cryptography is affected equally. Understanding <strong className="text-foreground">what breaks, what weakens, and what survives</strong> is the first step toward quantum safety.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              status: 'Broken',
              icon: '💔',
              color: 'bg-destructive/10 border-destructive/20',
              textColor: 'text-destructive',
              algos: ['RSA', 'ECC (ECDSA, ECDH)', 'Diffie-Hellman', 'DSA'],
              reason: "Shor's algorithm finds the period of modular exponentiation exponentially faster — factoring and discrete log become easy.",
              analogy: 'Like a lock where every key opens it — the math that made it hard is no longer hard.'
            },
            {
              status: 'Weakened',
              icon: '⚠️',
              color: 'bg-amber-500/10 border-amber-500/20',
              textColor: 'text-amber-600',
              algos: ['AES-128', 'SHA-256 (collisions)', 'Password hashing'],
              reason: "Grover's algorithm provides quadratic speedup — key strength is halved. AES-256 remains secure; AES-128 is borderline.",
              analogy: 'Like cutting a password from 10 characters to 5 — still secure for now, but much weaker.'
            },
            {
              status: 'Quantum-Resistant',
              icon: '🛡️',
              color: 'bg-success/10 border-success/20',
              textColor: 'text-success',
              algos: ['AES-256', 'SHA-384 / SHA-512', 'Lattice-based (Kyber)', 'Code-based (McEliece)', 'Hash-based (SPHINCS+)'],
              reason: "These algorithms rely on hardness assumptions that resist quantum attacks. LWE, SVP, and random linear decoding have no known exponential quantum speedup.",
              analogy: 'Like a lock designed specifically to resist the "frequency glasses" — the mechanism is fundamentally different.'
            },
          ].map(cat => (
            <div key={cat.status} className={`glass ${cat.color} rounded-3xl p-8 border-2 space-y-6`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className={`text-2xl font-bold ${cat.textColor}`}>{cat.status}</h3>
              </div>

              <div className="space-y-2">
                {cat.algos.map(algo => (
                  <div key={algo} className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-slate-200">
                    <span className={`w-2 h-2 rounded-full ${cat.color.split(' ')[0].replace('/10', '/50')}`} />
                    <span className="text-sm font-mono text-slate-600">{algo}</span>
                  </div>
                ))}
              </div>

              <div className={`text-xs text-slate-600 leading-relaxed p-3 rounded-lg bg-white/80`}>
                <strong className={cat.textColor}>Why: </strong>{cat.reason}
              </div>

              <div className="text-xs text-slate-600 italic p-3 bg-slate-50/60 rounded-lg">
                💡 {cat.analogy}
              </div>
            </div>
          ))}
        </div>

        {/* Urgency Timeline */}
        <div className="glass rounded-3xl p-8 border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>⏰</span> The Urgency Timeline
          </h3>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-0 min-w-[600px]">
              {[
                { year: '2024–2026', label: 'Today', desc: 'HNDL collection underway. Encrypted data is being harvested and stored for future decryption.', color: 'bg-destructive', active: true },
                { year: '2027–2029', label: 'Near Future', desc: 'Large-scale quantum computers with 1K+ logical qubits. NIST PQC standards finalized and deployment begins.', color: 'bg-amber-500', active: true },
                { year: '2030–2032', label: 'Q-Day Range', desc: 'CRQC capable of breaking RSA-2048. All classical public-key crypto becomes obsolete overnight.', color: 'bg-amber-500', active: true },
                { year: '2033+', label: 'Post-Quantum', desc: 'Full PQC migration complete (hopefully). Quantum-safe infrastructure becomes the global standard.', color: 'bg-success', active: false },
              ].map((era, i) => (
                <div key={i} className="flex-1 relative">
                  <div className="flex items-center mb-4">
                    <div className={`h-2 flex-1 ${i === 0 ? 'rounded-l-full' : ''} ${i === 3 ? 'rounded-r-full' : ''} ${era.color}`} />
                  </div>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${era.active ? `${era.color} border-foreground` : 'bg-slate-200 border-slate-300'}`} />
                  <div className="mt-6 space-y-2">
                    <div className={`text-sm font-bold ${era.active ? 'text-foreground' : 'text-slate-600'}`}>{era.year}</div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${era.active ? `${era.color}/20 ${era.color.replace('bg-', 'text-')}` : 'bg-slate-100 text-slate-600'}`}>{era.label}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{era.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive font-bold mb-1">⚠️ Critical Takeaway</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              The HNDL (Harvest Now, Decrypt Later) threat is <strong className="text-destructive">active today</strong>. Adversaries are collecting encrypted data now, 
              knowing they can decrypt it once a CRQC exists. Data that must remain confidential for 20+ years (medical records, state secrets, 
              financial history) may <strong className="text-destructive">already be compromised</strong> — the decryption just hasn't happened yet.
            </p>
          </div>
        </div>

        {/* Transition to the Quantum Threat Story */}
        <div className="glass rounded-3xl p-10 text-center border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-4">Now You Understand the Machine — Let's See the Threat</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            You now know what a qubit is, how superposition enables parallelism, and why Shor's and Grover's algorithms 
            pose existential threats to classical cryptography. The next section dives deep into <strong className="text-primary">exactly how Shor's 
            algorithm breaks RSA</strong> — using the period-finding technique you just learned about.
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-slate-600">
            <span>↓ Scroll down to begin Module 1</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function NeedPQCModule() {
  return (
    <>
    <QuantumFundamentals />
    <TopicTemplate 
      topicId="1-1"
      topicName="The Quantum Threat to Classical Foundations"
      story={{
        title: "The Case of the Vibrating Safe",
        content: "Mr. Locksmith was famous for his 'Prime Safes'. To open them, you needed two secret prime numbers. He told everyone, 'Even the world's fastest burglars would take trillions of years to guess these!' But one day, a mysterious thief arrived with 'Frequency Glasses'. Instead of guessing numbers, the glasses looked at the internal gears and saw how often they repeated their patterns. Suddenly, the trillion-year problem was solved in minutes because the gears couldn't hide their rhythm.",
        analogy: "The safe is RSA encryption. The primes are our keys. The 'world's fastest burglars' are classical supercomputers. The thief with glasses is a Quantum Computer running Shor's Algorithm.",
        reflectiveQuestions: [
          "If the safe isn't broken but the combination is revealed by a 'glitch', is it still safe?",
          "Why did looking at the 'rhythm' (frequency) help the thief?",
          "Can we build a safe that doesn't rely on gears that vibrate in patterns?"
        ],
        connectToTopic: "Our entire digital world (HTTPS, Banking, VPNs) is built on 'Prime Safes'. This module measures why these safes fail against quantum computers — quantifying the exact speedup ratio (10²⁴×), validating that no key size can compensate, and measuring the risk score for every data type you encrypt today."
      }}
      mathModelling={{
        need: "Measuring the quantum threat requires precise metrics: complexity class change (exponential → polynomial), gate count (2n³ for factoring n-bit numbers), and quantum advantage ratio (T_classical/T_quantum). Without these measurements, the threat remains abstract — with them, we validate the exact magnitude of PQC necessity.",
        motivation: "Classical RSA security relies on factoring being 'Hard' (exponential). By measuring the exact gap between exponential and polynomial complexity — 10²⁴× for RSA-2048 — we validate that no key size increase can compensate. This measurement IS the proof that PQC replacement is mandatory, not optional.",
        challenges: {
          realWorld: "Trillions of dollars in global commerce rely on the 'hardness' of factoring.",
          technical: "Quantum computers use Superposition to compute f(x) for all x simultaneously, and Interference to cancel out wrong answers."
        },
        advantages: [
          "Exponential speedup",
          "Breaks RSA-2048 in hours",
          "Mathematically proven"
        ],
        limitations: [
          "Requires stable qubits",
          "High error rates in current hardware",
          "Needs Quantum Fourier Transform (QFT)"
        ],
        equations: [
          {
            latex: "f(x) = a^x \\pmod N",
            symbols: {
              "a": "A random number coprime to N",
              "x": "The input value (integer)",
              "N": "The large number we want to factor",
              "f(x)": "The modular exponentiation result"
            },
            meaning: "This function is periodic. It repeats its values every 'r' steps.",
            whyNeeded: "Finding the period 'r' is the key to Shor's algorithm. If we know 'r', we can find p and q using Greatest Common Divisors.",
            interpretation: "The rhythm of this function contains the secret code to the safe.",
            numericalExample: "Let N=15, a=7.\nx=1: 7^1 mod 15 = 7\nx=2: 7^2 mod 15 = 49 mod 15 = 4\nx=3: 7^3 mod 15 = 343 mod 15 = 13\nx=4: 7^4 mod 15 = 1\nx=5: 7^5 mod 15 = 7 (REPEAT!)\nPeriod r = 4."
          }
        ],
        simulationResults: "The simulator demonstrates that for small numbers, we can see the period. For large numbers, a quantum computer finds the same period using the QFT algorithm."
      }}
      abl={[
        {
          level: 1,
          title: "The Periodic Paper Fold",
          objective: "Visualize how a pattern repeats and how finding that repetition reveals structure.",
          time: "15 Mins",
          materials: ["Strip of Paper", "Marker"],
          instructions: [
            "Teacher folds a long strip of paper multiple times in the same direction.",
            "Unfold and mark the creases.",
            "Show that the distance between creases is constant (the 'period').",
            "Explain that if we know the distance, we know how the paper was folded."
          ],
          expectedOutput: "Students identify the 'rhythm' of the folds.",
          assessmentRubrics: ["Observation of pattern", "Connecting folds to periodicity"],
        },
        {
          level: 2,
          title: "Modular Math Relay",
          objective: "Calculate modular exponentiation manually to feel the 'work' involved.",
          time: "20 Mins",
          materials: ["Chalkboard", "Scientific Calculators"],
          instructions: [
            "Teacher gives N=21, a=2.",
            "Students take turns calculating 2^1, 2^2, 2^3... mod 21.",
            "The class shouts 'PERIOD!' when the numbers start repeating.",
            "Analyze how much 'work' it took to find it."
          ],
          expectedOutput: "Discovery of r=6 for 2^x mod 21.",
          assessmentRubrics: ["Accuracy of calculation", "Time taken to detect repeat"],
        }
      ]}
      pbl={{
        scope: "Design a 'Quantum-Ready' audit checklist for a local small business.",
        feasibility: "High - Requires only research and documentation.",
        risks: [
          { description: "Data complexity", level: "Low" },
          { description: "Regulatory changes", level: "Medium" }
        ],
        budget: "₹0 (Academic Project)",
        timeline: "2 Weeks",
        objectives: ["Identify encrypted data assets", "Map current algorithms used"],
        outcomes: ["Risk assessment report", "Migration priority list"],
        milestones: [
          { date: "Day 3", task: "Inventory of current software" },
          { date: "Day 7", task: "Algorithm vulnerability scan" },
          { date: "Day 14", task: "Final Audit Presentation" }
        ],
        teamRoles: {
          "Lead Researcher": "Analyzing current encryption standards",
          "Risk Analyst": "Evaluating impact of Shor's on specific data",
          "Documentation Officer": "Compiling the audit report"
        }
      }}
      questions={[
        {
          type: "Conceptual",
          text: "Why is finding the period 'r' of a modular function so dangerous for RSA?",
          answer: "Because if we know the period 'r' of f(x) = a^x mod N, we can calculate the factors p and q of N using simple GCD operations like gcd(a^(r/2) ± 1, N).",
          explanation: "RSA's security is entirely based on the difficulty of factoring N. Shor's algorithm converts factoring into period finding, which quantum computers are incredibly good at.",
          keyPoints: ["Period finding", "Shor's Algorithm", "RSA Collapse"],
          commonMistakes: ["Thinking Shor's guesses the primes", "Confusing it with Grover's search"],
          tips: ["Remember: Shor's = Frequency/Periodicity"]
        },
        {
          type: "Numerical",
          text: "Find the period 'r' for a=2 and N=15.",
          answer: "r = 4",
          explanation: "2^1 mod 15 = 2; 2^2 mod 15 = 4; 2^3 mod 15 = 8; 2^4 mod 15 = 1. Since 2^4 mod 15 = 1, the period is 4.",
          keyPoints: ["Successive powers", "Modulo reduction"],
          commonMistakes: ["Stopping before hitting 1", "Calculation errors"],
          tips: ["The sequence always goes back to 1 before repeating."]
        }
      ]}
      virtualLab={{
        title: "Quantum Fourier Transform Visualizer",
        description: "Simulate how a quantum computer 'sees' the period of a function using wave interference.",
        controls: ["Adjust Base a & Modulus N", "Compute f(x) Step-by-Step", "Auto-Run to Detect Period", "Compare Classical vs Quantum Steps"],
        dataFlow: "Input Integer -> Modular Exponentiation -> QFT Waveform -> Period Extraction",
        processExplanation: "While a classical computer checks each point one by one, the QFT uses constructive interference to make the 'period' peak stand out from the noise.",
        component: <ShorSimulation />,
        procedure: [
          "Click 'Compute Step' repeatedly and observe the sequence of f(x) = 7^x mod 15 values",
          "Count how many steps before the pattern repeats — that is the 'period' r",
          "Record the period r and compute gcd(7^{r/2} ± 1, 15) to find the factors",
          "Compare: a classical computer would need to check every possible period (up to 15 values); QFT finds r in one shot"
        ],
        observations: [
          { prompt: "What is the period r of the sequence f(x) = 7^x mod 15?", hint: "Count the number of distinct values before the sequence repeats" },
          { prompt: "How many classical steps would it take to find this period by brute force?", hint: "In the worst case, you'd need to check r different values" },
          { prompt: "What two factors did Shor's algorithm recover?", hint: "Use gcd(7^{r/2} + 1, 15) and gcd(7^{r/2} - 1, 15)" }
        ],
        conclusion: "You just performed the same mathematical process as Shor's algorithm — but manually. The quantum advantage comes from the QFT finding this period in a single operation using superposition and interference, while classical search takes O(r) steps. For RSA-2048, the period search space is astronomically large (~10^308), making the exponential speedup from polynomial to classical the fundamental validated impact."
      }}
      summary={{
        insights: [
          "Measuring the quantum threat: Shor's achieves 10²⁴× speedup over classical factoring — this validated quantum advantage ratio is the foundational measurement that proves classical public-key cryptography cannot survive the quantum era",
          "Validating PQC necessity: RSA-2048 provides 0 bits quantum security (measured by Shor's polynomial-time complexity); security margin is negative and cannot be fixed by increasing key sizes — this validated measurement drives the global PQC migration mandate",
          "Everyday impact measurement: your HTTPS sessions, VPNs, and encrypted emails have a validated risk score = (data lifetime > Q-Day horizon), meaning all long-lived data encrypted today is already measurable at-risk and requires PQC re-encryption"
        ],
        advantages: ["Provides transition path to PQC", "Standardizes threat models"],
        disadvantages: ["High computational overhead", "Hardware dependency"],
        futureScope: "Implementation of Shor's on 10,000+ logical qubits.",
        industrialApps: ["Cryptographic Auditing", "Secure Communication Design", "HTTPS/TLS Infrastructure Review"],
        careerRelevance: "Essential for Quantum Security Engineers and Cryptographers — a field projected to have 2M+ unfilled roles by 2030."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      skills={[
        { icon: "🧮", name: "Complexity Class Analysis", description: "Distinguish exponential vs polynomial complexity and measure quantum advantage ratios" },
        { icon: "📊", name: "Security Level Benchmarking", description: "Quantify security in bits using NIST security level standards" },
        { icon: "⚛️", name: "Quantum Computing Literacy", description: "Understand qubits, superposition, interference, and their cryptographic implications" },
        { icon: "🔍", name: "HNDL Risk Assessment", description: "Measure data sensitivity lifetime against Q-Day horizon to quantify exposure" },
      ]}
      nepAlignment={[
        { policy: "NEP 2020 — Experiential Learning", icon: "🇮🇳", description: "Interactive qubit playground and quantum simulator provide hands-on exploration of superposition and measurement" },
        { policy: "STEM — Critical Thinking", icon: "🔬", description: "Reflective questions connect abstract quantum concepts to real-world security risks and migration urgency" },
        { policy: "Multidisciplinary Approach", icon: "📚", description: "Bridges quantum physics, computer science, and cybersecurity policy into a unified learning framework" },
        { policy: "Outcome-Based Education", icon: "🎯", description: "Measurable learning outcomes linked to concrete security metrics and validated threat assessments" },
      ]}
      miniActivity={{
        title: "Build Your Own Quantum Advantage Ratio",
        instructions: "Pick a problem from the module, identify its classical and quantum complexity classes, and compute the quantum advantage ratio (classical time ÷ quantum time).",
        checkpoints: [
          "Identify the classical complexity class (e.g. exponential, polynomial, quadratic)",
          "Identify the quantum complexity class after applying Shor's or Grover's",
          "Classify the speedup type: exponential, quadratic, or none",
          "Compute a numerical ratio: T_classical / T_quantum for a specific input size"
        ],
        reflection: "Understanding the magnitude of quantum speedup is the foundation of all PQC risk assessment — without measurement, there is no urgency."
      }}
      onNextTopic={() => {}}
    />
    </>
  );
}
