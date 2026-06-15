"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRSAFromPrimes, encryptRSA, isPrime, runShor, runGrover, simulateLattice, simulateCode, createQubit, createTwoQubit, applyXGate, applyHGate, applyZGate, applyYGate, applyCNOTGate, measureQubit, getProbabilities, getTwoQubitProbabilities, type QubitState, type TwoQubitState } from '@/lib/crypto';

// ─── RSA Lab ──────────────────────────────────────────────────────────────────
function RSALab() {
    const [p, setP] = useState('11');
    const [q, setQ] = useState('13');
    const [keys, setKeys] = useState<any>(null);
    const [msg, setMsg] = useState(42);
    const [cipher, setCipher] = useState<any>(null);
    const [decrypted, setDecrypted] = useState<number | null>(null);

    const generate = () => {
        const pn = parseInt(p), qn = parseInt(q);
        if (!isPrime(pn) || !isPrime(qn)) { alert('Both must be prime!'); return; }
        if (pn === qn) { alert('p and q must differ!'); return; }
        setKeys(generateRSAFromPrimes(pn, qn));
        setCipher(null); setDecrypted(null);
    };

    const encrypt = () => {
        if (!keys) return;
        if (msg >= keys.public_key.n) { alert(`Message must be < ${keys.public_key.n}`); return; }
        setCipher(encryptRSA(msg, keys.public_key.e, keys.public_key.n));
        setDecrypted(null);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {[['Prime p', p, setP], ['Prime q', q, setQ]].map(([label, val, setter]: any) => (
                    <div key={label} className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>
                        <input type="number" value={val} onChange={e => setter(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                ))}
            </div>
            <button onClick={generate} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                Generate RSA Keys
            </button>
            {keys && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        {[['n', keys.public_key.n, 'text-emerald-400'], ['e (pub)', keys.public_key.e, 'text-primary'], ['d (priv)', keys.private_key.d, 'text-math']].map(([k, v, c]: any) => (
                            <div key={k} className="bg-white border border-slate-200 p-4 rounded-xl text-center">
                                <div className="text-xs text-muted-foreground mb-1">{k}</div>
                                <div className={`text-2xl font-black font-mono ${c}`}>{v}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <input type="number" value={msg} onChange={e => setMsg(Number(e.target.value))}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-white outline-none" placeholder="Message" />
                        <button onClick={encrypt} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all">Encrypt</button>
                        <button onClick={() => cipher && setDecrypted(msg)} disabled={!cipher}
                            className="bg-success text-white px-6 py-3 rounded-xl font-bold disabled:opacity-30 hover:opacity-90 transition-all">Decrypt</button>
                    </div>
                    {cipher && (
                        <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Ciphertext c = {msg}^{keys.public_key.e} mod {keys.public_key.n}</span>
                            <span className="font-black text-3xl font-mono text-secondary">{cipher.ciphertext}</span>
                        </div>
                    )}
                    {decrypted !== null && (
                        <div className="bg-success/10 border border-success/30 p-4 rounded-xl flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Recovered m = {cipher.ciphertext}^{keys.private_key.d} mod {keys.public_key.n}</span>
                            <span className="font-black text-3xl font-mono text-success">{decrypted}</span>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}

// ─── Shor Lab ─────────────────────────────────────────────────────────────────
function ShorLab() {
    const [n, setN] = useState('15');
    const [result, setResult] = useState<any>(null);
    const run = () => {
        const N = parseInt(n);
        if (isNaN(N) || N <= 1) { alert('Enter a valid integer > 1'); return; }
        setResult(runShor(N));
    };
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Number to Factor (N)</label>
                <input type="number" value={n} onChange={e => setN(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xl font-mono text-white focus:ring-2 focus:ring-secondary outline-none" />
            </div>
            <button onClick={run} className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                ⚛️ Run Shor's Algorithm
            </button>
            <div className="bg-white/80 border border-slate-200 p-4 rounded-xl text-xs text-muted-foreground space-y-1">
                {['Superpose all inputs simultaneously', 'Evaluate f(x) = a^x mod N for all x', 'QFT extracts period r', 'Compute GCD(a^(r/2) ± 1, N) → factors'].map((s, i) => (
                    <div key={i} className="flex gap-2"><span className="text-secondary">{i + 1}.</span>{s}</div>
                ))}
            </div>
            {result && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    {result.result ? (
                        <div className="bg-success/10 border border-success/30 p-6 rounded-xl text-center">
                            <div className="text-success text-sm font-bold mb-2">✓ Prime Factors Found</div>
                            <div className="text-4xl font-black font-mono text-success">{result.result[0]} × {result.result[1]}</div>
                            <div className="text-xs text-muted-foreground mt-2">= {parseInt(result.result[0]) * parseInt(result.result[1])}</div>
                        </div>
                    ) : (
                        <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl text-center">
                            <div className="text-destructive font-bold mb-1">Probabilistic Failure</div>
                            <p className="text-xs text-slate-600">Quantum results are probabilistic. Run again.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}

// ─── Grover Lab ───────────────────────────────────────────────────────────────
function GroverLab() {
    const [size, setSize] = useState(1000000);
    const [result, setResult] = useState<any>(null);
    const run = () => setResult(runGrover(size));
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Database Size (N): {size.toLocaleString()}</label>
                <input type="range" min="1000" max="100000000" step="1000" value={size}
                    onChange={e => setSize(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
            </div>
            <button onClick={run} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                🔦 Run Grover Search
            </button>
            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase font-bold">Classical Steps</div>
                            <div className="text-xs text-muted-foreground">N / 2 average</div>
                        </div>
                        <div className="text-2xl font-black font-mono text-slate-700">{Math.floor(result.classical_average_steps).toLocaleString()}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <div className="text-xs text-primary uppercase font-bold">Quantum Steps</div>
                            <div className="text-xs text-primary/60">(π/4)√N</div>
                        </div>
                        <div className="text-2xl font-black font-mono text-primary">{Math.floor(result.quantum_steps).toLocaleString()}</div>
                    </div>
                    <div className="bg-success/10 border border-success/30 p-3 rounded-xl text-center">
                        <div className="text-xs text-success font-bold uppercase">Speedup Factor</div>
                        <div className="text-xl font-black text-success">
                            {(Math.floor(result.classical_average_steps) / Math.floor(result.quantum_steps)).toFixed(0)}×
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ─── LWE Lab ──────────────────────────────────────────────────────────────────
function LWELab() {
    const [dim, setDim] = useState(4);
    const [noise, setNoise] = useState(0.5);
    const [result, setResult] = useState<any>(null);
    const run = () => setResult(simulateLattice(dim, noise));
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Lattice Dimension (n)</label>
                    <input type="number" value={dim} onChange={e => setDim(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-success outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Noise Level (σ)</label>
                    <input type="number" step="0.1" value={noise} onChange={e => setNoise(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-success outline-none" />
                </div>
            </div>
            <button onClick={run} className="w-full bg-success text-success-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                Generate LWE Keys
            </button>
            <div className="bg-success/5 border border-success/20 p-3 rounded-xl text-xs text-muted-foreground">
                <p className="font-bold text-success">LWE: b = A·s + e (mod q)</p>
                <p>A: public matrix | s: secret key | e: small noise | b: public key</p>
            </div>
            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    {result.steps?.map((s: any, i: number) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 rounded-lg">
                            <div className="text-xs font-bold text-success uppercase mb-1">{s.step}</div>
                            <div className="text-xs font-mono text-slate-700">{s.formula}</div>
                            {s.values && <div className="text-xs text-slate-600 mt-1">{s.values}</div>}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

// ─── McEliece Lab ─────────────────────────────────────────────────────────────
function McElieceLab() {
    const [msgLen, setMsgLen] = useState(8);
    const [errWeight, setErrWeight] = useState(2);
    const [result, setResult] = useState<any>(null);
    const run = () => setResult(simulateCode(msgLen, errWeight));
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Message Length</label>
                    <input type="number" value={msgLen} onChange={e => setMsgLen(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-success outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Error Weight (t)</label>
                    <input type="number" value={errWeight} onChange={e => setErrWeight(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-success outline-none" />
                </div>
            </div>
            <button onClick={run} className="w-full bg-success text-success-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                Encode Message (McEliece)
            </button>
            <div className="bg-success/5 border border-success/20 p-3 rounded-xl text-xs text-muted-foreground">
                <p className="font-bold text-success">McEliece: c = mG + e</p>
                <p>m: message | G: generator matrix | e: intentional errors | Decoding without trapdoor is NP-Hard.</p>
            </div>
            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    {result.steps?.map((s: any, i: number) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 rounded-lg">
                            <div className="text-xs font-bold text-success uppercase mb-1">{s.step}</div>
                            <div className="text-xs font-mono text-slate-700">{s.formula}</div>
                            {s.values && <div className="text-xs text-slate-600 mt-1">{s.values}</div>}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

// ─── Quantum Basics Lab ────────────────────────────────────────────────────────
function QubitCircle({ prob0, prob1, size = 220 }: { prob0: number; prob1: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  const angle0 = Math.PI;
  const sweep = -Math.PI * 2 * prob0;
  const pct0 = (prob0 * 100).toFixed(0);
  const pct1 = (prob1 * 100).toFixed(0);
  const x0 = cx + r * Math.cos(angle0), y0 = cy + r * Math.sin(angle0);
  const x1 = cx + r * Math.cos(angle0 + sweep), y1 = cy + r * Math.sin(angle0 + sweep);
  const largeArc = prob0 > 0.5 ? 1 : 0;
  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg mx-auto" style={{ maxWidth: size }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.15} />
      {prob0 > 0.001 && (
        <path d={`M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 0 ${x1} ${y1} L ${cx} ${cy} Z`} fill="rgba(99,102,241,0.5)" />
      )}
      {prob1 > 0.001 && (
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${prob1 > 0.5 ? 1 : 0} 0 ${x0} ${y0} L ${cx} ${cy} Z`} fill="rgba(236,72,153,0.5)" />
      )}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth={1} opacity={0.2} />
      <text x={cx} y={cy - 28} textAnchor="middle" fill="rgb(129,140,248)" fontSize={14} fontWeight="bold">|0⟩</text>
      <text x={cx} y={cy + 40} textAnchor="middle" fill="rgb(244,114,182)" fontSize={14} fontWeight="bold">|1⟩</text>
      <text x={cx - 40} y={cy + 4} textAnchor="middle" fill="rgb(148,163,184)" fontSize={22} fontWeight="black">{pct0}%</text>
      <text x={cx + 40} y={cy + 4} textAnchor="middle" fill="rgb(148,163,184)" fontSize={22} fontWeight="black">{pct1}%</text>
    </svg>
  );
}

function DiracState({ alpha, beta, label = "|ψ⟩" }: { alpha: number; beta: number; label?: string }) {
  const fmt = (v: number) => {
    const a = Math.abs(v);
    if (a < 0.001) return "0";
    const s = v < 0 ? "−" : "";
    if (Math.abs(a - 1) < 0.001) return `${s}1`;
    if (Math.abs(a - Math.SQRT1_2) < 0.01) return `${s}1/√2`;
    return `${s}${a.toFixed(3)}`;
  };
  return (
    <div className="font-mono text-lg text-center tracking-wider">
      <span className="text-slate-600">{label} = </span>
      <span className="text-indigo-400">{fmt(alpha)}</span>
      <span className="text-slate-600">|0⟩</span>
      <span className="text-slate-600"> + </span>
      <span className="text-pink-400">{fmt(beta >= 0 ? beta : beta)}</span>
      <span className="text-slate-600">|1⟩</span>
    </div>
  );
}

function QuantumLab() {
  const [qubit, setQubit] = useState<QubitState>(createQubit(true));
  const [measurement, setMeasurement] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [twoQubitMode, setTwoQubitMode] = useState(false);
  const [twoQubit, setTwoQubit] = useState<TwoQubitState>(createTwoQubit());

  const probs = getProbabilities(qubit);
  const { p00, p01, p10, p11 } = getTwoQubitProbabilities(twoQubit);

  const apply = (gate: string, fn: () => void) => {
    setMeasurement(null);
    fn();
    setHistory(h => [`${gate}`, ...h.slice(0, 19)]);
  };

  const resetQubit = () => {
    setQubit(createQubit(true));
    setTwoQubit(createTwoQubit());
    setMeasurement(null);
    setHistory([]);
  };

  const doMeasure = () => {
    const result = measureQubit(qubit);
    setMeasurement(result);
    setHistory(h => [`Measure → |${result}⟩`, ...h.slice(0, 19)]);
  };

  const twoQubitProbs = [
    { label: "|00⟩", value: p00, color: "rgb(129,140,248)" },
    { label: "|01⟩", value: p01, color: "rgb(167,139,250)" },
    { label: "|10⟩", value: p10, color: "rgb(244,114,182)" },
    { label: "|11⟩", value: p11, color: "rgb(251,146,60)" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        <div className="flex bg-white rounded-lg md:rounded-xl p-1 border border-slate-200">
          {['Single Qubit', 'Two Qubits'].map(mode => (
            <button key={mode} onClick={() => setTwoQubitMode(mode === 'Two Qubits')}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${(mode === 'Single Qubit') === !twoQubitMode ? 'bg-primary text-white' : 'text-slate-600 hover:text-foreground'}`}>
              {mode}
            </button>
          ))}
        </div>
        <button onClick={resetQubit} className="text-[10px] md:text-xs text-slate-600 hover:text-foreground px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
          ↺ Reset
        </button>
      </div>

      {!twoQubitMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Visual + State */}
          <div className="space-y-3 md:space-y-4">
            <QubitCircle prob0={probs.prob0} prob1={probs.prob1} size={180} />
            <DiracState alpha={qubit.alpha} beta={qubit.beta} />
          </div>
          {/* Controls + History */}
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { gate: 'X', desc: 'Flip', action: () => apply('X', () => setQubit(q => applyXGate(q))), color: 'border-indigo-500/30 hover:bg-indigo-500/10' },
                { gate: 'H', desc: 'Superpose', action: () => apply('H', () => setQubit(q => applyHGate(q))), color: 'border-pink-500/30 hover:bg-pink-500/10' },
                { gate: 'Z', desc: 'Phase', action: () => apply('Z', () => setQubit(q => applyZGate(q))), color: 'border-purple-500/30 hover:bg-purple-500/10' },
                { gate: 'Y', desc: 'Rotate', action: () => apply('Y', () => setQubit(q => applyYGate(q))), color: 'border-amber-500/30 hover:bg-amber-500/10' },
              ].map(g => (
                <button key={g.gate} onClick={g.action}
                  className={`bg-white border ${g.color} rounded-lg md:rounded-xl p-3 md:p-4 text-center hover:scale-[1.02] active:scale-95 transition-all`}>
                  <div className="text-base md:text-xl font-black text-white font-mono">{g.gate}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{g.desc}</div>
                </button>
              ))}
              <button onClick={doMeasure}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg md:rounded-xl p-3 md:p-4 text-center hover:scale-[1.02] active:scale-95 transition-all">
                <div className="text-base md:text-lg font-black text-amber-400">Measure</div>
                <div className="text-[10px] text-amber-500/60">Collapse</div>
              </button>
            </div>
            {measurement !== null && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-amber-400 font-bold uppercase mb-1">Measurement Result</div>
                <div className="text-3xl md:text-5xl font-black font-mono text-white">|{measurement}⟩</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Two qubit visualization */}
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {twoQubitProbs.map(({ label, value, color }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-lg md:rounded-xl p-2 md:p-3 text-center">
                  <div className="font-mono font-bold text-[10px] md:text-sm" style={{ color }}>{label}</div>
                  <div className="text-lg md:text-2xl font-black text-white mt-1">{(value * 100).toFixed(0)}%</div>
                  <div className="w-full bg-slate-100 rounded-full h-1 md:h-1.5 mt-1 md:mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value * 100}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/80 border border-slate-200 p-2 md:p-3 rounded-lg md:rounded-xl text-[10px] md:text-xs text-slate-600 text-center">
              Entanglement demo: Set first qubit to |1⟩ (X gate), then apply CNOT
            </div>
            <button onClick={() => apply('X₁', () => setTwoQubit(q => {
              return { alpha: q.gamma, beta: q.delta, gamma: q.alpha, delta: q.beta };
            }))}
              className="w-full bg-white border border-slate-200 rounded-lg md:rounded-xl py-2 md:py-3 text-center hover:bg-slate-100 transition-all text-xs md:text-sm font-bold">
              X₁ (Flip first qubit)
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button onClick={() => apply('CNOT', () => setTwoQubit(q => applyCNOTGate(q)))}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg md:rounded-xl p-3 md:p-5 text-center hover:scale-[1.02] active:scale-95 transition-all">
                <div className="text-base md:text-lg font-black text-emerald-400">CNOT</div>
                <div className="text-[10px] text-emerald-500/60">Controlled NOT</div>
                <div className="text-[10px] text-slate-600 mt-1 hidden md:block">Control | Target</div>
              </button>
              <button onClick={() => apply('H₁', () => setTwoQubit(q => {
                const sqrt2 = Math.SQRT1_2;
                return {
                  alpha: (q.alpha + q.gamma) * sqrt2,
                  beta: (q.beta + q.delta) * sqrt2,
                  gamma: (q.alpha - q.gamma) * sqrt2,
                  delta: (q.beta - q.delta) * sqrt2,
                };
              }))}
                className="bg-pink-500/10 border border-pink-500/30 rounded-lg md:rounded-xl p-3 md:p-5 text-center hover:scale-[1.02] active:scale-95 transition-all">
                <div className="text-base md:text-lg font-black text-pink-400">H₁</div>
                <div className="text-[10px] text-pink-500/60">Hadamard on Qubit 1</div>
              </button>
            </div>
            <div className="bg-white/80 border border-slate-200 p-2 md:p-3 rounded-lg md:rounded-xl text-[10px] md:text-xs text-slate-600 space-y-1">
              <p className="font-bold text-emerald-400">🔗 Create a Bell State (|Φ⁺⟩)</p>
              <p>1. X₁ (set first qubit to |1⟩)</p>
              <p>2. H₁ (create superposition on first qubit)</p>
              <p>3. CNOT (entangle both qubits)</p>
              <p>Result: |00⟩ + |11⟩ (perfectly correlated)</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white/80 border border-slate-200 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div className="text-[10px] md:text-xs text-slate-600 font-bold uppercase mb-1 md:mb-2">Operation History</div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {history.map((op, i) => (
              <span key={i} className={`text-[10px] font-mono px-1.5 md:px-2 py-0.5 md:py-1 rounded ${op.startsWith('Measure') ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                {op}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const labSteps: Record<string, { step: number; instruction: string; objective: string }[]> = {
    rsa: [
        { step: 1, instruction: "Enter two distinct prime numbers for p and q (e.g., 11 and 13)", objective: "Understand that RSA starts with prime number selection" },
        { step: 2, instruction: "Click 'Generate RSA Keys' to compute the public/private key pair", objective: "Observe how n = p × q and the keys are derived from φ(n)" },
        { step: 3, instruction: "Enter a message number (must be less than n) and click 'Encrypt'", objective: "See the encryption formula c = m^e mod n in action" },
        { step: 4, instruction: "Click 'Decrypt' to recover the original message using the private key", objective: "Verify that decryption reverses encryption: m = c^d mod n" },
    ],
    shor: [
        { step: 1, instruction: "Enter a composite number N to factor (e.g., 15, 21, 35)", objective: "Understand the factoring problem Shor's solves" },
        { step: 2, instruction: "Click 'Run Shor's Algorithm' to simulate quantum period-finding", objective: "See how period-finding leads to prime factors" },
        { step: 3, instruction: "Review the algorithm steps in the info panel", objective: "Learn the 4-step quantum process: superposition → evaluate → QFT → GCD" },
        { step: 4, instruction: "Run multiple times — the probabilistic nature means occasional failure is normal", objective: "Understand that quantum algorithms are probabilistic, not deterministic" },
    ],
    grover: [
        { step: 1, instruction: "Adjust the database size slider to explore different search spaces", objective: "Understand how search space size affects algorithm performance" },
        { step: 2, instruction: "Click 'Run Grover Search' to compute classical vs quantum step counts", objective: "Compare classical O(N) vs quantum O(√N) complexity" },
        { step: 3, instruction: "Observe the speedup factor for different N values", objective: "Understand that Grover's provides quadratic, NOT exponential, speedup" },
        { step: 4, instruction: "Calculate: what N would make the quantum steps exceed 1 million?", objective: "Apply the (π/4)√N formula to realistic scenarios" },
    ],
    lwe: [
        { step: 1, instruction: "Set the lattice dimension (n) — higher dimensions mean stronger security", objective: "Understand that lattice dimension directly impacts security level" },
        { step: 2, instruction: "Set the noise level (σ) — more noise means harder recovery", objective: "See how intentional noise creates the one-way trapdoor" },
        { step: 3, instruction: "Click 'Generate LWE Keys' to simulate the b = A·s + e computation", objective: "Trace the LWE key generation process step by step" },
        { step: 4, instruction: "Study the formula: without knowing e, finding s from (A, b) is computationally hard", objective: "Understand why LWE is quantum-resistant (geometric hardness, not algebraic)" },
    ],
    mceliece: [
        { step: 1, instruction: "Set message length and error weight parameters", objective: "Understand code-based cryptography parameters" },
        { step: 2, instruction: "Click 'Encode Message (McEliece)' to simulate c = mG + e", objective: "See how intentional errors make decoding without the trapdoor NP-hard" },
        { step: 3, instruction: "Review the encoding steps and error injection process", objective: "Understand the syndrome decoding problem" },
        { step: 4, instruction: "Reflect: why is decoding random linear codes hard even for quantum computers?", objective: "Connect NP-hardness to quantum resistance" },
    ],
    quantum: [
        { step: 1, instruction: "Start in Single Qubit mode. Observe the qubit is initially |0⟩ (100% blue).", objective: "Understand that a qubit begins in a definite classical state" },
        { step: 2, instruction: "Click the X (Not) gate to flip the qubit from |0⟩ to |1⟩. Watch the pie chart change.", objective: "X gate is the quantum equivalent of classical NOT — it swaps |0⟩ and |1⟩" },
        { step: 3, instruction: "Click H (Hadamard) gate. The qubit enters superposition — 50% |0⟩ and 50% |1⟩ simultaneously.", objective: "H gate creates superposition, the key resource that gives quantum computers their power" },
        { step: 4, instruction: "Click Measure. The superposition collapses to either |0⟩ or |1⟩ at random.", objective: "Measurement destroys superposition and yields a probabilistic classical bit" },
        { step: 5, instruction: "Switch to Two Qubits mode. Apply X₁ → H₁ → CNOT to create a Bell state (|00⟩ + |11⟩).", objective: "CNOT creates entanglement — two qubits become perfectly correlated even at a distance" },
    ],
};

const labs = [
    {
        id: 'rsa',
        title: 'RSA Cryptosystem',
        icon: '🔐',
        module: 'Module 2',
        color: 'border-secondary/30',
        badge: 'bg-secondary/10 text-secondary',
        desc: 'Generate RSA key pairs, encrypt and decrypt messages using real modular arithmetic.',
        component: <RSALab />,
    },
    {
        id: 'shor',
        title: "Shor's Algorithm",
        icon: '⚛️',
        module: 'Module 3',
        color: 'border-math/30',
        badge: 'bg-math/10 text-math',
        desc: 'Factor integers using quantum period-finding. Observe how RSA collapses.',
        component: <ShorLab />,
    },
    {
        id: 'grover',
        title: "Grover's Search",
        icon: '🔦',
        module: 'Module 3',
        color: 'border-primary/30',
        badge: 'bg-primary/10 text-primary',
        desc: 'Compare classical vs quantum search step counts. Visualize the √N speedup.',
        component: <GroverLab />,
    },
    {
        id: 'lwe',
        title: 'LWE Key Generation',
        icon: '🌐',
        module: 'Module 5',
        color: 'border-success/30',
        badge: 'bg-success/10 text-success',
        desc: 'Simulate Learning With Errors — the foundation of CRYSTALS-Kyber (FIPS 203).',
        component: <LWELab />,
    },
    {
        id: 'mceliece',
        title: 'McEliece Encoding',
        icon: '📦',
        module: 'Module 5',
        color: 'border-success/30',
        badge: 'bg-success/10 text-success',
        desc: 'Encode messages with intentional errors. Experience code-based PQC security.',
        component: <McElieceLab />,
    },
    {
        id: 'quantum',
        title: 'Quantum Basics',
        icon: '⚛️',
        module: 'Module 3',
        color: 'border-indigo-500/30',
        badge: 'bg-indigo-500/10 text-indigo-400',
        desc: 'Explore qubits, superposition, X/H/Z gates, measurement, and CNOT entanglement.',
        component: <QuantumLab />,
    },
];

export default function VirtualLabPage() {
    const [active, setActive] = useState('rsa');
    const lab = labs.find(l => l.id === active)!;

    return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-12">
      {/* Header */}
      <div className="space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] md:text-xs font-bold uppercase tracking-widest">
          🧪 Interactive Virtual Labs
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">Virtual Lab</h1>
        <p className="text-sm md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Hands-on cryptographic simulations. Run real algorithms, observe mathematical operations,
          and build intuition through experimentation. Aligned with NEP 2020 learn-by-doing methodology.
        </p>
      </div>

      {/* Lab Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {labs.map(l => (
          <button key={l.id} onClick={() => setActive(l.id)}
            className={`glass rounded-xl md:rounded-2xl p-3 md:p-4 text-left transition-all hover:scale-[1.02] ${active === l.id ? `border-2 ${l.color} shadow-lg` : 'border border-slate-200 opacity-70 hover:opacity-100'}`}>
            <div className="text-xl md:text-2xl mb-1 md:mb-2">{l.icon}</div>
            <div className={`text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded mb-1 md:mb-2 inline-block ${l.badge}`}>{l.module}</div>
            <div className="text-[10px] md:text-sm font-bold leading-tight">{l.title}</div>
          </button>
        ))}
      </div>

      {/* Active Lab */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`glass rounded-2xl md:rounded-[2rem] overflow-hidden border-2 ${lab.color}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[400px] md:min-h-[500px]">
            {/* Lab Panel */}
            <div className="lg:col-span-2 p-4 md:p-8 bg-white/60">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                <span className="text-3xl md:text-4xl">{lab.icon}</span>
                <div>
                  <div className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block ${lab.badge}`}>{lab.module}</div>
                  <h2 className="text-lg md:text-2xl font-bold">{lab.title}</h2>
                </div>
              </div>
              {lab.component}
            </div>

            {/* Info Panel */}
            <div className="p-4 md:p-8 border-t md:border-t-0 md:border-l border-border/50 bg-slate-50/40 space-y-4 md:space-y-8 flex flex-col justify-between">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="font-bold text-primary mb-2 md:mb-3 text-sm md:text-base">About This Lab</h3>
                  <p className="text-[11px] md:text-sm text-slate-600 leading-relaxed">{lab.desc}</p>
                </div>
                {labSteps[lab.id] && (
                  <div className="bg-success/5 border border-success/20 p-3 md:p-4 rounded-lg md:rounded-xl">
                    <h4 className="text-[10px] md:text-xs font-bold text-success uppercase mb-2 md:mb-3 flex items-center gap-2">
                      <span>🎯</span> Learn by Doing — Step by Step
                    </h4>
                    <div className="space-y-2 md:space-y-3">
                      {labSteps[lab.id].map(s => (
                        <div key={s.step} className="flex gap-2 md:gap-3">
                          <span className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-[8px] md:text-[10px] font-bold mt-0.5">
                            {s.step}
                          </span>
                          <div>
                            <p className="text-[10px] md:text-xs text-slate-700 leading-snug">{s.instruction}</p>
                            <p className="text-[8px] md:text-[10px] text-slate-600 mt-0.5 italic">{s.objective}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-primary/5 border border-primary/20 p-3 md:p-4 rounded-lg md:rounded-xl">
                  <h4 className="text-[10px] md:text-xs font-bold text-primary uppercase mb-1 md:mb-2">Learning Objective</h4>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">
                    Observe the mathematical operations in real time. Connect each step to the theoretical concepts in the corresponding module.
                  </p>
                </div>
                <div className="bg-accent/5 border border-accent/20 p-3 md:p-4 rounded-lg md:rounded-xl">
                  <h4 className="text-[10px] md:text-xs font-bold text-accent uppercase mb-1 md:mb-2">NEP 2020 Alignment</h4>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">
                    Activity-Based Learning Level 4 — Individual exploration with real tools. Builds deep conceptual mastery through direct experimentation.
                  </p>
                </div>
              </div>
              <Link href={`/modules/${lab.module.toLowerCase().replace('module ', '')}-${lab.id === 'rsa' ? 'rsa-ecc' :
                      lab.id === 'shor' || lab.id === 'grover' || lab.id === 'quantum' ? 'shor-grover' :
                          'pqc'
                  }`}
                  className="block text-center py-2 md:py-3 bg-primary text-primary-foreground rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:opacity-90 transition-all mt-3 md:mt-0">
                  Open Full Module →
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* All Labs Grid */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-2xl font-bold font-outfit">All Available Labs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {labs.map(l => (
            <button key={l.id} onClick={() => { setActive(l.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`glass rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:scale-[1.01] transition-all border ${l.color} group`}>
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl">{l.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded mb-1 md:mb-2 inline-block ${l.badge}`}>{l.module}</div>
                  <h3 className="font-bold mb-1 group-hover:text-slate-900 transition-colors text-sm md:text-base">{l.title}</h3>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">{l.desc}</p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-slate-600 group-hover:text-primary transition-colors flex items-center gap-1">
                Launch Lab <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
    );
}
