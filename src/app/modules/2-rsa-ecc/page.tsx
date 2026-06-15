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
    "Prime numbers and coprime relationships",
    "Euler's Totient function φ(n)",
    "Modular arithmetic and modular inverses",
    "Basic understanding of public-key cryptography",
    "Properties of finite fields for elliptic curves"
  ],
  mcqs: [
    {
      question: "What does it mean for two numbers to be coprime?",
      options: ["They are both prime", "Their greatest common divisor (gcd) is 1", "They are equal", "Their product is prime"],
      correctIndex: 1,
      justification: "Two numbers are coprime if their greatest common divisor is 1. For example, 8 and 15 are coprime (gcd=1) even though neither is prime individually."
    },
    {
      question: "What is Euler's Totient φ(n) for n = p × q where p and q are primes?",
      options: ["p + q", "p × q", "(p − 1)(q − 1)", "p − q"],
      correctIndex: 2,
      justification: "For a product of two distinct primes n = p × q, φ(n) = (p − 1)(q − 1). This counts the numbers less than n that are coprime to n."
    },
    {
      question: "What is a modular inverse of a modulo m?",
      options: ["The number b such that a × b mod m = 0", "The number b such that a × b mod m = 1", "The reciprocal a/m", "The negative of a modulo m"],
      correctIndex: 1,
      justification: "The modular inverse b satisfies a × b ≡ 1 mod m. It exists only when gcd(a, m) = 1. In RSA, d is the modular inverse of e mod φ(n)."
    },
    {
      question: "What is the key size ratio for equivalent security between ECC and RSA?",
      options: ["Same size", "ECC needs twice the size", "256-bit ECC ≈ 3072-bit RSA", "ECC is always smaller regardless of parameters"],
      correctIndex: 2,
      justification: "ECC provides equivalent classical security to RSA with much smaller keys because the ECDLP has no sub-exponential attack, unlike RSA's factoring problem."
    },
    {
      question: "What is the fundamental problem that makes RSA secure?",
      options: ["The difficulty of multiplication", "The difficulty of integer factorization", "The difficulty of addition", "The difficulty of exponentiation"],
      correctIndex: 1,
      justification: "RSA's security relies on the computational hardness of factoring large composite numbers into their prime factors. Multiplying is easy; factoring is hard."
    },
    {
      question: "What is a trapdoor function in cryptography?",
      options: ["A function that is hard to compute in both directions", "A function that is easy to compute but hard to reverse without secret information", "A function that cannot be computed", "A function that only works with a key"],
      correctIndex: 1,
      justification: "A trapdoor function is easy to compute in one direction but difficult to reverse unless you have special 'trapdoor' information. RSA's encryption is the trapdoor; the private key d provides the trapdoor."
    },
    {
      question: "Compute: 5³ mod 7",
      options: ["5", "6", "1", "2"],
      correctIndex: 1,
      justification: "5³ = 125. 125 ÷ 7 = 17 with remainder 6. Therefore, 5³ mod 7 = 6."
    },
    {
      question: "What is the Elliptic Curve Discrete Logarithm Problem (ECDLP)?",
      options: ["Finding the curve equation from a point", "Given points G and Q = kG on an elliptic curve, find k", "Finding the sum of two curve points", "Encrypting a message with ECC"],
      correctIndex: 1,
      justification: "ECDLP: given a generator point G and a point Q = kG (G added to itself k times), find the scalar k. This is computationally infeasible for large k."
    },
    {
      question: "Why is RSA considered 'asymmetric' cryptography?",
      options: ["It uses two different keys: one public and one private", "It only works with odd-length messages", "It treats numbers asymmetrically", "It requires different algorithms for encrypt and decrypt"],
      correctIndex: 0,
      justification: "Asymmetric cryptography uses a pair of keys: a public key for encryption (shared openly) and a private key for decryption (kept secret). This solves the key distribution problem."
    },
    {
      question: "What happens to RSA's security if p and q are not chosen randomly?",
      options: ["It becomes more secure", "It becomes predictable and factorable — security collapses", "There is no effect", "Key generation becomes faster"],
      correctIndex: 1,
      justification: "p and q must be random, independent primes. If predictable (e.g., derived from a weak RNG), an attacker could factor n and recover the private key."
    }
  ]
};

