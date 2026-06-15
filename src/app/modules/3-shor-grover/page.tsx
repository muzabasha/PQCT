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
  const [datasetSize, setDatasetSize] = useState(1000000);
  const [groverResult, setGroverResult] = useState<any>(null);

  const runShor = () => {
    const N = parseInt(shorN);
    if (isNaN(N) || N <= 1) { alert("Enter a valid integer > 1."); return; }
    setShorResult(simShor(N));
  };

  const runGrover = () => setGroverResult(simGrover(datasetSize));

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        {(['Shor', 'Grover'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === tab ? 'bg-secondary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {tab === 'Shor' ? "Shor's (Breaks RSA)" : "Grover's (Weakens AES)"}
          </button>
        ))}
      </div>

      {activeTab === 'Shor' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Number to Factor (N)</label>
              <input type="number" value={shorN} onChange={e => setShorN(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xl font-mono text-white focus:ring-2 focus:ring-secondary outline-none"
                placeholder="e.g. 15, 21, 35" />
            </div>
            <button onClick={runShor}
              className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
              ⚛️ Run Quantum Circuit
            </button>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-xs text-muted-foreground space-y-1">
              <p className="font-bold text-slate-300 mb-2">Algorithm Steps:</p>
              {["1. Superpose all inputs simultaneously","2. Evaluate f(x) = a^x mod N for all x","3. QFT extracts period r","4. Compute GCD(a^(r/2) ± 1, N) → factors"].map((s,i)=>(
                <div key={i} className="flex gap-2"><span className="text-secondary">{i+1}.</span>{s}</div>
              ))}
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center min-h-[200px]">
            {shorResult ? (
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="space-y-4">
                {shorResult.result ? (
                  <div className="bg-success/10 border border-success/30 p-6 rounded-xl text-center">
                    <div className="text-success text-sm font-bold mb-2">✓ Prime Factors Found</div>
                    <div className="text-4xl font-black font-mono text-success">
                      {shorResult.result[0]} × {shorResult.result[1]}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">= {parseInt(shorResult.result[0]) * parseInt(shorResult.result[1])}</div>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl text-center">
                    <div className="text-destructive font-bold mb-1">Probabilistic Failure</div>
                    <p className="text-xs text-slate-400">Quantum results are probabilistic. Run again to get a valid period.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground italic text-sm">Initialize superposition to begin factoring.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Grover' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Database Size (N): {datasetSize.toLocaleString()}</label>
              <input type="range" min="1000" max="100000000" step="1000" value={datasetSize}
                onChange={e => setDatasetSize(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            </div>
            <button onClick={runGrover}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
              🔦 Run Grover Search
            </button>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-xs text-muted-foreground">
              <p className="font-bold text-primary mb-2">Amplitude Amplification:</p>
              <p>Oracle flips phase of correct answer → Diffusion inverts all amplitudes around mean → Correct answer grows brighter each iteration → Repeat ≈ π/4 × √N times</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center min-h-[200px]">
            {groverResult ? (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-bold">Classical Steps</div>
                      <div className="text-xs text-muted-foreground">N / 2 average</div>
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-300">{Math.floor(groverResult.classical_average_steps).toLocaleString()}</div>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-xs text-primary uppercase font-bold">Quantum Steps</div>
                      <div className="text-xs text-primary/60">(π/4)√N</div>
                    </div>
                    <div className="text-2xl font-black font-mono text-primary">{Math.floor(groverResult.quantum_steps).toLocaleString()}</div>
                  </div>
                  <div className="bg-success/10 border border-success/30 p-3 rounded-xl text-center">
                    <div className="text-xs text-success font-bold uppercase">Speedup Factor</div>
                    <div className="text-xl font-black text-success">
                      {(Math.floor(groverResult.classical_average_steps) / Math.floor(groverResult.quantum_steps)).toFixed(0)}×
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground italic text-sm">Adjust dataset size and run search.</div>
            )}
          </div>
        </div>
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
    },
    {
      question: "How do we measure the effective security of AES after applying Grover's?",
      options: ["AES security is unchanged", "Validated formula: effective_bits = original_bits / 2. AES-128: 128/2 = 64-bit security under Grover's. AES-256: 256/2 = 128-bit security. This measurement formula is validated by Grover's √N complexity: √(2^128) = 2^64", "Grover's doubles security", "AES cannot be analyzed this way"],
      correctIndex: 1,
      justification: "Validated Grover's impact: Grover's searches a space of 2^k in √(2^k) = 2^(k/2) steps. Therefore, effective security = k/2 bits. AES-128 → 64-bit (potentially feasible soon). AES-256 → 128-bit (infeasible). This validated measurement defines NIST's recommendation: AES-256 for data needing post-quantum confidentiality."
    },
    {
      question: "What validates that Shor's provides exponential speedup for factoring but not for AES?",
      options: ["Shor's only works on certain computers", "Validated by problem structure: factoring has hidden algebraic periodicity (modular exponentiation) that QFT detects exponentially. AES has no periodic structure — it's a series of S-box substitutions and permutations. Grover's is the only quantum attack on AES", "Shor's is stronger than Grover's", "Factoring is an easier problem"],
      correctIndex: 1,
      justification: "Validated structural measurement: Shor's requires periodicity. Modular exponentiation f(x) = a^x mod N is periodic — QFT finds this period exponentially faster. AES has zero algebraic periodicity (it's designed to be pseudorandom). Therefore Shor's doesn't apply to AES — this validated distinction is why AES-256 is quantum-safe but RSA-2048 is not."
    },
    {
      question: "What metric measures the 'cost' of running Grover's algorithm?",
      options: ["Number of qubits only", "Total gate count × error correction overhead. Validated measurement: Grover's on AES-128 requires ~2^64 sequential oracle calls × ~10^4 gates per call = ~10^20 total gates — infeasible with current or near-future hardware. This cost measurement validates AES-128's near-term safety", "Memory usage", "Algorithm line count"],
      correctIndex: 1,
      justification: "Validated cost measurement: each Grover iteration requires one Oracle call (~10^4 quantum gates for AES-128). Total iterations = 2^64. Total gates = 10^4 × 2^64 = ~10^20 gates. Even at 1MHz gate speed (optimistic), this takes 10^14 seconds = millions of years. This validated cost metric explains why AES-128 is considered 'safe for now' despite Grover's."
    },
    {
      question: "How do we measure the practical impact of Shor's on different key sizes?",
      options: ["By the algorithm name", "Validated scaling formula: Shor's gate count ~ 2n³ where n = key bit-length. RSA-2048 (n=2048) = 8.6B gates. RSA-4096 (n=4096) = 68.7B gates — only 8× harder, not exponentially harder. This validated measurement proves key size increase cannot save RSA from Shor's", "By the encryption speed", "By the key's age"],
      correctIndex: 1,
      justification: "Validated scaling: Shor's O(n³) means doubling key size from 2048 to 4096 increases gate count by (4096/2048)³ = 2³ = 8×. Adding 2048 bits increases difficulty by only 8× while doing the same for classical GNFS would square the difficulty. This polynomial vs exponential scaling is the validated proof that RSA cannot outrun Shor's."
    },
    {
      question: "What is the validated method for measuring the number of qubits needed for Shor's?",
      options: ["Count the number of bits in N", "Validated formula: ~2n logical qubits + ~10⁶× more physical qubits for error correction. Shor's on RSA-2048: 2×2048 = 4096 logical qubits → ~20 million physical qubits. This measurement validates why CRQCs are projected for 2030-2035, not today", "Qubits = n + 1", "Qubits are not measurable"],
      correctIndex: 1,
      justification: "Validated qubit budget: Shor's requires ~2n logical qubits for n-bit factoring. But quantum error correction needs ~10⁴ physical qubits per logical qubit. RSA-2048: 4096 logical qubits → ~40 million physical qubits. Current state: ~1000 physical qubits (2024). Roadmap: IBM targets 100K physical qubits by 2029 → CRQC feasible by early 2030s. This measurement justifies the urgency timeline."
    },
    {
      question: "How do we validate that Grover's cannot be improved beyond √N?",
      options: ["We cannot know", "Validated by the BBBV theorem (Bennett, Bernstein, Brassard, Vazirani, 1997): any quantum algorithm for unstructured search requires Ω(√N) oracle queries. This is a mathematical proof, not a conjecture — it sets a validated upper bound on Grover's impact on symmetric cryptography", "It has been improved", "The theorem was disproven"],
      correctIndex: 1,
      justification: "The BBBV theorem provides a validated proof that √N is the absolute minimum for quantum unstructured search. This means: (1) no future 'better Grover's' will exist, (2) AES-256's 2^128 quantum cost is permanently safe, (3) the quadratic speedup is a ceiling, not just a current limitation. This validated bound is fundamental to PQC security assessment."
    },
    {
      question: "What validated metric determines if a cryptographic algorithm is 'quantum-safe'?",
      options: ["Key size > 256 bits", "The best known quantum attack complexity must be ≥ 2^100 operations at minimum, and the algorithm must have no sub-exponential quantum speedup based on validated cryptanalysis", "Algorithm age > 10 years", "NIST approval"],
      correctIndex: 1,
      justification: "Validated quantum-safety metric: (1) Best quantum attack complexity ≥ 2^100 ops, (2) No polynomial-time quantum algorithm exists, (3) At least 5 years of public quantum cryptanalysis without break. Kyber passes: best attack ~2^180 quantum ops, no polynomial algorithm, 7+ years of analysis. RSA-2048 fails: best attack ~2^33 quantum ops via Shor's (polynomial). This metric defines PQC."
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
    },
    {
      question: "What validated metric determines whether AES-128 is 'safe enough' against Grover's?",
      options: ["AES-128 is completely broken", "Total gate cost = iterations × gates_per_iteration = 2^64 × 10^4 ≈ 10^20 gates. At 1 MHz gate speed, this takes 10^14 seconds ≈ 3M years. Even at 1 GHz gate speed (highly optimistic), it takes 3000 years. This validated cost measurement shows AES-128 is safe for current data but not 30-year data", "AES-128 is unbreakable", "The key size is too large"],
      correctIndex: 1,
      justification: "Validated cost measurement: each Grover iteration on AES-128 requires ~10^4 quantum gates (implementing AES as a quantum circuit). With 2^64 iterations: total = ~10^20 gates. At optimistic 1GHz gate rate: 10^11 seconds ≈ 3000 years. At realistic 1MHz: 3M years. This validates NIST's position: AES-128 is quantum-safe for data expiring before 2035, but AES-256 is needed for long-term protection."
    },
    {
      question: "Why is Shor's O(n³) scaling a validated defeat for RSA key size increases?",
      options: ["RSA keys cannot be increased", "Validated scaling comparison: RSA-2048 (n=2048) → Shor's = 8.6B gates. RSA-4096 (n=4096) → Shor's = 68.7B gates (8× increase). But classical GNFS for RSA-4096 scales from ~10³⁴ to ~10⁷⁰ ops (quadrillions× harder for classical, only 8× harder for quantum). This validated scaling difference proves key size increase CANNOT defend against Shor's", "Shor's doesn't work on large keys", "Classical algorithms are faster"],
      correctIndex: 1,
      justification: "Validated measurement: Shor's O(n³) means doubling n → 8× more gates. Classical GNFS O(exp(n^{1/3})) means doubling n → complexity becomes (exp(n^{1/3}))² = exp(2n^{1/3}) ≈ exponentially harder for classical. The defender gets negligible benefit from increasing RSA key size while the quantum attacker is barely slowed. This validated asymmetry proves RSA must be replaced, not patched."
    },
    {
      question: "What validated measurement confirms Grover's on AES-256 is permanently infeasible?",
      options: ["Nothing is permanently secure", "BBBV theorem: √(2^256) = 2^128 iterations minimum. Each iteration requires ~10^4 gates (AES-256 quantum circuit). Total: 10^4 × 2^128 ≈ 10^42 gates. Even at 10GHz gate speed (technology limit), this takes 10^31 years — 10²¹× the age of the universe. This validated cost measurement makes AES-256 permanently quantum-safe", "AES-256 was designed for quantum", "Grover's doesn't work on AES-256"],
      correctIndex: 1,
      justification: "Validated with extreme lower-bound assumptions: assume 10 GHz gate speed (10^10 gates/sec) and 1 trillion parallel quantum computers. Even then: (10^42 gates) / (10^10 × 10^12) = 10^20 seconds ≈ 3 trillion years — 200× the age of the universe. The validated conclusion: AES-256 is permanently safe against Grover's regardless of technological advances."
    },
    {
      question: "How is the 'quantum threat level' of an algorithm measured and validated?",
      options: ["By media coverage", "Validated threat score = (Best Quantum Attack Complexity) / (Security Threshold of 2^100). Score < 1 means threatened. RSA-2048: Shor's 2^33 / 10^100 = ~0 → CRITICAL. AES-256: 2^128 / 2^100 = 2^28 ≈ 268M → SAFE with 268M× margin. This validated metric guides NIST's algorithm categorization", "By the algorithm's age", "By key size"],
      correctIndex: 1,
      justification: "Validated threat measurement: threat_score = quantum_attack_complexity / 2^100 threshold. RSA-2048 under Shor's: ~2^33 / 2^100 = 0 (CRITICAL — polynomial attack). AES-256 under Grover's: 2^128 / 2^100 = 2^28 (SAFE — huge margin). AES-128: 2^64 / 2^100 = 2^-36 (THREATENED — below threshold). NIST uses this validated metric to classify algorithms."
    },
    {
      question: "What validated measurement determines the 'cryptographic relevance' of a quantum computer?",
      options: ["Number of qubits alone", "A CRQC must have: (1) ~2n logical qubits for target n-bit key (e.g., 4096 for RSA-2048), (2) gate error rate < 10^-6, (3) ~8.6B sequential gate operations with error correction. Validated against current hardware: IBM has ~1K qubits with 10^-3 error — 10^4× short on both metrics", "Quantum volume metric", "Algorithm runtime"],
      correctIndex: 1,
      justification: "Validated CRQC requirements: (1) ~2n logical qubits for target n-bit key, (2) physical qubit overhead ~10^4 per logical (surface codes), (3) ~40M physical qubits for RSA-2048, (4) gate fidelity > 99.9999%. Current best: IBM 1121 qubits, fidelity ~99.9%. The validated gap of 10^4× in both qubit count and fidelity defines the 2030-2035 CRQC timeline."
    },
    {
      question: "What validates that Shor's can factor RSA-2048 but NOT break AES-256?",
      options: ["AES uses stronger encryption", "Validated structural analysis: Shor's solves the Hidden Subgroup Problem (HSP) over cyclic groups. Modular exponentiation (RSA's core) forms a cyclic group. AES's S-box substitution-permutation network has no group structure — the HSP does not apply. This algebraic validation is why Grover's (which needs no structure) is the only quantum attack on AES", "Shor's was designed only for RSA", "RSA is weaker than AES"],
      correctIndex: 1,
      justification: "Validated structural measurement: Shor's works on problems reducible to the Abelian Hidden Subgroup Problem. RSA's multiplicative group (Z_n^×) is abelian — Shor's applies. AES's structure is a composition of non-linear substitutions and linear permutations with no abelian group structure — Shor's cannot touch it. This mathematical validation is fundamental: the HSP framework precisely predicts which algorithms Shor's breaks and which it doesn't."
    },
    {
      question: "What validated measurement framework defines the 'PQC security level' (NIST Level 1-5)?",
      options: ["Security level = key size / 8", "NIST Level 1 = hardest classical attack ≥ 2^128 operations (AES-128 benchmark). Level 2 = hardest classical ≥ 2^128 AND hardest quantum ≥ 2^128 (SHA-256 collision benchmark). Level 3 = 2^192 (AES-192). Level 5 = 2^256 (AES-256). These validated benchmarks tie PQC security to well-analyzed symmetric algorithm complexities", "Level = quantum advantage", "Level = algorithm generation"],
      correctIndex: 1,
      justification: "Validated NIST framework: Level 1 = at least as hard as breaking AES-128 (2^128 classical). Level 3 = AES-192 (2^192). Level 5 = AES-256 (2^256). Kyber-512 targets Level 1; Kyber-1024 targets Level 5. This validated measurement framework allows apples-to-apples comparison between classical crypto, quantum attacks, and PQC algorithms at equivalent security."
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
        connectToTopic: "Shor's and Grover's are the two weapons in the quantum arsenal. Shor's breaks public-key crypto (RSA, ECC) with exponential speedup. Grover's weakens symmetric crypto (AES, SHA) with quadratic speedup — which is why NIST recommends doubling symmetric key sizes as a stopgap."
      }}
      mathModelling={{
        need: "Understanding the quantum advantage quantitatively — not just intuitively — to correctly size the threat and design appropriate responses.",
        motivation: "Cryptographers need precise complexity estimates to determine which algorithms are 'quantum-safe' and which require replacement.",
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
        controls: ["Switch Shor/Grover", "Run Quantum Circuit", "Run Grover Search"],
        dataFlow: "Shor: N → Superposition → QFT → Period r → GCD → Factors | Grover: N → Oracle → Diffusion × √N → Target",
        processExplanation: "Shor's simulation uses classical period-finding to mimic the quantum result. Grover's computes exact step counts using the (π/4)√N formula, showing the speedup ratio in real time.",
        component: <ShorGroverLab />
      }}
      summary={{
        insights: [
          "Measured impact: Shor's achieves 10²⁵× speedup (validated O(n³) vs O(exp)); Grover's achieves √N speedup (validated optimal by BBBV theorem) — together they define the complete quantum threat landscape",
          "Validated key measurement: RSA/ECC provide 0-bit quantum security, AES-128 provides 64-bit effective quantum security, AES-256 provides 128-bit — this measured security hierarchy directly dictates the PQC migration strategy for every organization",
          "Everyday impact measurement: every RSA/ECC-protected login (banking, email, VPN) has a validated HNDL risk; every AES-128 encrypted file (WhatsApp backups, cloud storage) has its effective security halved — these measured risks are the quantitative justification for immediate PQC adoption"
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
