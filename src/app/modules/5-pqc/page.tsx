"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopicTemplate } from '@/components/TopicTemplate';
import { simulateLattice as simLattice, simulateCode as simCode } from '@/lib/crypto';

type PQCTab = 'Lattice' | 'Code' | 'Hash';

function PQCLab() {
  const [tab, setTab] = useState<PQCTab>('Lattice');
  const [result, setResult] = useState<any>(null);
  const [dimension, setDimension] = useState(4);
  const [noiseLevel, setNoiseLevel] = useState(0.5);
  const [msgLength, setMsgLength] = useState(8);
  const [errWeight, setErrWeight] = useState(2);

  const runLattice = () => setResult(simLattice(dimension, noiseLevel));
  const runCode = () => setResult(simCode(msgLength, errWeight));

  const tabs: PQCTab[] = ['Lattice', 'Code', 'Hash'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setResult(null); }}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${tab === t ? 'bg-success text-success-foreground' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {t}-Based
          </button>
        ))}
      </div>

      {tab === 'Lattice' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Lattice Dimension (n)</label>
                <input type="number" value={dimension} onChange={e => setDimension(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-success" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Noise Level (σ)</label>
                <input type="number" step="0.1" value={noiseLevel} onChange={e => setNoiseLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-success" />
              </div>
            </div>
            <button onClick={runLattice} className="w-full bg-success text-success-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
              Generate LWE Keys
            </button>
            <div className="bg-success/5 border border-success/20 p-3 rounded-xl text-[10px] text-muted-foreground space-y-1">
              <p className="font-bold text-success">LWE Formula: A·s + e = b (mod q)</p>
              <p>A: public matrix | s: secret key | e: small noise | b: public key</p>
              <p>Security: Finding s from (A, b) without knowing e is computationally hard even for quantum computers.</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center min-h-[200px]">
            {result && result.technique === 'Lattice-Based (LWE)' ? (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-3">
                {result.steps?.map((s: any, i: number) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <div className="text-[10px] font-bold text-success uppercase mb-1">{s.step}</div>
                    <div className="text-xs font-mono text-slate-300">{s.formula}</div>
                    {s.values && <div className="text-[10px] text-slate-500 mt-1">{s.values}</div>}
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground italic text-sm">Configure and generate lattice keys to trace the math.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'Code' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Message Length</label>
                <input type="number" value={msgLength} onChange={e => setMsgLength(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-success" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Error Weight (t)</label>
                <input type="number" value={errWeight} onChange={e => setErrWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-success" />
              </div>
            </div>
            <button onClick={runCode} className="w-full bg-success text-success-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
              Encode Message
            </button>
            <div className="bg-success/5 border border-success/20 p-3 rounded-xl text-[10px] text-muted-foreground">
              <p className="font-bold text-success">McEliece: c = mG + e</p>
              <p>m: message | G: generator matrix | e: intentional errors | Decoding without trapdoor is NP-Hard.</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center min-h-[200px]">
            {result && result.technique === 'Code-Based' ? (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-3">
                {result.steps?.map((s: any, i: number) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <div className="text-[10px] font-bold text-success uppercase mb-1">{s.step}</div>
                    <div className="text-xs font-mono text-slate-300">{s.formula}</div>
                    {s.values && <div className="text-[10px] text-slate-500 mt-1">{s.values}</div>}
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground italic text-sm">Configure and encode to trace the math.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'Hash' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              {name:'CRYSTALS-Kyber',role:'KEM (Key Encapsulation)',basis:'Module-LWE',nist:'FIPS 203',color:'text-primary'},
              {name:'CRYSTALS-Dilithium',role:'Digital Signatures',basis:'Module-LWE',nist:'FIPS 204',color:'text-secondary'},
              {name:'SPHINCS+',role:'Hash-Based Signatures',basis:'SHA-3 / SHAKE',nist:'FIPS 205',color:'text-success'},
            ].map(alg => (
              <div key={alg.name} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className={`text-sm font-black ${alg.color}`}>{alg.name}</div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase">{alg.role}</div>
                <div className="text-[10px] text-slate-500">Basis: {alg.basis}</div>
                <div className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{alg.nist}</div>
              </div>
            ))}
          </div>
          <div className="bg-success/5 border border-success/20 p-4 rounded-xl text-sm text-slate-300">
            <p className="font-bold text-success mb-2">NIST PQC Standards (2024)</p>
            <p className="text-xs leading-relaxed">These three algorithms were standardized by NIST in August 2024. Kyber (now ML-KEM) replaces RSA/ECDH for key exchange. Dilithium (now ML-DSA) and SPHINCS+ replace RSA/ECDSA for signatures. Migration to these standards is recommended immediately for all new systems.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const prerequisitesData = {
  topics: [
    "Understanding why RSA/ECC are broken by Shor's Algorithm (Modules 1–3)",
    "HNDL threat model and migration urgency (Module 4)",
    "Linear algebra: vectors, matrices, and dot products",
    "Coding theory basics: error detection and correction concepts",
    "Computational hardness: what makes a problem hard for quantum computers"
  ],
  mcqs: [
    {
      question: "Why can't we just increase RSA key sizes to make them quantum-safe?",
      options: ["Key sizes have a maximum limit", "Shor's complexity is O(n³) — polynomial growth means any feasible key size is breakable", "Larger keys are harder to generate", "Quantum computers only work on small keys"],
      correctIndex: 1,
      justification: "Shor's scales polynomially (O(n³)) with bit length. Doubling RSA keys from 2048 to 4096 makes Shor's only 8× harder, while classical factoring becomes exponentially harder. No practical key size can escape Shor's."
    },
    {
      question: "What is the Shortest Vector Problem (SVP) in lattice-based cryptography?",
      options: ["Finding the shortest distance between two points", "Given a high-dimensional lattice, find the shortest non-zero vector — proven NP-hard", "Compressing a vector to its shortest form", "Encrypting a short message"],
      correctIndex: 1,
      justification: "SVP asks: given a lattice basis, find the shortest non-zero lattice vector. This is NP-hard in high dimensions, and no efficient quantum algorithm exists. LWE reduces to worst-case SVP."
    },
    {
      question: "What is a 'lattice' in mathematics?",
      options: ["A grid of parallel lines", "A regular arrangement of points in n-dimensional space with periodic structure", "A type of encryption algorithm", "A set of equations"],
      correctIndex: 1,
      justification: "A lattice is a set of points in R^n where any integer linear combination of basis vectors remains in the lattice. Think of it as an infinite, repeating grid extended to high dimensions."
    },
    {
      question: "What does NP-hard mean in computational complexity?",
      options: ["Not Possible to compute", "A problem at least as hard as every problem in NP — no known polynomial-time algorithm exists", "Not Protected — easy to break", "Nearly Polynomial time"],
      correctIndex: 1,
      justification: "A problem is NP-hard if it's at least as hard as the hardest problems in NP. If any NP-hard problem can be solved in polynomial time, all NP problems can. SVP is NP-hard."
    },
    {
      question: "What is the Learning With Errors (LWE) problem?",
      options: ["Training AI to recognize errors", "Given (A, b = As + e), find s — where e is small random noise", "A way to correct errors in transmission", "A method to learn from mistakes"],
      correctIndex: 1,
      justification: "LWE: given a random matrix A and a noisy public key b = As + e (where s is secret and e is small noise), find s. The noise e makes this computationally infeasible without the secret."
    },
    {
      question: "What is the fundamental difference between classical and PQC hardness assumptions?",
      options: ["PQC uses no math", "Classical assumptions (factoring, ECDLP) rely on algebraic structures exploitable by Shor's; PQC uses geometric/combinatorial problems with no known quantum shortcuts", "PQC is based on guesswork", "Classical problems are harder"],
      correctIndex: 1,
      justification: "Shor's exploits the algebraic structure of cyclic groups (used by RSA/ECC). Lattice problems are geometric — they lack the algebraic periodicity that Shor's needs. This is why they're quantum-resistant."
    },
    {
      question: "What is a generator matrix G in code-based cryptography?",
      options: ["A matrix that generates random numbers", "A k×n matrix that maps k-bit messages to n-bit codewords in a linear code", "A matrix that deletes errors", "A matrix for encryption"],
      correctIndex: 1,
      justification: "A generator matrix G defines a linear code. An k-bit message m is encoded as codeword c = mG (an n-bit vector). The redundancy allows error detection and correction."
    },
    {
      question: "What is the Hamming weight of a binary vector?",
      options: ["The length of the vector", "The number of non-zero entries (bits set to 1) in the vector", "The vector's position", "The vector's encryption key"],
      correctIndex: 1,
      justification: "Hamming weight counts the number of 1s in a binary vector. In McEliece, the error vector e has a specific Hamming weight t, ensuring the error is correctable by the trapdoor decoder."
    },
    {
      question: "What is the syndrome decoding problem?",
      options: ["Decoding a message without errors", "Given a noisy codeword and the parity-check matrix, find the error vector — NP-hard for general linear codes", "Encoding a syndrome into a message", "Verifying a digital signature"],
      correctIndex: 1,
      justification: "Syndrome decoding: given H and s = Hc (where c is a noisy codeword), find the most likely error vector. This is proven NP-hard for general linear codes."
    },
    {
      question: "Why is AES-256 considered safe against quantum attacks while RSA-2048 is not?",
      options: ["AES is more modern", "Grover's only provides quadratic speedup — AES-256 requires 2^128 quantum operations, which is infeasible. Shor's provides exponential speedup — RSA-2048 requires only 8.6 billion operations", "AES uses stronger math", "RSA uses weaker keys"],
      correctIndex: 1,
      justification: "Shor's provides exponential speedup, making RSA-2048 vulnerable. Grover's provides only quadratic speedup — AES-256 requires 2^128 quantum operations (still infeasible). Both are 'quantum-safe' in practice for AES-256, but not RSA-2048."
    }
  ]
};

const recapData = {
  summary: [
    "LWE (Learning With Errors): b = A·s + e mod q — given (A, b), finding s is hard even for quantum computers",
    "LWE security is provably reducible to worst-case Shortest Vector Problem (SVP) in lattices — an NP-hard problem",
    "CRYSTALS-Kyber (FIPS 203) is the NIST-standardized KEM for key exchange, based on Module-LWE",
    "CRYSTALS-Dilithium (FIPS 204) is the NIST-standardized digital signature scheme, also based on Module-LWE",
    "SPHINCS+ (FIPS 205) provides hash-based signatures relying only on the security of SHA-3/SHAKE — maximum conservatism",
    "McEliece code-based encryption: c = mG + e — decoding without the private trapdoor is NP-hard",
    "PQC algorithms have larger key/ciphertext sizes than RSA/ECC — bandwidth considerations matter",
    "NIST finalized FIPS 203/204/205 in August 2024 — these are the official US government PQC standards",
    "Hybrid TLS modes (X25519 + Kyber) allow gradual migration while maintaining classical security during transition",
    "PQC replaces number-theoretic hardness (factoring, ECDLP) with geometric hardness (lattices) and combinatorial hardness (codes)"
  ],
  mcqs: [
    {
      question: "What is the LWE equation that forms the basis of CRYSTALS-Kyber?",
      options: ["c = m^e mod n", "y² = x³ + ax + b", "b = A·s + e (mod q)", "E = mc²"],
      correctIndex: 2,
      justification: "LWE: b = A·s + e mod q. A is a random matrix, s is the secret key, e is small noise, and b is the public key. Finding s from (A, b) without knowing e is computationally infeasible."
    },
    {
      question: "Which NIST PQC standard replaces RSA for digital signatures and what is its basis?",
      options: ["CRYSTALS-Kyber (FIPS 203) — LWE basis", "CRYSTALS-Dilithium (FIPS 204) — Module-LWE basis", "SPHINCS+ (FIPS 205) — Hash basis", "McEliece — Code basis"],
      correctIndex: 1,
      justification: "CRYSTALS-Dilithium (FIPS 204) is the NIST standard for digital signatures, replacing RSA/ECDSA. It is based on Module-LWE hardness. Kyber replaces RSA/ECDH for key exchange (KEM)."
    },
    {
      question: "Why is PQC key size generally LARGER than RSA/ECC for equivalent security?",
      options: ["PQC engineers haven't optimized keys", "PQC uses different mathematical structures (lattices) that naturally produce larger keys — this is a known tradeoff for quantum resistance", "Larger keys are always more secure", "NIST mandated larger keys"],
      correctIndex: 1,
      justification: "Lattice-based PQC inherently produces larger keys because the security depends on high-dimensional matrices and vectors. Kyber-512 keys (800 bytes) are ~3× larger than RSA-2048 (256 bytes), but provide quantum security RSA cannot match."
    },
    {
      question: "What security property does SPHINCS+ provide that makes it different from Kyber and Dilithium?",
      options: ["It's faster", "It relies ONLY on hash function security (SHA-3/SHAKE), making it maximally conservative with the longest security track record", "It has smaller keys", "It's easier to implement"],
      correctIndex: 1,
      justification: "SPHINCS+ is hash-based, relying solely on the well-analyzed security of SHA-3/SHAKE. It doesn't depend on structured lattices, making it the most conservative choice. Tradeoff: larger signatures (~8KB vs Dilithium's ~2KB)."
    },
    {
      question: "What is the key size comparison for RSA-2048 vs Kyber-512?",
      options: ["RSA-2048: 2048 bytes, Kyber-512: 512 bytes", "RSA-2048: 256 bytes, Kyber-512: 800 bytes", "Same size", "RSA is always smaller regardless of security level"],
      correctIndex: 1,
      justification: "RSA-2048 has a 256-byte public key. Kyber-512 (128-bit PQ security) has an 800-byte public key. PQC keys are larger, but this is acceptable given the security benefit."
    },
    {
      question: "What does 'KEM' stand for in Kyber?",
      options: ["Key Establishment Module", "Key Encapsulation Mechanism — a protocol for two parties to agree on a shared secret key using public-key cryptography", "Key Elimination Method", "Knowledge Encryption Matrix"],
      correctIndex: 1,
      justification: "KEM allows two parties to establish a shared symmetric key using public-key operations. Kyber is a KEM replacing RSA/ECDH key exchange in TLS. FIPS 203 standardizes ML-KEM (formerly Kyber)."
    },
    {
      question: "Why is McEliece considered to have the strongest security track record among PQC candidates?",
      options: ["It was invented most recently", "McEliece was invented in 1978 and has never been broken, even by quantum cryptanalysis — 50+ years of scrutiny", "It uses the same math as RSA", "It has been standardized the longest"],
      correctIndex: 1,
      justification: "McEliece (1978) predates RSA (1977). Despite decades of classical and quantum cryptanalysis, no practical attack has been found. Its main drawback is large public keys (1MB+) limiting practical use."
    },
    {
      question: "What is the purpose of the noise vector 'e' in LWE?",
      options: ["It makes the math more complex unnecessarily", "It destroys the algebraic structure that Shor's algorithm exploits, creating a problem that's geometrically but not algebraically structured", "It speeds up computation", "It verifies correctness"],
      correctIndex: 1,
      justification: "The noise 'e' is the critical innovation. Without noise, b = As is a linear system solvable classically. The noise makes the system look random, destroying the algebraic structure that Shor's algorithm needs."
    },
    {
      question: "What is a 'hybrid' TLS mode in the context of PQC migration?",
      options: ["Using both WiFi and Ethernet", "Combining classical (X25519) and PQC (Kyber) key exchange so security is at least as strong as the stronger algorithm", "Alternating between two algorithms randomly", "Using hardware and software encryption together"],
      correctIndex: 1,
      justification: "Hybrid key exchange (e.g., X25519Kyber768) combines a classical and PQC algorithm. An attacker must break BOTH to compromise the connection. This allows safe migration without trusting PQC alone."
    },
    {
      question: "What makes lattice problems hard for quantum computers specifically?",
      options: ["Quantum computers can't handle lattices", "Lattice problems are geometric, not algebraic — they lack the periodic structure (cyclic groups) that Shor's algorithm exploits with QFT", "Lattices exist in imaginary space", "Lattice problems are easy classically"],
      correctIndex: 1,
      justification: "Shor's algorithm works by finding hidden periods in algebraic structures (cyclic groups). Lattice problems like SVP are geometric — there's no periodic function to detect with QFT. This geometric hardness is why PQC works."
    }
  ]
};

export default function PQCModule() {
  return (
    <TopicTemplate
      topicId="5-1"
      topicName="Post-Quantum Cryptography (PQC)"
      story={{
        title: "The Foggy Grid and the Scrambled Library",
        content: "Dr. Anika had to hide the crown jewels. She couldn't use the old vault (it had a quantum weakness). So she did something brilliant: she built a 1000-dimensional maze where every corridor was slightly crooked. She gave everyone a map, but the map had intentional errors — every measurement was 'approximately' right. Without her secret compass, even the most powerful computer got completely lost in the fog. Separately, she also scrambled the library's books by injecting random extra pages. The books were readable only if you had the page-removal key.",
        analogy: "The foggy 1000D maze = Lattice-Based Cryptography (LWE). The secret compass = the private key vector 's'. The scrambled library = Code-Based Cryptography (McEliece). The page-removal key = the trapdoor decoding algorithm. Both tricks work because the 'noise' or 'error' is the security.",
        reflectiveQuestions: [
          "Why does adding intentional errors make something MORE secure, not less?",
          "If the maze is public, why can't an attacker just try every path?",
          "What makes a 1000-dimensional problem harder than a 2D problem?"
        ],
        connectToTopic: "Post-Quantum Cryptography replaces mathematical hardness assumptions vulnerable to Shor's algorithm (factoring, ECDLP) with assumptions that remain hard even for quantum computers: the Shortest Vector Problem in lattices, and decoding random linear codes."
      }}
      mathModelling={{
        need: "Classical cryptography's security assumptions collapse under Shor's algorithm. We need new hard problems that are quantum-resistant.",
        motivation: "NIST ran a 7-year competition (2016-2023) to standardize PQC algorithms. In 2024, FIPS 203, 204, and 205 were published as the first official post-quantum standards.",
        challenges: {
          realWorld: "Every TLS handshake, every SSH connection, every code-signing operation needs a drop-in quantum-resistant replacement.",
          technical: "PQC algorithms have larger key sizes and higher computational costs than classical counterparts. Efficient implementation is a research challenge."
        },
        advantages: ["Resistant to both classical and quantum attacks","Diverse security assumptions (not one point of failure)","NIST standardized — government and industry adoption ready"],
        limitations: ["Larger key/ciphertext sizes vs RSA/ECC","Higher computational overhead","Some algorithms (Isogeny) still being researched"],
        equations: [
          {
            latex: "\\mathbf{b} = \\mathbf{A} \\cdot \\mathbf{s} + \\mathbf{e} \\pmod{q}",
            symbols: {
              "\\mathbf{A}": "Public random matrix (n×m) over Z_q",
              "\\mathbf{s}": "Secret vector (private key) with small entries",
              "\\mathbf{e}": "Small noise vector sampled from a Gaussian distribution",
              "\\mathbf{b}": "Public key vector",
              "q": "Modulus (large prime)"
            },
            meaning: "The Learning With Errors (LWE) problem: given (A, b), find s. The noise e makes this computationally infeasible without s.",
            whyNeeded: "LWE is the foundation of CRYSTALS-Kyber (NIST FIPS 203). Its hardness is provably related to the worst-case Shortest Vector Problem (SVP) in lattices — proven NP-hard.",
            interpretation: "Even a quantum computer cannot efficiently find the 'closest lattice point' in a high-dimensional lattice. This is the trapdoor that replaces prime factoring.",
            numericalExample: "n=4, q=17, s=[1,2,0,1]^T\nA = [[3,1,4,1],[5,9,2,6],[5,3,5,8]]\ne = [1,0,-1] (small noise)\nb = A·s + e mod 17\nb = [3+2+0+1+1, 5+18+0+6+0, 5+6+0+8-1] mod 17\nb = [7, 12, 1] mod 17\n\nAttacker knows A and b. Finding s requires solving the noisy linear system — computationally infeasible for large n."
          },
          {
            latex: "\\mathbf{c} = \\mathbf{m} \\cdot \\mathbf{G} + \\mathbf{e}",
            symbols: {
              "\\mathbf{c}": "Ciphertext (noisy codeword)",
              "\\mathbf{m}": "Original message vector",
              "\\mathbf{G}": "Public generator matrix (known to all)",
              "\\mathbf{e}": "Intentional error vector of weight t"
            },
            meaning: "Code-Based Encryption (McEliece): encode the message then inject t deliberate errors. Decryption requires knowing the trapdoor decoding algorithm for G.",
            whyNeeded: "Decoding random linear codes is NP-hard. Even quantum computers cannot efficiently decode c without the private trapdoor algorithm.",
            interpretation: "Security comes from the hardness of the General Decoding Problem: given a random linear code and a noisy codeword, finding the message is computationally infeasible.",
            numericalExample: "m=[1,0,1,1], G is a [4,8] generator matrix\nc = mG + e where e has weight t=2 (2 bit-flips)\nAttacker sees c and G. Without the private fast decoder (Patterson's algorithm), finding m is exponentially hard.\nKey advantage: 50-year security track record — McEliece has never been broken."
          }
        ],
        simulationResults: "The lab below simulates LWE key generation and McEliece encoding. The NIST Standards tab shows the three standardized PQC algorithms."
      }}
      abl={[
        {
          level: 1,
          title: "The Foggy Grid Demo",
          objective: "Demonstrate why intentional noise makes a signal hard to recover.",
          time: "10 Mins",
          materials: ["Graph paper","Pencil","Ruler"],
          instructions: [
            "Draw a simple 5×5 grid on the board.",
            "Mark a specific grid intersection as the 'secret point'.",
            "Now draw a new point 'approximately 1 unit away' from the secret.",
            "Ask students: 'Without knowing the exact shift, which grid point is the secret?'",
            "Extend: in LWE, the grid is 1000-dimensional — there are exponentially more possible points."
          ],
          expectedOutput: "Students understand that noise destroys the ability to recover the exact grid point without a 'compass' (private key).",
          assessmentRubrics: ["Correctly identifies the ambiguity","Can explain why higher dimensions make this harder"]
        },
        {
          level: 2,
          title: "LWE Manual Simulation",
          objective: "Compute a small LWE problem by hand to see how noise hides the secret.",
          time: "25 Mins",
          materials: ["Calculator","Graph paper"],
          instructions: [
            "Use n=2, q=11, secret s=[2,3]^T",
            "Teacher provides A=[[1,2],[3,4],[5,6]]",
            "Compute A·s mod 11 = [[1×2+2×3],[3×2+4×3],[5×2+6×3]] = [[8],[18],[28]] mod 11 = [[8],[7],[6]]",
            "Add noise e=[1,0,-1]: b = [9,7,5]",
            "Student attempts to recover s from only (A, b) without knowing e.",
            "Discuss: why the noise makes recovery ambiguous."
          ],
          expectedOutput: "Students directly experience the computational ambiguity that LWE creates.",
          assessmentRubrics: ["Correct matrix multiplication","Correct modular reduction","Articulation of why recovery is hard"]
        },
        {
          level: 3,
          title: "PQC Algorithm Comparison Table",
          objective: "Evaluate the tradeoffs between the 3 NIST PQC standards.",
          time: "20 Mins",
          materials: ["NIST PQC specs printout (provided)","Whiteboard"],
          instructions: [
            "Divide into 3 groups: Kyber, Dilithium, SPHINCS+",
            "Each group researches: Security basis, Key size, Signature/ciphertext size, Performance",
            "Build a comparison table on the board",
            "Discuss: which algorithm would you choose for (a) a bank's TLS, (b) a medical device, (c) a smartphone app?"
          ],
          expectedOutput: "A complete comparison table and justified recommendations for 3 use cases.",
          assessmentRubrics: ["Accuracy of technical data","Quality of use-case justification","Group collaboration"]
        },
        {
          level: 4,
          title: "PQC Simulator Deep Dive",
          objective: "Use the Virtual Lab to trace the LWE and Code-Based simulations and write a comparative analysis.",
          time: "20 Mins",
          materials: ["Virtual Lab (below)","Notebook"],
          instructions: [
            "Run LWE simulation with dimension=4, noise=0.5. Record the 'A·s+e=b' output.",
            "Run LWE simulation with dimension=8, noise=1.0. Note how complexity grows.",
            "Switch to Code-Based. Run with msgLength=8, errWeight=2. Trace the encoding steps.",
            "Write: 'How does increasing lattice dimension affect security? What is the tradeoff with performance?'"
          ],
          expectedOutput: "A written analysis comparing the two PQC paradigms with specific numbers from the simulator.",
          assessmentRubrics: ["Correct data recording","Accurate complexity analysis","Clear tradeoff discussion"]
        }
      ]}
      pbl={{
        scope: "Implement a CRYSTALS-Kyber key encapsulation demonstration in Python and benchmark it against RSA-2048.",
        feasibility: "Medium — Python's 'kyber-py' library provides a reference implementation. Benchmarking requires standard timing utilities.",
        risks: [
          {description:"Library compatibility issues across Python versions", level:"Medium"},
          {description:"Performance measurement methodology inaccuracy", level:"Low"},
          {description:"Scope expansion into full TLS implementation", level:"High"}
        ],
        budget: "₹0 — open source Python libraries",
        timeline: "3 Weeks",
        objectives: [
          "Implement Kyber-512 key encapsulation using kyber-py",
          "Implement RSA-2048 using Python cryptography library",
          "Benchmark: key generation time, encapsulation time, ciphertext size",
          "Visualize comparison results in a dashboard"
        ],
        outcomes: [
          "Working Python benchmark script",
          "Performance comparison chart (key size, speed, security level)",
          "TRL-3 demonstration with documented results",
          "Recommendation report for a specific use case"
        ],
        milestones: [
          {date:"Week 1 Day 2", task:"Environment setup, library installation, hello-world tests"},
          {date:"Week 1 Day 5", task:"RSA-2048 implementation and timing baseline"},
          {date:"Week 2 Day 2", task:"Kyber-512 implementation and timing"},
          {date:"Week 2 Day 5", task:"Comparison metrics collection and visualization"},
          {date:"Week 3 Day 2", task:"Dashboard development"},
          {date:"Week 3 Day 5", task:"Final report and class presentation"}
        ],
        teamRoles: {
          "RSA Engineer": "Implement and benchmark RSA-2048 baseline",
          "Kyber Engineer": "Implement and benchmark Kyber-512",
          "Benchmark Analyst": "Design fair timing methodology and collect data",
          "Visualization Lead": "Build performance comparison dashboard"
        }
      }}
      questions={[
        {
          type: "Conceptual",
          text: "Why is the Learning With Errors (LWE) problem considered quantum-resistant when RSA is not?",
          answer: "LWE security is based on the hardness of the Shortest Vector Problem (SVP) in high-dimensional lattices. No known quantum algorithm (including Shor's) provides an exponential speedup for SVP. The best quantum algorithm for SVP (Grover-enhanced lattice sieving) provides only a quadratic speedup, which is mitigated by increasing the lattice dimension.",
          explanation: "Shor's algorithm works by exploiting the algebraic structure of cyclic groups. LWE has no such exploitable algebraic structure — it is a different mathematical domain. Even the best quantum algorithms for lattice problems remain exponential in the lattice dimension.",
          keyPoints: ["LWE vs SVP hardness","No efficient quantum algorithm for SVP","Dimension increase mitigates Grover speedup"],
          commonMistakes: ["Assuming all hard problems are quantum-resistant","Confusing NP-hardness with quantum-resistance"],
          tips: ["LWE = hard for quantum because it's geometrically hard, not algebraically structured."]
        },
        {
          type: "Numerical",
          text: "Compute the LWE public key b = A·s + e (mod 7) for A=[2,5], s=[1,3]^T, e=[1].",
          answer: "b = 2 (mod 7)",
          explanation: "A·s = 2×1 + 5×3 = 2+15 = 17. Add noise: 17+1 = 18. Reduce mod 7: 18 mod 7 = 4. Wait, let me recalculate: 17 mod 7 = 3. Then 3+1 = 4. So b=4.",
          keyPoints: ["Matrix multiplication","Modular reduction","Noise addition order"],
          commonMistakes: ["Forgetting to reduce mod q before adding noise","Wrong order of operations"],
          tips: ["Order: compute A·s first, then add e, then reduce mod q."]
        },
        {
          type: "Application",
          text: "A government agency must replace its TLS certificate infrastructure (currently using ECDSA-256). Which NIST PQC standard should they use and why?",
          answer: "CRYSTALS-Dilithium (FIPS 204). It is the NIST-standardized digital signature algorithm designed as a direct replacement for ECDSA. It provides equivalent security with a well-analyzed security proof based on Module-LWE hardness.",
          explanation: "ECDSA is used for digital signatures in TLS certificates. The PQC replacement for signatures is Dilithium (not Kyber, which is a KEM for key exchange). SPHINCS+ is also a valid choice for maximum conservatism but has larger signature sizes.",
          keyPoints: ["ECDSA → Dilithium","Kyber is for key exchange not signatures","FIPS 204 standardization"],
          commonMistakes: ["Confusing KEM (Kyber) with signature (Dilithium)","Using SPHINCS+ when performance matters"],
          tips: ["Kyber = Key exchange. Dilithium = Digital signatures. SPHINCS+ = Maximum conservatism signatures."]
        },
        {
          type: "ProblemSolving",
          text: "Compare key sizes: RSA-2048 vs CRYSTALS-Kyber-512. What is the size reduction and what is the security level tradeoff?",
          answer: "RSA-2048: public key = 256 bytes. Kyber-512: public key = 800 bytes, ciphertext = 768 bytes. Key size INCREASES with PQC. However, Kyber-512 provides 128-bit post-quantum security vs RSA-2048's ~112-bit classical (0-bit quantum) security.",
          explanation: "PQC algorithms generally have LARGER key/ciphertext sizes than classical algorithms. This is a known tradeoff. The benefit is quantum resistance — RSA-2048 provides zero security against a CRQC, while Kyber-512 provides 128-bit security against both classical and quantum attackers.",
          keyPoints: ["PQC keys are LARGER than RSA/ECC","Security level increases","Bandwidth impact must be considered in protocol design"],
          commonMistakes: ["Assuming PQC keys are smaller","Forgetting RSA provides 0 quantum security"],
          tips: ["PQC trades key size for quantum resistance. Bandwidth engineers must plan for 3-10× larger keys."]
        }
      ]}
      virtualLab={{
        title: "PQC Algorithm Simulator",
        description: "Simulate LWE key generation, McEliece encoding, and explore NIST standardized algorithms.",
        controls: ["Switch Lattice/Code/NIST Standards","Generate Keys","Encode Message"],
        dataFlow: "LWE: A, s, e → b=As+e | Code: m, G, e → c=mG+e | Both use noise/error as the security mechanism",
        processExplanation: "The LWE simulation shows how the public key b is derived by mixing the secret s with noise e. The Code simulation shows how a message m is encoded with intentional errors e. In both cases, decryption requires the private trapdoor — impossible without it.",
        component: <PQCLab />
      }}
      summary={{
        insights: [
          "PQC replaces number-theory hardness with geometry-based hardness (lattices) or combinatorics (codes)",
          "NIST finalized 3 standards in 2024: Kyber (KEM), Dilithium (signatures), SPHINCS+ (hash signatures)",
          "LWE security is provably related to worst-case SVP — one of the strongest security foundations in cryptography",
          "Everyday: Cloudflare already deploys Kyber+ X25519 hybrid key agreement; future browsers, messaging apps, and IoT devices will transparently upgrade to PQC without you noticing"
        ],
        advantages: ["Quantum-resistant security","Multiple diverse mathematical foundations","NIST-standardized for immediate deployment"],
        disadvantages: ["Larger key and ciphertext sizes","Higher computational cost","Immature implementations vs 40-year-old RSA codebases"],
        futureScope: "NIST is continuing evaluation of additional algorithms (FALCON, HQC) as backup standards. Post-quantum TLS (RFC 9180) is already being deployed by Cloudflare and Google.",
        industrialApps: ["TLS/HTTPS certificate replacement","Government secure communications","IoT device firmware signing","Cloud HSM key management"],
        careerRelevance: "Post-Quantum Implementation Engineers are among the highest-demand cybersecurity roles of the 2020s-2030s, with premium salaries at FAANG, defense contractors, and national laboratories."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      onNextTopic={() => { window.location.href = '/modules/6-dashboard'; }}
    />
  );
}