const recapData = {
  summary: [
    "RSA encryption: c ≡ m^e (mod n) where e is the public exponent and n = p × q is the modulus",
    "RSA decryption: m ≡ c^d (mod n) where d is the private exponent satisfying d × e ≡ 1 mod φ(n)",
    "Security depends entirely on the difficulty of factoring n back into its prime components p and q",
    "ECC uses the Elliptic Curve Discrete Logarithm Problem (ECDLP): given G and kG, finding k is computationally hard",
    "ECC provides equivalent security to RSA with significantly smaller key sizes (256-bit ECC ≈ 3072-bit RSA)",
    "The Weierstrass equation y² = x³ + ax + b (mod p) defines points on an elliptic curve forming a group",
    "Both RSA and ECC are vulnerable to Shor's Algorithm on sufficiently powerful quantum computers",
    "RSA key generation steps: choose primes → compute n → compute φ(n) → choose e → compute d = e⁻¹ mod φ(n)",
    "Digital signatures use the private key to sign; anyone with the public key can verify — the reverse of encryption",
    "Post-quantum replacements: CRYSTALS-Kyber for key exchange (replaces RSA/ECDH) and CRYSTALS-Dilithium for signatures (replaces RSA/ECDSA)"
  ],
  mcqs: [
    {
      question: "What is the private key d in RSA derived from?",
      options: ["It is randomly chosen", "It is the modular inverse of e modulo φ(n)", "It is half of n", "It is the square of e"],
      correctIndex: 1,
      justification: "The private exponent d is computed as d ≡ e⁻¹ (mod φ(n)), meaning d × e mod φ(n) = 1. This requires knowing φ(n), which requires knowing p and q."
    },
    {
      question: "Given p=3, q=11, e=3, encrypt m=5 using RSA.",
      options: ["c = 5", "c = 26", "c = 33", "c = 15"],
      correctIndex: 1,
      justification: "n = 33. c = 5³ mod 33 = 125 mod 33 = 26. To decrypt: d = 7 (since 3×7=21 ≡ 1 mod 20). m = 26⁷ mod 33 = 5 ✓."
    },
    {
      question: "Why does ECC-NIST P-256 provide equivalent security to RSA-3072?",
      options: ["ECC is naturally stronger", "ECDLP has no known sub-exponential attack, unlike RSA's factoring", "ECC uses better random number generators", "ECC keys are always stored securely"],
      correctIndex: 1,
      justification: "The best attacks against ECDLP are fully exponential in the key size, while RSA's factoring problem has sub-exponential algorithms (GNFS). This means ECC keys pack more security per bit."
    },
    {
      question: "What is the purpose of the public exponent e in RSA?",
      options: ["To factor n", "To compute the private key", "To encrypt messages", "To generate random primes"],
      correctIndex: 2,
      justification: "The public exponent e is used in the encryption formula c = m^e mod n. It is typically chosen as 65537 (2¹⁶ + 1) for efficiency and security."
    },
    {
      question: "What validates that an RSA key pair (e, d, n) is correctly generated?",
      options: ["e + d = n", "Encrypting and decrypting a message reproduces the original: (m^e)^d ≡ m (mod n)", "e × d = n", "p + q = n"],
      correctIndex: 1,
      justification: "The correctness of RSA follows from Euler's theorem: (m^e)^d mod n = m^(e×d) mod n = m. If m^e mod n ≠ m when decrypted, the key generation is wrong."
    },
    {
      question: "What makes the Elliptic Curve group operation useful for cryptography?",
      options: ["The operation is slow", "The group operation (point addition) is easy, but reversing it (finding k from kG) is hard", "The curve cannot be drawn", "The operation always produces the same result"],
      correctIndex: 1,
      justification: "Adding a point G to itself k times (kG) is computationally easy. But given G and kG, finding k (the ECDLP) is computationally hard — this asymmetry is what makes ECC secure."
    },
    {
      question: "Why does RSA compute φ(n) = (p-1)(q-1)?",
      options: ["It's an arbitrary convention", "φ(n) counts numbers < n that are coprime to n", "It determines the key size", "It multiplies p and q"],
      correctIndex: 1,
      justification: "φ(n) counts positive integers less than n that are coprime to n. For n = p×q, this is (p-1)(q-1). This value is needed to compute the private key d."
    },
    {
      question: "What happens if you encrypt a message m that is larger than the modulus n?",
      options: ["The message is automatically split", "The decryption will fail to recover the original m", "It becomes more secure", "The key is regenerated"],
      correctIndex: 1,
      justification: "If m ≥ n, the modular reduction m^e mod n loses information because different messages can map to the same ciphertext. Messages must always be smaller than n."
    },
    {
      question: "What is the practical implication of Shor's Algorithm for TLS certificates using ECDSA?",
      options: ["ECDSA certificates are safe", "All ECDSA certificates become forgeable once a CRQC exists", "Only RSA certificates need replacement", "TLS is unaffected"],
      correctIndex: 1,
      justification: "Shor's algorithm breaks the ECDLP that ECDSA relies on. Once a CRQC is available, anyone can forge ECDSA signatures. TLS certificates must migrate to PQC signatures like CRYSTALS-Dilithium."
    },
    {
      question: "Why is the RSA decryption exponent d kept secret while e is public?",
      options: ["Because d is stored on a different server", "Because computing d requires factoring n, which is hard", "Because only e can be shared", "Because d is larger than e"],
      correctIndex: 1,
      justification: "Computing d from e and n requires knowing φ(n), which requires factoring n into p and q. Since factoring is computationally hard, d cannot be derived from public information (e, n)."
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
          "Asymmetric crypto solves the key exchange problem with zero prior contact",
          "Both RSA and ECC rely on mathematical hardness assumptions",
          "Both are broken by Shor's algorithm on a sufficiently powerful quantum computer",
          "Everyday: RSA/ECC protect your WhatsApp messages, bank logins, SSH connections, and every HTTPS website you visit — over 90% of all internet traffic uses these algorithms today"
        ],
        advantages: ["No pre-shared secret needed","Enables digital signatures and PKI","Proven mathematical foundation"],
        disadvantages: ["100-1000× slower than symmetric crypto","Quantum-vulnerable","Growing key sizes"],
        futureScope: "Post-quantum replacements: CRYSTALS-Kyber (KEM) and CRYSTALS-Dilithium (signatures) standardized by NIST in 2024.",
        industrialApps: ["TLS/HTTPS","SSH","S/MIME email","Code signing","VPNs"],
        careerRelevance: "Core competency for Security Engineers, Cryptographers, and any developer working with secure protocols. Every major tech company (Google, Meta, Apple, Microsoft) is actively hiring engineers who understand RSA/ECC migration to PQC."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      onNextTopic={() => { window.location.href = '/modules/3-shor-grover'; }}
    />
  );
}
