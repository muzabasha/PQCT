"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          "Shor's converts factoring (exponential) to period-finding (polynomial)",
          "Grover's provides exactly quadratic speedup — no more, no less",
          "Doubling symmetric key sizes mitigates Grover; nothing classical mitigates Shor's"
        ],
        advantages: ["Proven speedups with mathematical guarantees","Motivates urgency for PQC migration","Provides precise threat quantification"],
        disadvantages: ["Requires fault-tolerant quantum hardware not yet available","Grover's threat overstated — quadratic not exponential","Error rates in current QC limit practical applicability"],
        futureScope: "As qubit counts and error correction improve (IBM 2029 roadmap: 100K physical qubits), Shor's attack becomes increasingly credible on RSA-2048.",
        industrialApps: ["National security threat modeling","Financial sector quantum risk assessments","Cryptographic protocol design","NIST PQC standardization rationale"],
        careerRelevance: "Critical knowledge for Quantum Security Analysts, Cryptographic Standards Auditors, and anyone designing secure systems beyond 2030."
      }}
      onNextTopic={() => { window.location.href = '/modules/4-shor-impact'; }}
    />
  );
}
