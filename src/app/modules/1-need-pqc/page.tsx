"use client";

import { TopicTemplate } from '@/components/TopicTemplate';
import { useState } from 'react';
import { motion } from 'framer-motion';

const prerequisitesData = {
  topics: [
    "Basic number theory: prime numbers, factors, and divisibility",
    "Modular arithmetic: modulo operation and modular equivalence",
    "Exponential functions: understanding growth rates (linear vs exponential)",
    "Fundamental understanding of what encryption means",
    "Familiarity with the concept of computational hardness"
  ],
  mcqs: [
    {
      question: "What is the defining property of a prime number?",
      options: ["It is divisible by 2", "It has exactly two distinct positive divisors: 1 and itself", "It is always odd", "It can be factored into smaller integers"],
      correctIndex: 1,
      justification: "A prime number is a positive integer greater than 1 that has no positive divisors other than 1 and itself. For example, 7 is prime because only 1 and 7 divide it evenly."
    },
    {
      question: "What does 'a mod n' represent?",
      options: ["The quotient when a is divided by n", "The remainder when a is divided by n", "The product of a and n", "The sum of a and n"],
      correctIndex: 1,
      justification: "The modulo operation 'a mod n' returns the remainder after dividing a by n. For example, 17 mod 5 = 2 because 17 ÷ 5 = 3 with remainder 2."
    },
    {
      question: "Which of the following best describes exponential growth?",
      options: ["Growth that adds a constant amount each step", "Growth that multiplies by a constant factor each step", "Growth that decreases over time", "Growth that stays the same each step"],
      correctIndex: 1,
      justification: "Exponential growth means the quantity multiplies by a constant factor at each step. For example, f(x) = 2^x doubles each time x increases by 1."
    },
    {
      question: "What is the fundamental purpose of encryption?",
      options: ["To delete data permanently", "To convert readable data into an unreadable form that can only be reversed with a key", "To compress data for storage", "To duplicate data for backup"],
      correctIndex: 1,
      justification: "Encryption transforms plaintext into ciphertext using an algorithm and key. Only someone with the correct key can decrypt it back to the original message."
    },
    {
      question: "What does 'computational hardness' mean in cryptography?",
      options: ["A problem that cannot be solved even with infinite time", "A problem that requires too much time or resources to solve in practice, even though a solution exists", "A problem with no known algorithm", "A problem that is impossible to state mathematically"],
      correctIndex: 1,
      justification: "A computationally hard problem has a solution, but the time/resources needed to find it exceed practical limits. RSA security relies on the hardness of factoring large numbers."
    },
    {
      question: "What is the result of 23 mod 7?",
      options: ["2", "3", "4", "5"],
      correctIndex: 0,
      justification: "23 ÷ 7 = 3 with remainder 2. Therefore, 23 mod 7 = 2."
    },
    {
      question: "If a function has a 'period' of r, what does that mean?",
      options: ["The function never repeats", "The function repeats its values every r steps", "The function increases by r each step", "The function decreases by r each step"],
      correctIndex: 1,
      justification: "A periodic function repeats its values at regular intervals. If period = r, then f(x + r) = f(x) for all x. This is the key insight Shor's algorithm exploits."
    },
    {
      question: "Why is multiplication considered 'easy' but factoring considered 'hard'?",
      options: ["Multiplication requires more steps", "Given a product, finding the original factors has no efficient algorithm for large numbers", "Factoring is taught before multiplication", "Multiplication is not used in cryptography"],
      correctIndex: 1,
      justification: "Multiplying two large primes (e.g., 17 × 23 = 391) is fast. But given 391, finding the two prime factors (17 and 23) becomes exponentially harder as numbers grow."
    },
    {
      question: "What is a 'one-way function'?",
      options: ["A function that can be computed in one direction but is infeasible to reverse", "A function that only works one time", "A function with no output", "A function that reverses itself automatically"],
      correctIndex: 0,
      justification: "A one-way function is easy to compute in the forward direction but computationally infeasible to invert. Mixing red and blue to get purple is a good analogy — easy to mix, hard to unmix."
    },
    {
      question: "How does a classical computer find the period of a function?",
      options: ["By using quantum superposition", "By computing values one at a time until the pattern repeats", "By guessing randomly", "By using a Fourier transform on analog signals"],
      correctIndex: 1,
      justification: "Classical computers must compute f(1), f(2), f(3), ... one by one until the pattern repeats. For large functions, this takes an enormous number of steps. Quantum computers use superposition to do this in parallel."
    }
  ]
};

