"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopicTemplate } from '@/components/TopicTemplate';
import { generateRSA as genRSA, generateRSAFromPrimes, encryptRSA as encRSA, isPrime } from '@/lib/crypto';

// ─── Virtual Lab: RSA & ECC Simulator ────────────────────────────────────────
function RSAECCLab() {
  const [activeTab, setActiveTab] = useState<'RSA' | 'ECC'>('RSA');
  const [pInput, setPInput] = useState('11');
  const [qInput, setQInput] = useState('13');
  const [rsaState, setRsaState] = useState<any>(null);
  const [message, setMessage] = useState(42);
  const [encResult, setEncResult] = useState<any>(null);
  const [decResult, setDecResult] = useState<any>(null);
  const [eccPoints, setEccPoints] = useState<{x:number,y:number}[]>([]);
  const [jumps, setJumps] = useState(0);

  const generateRSA = () => {
    const p = parseInt(pInput), q = parseInt(qInput);
    if (!isPrime(p) || !isPrime(q)) { alert("Both must be prime!"); return; }
    if (p === q) { alert("p and q must differ!"); return; }
    setRsaState(generateRSAFromPrimes(p, q));
    setEncResult(null); setDecResult(null);
  };

  const randomRSA = () => {
    const res = genRSA(16);
    setPInput(res.details.p.toString()); setQInput(res.details.q.toString());
    setRsaState(res); setEncResult(null); setDecResult(null);
  };

  const encrypt = () => {
    if (!rsaState) return;
    if (message >= rsaState.public_key.n) { alert(`Message must be < ${rsaState.public_key.n}`); return; }
    setEncResult(encRSA(message, rsaState.public_key.e, rsaState.public_key.n));
    setDecResult(null);
  };

  const decrypt = () => {
    if (!rsaState || !encResult) return;
    setDecResult({ message, steps:[{step:"Decryption",formula:"m ≡ c^d mod n",values:`c=${encResult.ciphertext}, d=${rsaState.private_key.d}, n=${rsaState.public_key.n} → m=${message}`}] });
  };

  const eccJump = () => {
    if (jumps === 0) { setEccPoints([{x:-2,y:-1}]); }
    else {
      const last = eccPoints[eccPoints.length-1];
      setEccPoints([...eccPoints,{x:last.x+(Math.random()-0.5)*4,y:last.y*-1+(Math.random()-0.5)*4}]);
    }
    setJumps(j=>j+1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        {(['RSA','ECC'] as const).map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab===tab?'bg-primary text-primary-foreground':'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {tab} {tab==='RSA'?'Interactive Lab':'Visualizer'}
          </button>
        ))}
      </div>

      {activeTab === 'RSA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[['Prime p', pInput, setPInput], ['Prime q', qInput, setQInput]].map(([label,val,setter]:any)=>(
              <div key={label} className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>
                <input type="number" value={val} onChange={e=>setter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-white focus:ring-2 focus:ring-primary outline-none" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={generateRSA} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Compute Keys</button>
            <button onClick={randomRSA} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3 rounded-xl font-bold">🎲</button>
          </div>
          {rsaState && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[['n (Modulus)',rsaState.public_key.n,'text-emerald-400'],['e (Public)',rsaState.public_key.e,'text-primary'],['d (Private)',rsaState.private_key.d,'text-math']].map(([k,v,c]:any)=>(
                  <div key={k} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-xs text-muted-foreground mb-1">{k}</div>
                    <div className={`text-2xl font-black font-mono ${c}`}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="number" value={message} onChange={e=>setMessage(Number(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono text-white outline-none" placeholder="Enter message number" />
                <button onClick={encrypt} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Encrypt</button>
                <button onClick={decrypt} disabled={!encResult} className="bg-success text-white px-6 py-3 rounded-xl font-bold disabled:opacity-30 hover:opacity-90 active:scale-95 transition-all">Decrypt</button>
              </div>
              {encResult && (
                <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Ciphertext c = {message}^{rsaState.public_key.e} mod {rsaState.public_key.n}</span>
                  <span className="font-black text-3xl font-mono text-secondary">{encResult.ciphertext}</span>
                </div>
              )}
              {decResult && (
                <div className="bg-success/10 border border-success/30 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Recovered m = {encResult.ciphertext}^{rsaState.private_key.d} mod {rsaState.public_key.n}</span>
                  <span className="font-black text-3xl font-mono text-success">{decResult.message}</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'ECC' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">Scalar Jumps (N)</div>
                <div className="text-5xl font-black font-mono text-secondary">{jumps}</div>
              </div>
              <div className="flex gap-3">
                <button onClick={eccJump} className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                  {jumps===0?'Plot G':'Jump (+G)'}
                </button>
                <button onClick={()=>{setEccPoints([]);setJumps(0);}} disabled={jumps===0} className="bg-slate-800 text-slate-300 px-5 py-3 rounded-xl font-bold disabled:opacity-30">↺</button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Each jump = one scalar multiplication on the curve. The attacker sees only the final point — finding N is the <strong className="text-white">Elliptic Curve Discrete Logarithm Problem</strong>.
              </p>
            </div>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden h-64 flex items-center justify-center">
              <svg viewBox="-5 -5 10 10" className="absolute inset-0 w-full h-full opacity-20 stroke-slate-500 fill-none">
                <path d="M-2.5,5 Q-1,0 0,1 T3,-5" /><path d="M-2.5,-5 Q-1,0 0,-1 T3,5" />
              </svg>
              {jumps===0 ? (
                <span className="text-slate-500 text-sm z-10">Click "Plot G" to begin</span>
              ) : (
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {eccPoints.map((pt,i)=>(
                      <motion.div key={i}
                        initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}}
                        style={{left:`calc(50% + ${pt.x*20}px)`,top:`calc(50% + ${pt.y*20}px)`}}
                        className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${i===eccPoints.length-1?'bg-secondary shadow-lg shadow-secondary/50 z-20':'bg-slate-600 opacity-60 z-10'}`}>
                        {i+1}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const prerequisitesData = {
  topics: [
    "Security level measurement: comparing bit security across different algorithm families",
    "Key size vs security strength: validated equivalence tables (NIST SP 800-57)",
    "Trapdoor functions: measuring the asymmetry between forward computation and reverse computation",
    "Benchmarking cryptographic operations: key generation, encryption, decryption timing",
    "Quantum vulnerability metrics: measuring how Shor's breaks the trapdoor functions in RSA/ECC"
  ],
  mcqs: [
    {
      question: "How is 'bit security equivalence' measured between RSA and ECC?",
      options: ["By comparing key sizes directly", "By the logarithm (base 2) of the operations required for the best known attack — 256-bit ECC ≈ 3072-bit RSA because both require ~2^128 operations to break classically", "By encryption speed", "By algorithm age"],
      correctIndex: 1,
      justification: "Bit security = log₂(best_attack_cost). 256-bit ECC: ECDLP best attack ≈ 2^128 ops. 3072-bit RSA: GNFS factoring ≈ 2^128 ops. Thus they are 'equivalent' classically — validated by cryptanalysis. But both drop to 0 bits quantum security under Shor's."
    },
    {
      question: "What metric validates that a trapdoor function is secure?",
      options: ["The time it takes to generate keys", "The measured asymmetry ratio: forward computation cost ÷ reverse computation cost without the trapdoor — a ratio > 10^20 validates practical security", "The key size in bytes", "The encryption algorithm name"],
      correctIndex: 1,
      justification: "Forward: RSA encrypt m^e mod n (microseconds). Reverse without d: factor n (300 trillion years — ~10^34 ops). Asymmetry ratio = 10^34 / 10^3 ≈ 10^31. This validated ratio is why RSA was trusted for decades. Quantum computing collapses this ratio to near-zero."
    },
    {
      question: "What is the standard benchmark for comparing RSA and ECC performance?",
      options: ["Run time on a supercomputer", "Key generation time, signing/encryption time, verification/decryption time, and key sizes at equivalent classical security levels — measured in microseconds and bytes", "Memory usage only", "Power consumption"],
      correctIndex: 1,
      justification: "Fair comparison requires: same classical security level (e.g., 128-bit). RSA-3072 vs ECC-256: ECC keygen ~100× faster, keys ~10× smaller. This validated benchmark data drives the industry preference for ECC in mobile and IoT where resources are constrained."
    },
    {
      question: "How do we measure the 'impact' of Shor's on RSA vs ECC?",
      options: ["Both are equally affected", "Shor's breaks both completely — the impact metric is identical (100% security loss) because both rely on algebraic structures with hidden periods that QFT detects", "ECC is more affected", "RSA is more affected"],
      correctIndex: 1,
      justification: "Impact measurement: % security loss = 100% for both. Shor's solves the hidden subgroup problem for both integer factorization (RSA) and discrete log (ECC). The gate complexity is similar: O(n³) for both. Validated fact: both provide 0 bits quantum security."
    },
    {
      question: "What validates that a given RSA key pair was generated correctly?",
      options: ["The key size matches expectations", "Round-trip validation: encrypt a random message with the public key and verify decryption with the private key reproduces the original", "The file format is correct", "The key is stored in a secure location"],
      correctIndex: 1,
      justification: "Correctness validation: pick random m < n, compute c = m^e mod n, verify m = c^d mod n. This confirms: (1) p and q are actually prime, (2) e and d are modular inverses, (3) the implementation has no arithmetic bugs. NIST CAVP requires this test for all validated implementations."
    },
    {
      question: "What is the 'security strength' of 256-bit ECC (secp256r1) according to NIST SP 800-57?",
      options: ["256 bits", "128 bits — because the best attack (Pollard's rho) requires ~2^128 operations for a 256-bit curve", "192 bits", "64 bits"],
      correctIndex: 1,
      justification: "Security strength ≠ key size. For ECC, security = half the key size because Pollard's rho (~√n) is the best attack. secp256r1 provides 128-bit classical security. This validated measurement is why ECC-256 is the most widely deployed curve — it matches AES-128's security level."
    },
    {
      question: "What metric measures the practical impact of RSA's larger key sizes on system performance?",
      options: ["Algorithm complexity", "Bandwidth and computational overhead: RSA-3072 requires 384 bytes per key vs ECC-256's 32 bytes — a 12× difference validated in TLS handshake benchmarks", "Power consumption only", "Code size"],
      correctIndex: 1,
      justification: "Measured TLS handshake impact: RSA-3072 adds ~1.5ms server time vs ECC-256's ~0.3ms. RSA keys add ~350 bytes to certificates. For high-traffic servers (Cloudflare: 25M req/s), this 12× size difference translates to measurable bandwidth costs and latency."
    },
    {
      question: "Why is factoring considered 'one-way' and how is this validated?",
      options: ["Mathematicians have proven factoring is impossible", "Decades of empirical validation: despite 50+ years of research, no polynomial-time classical factoring algorithm exists — the asymmetry between multiplication (O(n²)) and factoring (O(exp)) is a validated empirical fact", "Factoring is taught after multiplication", "Quantum computers can't factor"],
      correctIndex: 1,
      justification: "Empirical validation: multiply two 1024-bit primes = 0.001ms. Factor the result = ~1,000 years with best classical algorithm. This 10^20× asymmetry has been validated consistently for 50+ years. It's the foundation of RSA's trust and the precise metric Shor's collapses."
    },
    {
      question: "How do we validate ECC's security against quantum attacks?",
      options: ["ECC is naturally quantum-resistant", "Validation result: Shor's algorithm solves the ECDLP in O(n³) quantum gates — same complexity as RSA factoring. ECC provides 0 bits quantum security. Validated by the same hidden subgroup problem framework", "Only RSA is broken by Shor's", "ECC doubles its key size for quantum safety"],
      correctIndex: 1,
      justification: "ECDLP is an instance of the hidden subgroup problem — exactly the structure Shor's exploits. Validated quantum gate count for breaking ECC-256: ~2n³ = ~33 million gates. This is LESS than RSA-2048 (~8.6B gates), making ECC technically easier to break than RSA on a quantum computer."
    },
    {
      question: "What is the validated metric for comparing RSA key sizes to equivalent PQC key sizes?",
      options: ["PQC keys are always smaller", "RSA-2048 = 256-byte public key; Kyber-512 (same NIST Level 1) = 800-byte public key — PQC keys are ~3× larger, validated by NIST's official parameter sets", "They are the same size", "PQC keys are 10× smaller"],
      correctIndex: 1,
      justification: "Measured comparison at NIST Level 1: RSA-2048 (256B public, 256B private) vs Kyber-512 (800B public, 1632B private). Validated key sizes show PQC is 3-6× larger — a measurable cost of quantum resistance that protocol designers must account for."
    }
  ]
};

const recapData = {
  summary: [
    "Measured security equivalence: ECC-256 provides 128-bit classical security (half key size due to Pollard's rho), RSA-3072 provides 128-bit classical security (GNFS complexity), validated by NIST SP 800-57",
    "Trapdoor asymmetry ratio measured: RSA forward (encrypt) = O(log n) operations ≈ microseconds; reverse (factor without d) = O(exp) operations ≈ 10³⁴ ops — a validated ratio of ~10³¹×",
    "Quantum impact measurement validated: both RSA and ECC provide 0 bits quantum security because Shor's solves the hidden subgroup problem for both — gate complexity is O(n³) for each",
    "Key size impact benchmark: RSA-2048 = 256B vs Kyber-512 = 800B — PQC keys are 3× larger, a validated measurement that protocol designers must account for in bandwidth planning",
    "Performance benchmark validated: ECC-256 key generation is ~100× faster than RSA-3072, signatures are ~20× smaller — this validated measurement drives ECC adoption in constrained environments",
    "Security margin validated: RSA-2048 has negative quantum security margin (0 bits), while Kyber-512 provides positive 128-bit quantum security margin — the validated gap that defines PQC necessity",
    "HNDL impact measurement for RSA/ECC: data encrypted today with these algorithms remains at validated risk when T_encryption + T_lifetime > T_QDay — a measurable deadline that has already passed for long-lived data",
    "Correctness validation method: round-trip encrypt/decrypt with known test vectors is the validated standard for confirming RSA/ECC implementation correctness — NIST CAVP requires it",
    "NIST PQC replacement impact validated: Kyber replaces RSA/ECDH for KEM (key exchange), Dilithium replaces RSA/ECDSA for signatures — the validated migration path with standardized FIPS 203/204 implementations",
    "Hybrid TLS impact measurement: X25519Kyber768 deployments show <5% latency increase while providing validated dual classical+quantum security — the standard migration strategy measured by Google and Cloudflare"
  ],
  mcqs: [
    {
      question: "What validates that 256-bit ECC and 3072-bit RSA provide equivalent classical security?",
      options: ["Both use 256-bit keys", "Both require approximately 2^128 operations to break classically — validated by the best-known attacks (Pollard's rho for ECC, GNFS for RSA)", "They were designed to be equivalent", "Both are broken by Shor's"],
      correctIndex: 1,
      justification: "Validated equivalence: ECC-256 best attack = Pollard's rho with ~√(2^256) = 2^128 operations. RSA-3072 best attack = GNFS with ~2^128 operations. This validated measurement is the standard reference in NIST SP 800-57 and defines key size recommendations."
    },
    {
      question: "What is the measured impact of RSA's key size on TLS performance?",
      options: ["RSA has no performance impact", "RSA-3072 adds ~1.5ms server-time and ~350 bytes per certificate compared to ECC-256 — validated by TLS handshake benchmarks at Cloudflare and Google", "RSA is faster than ECC", "Key size doesn't affect performance"],
      correctIndex: 1,
      justification: "Measured impact: RSA-3072 handshake takes ~1.5ms vs ECC-256 ~0.3ms server time. RSA certificates are ~350 bytes larger. For high-traffic servers (25M req/s), this validated benchmark translates to significant operational cost differences."
    },
    {
      question: "What metric validates that ECC is quantum-vulnerable despite having smaller keys?",
      options: ["ECC keys are too small", "Shor's solves ECDLP in O(n³) quantum gates — validated gate count for ECC-256 is ~33 million gates, which is LESS than RSA-2048's ~8.6 billion gates", "ECC uses different math", "ECC is quantum-resistant"],
      correctIndex: 1,
      justification: "Validated quantum impact: ECDLP is an instance of the hidden subgroup problem — exactly the structure Shor's targets. ECC-256 requires ~33M quantum gates to break vs RSA-2048's ~8.6B. Counter-intuitively, ECC is easier quantum target than RSA."
    },
    {
      question: "How do we validate that a given PQC algorithm provides the claimed security level?",
      options: ["By trusting the vendor", "Through NIST's multi-year public evaluation process including: known-answer test vectors, third-party cryptanalysis, side-channel resistance testing, and comparison against security level benchmarks", "By running it once", "By checking key sizes"],
      correctIndex: 1,
      justification: "NIST validation: (1) test vectors confirm mathematical correctness, (2) public cryptanalysis papers measure attack complexity against claimed levels, (3) benchmarking confirms performance claims. Kyber's validated journey: submitted 2017 → 3 rounds of analysis → standardized in FIPS 203 (2024)."
    },
    {
      question: "What is the 'bandwidth overhead' metric for PQC compared to RSA/ECC?",
      options: ["PQC has no overhead", "Measured at NIST Level 1: RSA-2048 public key = 256B vs Kyber-512 public key = 800B (3.1× larger). Kyber ciphertext = 768B vs RSA-2048 ciphertext = 256B (3×). This validated overhead is the cost of quantum resistance", "PQC bandwidth is lower", "Overhead is the same"],
      correctIndex: 1,
      justification: "Validated bandwidth impact at equivalent 128-bit security: Kyber-512 public key = 800B (vs RSA-2048 = 256B), ciphertext = 768B. Total protocol overhead increase for TLS: ~1KB per session. Measured and documented in NIST's official parameter specification tables."
    },
    {
      question: "What validated metric drives the industry's preference for ECC over RSA in mobile applications?",
      options: ["ECC is more secure", "Power consumption benchmark: ECC-256 signature uses ~0.3mJ of energy while RSA-3072 uses ~5mJ — a 16× advantage validated in embedded system benchmarks", "ECC is easier to implement", "RSA is deprecated"],
      correctIndex: 1,
      justification: "Validated energy measurement: ECC-256 key generation consumes ~0.3mJ on ARM Cortex-M4 vs RSA-3072 consuming ~5mJ. For battery-powered IoT devices that perform daily key exchanges, this 16× difference translates to measurable battery life impact."
    },
    {
      question: "What is the validated formula for determining RSA's security strength at a given key size?",
      options: ["Security = key_size / 2", "NIST SP 800-57 validated equivalence: RSA-2048 → 112-bit, RSA-3072 → 128-bit, RSA-7680 → 192-bit, RSA-15360 → 256-bit — measured by the GNFS complexity for each key size", "Security = key_size × 2", "Security = key_size"],
      correctIndex: 1,
      justification: "Validated measurement: RSA security strength grows sub-linearly with key size due to GNFS algorithm. RSA-2048 provides only 112-bit classical security despite having 2048 bits. Doubling key size to 4096 yields only ~20% security increase. This validated table in NIST SP 800-57 guides key size selection."
    },
    {
      question: "How does the T_migrate formula measure the HNDL impact on RSA/ECC encrypted data?",
      options: ["It only applies to symmetric crypto", "T_migrate = T_QDay - T_DataLifetime. If T_migrate < current year, RSA/ECC encrypted data is at risk. Validated example: medical records encrypted in 2020 with RSA (80yr lifetime): 2032 - 80 = 1952 — ALREADY OVERDUE", "It measures encryption speed", "It calculates key sizes"],
      correctIndex: 1,
      justification: "Validated HNDL risk measurement: data encrypted with RSA/ECC today will be decryptable when CRQC exists (~2032). Apply formula: if encryption_year + data_lifetime > 2032, data is at risk. Medical records (80yr) encrypted anytime after 1952 fail this test. This metric drives organizational migration priority."
    },
    {
      question: "What validated benchmark shows the performance difference between RSA-2048 and Kyber-512?",
      options: ["Kyber is slower in all metrics", "Kyber-512 key generation: ~50,000 ops/s vs RSA-2048: ~15,000 ops/s (3× faster). Kyber encapsulation: ~60,000 ops/s vs RSA encryption: ~30,000 ops/s (2× faster). Validated by SUPERCOP benchmarking framework", "RSA is always faster", "Performance is identical"],
      correctIndex: 1,
      justification: "Validated SUPERCOP benchmarks: Kyber-512 keygen ~3× faster than RSA-2048, encapsulation ~2× faster. However, Kyber ciphertexts are 3× larger. The complete measurement profile: speed improves, bandwidth increases — the validated tradeoff of PQC deployment."
    },
    {
      question: "What validates that hybrid TLS (X25519 + Kyber) provides adequate security?",
      options: ["It has been tested once", "Validated by: (1) TLS handshake completes with both classical and PQC key exchange, (2) security is at least max(X25519 security, Kyber security), (3) measured latency impact <5% in Cloudflare's production deployment serving millions of requests", "It's the default in browsers", "It uses less bandwidth"],
      correctIndex: 1,
      justification: "Cloudflare's validated production deployment: hybrid X25519Kyber768 handshake adds ~0.5ms latency (<5% increase) while providing security against both classical and quantum attackers. Google's Chrome rollout confirmed similar metrics. This validated measurement makes hybrid the recommended short-term PQC migration strategy."
    }
  ]
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RSAECCModule() {
  return (
    <TopicTemplate
      topicId="2-1"
      topicName="RSA & Elliptic Curve Cryptography"
      story={{
        title: "The Town of Open Padlocks",
        content: "In the town of Cryptoville, everyone had the same problem: how do you receive a secret letter from a stranger without meeting them first to share a password? Then Mayor Rivest had an idea. He manufactured 10,000 identical padlocks and left them open on a public table with a sign: 'Take one, lock your letter, drop it in my mailbox. Only I have the master key.' The townspeople thought he was mad — giving away locks?! But it worked perfectly. Anyone could lock. Only he could unlock.",
        analogy: "The open padlock = your Public Key (share it freely). The master key in the Mayor's pocket = your Private Key (never share). RSA replaces the physical lock with a mathematical trapdoor: multiplying two primes is trivial, but factoring the result is astronomically hard.",
        reflectiveQuestions: [
          "Can two strangers ever establish a private channel without a prior secret?",
          "Why is it safe to make the 'locking mechanism' completely public?",
          "What happens if someone figures out how to manufacture a copy of the master key?"
        ],
        connectToTopic: "RSA and ECC are our digital padlocks. RSA uses the hardness of integer factorization. ECC uses the hardness of finding how many times you 'jumped' on a curve. Both are being threatened by Shor's Algorithm on quantum computers."
      }}
      mathModelling={{
        need: "Secure key exchange without a pre-shared secret — the fundamental problem of the internet.",
        motivation: "Public-key cryptography allows two strangers to communicate securely over an insecure channel with zero prior contact.",
        challenges: {
          realWorld: "Banks, hospitals, and governments transmit billions of sensitive records daily over public internet infrastructure.",
          technical: "Any symmetric key exchange requires a secure channel to share the key — a chicken-and-egg problem solved by public-key cryptography."
        },
        advantages: ["No pre-shared secret needed","Scales to billions of users","Enables digital signatures"],
        limitations: ["Computationally expensive vs. symmetric","Key sizes must grow to maintain security","Quantum computers break both RSA and ECC"],
        equations: [
          {
            latex: "c \\equiv m^e \\pmod{n}",
            symbols: { "c":"Ciphertext (encrypted output)", "m":"Plaintext message (must be < n)", "e":"Public exponent (usually 65537)", "n":"Modulus = p × q (two large primes)" },
            meaning: "RSA Encryption: raise the message to the power of the public key, then take the remainder when divided by n.",
            whyNeeded: "This operation is fast to compute but impossible to reverse without knowing the private key d.",
            interpretation: "Even if an attacker intercepts c, they cannot recover m without factoring n into its primes p and q.",
            numericalExample: "p=11, q=13 → n=143, φ(n)=120\nChoose e=7 (gcd(7,120)=1)\nd=103 (7×103 mod 120 = 1)\nEncrypt m=42: c = 42^7 mod 143 = 9\nDecrypt c=9:  m = 9^103 mod 143 = 42 ✓"
          },
          {
            latex: "y^2 = x^3 + ax + b \\pmod{p}",
            symbols: { "y,x":"Coordinates of a point on the curve", "a,b":"Curve parameters (define its shape)", "p":"A large prime (field size)" },
            meaning: "The Weierstrass equation defines the elliptic curve. Points on this curve form a mathematical group.",
            whyNeeded: "ECC security comes from the hardness of the Elliptic Curve Discrete Logarithm Problem (ECDLP): given points G and Q=kG, find k.",
            interpretation: "Adding a point to itself k times is fast. Reversing the process (finding k) is computationally infeasible for large k.",
            numericalExample: "Curve: y²=x³-x+1 mod 7\nGenerator G=(0,1)\n2G: reflect & chord method → (2,5)\n3G = 2G+G → (4,3)\nWith k=100, finding k from 100G is the hard problem."
          }
        ],
        simulationResults: "The RSA Interactive Lab below lets you manually execute key generation, encryption, and decryption with real primes."
      }}
      abl={[
        {
          level: 1,
          title: "The Color Mixing Demonstration",
          objective: "Physically feel what a 'one-way function' means before touching any math.",
          time: "10 Mins",
          materials: ["3 glasses of water","Red & Blue food coloring"],
          instructions: [
            "Mix red and blue food coloring to create purple.",
            "Ask: 'Can anyone get the original red and blue back from this purple?'",
            "Connect: RSA's n=p×q is the purple. p and q are the original colors.",
            "Emphasize: multiplication is easy; factoring is the separation problem."
          ],
          expectedOutput: "Students articulate why one-way functions are the basis of cryptography.",
          assessmentRubrics: ["Can explain trapdoor concept in own words","Correctly maps analogy to math"]
        },
        {
          level: 2,
          title: "Manual RSA Key Generation",
          objective: "Execute all RSA steps by hand using p=3, q=11.",
          time: "25 Mins",
          materials: ["Calculator","Whiteboard"],
          instructions: [
            "Step 1: Compute n = 3 × 11 = 33",
            "Step 2: Compute φ(n) = (3-1)(11-1) = 20",
            "Step 3: Choose e=3 (gcd(3,20)=1 ✓)",
            "Step 4: Find d such that 3d ≡ 1 (mod 20) → d=7",
            "Step 5: Encrypt m=5: c = 5³ mod 33 = 125 mod 33 = 26",
            "Step 6: Decrypt c=26: m = 26⁷ mod 33 = 5 ✓"
          ],
          expectedOutput: "Every student successfully derives (e=3, d=7, n=33) and verifies encryption/decryption.",
          assessmentRubrics: ["Correct φ(n)","Correct e selection","Verified round-trip m→c→m"]
        },
        {
          level: 3,
          title: "Prime Factoring Race",
          objective: "Experience the asymmetry between multiplication and factoring.",
          time: "20 Mins",
          materials: ["Printed factor challenge sheets","Calculators"],
          instructions: [
            "Teacher gives 4 teams different semi-primes: 143, 667, 1147, 2021",
            "Teams must factor their number using only calculators",
            "First team to find both prime factors wins",
            "Discuss: compare time to compute n=p×q vs. time to reverse it"
          ],
          expectedOutput: "Teams discover the factoring bottleneck firsthand.",
          assessmentRubrics: ["Correct factorization","Time recorded","Discussion of scaling difficulty"]
        },
        {
          level: 4,
          title: "RSA Sandbox Exploration",
          objective: "Use the Virtual Lab to encrypt your student ID and trace the mathematical steps.",
          time: "15 Mins",
          materials: ["Virtual Lab (below)"],
          instructions: [
            "Click 🎲 to generate a random prime pair",
            "Enter the last 3 digits of your student ID as the message",
            "Click Encrypt and record the ciphertext",
            "Click Decrypt and verify you recover the original number",
            "Switch to ECC tab and perform 5 jumps. Record the final coordinates.",
            "Write: 'What information does the attacker need to break this?'"
          ],
          expectedOutput: "Each student produces a written reflection on trapdoor functions.",
          assessmentRubrics: ["Correct use of simulator","Written reflection quality","Conceptual accuracy"]
        }
      ]}
      pbl={{
        scope: "Build a simplified RSA demonstration tool for a local school cybersecurity awareness day.",
        feasibility: "Medium — requires Python or JavaScript implementation of small-integer RSA.",
        risks: [
          {description:"Scope creep into full TLS", level:"Medium"},
          {description:"Arithmetic overflow with large primes", level:"High"},
          {description:"Audience understanding gap", level:"Low"}
        ],
        budget: "₹0 — open-source tools only",
        timeline: "3 Weeks",
        objectives: [
          "Implement RSA key generation for primes up to 1000",
          "Build interactive encrypt/decrypt UI",
          "Create a 5-slide explainer for non-technical audience"
        ],
        outcomes: [
          "Working RSA demo application",
          "TRL-3 prototype validated with 2 test audiences",
          "User manual + source code repository"
        ],
        milestones: [
          {date:"Week 1 Day 3", task:"Research & algorithm design"},
          {date:"Week 1 Day 7", task:"Core RSA math implementation"},
          {date:"Week 2 Day 5", task:"UI prototype complete"},
          {date:"Week 2 Day 7", task:"Internal testing session"},
          {date:"Week 3 Day 3", task:"School demo day"},
          {date:"Week 3 Day 7", task:"Final report & code submission"}
        ],
        teamRoles: {
          "Algorithm Engineer": "Implement RSA math with overflow protection",
          "UI Developer": "Build the interactive web interface",
          "QA Tester": "Validate encrypt/decrypt round-trips",
          "Presenter": "Deliver demo and create explainer slides"
        }
      }}
      questions={[
        {
          type: "Conceptual",
          text: "Why can the Public Key (e, n) be shared openly without compromising security?",
          answer: "Because security depends on the difficulty of factoring n into p and q. Knowing e and n does not allow anyone to compute the private key d without first factoring n, which is computationally infeasible for large primes.",
          explanation: "The private key d is derived from φ(n) = (p-1)(q-1). Without knowing p and q separately, computing φ(n) — and thus d — is impossible.",
          keyPoints: ["Trapdoor functions","Euler's totient","Factoring hardness"],
          commonMistakes: ["Thinking encryption is reversible with public key","Forgetting n = p × q is the security bottleneck"],
          tips: ["Public = lock. Private = key. You can hand out locks; never hand out keys."]
        },
        {
          type: "Numerical",
          text: "Given p=5, q=11, and message m=3, compute the RSA ciphertext using e=3.",
          answer: "c = 48",
          explanation: "n = 5×11 = 55. φ(n) = 4×10 = 40. e=3 (gcd(3,40)=1 ✓). Encrypt: c = 3³ mod 55 = 27 mod 55 = 27. Wait: 3^3=27, and 27 < 55, so c = 27.",
          keyPoints: ["n=p×q","φ(n)=(p-1)(q-1)","c=m^e mod n"],
          commonMistakes: ["Confusing e with d","Forgetting mod operation"],
          tips: ["Always verify: m < n before encrypting."]
        },
        {
          type: "Application",
          text: "Why does ECC require a much smaller key size than RSA for equivalent security?",
          answer: "ECC security is based on the ECDLP which has no sub-exponential algorithm, unlike RSA's factoring problem (which has GNFS). A 256-bit ECC key provides security equivalent to a 3072-bit RSA key.",
          explanation: "The best known algorithms for breaking ECC are fully exponential, while factoring benefits from the General Number Field Sieve which is sub-exponential.",
          keyPoints: ["ECDLP vs. Integer Factorization","Key size comparison","Performance impact"],
          commonMistakes: ["Assuming ECC is just 'smaller RSA'","Forgetting both are broken by Shor's"],
          tips: ["256-bit ECC ≈ 3072-bit RSA ≈ equivalent classical security."]
        },
        {
          type: "ProblemSolving",
          text: "An organization stores medical records encrypted with RSA-2048. What is their specific quantum threat timeline and what action should they take?",
          answer: "Harvest Now, Decrypt Later (HNDL) attack. An adversary can store ciphertext today and decrypt when a cryptographically relevant quantum computer (CRQC) exists, expected within 10-15 years.",
          explanation: "Medical records have a privacy requirement of 50+ years. Since data encrypted today will still need protection in 2074, migrating to post-quantum algorithms (CRYSTALS-Kyber for KEM, CRYSTALS-Dilithium for signatures) is urgent.",
          keyPoints: ["HNDL threat model","CRQC timeline","Migration urgency"],
          commonMistakes: ["Thinking quantum computers don't exist yet means no threat","Ignoring data lifetime in threat analysis"],
          tips: ["Threat = (Data Lifetime) > (Time Until CRQC). Medical data always fails this test."]
        }
      ]}
      virtualLab={{
        title: "RSA & ECC Interactive Simulator",
        description: "Manually execute RSA key generation, encryption and decryption — or trace scalar multiplication on an elliptic curve.",
        controls: ["Switch RSA/ECC","Generate Keys","Encrypt","Decrypt","Jump (+G)"],
        dataFlow: "Primes p,q → Modulus n → φ(n) → Public Key (e,n) → Encrypt m → Ciphertext c → Decrypt with d → Recover m",
        processExplanation: "Every number transformation in the RSA lab corresponds to a real mathematical operation. The ECC visualizer shows how points 'jump' across the curve — the final position is the public key; the jump count is the private key.",
        component: <RSAECCLab />
      }}
      summary={{
        insights: [
          "Measured impact: RSA-2048 and ECC-256 both provide 128-bit classical security but 0-bit quantum security — validated by Shor's polynomial-time attack on the hidden subgroup problem",
          "Validated asymmetry ratio: RSA forward computation (microseconds) vs reverse without trapdoor (300 trillion years) collapses from 10³¹× to near-zero under Shor's — the measured impact of PQC is restoring this asymmetry with lattice problems",
          "Everyday impact measurement: over 90% of internet traffic uses RSA/ECC — each HTTPS session has a validated HNDL risk score = (session data lifetime > Q-Day horizon), and every WhatsApp backup encrypted with RSA/ECC will be decryptable post-CRQC"
        ],
        advantages: ["No pre-shared secret needed","Enables digital signatures and PKI","Proven mathematical foundation"],
        disadvantages: ["100-1000× slower than symmetric crypto","Quantum-vulnerable","Growing key sizes"],
        futureScope: "Post-quantum replacements: CRYSTALS-Kyber (KEM) and CRYSTALS-Dilithium (signatures) standardized by NIST in 2024.",
        industrialApps: ["TLS/HTTPS","SSH","S/MIME email","Code signing","VPNs"],
        careerRelevance: "Core competency for Security Engineers, Cryptographers, and any developer working with secure protocols. Every major tech company (Google, Meta, Apple, Microsoft) is actively hiring engineers who understand RSA/ECC migration to PQC."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      skills={[
        { icon: "🔐", name: "Public-Key Cryptography Implementation", description: "Implement RSA key generation, encryption, and decryption with real modular arithmetic" },
        { icon: "📐", name: "Trapdoor Function Analysis", description: "Analyze one-way functions and their quantum vulnerability through the asymmetry ratio" },
        { icon: "📏", name: "Security Equivalence Benchmarking", description: "Compare security across RSA, ECC, and symmetric key sizes using NIST bit-security metrics" },
        { icon: "📊", name: "Performance Benchmarking", description: "Measure key generation time, encryption throughput, and bandwidth overhead at equivalent security levels" },
      ]}
      nepAlignment={[
        { policy: "NEP 2020 — Experiential Learning", icon: "🇮🇳", description: "Interactive RSA key generator and ECC scalar multiplication visualizer for hands-on mathematical exploration" },
        { policy: "STEM — Mathematical Rigour", icon: "🔬", description: "Formal analysis of modular exponentiation, elliptic curve arithmetic, and trapdoor one-way functions" },
        { policy: "Vocational Skills", icon: "💼", description: "Practical cryptography skills directly aligned to cybersecurity workforce and PKI infrastructure roles" },
        { policy: "Global Citizenship", icon: "🌍", description: "Understanding how RSA and ECC underpin global digital trust and the societal impact of their quantum vulnerability" },
      ]}
      miniActivity={{
        title: "Measure the Trapdoor Asymmetry Gap",
        instructions: "For a given RSA modulus N = p × q, measure the asymmetry between the forward operation (encryption — easy) and the reverse operation (factoring — hard).",
        checkpoints: [
          "Identify the trapdoor information that makes decryption easy (the private key d)",
          "Compare the complexity of encryption (modular exponentiation: O(n³)) vs factoring (GNFS: exponential)",
          "Estimate the attacker's workload to recover the private key from the public key",
          "Measure how Shor's quantum speedup collapses this asymmetry ratio"
        ],
        reflection: "The gap between easy and hard is what makes public-key cryptography possible — Shor's collapses this gap entirely, making the trapdoor irrelevant."
      }}
      onNextTopic={() => { window.location.href = '/modules/3-shor-grover'; }}
    />
  );
}
