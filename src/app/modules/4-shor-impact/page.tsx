"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopicTemplate } from '@/components/TopicTemplate';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ImpactLab() {
  const [selectedAlgo, setSelectedAlgo] = useState<'RSA' | 'ECC'>('RSA');
  const [dataLifetime, setDataLifetime] = useState(20);

  const data = [
    { year: 2024, security: 100 },
    { year: 2026, security: 90 },
    { year: 2028, security: 60 },
    { year: 2030, security: 20 },
    { year: 2032, security: 0 },
  ];

  const qDay = 2032;
  const deadline = qDay - dataLifetime;
  const isPastDeadline = deadline <= 2024;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-3">
          {(['RSA', 'ECC'] as const).map(a => (
            <button key={a} onClick={() => setSelectedAlgo(a)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${selectedAlgo === a ? 'bg-destructive text-white' : 'bg-slate-800 text-slate-400'}`}>
              {a}-{a === 'RSA' ? '2048' : '256'}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Projected Q-Day: ~2032</div>
      </div>

      <div className="h-48 bg-slate-950 rounded-2xl border border-slate-800 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="security" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#secGrad)" name={`${selectedAlgo} Security`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase">Your Data Lifetime: {dataLifetime} years</label>
          <span className={`text-xs font-bold px-2 py-1 rounded ${isPastDeadline ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
            {isPastDeadline ? '⚠ Migration OVERDUE' : `Migrate by ${deadline}`}
          </span>
        </div>
        <input type="range" min={1} max={50} value={dataLifetime} onChange={e => setDataLifetime(Number(e.target.value))}
          className="w-full accent-destructive h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-bold text-muted-foreground mb-1">HNDL Window</div>
          <div className="text-lg font-black text-destructive">Active NOW</div>
          <div className="text-[10px] text-slate-500 mt-1">Adversaries collecting encrypted data today</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-bold text-muted-foreground mb-1">Safe Migration Deadline</div>
          <div className={`text-lg font-black ${isPastDeadline ? 'text-destructive' : 'text-success'}`}>{isPastDeadline ? 'PASSED' : deadline}</div>
          <div className="text-[10px] text-slate-500 mt-1">For {dataLifetime}-year sensitive data</div>
        </div>
      </div>
    </div>
  );
}

export default function ShorImpactModule() {
  return (
    <TopicTemplate
      topicId="4-1"
      topicName="Harvest Now, Decrypt Later (HNDL)"
      story={{
        title: "The Locked Chest in Grandfather's Attic",
        content: "In 1950, a spy locked a chest full of state secrets and mailed it to a trusted friend. 'No one can open this,' he said, 'not for a hundred years.' The friend kept it in the attic. Decades passed. The chest sat unopened — perfectly secure. But in 2032, a scientist built a Quantum Key that could open ANY chest of that design in minutes. The spy's secrets, perfectly preserved for 82 years, were suddenly exposed overnight. The thief didn't need to break in back in 1950. He just needed to wait.",
        analogy: "The locked chest = encrypted network traffic intercepted today. The spy's secrets = medical records, government intelligence, financial data. The Quantum Key = a CRQC running Shor's Algorithm. Waiting = the HNDL strategy being executed right now by nation-state adversaries.",
        reflectiveQuestions: [
          "If someone steals your encrypted data today, is your data safe just because they can't read it yet?",
          "What types of information remain sensitive for 20+ years?",
          "If Q-Day is in 10 years, when was the last safe day to encrypt banking records with RSA-2048?"
        ],
        connectToTopic: "HNDL is not a future threat — it is a present one. Nation-state actors are vacuuming up encrypted traffic today. The migration window for data with long sensitivity lifetimes has already closed or is closing rapidly."
      }}
      mathModelling={{
        need: "Quantifying the urgency of migration by mapping data lifetime to CRQC timeline.",
        motivation: "Security is not just about present confidentiality but about future confidentiality. The threat model must include both the data lifetime and the quantum hardware development timeline.",
        challenges: {
          realWorld: "Medical records (80-year lifetime), government secrets (50-year lifetime), and financial transaction histories (30-year lifetime) are all at risk from data already intercepted.",
          technical: "Current estimates place CRQC capability at RSA-2048 scale between 2030-2035 based on IBM, Google, and IonQ roadmaps. The uncertainty itself is the danger."
        },
        advantages: ["Precise urgency quantification", "Data-driven migration prioritization", "Risk-based cost justification"],
        limitations: ["CRQC timeline is uncertain", "Migration costs are non-trivial", "Legacy system compatibility challenges"],
        equations: [
          {
            latex: "T_{migrate} < T_{QDay} - T_{DataLifetime}",
            symbols: {
              "T_{migrate}": "Latest acceptable date to complete PQC migration",
              "T_{QDay}": "Estimated year a CRQC breaks RSA-2048 (est. ~2032)",
              "T_{DataLifetime}": "Number of years data must remain confidential"
            },
            meaning: "The migration must be completed before the gap between Q-Day and data expiry runs out.",
            whyNeeded: "This formula gives organizations a precise, calculable deadline — not just a vague warning.",
            interpretation: "For medical records (lifetime=50 years) stored today and Q-Day=2032: Migrate by 2032-50 = 1982. Already past! For short-lived OTPs (lifetime=1 min): no urgency.",
            numericalExample: "Government Intelligence: lifetime = 50 years\nT_migrate < 2032 - 50 = 1982 → ALREADY TOO LATE\n\nFinancial Records: lifetime = 10 years\nT_migrate < 2032 - 10 = 2022 → ALSO PAST\n\nSoftware License: lifetime = 2 years\nT_migrate < 2032 - 2 = 2030 → 6 years remaining\n\nConclusion: Most sensitive data categories have ALREADY passed their safe migration window."
          }
        ],
        simulationResults: "The interactive timeline below lets you adjust data lifetime to see if your migration deadline has passed."
      }}
      abl={[
        {
          level: 1,
          title: "The Sealed Envelope Demo",
          objective: "Make the HNDL concept viscerally real with a physical demonstration.",
          time: "10 Mins",
          materials: ["Sealed envelope","Future date label"],
          instructions: [
            "Seal a written 'secret' inside an envelope. Label it 'Open in 2035'.",
            "Hand it to a student: 'This is completely secure today — you lack the key to open it.'",
            "Now ask: 'If I take this from you right now and store it, am I a threat?'",
            "Reveal: 'In 2032, I will have a Quantum Key. I don't need to open it now.'",
            "Connect: This is what nation-states are doing with our HTTPS traffic today."
          ],
          expectedOutput: "Students understand that data theft and data decryption are separated in time under HNDL.",
          assessmentRubrics: ["Can explain the time-delay aspect of HNDL","Connects to real data types voluntarily"]
        },
        {
          level: 2,
          title: "Migration Deadline Calculator",
          objective: "Apply the T_migrate formula to real-world data categories.",
          time: "20 Mins",
          materials: ["Whiteboard","Calculator"],
          instructions: [
            "Teacher draws a table: Data Type | Lifetime | T_migrate | Status",
            "Together, fill in: Medical Records (80yr), Banking History (30yr), Government Intel (50yr), OTP (1min)",
            "Calculate T_migrate = Q-Day (2032) - Lifetime for each",
            "Mark each as 'SAFE', 'URGENT', or 'OVERDUE'",
            "Discuss: what percentage of the world's sensitive data is already in the OVERDUE category?"
          ],
          expectedOutput: "Students derive that most high-sensitivity data categories are already past their safe migration window.",
          assessmentRubrics: ["Correct formula application","Correct categorization","Quality of discussion"]
        },
        {
          level: 3,
          title: "Sector Vulnerability Mapping",
          objective: "Identify which industry sectors face the highest HNDL risk.",
          time: "20 Mins",
          materials: ["Industry cards (Healthcare, Finance, Defence, IoT, Telecom)"],
          instructions: [
            "Divide into 5 groups, each assigned an industry sector.",
            "For your sector: list the 3 most sensitive data types and their lifetimes.",
            "Calculate T_migrate for each and present to the class.",
            "The class votes on: which sector needs to migrate MOST urgently?"
          ],
          expectedOutput: "A class-wide risk map showing which sectors face immediate HNDL threats.",
          assessmentRubrics: ["Sector research quality","Correct timeline calculation","Presentation clarity"]
        },
        {
          level: 4,
          title: "Personal HNDL Audit",
          objective: "Use the Virtual Lab to determine your personal digital risk profile.",
          time: "15 Mins",
          materials: ["Virtual Lab (below)","Reflection notebook"],
          instructions: [
            "Set Data Lifetime slider to reflect your most sensitive data (e.g., college transcripts = 30 years).",
            "Observe the Migration Deadline output.",
            "Switch between RSA-2048 and ECC-256 — note that ECC falls slightly earlier.",
            "Write: 'Three digital services I use that are sending data vulnerable to HNDL today, and what I would demand from them.'"
          ],
          expectedOutput: "A written personal risk assessment with concrete demands for PQC adoption.",
          assessmentRubrics: ["Self-awareness of digital footprint","Correct use of T_migrate formula","Specificity of written demands"]
        }
      ]}
      pbl={{
        scope: "Develop a 'Quantum Readiness Assessment' service for a mid-sized enterprise — a structured audit methodology and report template.",
        feasibility: "High — primarily research, analysis, and documentation. No advanced implementation required.",
        risks: [
          {description:"Inaccurate CRQC timeline assumptions", level:"High"},
          {description:"Scope limited to one industry sector", level:"Low"},
          {description:"Outdated NIST standard citations", level:"Medium"}
        ],
        budget: "₹0 — research-based academic project",
        timeline: "2 Weeks",
        objectives: [
          "Define a 5-step Quantum Readiness Assessment methodology",
          "Create data inventory and sensitivity classification framework",
          "Produce a sample assessment report for a hypothetical hospital"
        ],
        outcomes: [
          "Published assessment framework document",
          "Sample hospital Quantum Readiness Report",
          "Migration priority roadmap with cost estimates"
        ],
        milestones: [
          {date:"Day 3", task:"Literature review: NIST, NSA, ENISA quantum readiness guides"},
          {date:"Day 6", task:"Design 5-step assessment methodology"},
          {date:"Day 9", task:"Apply methodology to hypothetical hospital case"},
          {date:"Day 11", task:"Draft migration roadmap and cost estimation"},
          {date:"Day 14", task:"Final report and class presentation"}
        ],
        teamRoles: {
          "Methodology Lead": "Design the 5-step assessment framework",
          "Industry Analyst": "Research hospital-specific cryptographic dependencies",
          "Risk Modeller": "Apply T_migrate calculations and categorize urgency",
          "Report Writer": "Compile and format the final assessment document"
        }
      }}
      questions={[
        {
          type: "Conceptual",
          text: "Explain the 'Harvest Now, Decrypt Later' threat model. Why is it active today and not just a future concern?",
          answer: "HNDL means adversaries intercept and store encrypted ciphertext today, planning to decrypt it once a CRQC is available. It is active today because the data collection phase requires no quantum capability — only standard network interception. The decryption capability comes later.",
          explanation: "The two-phase attack separates collection (present) from decryption (future). Data with long sensitivity lifetimes (medical, government, financial) is already compromised because its T_migrate < current year.",
          keyPoints: ["Two-phase attack: collect now, decrypt later","Data lifetime vs. CRQC timeline","Already past migration window for most sensitive data"],
          commonMistakes: ["Thinking HNDL only matters after Q-Day","Ignoring data lifetime in threat assessment"],
          tips: ["HNDL = the threat where the clock started ticking YESTERDAY, not tomorrow."]
        },
        {
          type: "Numerical",
          text: "A bank encrypts customer records with RSA-2048. These records must remain confidential for 15 years. If Q-Day is estimated at 2032, has the bank's safe migration deadline passed?",
          answer: "Yes. T_migrate = 2032 - 15 = 2017. The deadline was 2017 — 7 years ago.",
          explanation: "Any record encrypted after 2017 and stored for 15 years will still be sensitive in 2032 when a CRQC can break RSA-2048. The bank must migrate immediately and re-encrypt historical data.",
          keyPoints: ["T_migrate formula","Historical data re-encryption urgency","Immediate action required"],
          commonMistakes: ["Calculating T_migrate as Q-Day + lifetime","Thinking only new data is at risk"],
          tips: ["Migration deadline = Q-Day MINUS lifetime. If that date is in the past, you're already late."]
        }
      ]}
      virtualLab={{
        title: "HNDL Timeline Calculator",
        description: "Calculate your data migration deadline based on sensitivity lifetime and projected Q-Day.",
        controls: ["Select Algorithm", "Adjust Data Lifetime"],
        dataFlow: "Data Lifetime → T_migrate = Q-Day − Lifetime → Status: SAFE / URGENT / OVERDUE",
        processExplanation: "The chart shows the projected security resilience of the selected algorithm over time. The slider calculates whether your data's migration deadline has already passed based on its required confidentiality duration.",
        component: <ImpactLab />
      }}
      summary={{
        insights: [
          "HNDL is the most immediate quantum security threat — it's happening now",
          "Most high-sensitivity data categories are already past safe migration deadlines",
          "The collection phase requires no quantum hardware — just standard interception"
        ],
        advantages: ["Precise deadline quantification","Risk-based migration prioritization","Universal applicability across sectors"],
        disadvantages: ["CRQC timeline uncertainty creates false comfort","Migration is expensive and complex","Legacy system incompatibility"],
        futureScope: "Post-quantum migration frameworks like NIST SP 800-208 and CNSA 2.0 provide standardized migration pathways.",
        industrialApps: ["Healthcare records protection","National intelligence archives","Financial transaction history","Military communications"],
        careerRelevance: "Quantum Risk Analysts, CISO advisors, and Cryptographic Auditors command premium salaries as organizations race to assess and mitigate HNDL exposure."
      }}
      onNextTopic={() => { window.location.href = '/modules/5-pqc'; }}
    />
  );
}