const recapData = {
  summary: [
    "Classical cryptography like RSA relies on the computational hardness of factoring large composite numbers into their prime factors",
    "Shor's Algorithm transforms the factoring problem into a period-finding problem, which quantum computers can solve efficiently",
    "The Quantum Fourier Transform (QFT) allows quantum computers to extract the period of a function using constructive and destructive interference",
    "A function f(x) = a^x mod N is periodic — its values repeat every 'r' steps, and finding this 'r' is the key to breaking RSA",
    "Classical period-finding requires checking values sequentially (exponential time), while quantum period-finding uses superposition (polynomial time)",
    "The modular exponentiation function creates a repeating pattern; the period r is found when f(x + r) = f(x) for all x",
    "Once the period r is known, simple GCD operations can recover the prime factors p and q from N",
    "This represents an exponential speedup: from O(e^{n^{1/3}}) classical to O(n³) quantum for factoring 2048-bit numbers",
    "Classical cryptographic security is based on mathematical assumptions that quantum computing fundamentally breaks",
    "RSA-2048, which would take classical computers 300 trillion years to factor, could be broken in hours on a cryptographically relevant quantum computer"
  ],
  mcqs: [
    {
      question: "What does Shor's Algorithm convert the factoring problem into?",
      options: ["A graph traversal problem", "A period-finding problem", "A sorting problem", "An optimization problem"],
      correctIndex: 1,
      justification: "Shor's Algorithm cleverly transforms integer factorization into period-finding. Quantum computers excel at finding periods using the Quantum Fourier Transform, whereas classical computers struggle."
    },
    {
      question: "What is the period 'r' in the context of f(x) = a^x mod N?",
      options: ["The number of factors of N", "The smallest positive integer such that a^r ≡ 1 (mod N)", "The value of a when x = 0", "The product of p and q"],
      correctIndex: 1,
      justification: "The period r is the smallest positive integer where the function repeats: a^r mod N = 1. For example, with a=7, N=15, the sequence 7,4,13,1 repeats, so r=4."
    },
    {
      question: "Why can't increasing RSA key sizes protect against Shor's Algorithm?",
      options: ["Because Shor's is also exponential for larger keys", "Because Shor's complexity is O(n³), which grows only polynomially with key length", "Because key sizes cannot be increased", "Because RSA doesn't use keys"],
      correctIndex: 1,
      justification: "Shor's algorithm scales polynomially (O(n³)) with the bit-length of N. Doubling the key size only makes Shor's 8× harder, while classical factoring becomes exponentially harder."
    },
    {
      question: "What role does the Quantum Fourier Transform (QFT) play in Shor's Algorithm?",
      options: ["It encrypts the data", "It extracts the period from the quantum superposition", "It generates random numbers", "It verifies digital signatures"],
      correctIndex: 1,
      justification: "The QFT converts the quantum state from the 'time domain' (where values are distributed across all x) to the 'frequency domain,' where the period r appears as a sharp, measurable peak."
    },
    {
      question: "What is the estimated time for a classical computer to factor RSA-2048?",
      options: ["About 1 year", "About 300 trillion years", "About 1000 years", "About 1 million years"],
      correctIndex: 1,
      justification: "The best classical algorithm (GNFS) would take approximately 300 trillion years to factor RSA-2048, whereas Shor's algorithm on a CRQC could do it in about 8 hours."
    },
    {
      question: "After finding the period r, how do we recover the prime factors of N?",
      options: ["By multiplying r by N", "By computing GCD(a^(r/2) ± 1, N)", "By dividing N by r", "By taking the square root of N"],
      correctIndex: 1,
      justification: "Using the period r, we compute GCD(a^(r/2) + 1, N) and GCD(a^(r/2) − 1, N). One of these yields a non-trivial factor of N."
    },
    {
      question: "Why is Shor's Algorithm considered an 'exponential speedup'?",
      options: ["It is only slightly faster than classical methods", "It changes the complexity class from exponential to polynomial", "It requires exponential memory", "It uses exponential energy"],
      correctIndex: 1,
      justification: "Shor's moves factoring from the exponential complexity class (infeasible for large inputs) to polynomial class (feasible). This is the most dramatic type of speedup possible."
    },
    {
      question: "What is the function used in Shor's period-finding step?",
      options: ["f(x) = x² mod N", "f(x) = a^x mod N", "f(x) = log(x) mod N", "f(x) = √x mod N"],
      correctIndex: 1,
      justification: "Shor's uses the modular exponentiation function f(x) = a^x mod N, where 'a' is a randomly chosen number coprime to N. This function is periodic, and its period reveals the factors."
    },
    {
      question: "What is a 'CRQC'?",
      options: ["Central Research Quantum Computer", "Cryptographically Relevant Quantum Computer — one capable of breaking RSA-2048", "Classical Reduced Quantum Computer", "Certified Random Quantum Circuit"],
      correctIndex: 1,
      justification: "A CRQC is a quantum computer with enough stable qubits and low error rates to run Shor's algorithm on RSA-2048 scale numbers. Estimates place this capability at 2030-2035."
    },
    {
      question: "How does quantum superposition help Shor's Algorithm?",
      options: ["It stores the result on a classical hard drive", "It allows computing f(x) for all x simultaneously in parallel", "It encrypts the computation", "It reduces the need for error correction"],
      correctIndex: 1,
      justification: "Superposition allows the quantum computer to evaluate f(x) = a^x mod N for all possible values of x simultaneously using a single quantum circuit, instead of checking each x one at a time."
    }
  ]
};

