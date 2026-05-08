"use client";

import { TopicTemplate } from '@/components/TopicTemplate';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NeedPQCModule() {
  const [activeStep, setActiveStep] = useState(0);

  // Virtual Lab Simulation Component
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
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">Shor's Period Finding Simulator</h3>
          <button 
            onClick={step}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:scale-105 transition-all"
          >
            Compute Next f(x)
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-4">Calculation: f(x) = 7^x mod 15</div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={i} 
                  className="flex justify-between text-sm font-mono border-b border-slate-800 pb-1"
                >
                  <span className="text-slate-500">x={h.x}</span>
                  <span className="text-primary font-bold">{h.result}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="text-4xl font-black text-white mb-2">r = 4</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Detected Period</div>
            <p className="mt-4 text-[10px] text-center text-slate-400">
              In a Quantum Computer, the Quantum Fourier Transform (QFT) finds this '4' almost instantly. 
              Knowing '4' allows us to factor 15 into 3 and 5 easily.
            </p>
          </div>
        </div>
      </div>
    );
  };

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
        insights: ["Classical security is a temporary island", "Physics can solve math problems"],
        advantages: ["Provides transition path to PQC", "Standardizes threat models"],
        disadvantages: ["High computational overhead", "Hardware dependency"],
        futureScope: "Implementation of Shor's on 10,000+ logical qubits.",
        industrialApps: ["Cryptographic Auditing", "Secure Communication Design"],
        careerRelevance: "Essential for Quantum Security Engineers and Cryptographers."
      }}
      onNextTopic={() => {}}
    />
  );
}
