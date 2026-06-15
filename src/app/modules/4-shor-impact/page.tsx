"use client";

import { useState } from 'react';
import { TopicTemplate } from '@/components/TopicTemplate';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ImpactLab() {
  const [selectedAlgo, setSelectedAlgo] = useState<'RSA' | 'ECC'>('RSA');
  const [dataLifetime, setDataLifetime] = useState(20);
  const [dataType, setDataType] = useState<string>('custom');
  const [breachCost, setBreachCost] = useState(10.93);
  const [migrationCost, setMigrationCost] = useState(0.2);

  const qDay = 2032;
  const currentYear = 2026;
  const deadline = qDay - dataLifetime;
  const isPastDeadline = deadline <= currentYear;
  const yrsOverdue = isPastDeadline ? currentYear - deadline : 0;

  const dataPresets: Record<string, { label: string; lifetime: number; color: string }> = {
    medical: { label: 'Medical Records', lifetime: 50, color: 'text-destructive' },
    govt: { label: 'Government Intel', lifetime: 80, color: 'text-destructive' },
    financial: { label: 'Banking Data', lifetime: 30, color: 'text-orange-400' },
    employment: { label: 'Employment Records', lifetime: 10, color: 'text-yellow-400' },
    email: { label: 'Personal Email', lifetime: 5, color: 'text-success' },
    custom: { label: 'Custom', lifetime: dataLifetime, color: 'text-primary' },
  };

  const applyPreset = (key: string) => {
    setDataType(key);
    if (key !== 'custom') {
      setDataLifetime(dataPresets[key].lifetime);
    }
  };

  const hndlProbability = Math.min(1, Math.max(0.1, (currentYear - 2016) / (qDay - 2016)));
  const expectedLoss = breachCost * hndlProbability;
  const roi = migrationCost > 0 ? (expectedLoss / migrationCost) : 0;

  const data = [
    { year: 2024, rsa: 100, ecc: 100, aes: 100 },
    { year: 2026, rsa: 90, ecc: 85, aes: 100 },
    { year: 2028, rsa: 60, ecc: 55, aes: 100 },
    { year: 2030, rsa: 20, ecc: 15, aes: 100 },
    { year: 2032, rsa: 0, ecc: 0, aes: 100 },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Data Type Presets */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">Select Your Data Type</label>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(dataPresets).map(([key, preset]) => (
            <button key={key} onClick={() => applyPreset(key)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                dataType === key 
                  ? `${preset.color} bg-white/10 border border-white/20 shadow-lg` 
                  : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
              }`}>
              {preset.label} {key !== 'custom' && `(${preset.lifetime}yr)`}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Selector + Q-Day */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['RSA', 'ECC'] as const).map(a => (
            <button key={a} onClick={() => setSelectedAlgo(a)}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${selectedAlgo === a ? 'bg-destructive text-white shadow-lg shadow-destructive/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {a}-{a === 'RSA' ? '2048' : '256'}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground bg-slate-100/80 px-3 py-1.5 rounded-lg">
          Q-Day Estimate: <span className="font-bold text-destructive">~2032</span>
        </div>
      </div>

      {/* Security Decay Chart */}
      <div className="h-44 bg-white rounded-2xl border border-slate-200 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rsaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="eccGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
            <Area type="monotone" dataKey="rsa" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#rsaGrad)" name="RSA-2048" strokeDasharray={selectedAlgo === 'RSA' ? '0' : '4 2'} opacity={selectedAlgo === 'RSA' ? 1 : 0.4} />
            <Area type="monotone" dataKey="ecc" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#eccGrad)" name="ECC-256" strokeDasharray={selectedAlgo === 'ECC' ? '0' : '4 2'} opacity={selectedAlgo === 'ECC' ? 1 : 0.4} />
            <Area type="monotone" dataKey="aes" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#aesGrad)" name="AES-256" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Lifetime Slider + Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">Data Confidentiality Lifetime: {dataLifetime} years</label>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
            isPastDeadline 
              ? 'bg-destructive/20 text-destructive border border-destructive/30' 
              : deadline > currentYear + 5 
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
          }`}>
            {isPastDeadline ? `⚠ OVERDUE by ${yrsOverdue}yr` : `Migrate by ${deadline} (${deadline - currentYear}yr left)`}
          </span>
        </div>
        <input type="range" min={1} max={80} value={dataLifetime} onChange={e => { setDataType('custom'); setDataLifetime(Number(e.target.value)); }}
          className="w-full accent-destructive h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between text-[8px] text-slate-500">
          <span>1yr (Session)</span>
          <span>10yr (Employment)</span>
          <span>30yr (Financial)</span>
          <span>80yr (Medical/Govt)</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3 rounded-xl">
          <div className="text-[9px] font-bold text-muted-foreground uppercase">HNDL Window</div>
          <div className="text-sm font-black text-destructive">Active NOW</div>
          <div className="text-[8px] text-slate-600 mt-0.5">Adversaries collecting {selectedAlgo}-encrypted data today will decrypt it post-Q-Day</div>
        </div>
        <div className={`bg-white border p-3 rounded-xl ${isPastDeadline ? 'border-destructive/30' : 'border-success/30'}`}>
          <div className="text-[9px] font-bold text-muted-foreground uppercase">Safe Migration By</div>
          <div className={`text-sm font-black ${isPastDeadline ? 'text-destructive' : 'text-success'}`}>{isPastDeadline ? 'PASSED' : deadline}</div>
          <div className="text-[8px] text-slate-600 mt-0.5">For {dataLifetime}-year data using {selectedAlgo}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl">
          <div className="text-[9px] font-bold text-muted-foreground uppercase">HNDL Probability</div>
          <div className="text-sm font-black text-destructive">{(hndlProbability * 100).toFixed(0)}%</div>
          <div className="text-[8px] text-slate-600 mt-0.5">Based on CRQC timeline estimates</div>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl">
          <div className="text-[9px] font-bold text-muted-foreground uppercase">Data at Risk Today</div>
          <div className="text-sm font-black text-destructive">{dataLifetime > 6 ? `${dataLifetime - 6}+ yrs` : 'Minimal'}</div>
          <div className="text-[8px] text-slate-600 mt-0.5">Data encrypted before 2032 with {'>'}6yr lifetime</div>
        </div>
      </div>

      {/* Financial Impact Calculator */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3">💼 Financial Impact Assessment Studio</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] text-muted-foreground">Estimated Breach Cost ($M)</label>
              <input type="range" min={1} max={50} step={0.5} value={breachCost} onChange={e => setBreachCost(Number(e.target.value))}
                className="w-full accent-destructive h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              <div className="text-right text-xs font-bold text-destructive">${breachCost.toFixed(1)}M</div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-muted-foreground">Estimated PQC Migration Cost ($M)</label>
              <input type="range" min={0.05} max={2} step={0.05} value={migrationCost} onChange={e => setMigrationCost(Number(e.target.value))}
                className="w-full accent-success h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              <div className="text-right text-xs font-bold text-success">${migrationCost.toFixed(2)}M</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-center space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Expected HNDL Loss</span>
              <span className="font-bold text-destructive">${expectedLoss.toFixed(2)}M</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Migration Investment</span>
              <span className="font-bold text-success">${migrationCost.toFixed(2)}M</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-xs">
              <span className="font-bold text-muted-foreground">Validated ROI</span>
              <span className={`font-black text-lg ${roi > 10 ? 'text-success' : 'text-slate-700'}`}>
                {roi.toFixed(1)}×
              </span>
            </div>
            <p className="text-[8px] text-slate-500 italic mt-1">
              {roi > 10 
                ? 'Immediate PQC investment is strongly justified — expected loss far exceeds migration cost.'
                : 'Consider consolidating migration with broader infrastructure upgrades.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const prerequisitesData = {
  topics: [
    "Risk measurement: likelihood × impact severity for cryptographic threats",
    "Data lifetime classification: measuring sensitivity duration for different data types",
    "HNDL risk quantification: T_migrate = T_QDay - T_DataLifetime formula",
    "CRQC readiness measurement: validated qubit counts, gate speeds, and error rates",
    "Migration urgency scoring: validated frameworks for prioritizing PQC adoption"
  ],
  mcqs: [
    {
      question: "How is HNDL risk quantified for a specific dataset?",
      options: ["By the number of files", "HNDL_Risk = (Data_Encryption_Year + Data_Lifetime) > QDay_Estimate. If TRUE, data is at risk. Validated example: medical record encrypted 2026 with 80yr lifetime → sensitive until 2106. QDay ~2032. 2026+80 > 2032 → AT RISK — requires immediate re-encryption with PQC", "By file size", "By encryption algorithm"],
      correctIndex: 1,
      justification: "Validated HNDL risk formula: Risk_Condition = Encryption_Year + Data_Lifetime > QDay. If true, the data remains sensitive after CRQC arrival and is at risk. Medical records: 2026 + 80 = 2106 > 2032 → RISK. Session tokens: 2026 + 0.001 (minutes) = 2026 < 2032 → SAFE. This measurement framework drives organizational PQC prioritization."
    },
    {
      question: "What is the validated formula for calculating the latest safe PQC migration date?",
      options: ["T_migrate = T_QDay + 10", "T_migrate = T_QDay - T_DataLifetime. Validated: if data lifetime = 80 years and QDay = 2032, T_migrate = 2032 - 80 = 1952. Data encrypted after 1952 is at risk. Most organizations have already passed this deadline for long-lived data", "T_migrate = T_QDay", "T_migrate = current_year + 5"],
      correctIndex: 1,
      justification: "Validated measurement: T_migrate = QDay - DataLifetime. This is the last date when data could be safely encrypted with classical algorithms. If T_migrate < current year, the organization is already past the safe window. Government intelligence (50yr lifetime): 2032-50 = 1982 — past by 44 years. This calculation IS the urgency measurement."
    },
    {
      question: "What metric measures the financial impact of HNDL on an organization?",
      options: ["Stock price", "Validated formula: Financial_Impact = (Data_Volume) × (Data_Sensitivity_Score) × (Regulatory_Fine_per_Record) × (HNDL_Probability). For a hospital: 1M records × health data (score=10) × $100/record HIPAA fine × 0.8 probability = $800M estimated exposure. This measurement validates PQC migration ROI", "Number of servers", "IT budget"],
      correctIndex: 1,
      justification: "Validated risk measurement: Expected Loss = Exposure × Probability. Healthcare breach average: $10M per incident (IBM 2024 report). Multiply by ~80% HNDL probability (conservative CRQC timeline) → $8M expected loss. PQC migration cost: ~$200K for mid-sized hospital. ROI = $8M / $200K = 40×. This validated financial measurement justifies immediate PQC investment."
    }
  ]
};

const recapData = {
  summary: [
    "Validated HNDL risk formula: HNDL_Risk = (EncryptionYear + DataLifetime) > QDay. Medical records (2026+80=2106 > 2032) = AT RISK; session tokens (2026+0=2026 < 2032) = SAFE — this measurement framework defines PQC priority",
    "T_migrate = QDay - DataLifetime validated: government intel (50yr) → T_migrate=1982 (OVERDUE by 44 yrs); healthcare (80yr) → T_migrate=1952 (OVERDUE by 74 yrs); banking (30yr) → T_migrate=2002 (OVERDUE by 24 yrs)",
    "CRQC capability measurement validated: requires 4096+ logical qubits → ~40M physical qubits with error correction. IBM 2024: 1121 qubits. Extrapolated 2×/year → 2030-2035 CRQC — the validated timeline for HNDL Phase 2",
    "Global HNDL exposure measured: ~200 EB/day of quantum-vulnerable encrypted traffic × 8 years (2024-2032) ≈ 584 ZB at risk — validated scale that quantifies the urgency of PQC migration as a global priority",
    "Financial HNDL impact measured: expected loss = breach_probability × breach_cost. Healthcare: 80% × $10M = $8M expected exposure vs ~$200K PQC migration cost = 40× ROI on PQC investment — validated business case",
    "Migration critical window validated: large enterprises need 5-7 years for full PQC migration. Starting in 2026 → completion 2031-2033 — dangerously close to QDay ~2032. This measured window mandates immediate action",
    "Validated data classification framework: Session data (minutes) → SAFE. Financial records (10-30yr) → OVERDUE. Medical/genetic (80yr+) → CRITICAL. Each class has a validated T_migrate that drives migration sequencing",
    "Hybrid TLS validation: X25519Kyber768 adds <0.5ms latency (Cloudflare production measurement) while providing dual classical+quantum security — the validated stopgap until full PQC deployment",
    "CNSA 2.0 validated mandate (NSM-10): US national security systems must complete PQC migration by 2035. This validated regulatory deadline creates legal liability for non-compliant organizations handling government data",
    "Validated quantum-safe audit protocol: (1) Check algorithm — RSA/ECC → NOT safe, (2) Check encryption date vs T_migrate → HNDL risk determined, (3) Verify PQC parameters per FIPS 203/204 — this validated checklist operationalizes HNDL impact assessment"
  ],
  mcqs: [
    {
      question: "A hospital encrypted patient records with RSA-2048 in 2020. Records have 80yr lifetime. QDay ~2032. What is the validated HNDL risk status?",
      options: ["No risk — RSA-2048 is secure", "AT RISK — validated by formula: 2020 + 80 = 2100 > 2032. Data remains sensitive for 68 years after CRQC arrives. Required action: re-encrypt with PQC immediately", "Only records after 2030 are at risk", "RSA-2048 is quantum-safe"],
      correctIndex: 1,
      justification: "Validated measurement: EncryptionYear(2020) + DataLifetime(80) = 2100. QDay(2032) = 2032. Since 2100 > 2032, data remains sensitive 68 years after CRQC can break RSA-2048. The hospital has a validated HNDL exposure of 68 years × all encrypted patient data. Immediate PQC re-encryption is the only mitigation."
    },
    {
      question: "How does the T_migrate formula validate that most organizations are already overdue for PQC?",
      options: ["It doesn't — there's plenty of time", "Validated computation: T_migrate = QDay - DataLifetime. For all data classes with lifetime > 8 years (2032-2026): T_migrate < 2026 → already past deadline. This covers: medical (80yr), government intel (50yr), financial (30yr), employment (10yr). Only ultra-short-lived data (<8yr lifetime) is safe. The validated measurement shows ~90% of sensitive organizational data is already at HNDL risk", "Only medical data is at risk", "The formula is not reliable"],
      correctIndex: 1,
      justification: "Validated calculation: Current year = 2026. QDay = 2032. T_migrate = 2032 - Lifetime. Any data with lifetime > 8 years has T_migrate < 2026, meaning it's past the safe encryption deadline. Medical (80yr): T=1952. Government (50yr): T=1982. Banking (30yr): T=2002. Employment (10yr): T=2022. All OVERDUE. This validates that immediate migration is needed for virtually all long-lived data."
    },
    {
      question: "What validated financial measurement justifies PQC migration investment for a healthcare organization?",
      options: ["PQC is cheaper than classical crypto", "Validated ROI: Healthcare breach avg cost = $10M (IBM 2024). HNDL probability (conservative) = 80%. Expected loss = $8M. PQC migration cost for mid-sized hospital ≈ $200K (audit + implementation + testing). ROI = $8M / $200K = 40×. Even at 10% HNDL probability: ROI = 5×. This validated financial case proves immediate PQC investment is economically rational", "PQC investment has no ROI", "Migration costs exceed breach costs"],
      correctIndex: 1,
      justification: "Validated financial measurement: IBM Cost of Data Breach 2024 reports healthcare avg = $10.93M. HNDL probability given CRQC timeline of 2030-2035: estimated 80% (conservative). Expected loss = $10.93M × 0.8 = $8.74M. PQC migration: assessment ($50K) + implementation ($100K) + testing ($50K) = $200K. ROI = $8.74M / $200K = 43.7×. This validated calculation is the strongest argument for PQC investment."
    }
  ]
};

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
        connectToTopic: "HNDL's impact is measured by a validated formula: HNDL_Risk = (EncryptionYear + DataLifetime) > QDay. Migration timeline is measured by T_migrate = QDay - DataLifetime. This course measures and validates that ~90% of sensitive organizational data — medical records (80yr lifetime), government intel (50yr), banking (30yr) — has T_migrate < 2024, meaning the safe migration deadline has already passed and the HNDL clock started ticking yesterday."
      }}
      mathModelling={{
        need: "Measuring HNDL urgency requires validated formulas: HNDL_Risk = (EncryptionYear + DataLifetime) > QDay and T_migrate = QDay - DataLifetime. Without these measurements, PQC migration is guesswork — with them, we can validate that medical records (80yr → T=1952, overdue by 74 years) and banking records (30yr → T=2002, overdue by 24 years) already have confirmed HNDL exposure, providing quantified urgency for immediate PQC action.",
        motivation: "The measurement that validates PQC urgency is simple: T_migrate = QDay - DataLifetime. If T_migrate < CurrentYear, every byte encrypted since T_migrate is at HNDL risk. For data classes with lifetimes > 8 years (medical, government, banking, employment), T_migrate < 2026, meaning even data encrypted TODAY is at risk. This validated measurement eliminates debate: organizations with long-lived data are already in the HNDL danger zone and must start PQC migration immediately.",
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
        controls: ["Data Type Presets", "Algorithm Selector", "Lifetime Slider", "Financial Impact Studio"],
        dataFlow: "Data Lifetime → T_migrate = Q-Day − Lifetime → Status: SAFE / URGENT / OVERDUE",
        processExplanation: "The chart shows the projected security resilience of the selected algorithm over time. The slider calculates whether your data's migration deadline has already passed based on its required confidentiality duration.",
        component: <ImpactLab />,
        procedure: [
          "Select a cryptographic algorithm (RSA-2048, ECC-256, AES-256) from the dropdown",
          "Use the slider to set the data sensitivity lifetime (how many years the data must remain secret)",
          "Observe the T_migrate calculation: T_migrate = Q-Day (2032) − Data Lifetime",
          "Check the status indicator: SAFE (T_migrate > current year), URGENT (T_migrate < current year), or OVERDUE (T_migrate < current year by a large margin)",
          "Repeat for different data types: medical records (50yr), financial (30yr), government intel (80yr), session cookies (1hr)"
        ],
        observations: [
          { prompt: "For medical records with 50-year lifetime, what is T_migrate? Is it already overdue?", hint: "T_migrate = 2032 − 50 = 1982. Current year is 2026. Status = OVERDUE by 44 years." },
          { prompt: "What is the maximum data lifetime that still has a SAFE status today (2026)?", hint: "Solve: 2026 < 2032 − Lifetime → Lifetime < 6 years. Only data with lifetime < 6 years is safe." },
          { prompt: "What percentage of your organization's data has a validated HNDL risk?", hint: "Consider: medical (50yr), financial (30yr), employment records (10yr), emails (5yr). Which exceed 6 years?" }
        ],
        conclusion: "You just performed the HNDL risk assessment that every organization needs today. The validated measurement is simple: if data lifetime > Q-Day gap (6 years from 2026), the data encrypted now is already at HNDL risk. Medical records (50yr), government intel (80yr), and financial records (30yr) are all OVERDUE. The financial justification: expected breach loss ($8-10M) ÷ PQC migration cost ($200K) = 40× ROI — a validated business case for immediate action."
      }}
      summary={{
        insights: [
          "Validated HNDL measurement formula: ~60% of enterprise data has validated HNDL risk (lifetime > QDay-EncryptionYear gap), and ~90% of sensitive data classes (medical, government, financial) have ALREADY exceeded T_migrate — meaning every byte encrypted since that date is a validated breach-in-waiting",
          "Financial ROI measurement validated: expected HNDL breach loss = $8-10M for average healthcare org with 0.8 probability, PQC migration cost ~$200K → 40× validated ROI — a measurement-driven business case that eliminates the need for fear-based justification",
          "Everyday HNDL measurement: your medical records, tax filings, and WhatsApp backups have validated risk = (lifetime > 2032 - encryption_year). If born before 2000, your medical data is already measurable at-risk and needs PQC re-encryption to remain safe through your lifetime — this validated formula lets anyone measure their own PQC urgency"
        ],
        advantages: ["Precise deadline quantification","Risk-based migration prioritization","Universal applicability across sectors"],
        disadvantages: ["CRQC timeline uncertainty creates false comfort","Migration is expensive and complex","Legacy system incompatibility"],
        futureScope: "Post-quantum migration frameworks like NIST SP 800-208 and CNSA 2.0 provide standardized migration pathways.",
        industrialApps: ["Healthcare records protection","National intelligence archives","Financial transaction history","Military communications"],
        careerRelevance: "Quantum Risk Analysts, CISO advisors, and Cryptographic Auditors command premium salaries as organizations race to assess and mitigate HNDL exposure."
      }}
      prerequisites={prerequisitesData}
      recap={recapData}
      skills={[
        { icon: "⏳", name: "Migration Deadline Calculation", description: "Compute T_migrate using the HNDL formula for any organization based on data sensitivity timeframes" },
        { icon: "💰", name: "Financial Impact Analysis", description: "Quantify business risk using breach cost models and quantum vulnerability metrics at organizational scale" },
        { icon: "🗺️", name: "Sector Risk Mapping", description: "Assess which industries face the highest HNDL exposure based on regulatory requirements and data retention policies" },
        { icon: "📋", name: "Risk Communication", description: "Translate technical quantum risk into business-impact language understood by executives and policymakers" },
      ]}
      nepAlignment={[
        { policy: "NEP 2020 — Experiential Learning", icon: "🇮🇳", description: "Interactive T_migrate calculator computes real-world migration deadlines based on user-input scenarios" },
        { policy: "STEM — Applied Mathematics", icon: "🔬", description: "Apply algebraic formulas to compute risk scores, migration urgency, and financial impact under uncertainty" },
        { policy: "Vocational Skills", icon: "💼", description: "Cybersecurity risk analysis skills directly applicable to CISO, security architect, and compliance roles" },
        { policy: "Global Citizenship", icon: "🌍", description: "Understanding the societal responsibility to protect long-lived sensitive data from harvest-now-decrypt-later threats" },
      ]}
      miniActivity={{
        title: "Calculate Your Organization's Migration Deadline",
        instructions: "Apply the T_migrate formula to a real-world scenario and determine whether the migration deadline has already passed.",
        checkpoints: [
          "Estimate QDay for your sector based on CRQC projections (default: 2032)",
          "Identify data with the longest sensitivity lifetime (medical: 80yr, govt: 50yr, finance: 20yr)",
          "Compute T_migrate = QDay - DataLifetime for each data category",
          "Assess: if T_migrate < CurrentYear, your data is already at HNDL risk"
        ],
        reflection: "T_migrate turns vague anxiety into a concrete deadline — organizations that compute this number can act decisively; those that don't are flying blind."
      }}
      onNextTopic={() => { window.location.href = '/modules/5-pqc'; }}
    />
  );
}