const ShorSimulation = () => {
    const [x, setX] = useState(1);
    const [a] = useState(7);
    const [N] = useState(15);
    const [history, setHistory] = useState<any[]>([]);

    const step = () => {
      const result = (Math.pow(a, x) % N);
      setHistory(prev => [...prev.slice(-5), { x, result }]);
      setX(prev => prev + 1);
    };

    return (
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base md:text-xl font-bold text-primary">Shor's Period Finding Simulator</h3>
          <button 
            onClick={step}
            className="self-stretch sm:self-auto px-4 md:px-6 py-1.5 md:py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs md:text-sm hover:scale-105 transition-all"
          >
            Compute Next f(x)
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8">
          <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-lg md:rounded-xl">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mb-2 md:mb-4">Calculation: f(x) = 7^x mod 15</div>
            <div className="space-y-1 md:space-y-2">
              {history.map((h, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={i} 
                  className="flex justify-between text-[11px] md:text-sm font-mono border-b border-slate-800 pb-1"
                >
                  <span className="text-slate-500">x={h.x}</span>
                  <span className="text-primary font-bold">{h.result}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-lg md:rounded-xl">
            <div className="text-3xl md:text-4xl font-black text-white mb-1 md:mb-2">r = 4</div>
            <div className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-widest">Detected Period</div>
            <p className="mt-2 md:mt-4 text-[10px] text-center text-slate-400">
              In a Quantum Computer, the Quantum Fourier Transform (QFT) finds this '4' almost instantly. 
              Knowing '4' allows us to factor 15 into 3 and 5 easily.
            </p>
          </div>
        </div>
      </div>
    );
  };

export default function NeedPQCModule() {
  return (
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
        connectToTopic: "Our entire digital world (HTTPS, Banking, VPNs) is built on 'Prime Safes'. Shor's Algorithm is the 'Frequency Glasses' that finds the hidden periodicity in our encryption math, making the impossible factoring problem trivial."
      }}
      mathModelling={{
        need: "Classical RSA security relies on the fact that factoring a large number N = p*q is 'Hard'.",
        motivation: "If we can find the 'period' of a modular function, we can factor N easily. Classical computers must check every number. Quantum computers use physics to see the whole pattern at once.",
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
        controls: ["Compute Step", "Reset Simulator"],
        dataFlow: "Input Integer -> Modular Exponentiation -> QFT Waveform -> Period Extraction",
        processExplanation: "While a classical computer checks each point one by one, the QFT uses constructive interference to make the 'period' peak stand out from the noise.",
        component: <ShorSimulation />
      }}
      summary={{
        insights: [
          "Classical security is a temporary island — today's encrypted data may be tomorrow's plaintext",
          "Physics can solve math problems: Shor's exploits quantum mechanics, not faster transistors",
          "Everyday: your HTTPS sessions, VPNs, and encrypted emails all depend on factoring being hard — Shor's breaks that assumption"
        ],
        advantages: ["Provides transition path to PQC", "Standardizes threat models"],
        disadvantages: ["High computational overhead", "Hardware dependency"],
        futureScope: "Implementation of Shor's on 10,000+ logical qubits.",
        industrialApps: ["Cryptographic Auditing", "Secure Communication Design", "HTTPS/TLS Infrastructure Review"],
        careerRelevance: "Essential for Quantum Security Engineers and Cryptographers — a field projected to have 2M+ unfilled roles by 2030."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      onNextTopic={() => {}}
    />
  );
}
