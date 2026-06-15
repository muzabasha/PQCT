"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

const allQuestions = [
  // Module 1
  { id: 1, module: 1, type: 'Conceptual', text: "Why does Shor's Algorithm reduce RSA to polynomial time?", answer: "Because it transforms the problem of integer factorization into period-finding, which the Quantum Fourier Transform solves in O(n³) time.", keyPoints: ["Period finding = QFT", "Polynomial vs Exponential", "RSA collapse"] },
  { id: 2, module: 1, type: 'Numerical', text: "Find the period r of f(x) = 2^x mod 15.", answer: "r = 4. Sequence: 2,4,8,1,2... repeats every 4 steps.", keyPoints: ["Compute successive powers", "Detect repeat at f(x)=1"] },
  { id: 3, module: 1, type: 'Application', text: "Why does increasing key size NOT protect RSA against Shor's Algorithm?", answer: "Shor's complexity is O(n³) — polynomial in key length. Doubling the key only octuples Shor's work, while classical factoring becomes exponentially harder. No amount of key size increase moves RSA out of the polynomial regime for Shor's.", keyPoints: ["O(n³) stays polynomial", "No key size escape"] },
  // Module 2
  { id: 4, module: 2, type: 'Conceptual', text: "Why is the RSA Public Key (e, n) safe to share openly?", answer: "Because recovering the private key d requires computing φ(n), which requires knowing p and q. Factoring n into p and q is computationally infeasible for large n.", keyPoints: ["Factoring hardness", "φ(n) requires p,q", "Trapdoor function"] },
  { id: 5, module: 2, type: 'Numerical', text: "Given p=7, q=11, e=7, encrypt m=3.", answer: "n=77, φ(n)=60, c = 3^7 mod 77 = 2187 mod 77 = 31. c=31.", keyPoints: ["n=pq", "c=m^e mod n", "Modular exponentiation"] },
  { id: 6, module: 2, type: 'Application', text: "Why does ECC require smaller keys than RSA for equivalent security?", answer: "ECC's ECDLP has no sub-exponential attack (unlike RSA's GNFS). 256-bit ECC ≈ 3072-bit RSA in classical security.", keyPoints: ["ECDLP vs Factoring", "Sub-exponential vs Exponential", "Key size ratio"] },
  // Module 3
  { id: 7, module: 3, type: 'Numerical', text: "Grover's searches N=10^6. How many steps vs classical?", answer: "Classical: N/2 = 500,000. Quantum: (π/4)√N ≈ 785 steps. Speedup: ~637×.", keyPoints: ["(π/4)√N formula", "Quadratic speedup only"] },
  { id: 8, module: 3, type: 'Conceptual', text: "Why does Grover's algorithm require the Diffusion operator?", answer: "The Oracle flips the phase of the target state. The Diffusion operator (2|s⟩⟨s|-I) inverts all amplitudes around the mean, amplifying the target and suppressing others. Without Diffusion, there is no net amplification — just a phase change invisible to measurement.", keyPoints: ["Oracle = phase flip", "Diffusion = amplitude inversion", "Both needed for amplification"] },
  // Module 4
  { id: 9, module: 4, type: 'Numerical', text: "Medical records need 50-year confidentiality. Q-Day = 2032. Has the migration deadline passed?", answer: "T_migrate = 2032 - 50 = 1982. Yes — the safe migration window closed in 1982. All medical data encrypted with RSA today is at long-term risk.", keyPoints: ["T_migrate = Q-Day - Lifetime", "Most high-sensitivity data is OVERDUE"] },
  { id: 10, module: 4, type: 'Application', text: "Explain why HNDL is an active threat today even though CRQCs don't yet exist.", answer: "HNDL separates data collection (now) from decryption (future). Adversaries intercept and store ciphertext today using conventional means. No quantum hardware is needed for collection — only for eventual decryption.", keyPoints: ["Two-phase attack", "Collection requires no QC", "Urgency is present, not future"] },
  // Module 5
  { id: 11, module: 5, type: 'Conceptual', text: "Why is LWE considered quantum-resistant when RSA is not?", answer: "LWE's hardness is based on SVP in high-dimensional lattices. No quantum algorithm (including Shor's) provides exponential speedup for SVP. The best quantum lattice algorithms are still exponential.", keyPoints: ["SVP is not algebraically structured", "Shor's needs cyclic groups", "Dimension growth mitigates Grover"] },
  { id: 12, module: 5, type: 'Application', text: "Which NIST PQC standard replaces ECDSA for digital signatures, and what is its security basis?", answer: "CRYSTALS-Dilithium (FIPS 204). Security basis: Module-LWE hardness. It replaces ECDSA for signature use cases in TLS, code signing, and certificate infrastructure.", keyPoints: ["Dilithium = signatures", "Module-LWE basis", "FIPS 204 standardized 2024"] },
];

const typeColors: Record<string, string> = {
  'Conceptual':      'bg-primary/10 text-primary border-primary/20',
  'Numerical':       'bg-math/10 text-math border-math/20',
  'Application':     'bg-accent/10 text-accent border-accent/20',
  'ProblemSolving':  'bg-secondary/10 text-secondary border-secondary/20',
};

export default function QuestionBankPage() {
  const [filter, setFilter] = useState<'All' | number>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = allQuestions.filter(q =>
    (filter === 'All' || q.module === filter) &&
    (typeFilter === 'All' || q.type === typeFilter)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-12">
      <div className="space-y-2 md:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-math/10 border border-math/20 text-math text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Assessment Bank
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">Question Bank</h1>
        <p className="text-sm md:text-xl text-muted-foreground">Conceptual, numerical, and application questions with model answers. 2-mark format aligned with university assessments.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="space-y-1 md:space-y-2">
          <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Filter by Module</div>
          <div className="flex gap-1.5 md:gap-2 flex-wrap">
            {(['All', 1, 2, 3, 4, 5] as const).map(m => (
              <button key={m} onClick={() => setFilter(m)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${filter === m ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {m === 'All' ? 'All Modules' : `Module ${m}`}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1 md:space-y-2">
          <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Filter by Type</div>
          <div className="flex gap-1.5 md:gap-2 flex-wrap">
            {['All', 'Conceptual', 'Numerical', 'Application'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${typeFilter === t ? 'bg-math text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs md:text-sm text-muted-foreground">Showing {filtered.length} questions</div>

      <div className="space-y-3 md:space-y-4">
        {filtered.map((q, i) => (
          <motion.div key={q.id}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }} viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-3 md:p-6 cursor-pointer" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                  <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded border ${typeColors[q.type] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {q.type}
                  </span>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Module {q.module}</div>
                    <h3 className="font-bold text-slate-200 leading-snug text-sm md:text-base">{q.text}</h3>
                  </div>
                </div>
                <button className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${expanded === q.id ? 'rotate-180' : ''}`}>
                  ↓
                </button>
              </div>
            </div>

            {expanded === q.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-t border-slate-200 bg-white/80 p-3 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <div className="text-[10px] md:text-xs font-bold text-success uppercase mb-1 md:mb-2">Model Answer</div>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{q.answer}</p>
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-bold text-primary uppercase mb-1 md:mb-2">Key Points</div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {q.keyPoints.map((kp, j) => (
                      <span key={j} className="text-[10px] bg-slate-100 text-slate-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-slate-200">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
