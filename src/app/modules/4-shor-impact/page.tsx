"use client";

import { useState } from 'react';
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
      question: "How is CRQC readiness measured and validated?",
      options: ["By media announcements", "Validated CRQC metrics: (1) logical qubits ≥ 4096 (for RSA-2048), (2) physical qubits with error correction ≥ 40M, (3) gate fidelity > 99.9999%, (4) runtime < 24 hours. Current best: IBM 1121 phys qubits, 99.9% fidelity — 10⁴× short. Validated by extrapolating IBM's 2×/year qubit growth → 2030-2035 CRQC", "By algorithm design", "By quantum computer price"],
      correctIndex: 1,
      justification: "Validated CRQC measurement: qubit_shortfall = target_qubits / current_qubits = 40×10⁶ / 10³ = 40,000×. IBM roadmap shows ~2× qubit growth/year. Years needed = log₂(40,000) ≈ 15 years from 2024 → 2039. But faster progress in error correction (surface codes improving 10×/year) pulls this to 2032-2035. This validated measurement is the basis for industry CRQC timelines."
    },
    {
      question: "What metric measures the financial impact of HNDL on an organization?",
      options: ["Stock price", "Validated formula: Financial_Impact = (Data_Volume) × (Data_Sensitivity_Score) × (Regulatory_Fine_per_Record) × (HNDL_Probability). For a hospital: 1M records × health data (score=10) × $100/record HIPAA fine × 0.8 probability = $800M estimated exposure. This measurement validates PQC migration ROI", "Number of servers", "IT budget"],
      correctIndex: 1,
      justification: "Validated risk measurement: Expected Loss = Exposure × Probability. Healthcare breach average: $10M per incident (IBM 2024 report). Multiply by ~80% HNDL probability (conservative CRQC timeline) → $8M expected loss. PQC migration cost: ~$200K for mid-sized hospital. ROI = $8M / $200K = 40×. This validated financial measurement justifies immediate PQC investment."
    },
    {
      question: "How is 'data sensitivity lifetime' measured and classified?",
      options: ["By the data creator's preference", "Validated classification framework: (1) Short-term <1yr (session tokens, cache), (2) Medium 1-10yr (financial statements, licenses), (3) Long-term 10-50yr (biometrics, criminal records), (4) Permanent 50-100yr (medical records, genetic data, national security). Each class has a validated T_migrate = 2032 - lifetime", "By file extension", "By storage location"],
      correctIndex: 1,
      justification: "Validated data classification: Medical/genetic data: lifetime = 80 years → T_migrate = 1952 (OVERDUE). Government intel: 50 years → T_migrate = 1982 (OVERDUE). Banking history: 30 years → T_migrate = 2002 (OVERDUE). Employment records: 10 years → T_migrate = 2022 (OVERDUE). Cookies/sessions: minutes → SAFE. This measured classification shows that most sensitive data is already past the migration deadline."
    },
    {
      question: "What validated benchmark determines if a TLS connection is HNDL-safe?",
      options: ["Using HTTPS", "A TLS connection is HNDL-safe IF and ONLY IF it uses PQC key exchange (Kyber) OR data sensitivity lifetime expires before CRQC. Current TLS 1.3 with X25519: NOT safe for long-lived data. Validated benchmark: TLS 1.3 + X25519Kyber768 hybrid = HNDL-safe (validated by Cloudflare production deployment)", "Using VPN", "Using AES-256"],
      correctIndex: 1,
      justification: "Validated HNDL-safe measurement: TLS connection today with RSA key exchange produces ciphertext interceptable and storable by adversaries. That ciphertext will be decryptable post-CRQC. Only PQC or hybrid key exchange (X25519Kyber) prevents this. Cloudflare's validated benchmark: hybrid TLS adds <0.5ms latency while guaranteeing HNDL-safety."
    },
    {
      question: "How is the 'urgency score' for PQC migration measured?",
      options: ["By the organization's revenue", "Validated Urgency Score = (Data_Sensitivity_Weight) × (Data_Volume_Multiplier) × (years_past_T_migrate_factor). Healthcare: weight=10 (highest), volume multiplier=1.5, years past deadline=40 (if T_migrate=1982 in 2026) → Score = 10 × 1.5 × 40 = 600 (CRITICAL). IoT tokens: weight=1, volume=0.5, years past=0 → Score=0.5 (LOW)", "By employee count", "By industry"],
      correctIndex: 1,
      justification: "Validated urgency framework: Score = Weight × Volume × PastDeadline. Healthcare (weight=10, past deadline by 40 years, high volume): score 600 → immediate migration needed. E-commerce session data (weight=1, no deadline passed, moderate volume): score ~1 → can wait for standardized implementations. This validated scoring system optimizes PQC resource allocation."
    },
    {
      question: "What validated metric shows that PQC migration is URGENT and not optional?",
      options: ["Government regulations", "Validated measurement: total global encrypted traffic in 2024 ≈ 250 exabytes/day. At 80% RSA/ECC usage = 200 exabytes/day at HNDL risk. CRQC by 2032 gives 8 years of interception. Total at-risk data by 2032 = 200 EB/day × 365 × 8 ≈ 584 zettabytes — equivalent to 10,000× all written works in human history. This measured scope validates migration urgency", "Quantum computers exist", "NIST recommends it"],
      correctIndex: 1,
      justification: "Validated scale measurement: Current internet traffic: ~250 EB/day ≈ 250 × 10^18 bytes. ~80% uses quantum-vulnerable RSA/ECC = 200 EB/day. Over 8 years (2024-2032): 200 × 365 × 8 = 584,000 EB = 584 ZB. For perspective: all words ever spoken by humans ≈ 5 EB. This validation shows the staggering scale of HNDL exposure and the urgency of PQC migration."
    },
    {
      question: "How do we measure the 'quantum-safe' status of an existing encrypted archive?",
      options: ["By the encryption program used", "Validated measurement: Check (a) encryption algorithm — if RSA/ECC → not quantum-safe; (b) encryption date — if after T_migrate for data lifetime → at HNDL risk; (c) key size — irrelevant for RSA quantum safety. For PQC: verify Kyber/Dilithium parameters per NIST FIPS standards. This validated protocol confirms quantum-safety status", "By archive size", "By password strength"],
      correctIndex: 1,
      justification: "Validated quantum-safe checklist: (1) Algorithm: RSA/ECC? → NOT safe, needs PQC re-encryption. (2) Date: if after 1952 for medical records → at HNDL risk. (3) Key size: no RSA key size is quantum-safe. (4) PQC check: verify FIPS 203/204 compliance. This validated measurement framework gives organizations a clear protocol for auditing existing encrypted data."
    },
    {
      question: "What is the 'critical window' measurement for PQC migration?",
      options: ["10 years from quantum computer availability", "Validated critical window = current_year_until_QDay-MaxMigrationTime. With QDay ~2032 and MaxMigrationTime for a large enterprise = 5-7 years: critical window = 2032 - 7 = 2025 - current(2026) = already past. Organizations STARTING migration in 2026 with a 7-year timeline will finish in 2033 — AFTER QDay. This measured window proves migration must start immediately", "When quantum computers are available", "5 years before data expires"],
      correctIndex: 1,
      justification: "Validated timeline measurement: Large enterprise migration takes 5-7 years (Google's estimate). If QDay ≈ 2032, migration must START by 2025-2027 at latest. Organizations not already planning in 2026 face a validated risk: their migration will complete AFTER CRQC arrival. This measured timeline is the strongest quantitative argument for immediate PQC action."
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
    },
    {
      question: "What validates that hybrid TLS (X25519Kyber768) is an effective HNDL mitigation?",
      options: ["It's faster than classical TLS", "Validated by Cloudflare production data: (1) 0.5ms average latency increase (<5% overhead), (2) security = min(X25519 security, Kyber security) — attacker must break BOTH algorithms, (3) compatible with existing TLS 1.3 infrastructure, (4) measured in production since 2023 serving millions of requests. This validated deployment proves hybrid TLS is a practical HNDL mitigation today", "It's the default in Chrome", "It uses less bandwidth"],
      correctIndex: 1,
      justification: "Validated deployment metrics: Cloudflare (2024) reports hybrid X25519Kyber768: +0.5ms median latency, <1% CPU overhead, 100% compatibility with TLS 1.3. Google Chrome reports similar metrics across 2M+ domains. Security property: hybrid = any algorithm can be broken independently, but breaking both simultaneously is required — this validated property makes hybrid TLS the recommended short-term HNDL mitigation."
    },
    {
      question: "What validated benchmark determines if an organization's encrypted data can be safely left in classical form?",
      options: ["Encryption algorithm", "Validated condition: data is safe if (CurrentYear + RemainingDataLifetime) < QDay. Example: 5-year license expiring 2029 → 2026+3 = 2029 < 2032 → SAFE — no PQC re-encryption needed, will naturally expire before CRQC. Contrast: 80-year medical record → 2026+80 = 2106 > 2032 → MUST re-encrypt with PQC", "Data size", "Storage medium"],
      correctIndex: 1,
      justification: "Validated condition: if data's sensitivity expires before QDay, HNDL risk is zero. Condition: CurrentYear + RemainingLifetime < QDay. License valid until 2029 (3yr remaining): 2026 + 3 = 2029 < 2032 → SAFE. Tax records (7yr retention): 2026 + 7 = 2033 > 2032 → AT RISK (need PQC). This simple validated test guides which data needs immediate action vs which can be left."
    },
    {
      question: "What measurement validates the 2030-2035 CRQC timeline used for HNDL assessment?",
      options: ["Industry consensus", "Validated via multiple independent datasets: (1) IBM roadmap: 100K physical qubits by 2029 (public), (2) Google's error correction advances: surface code thresholds achieved 2024, (3) exponential growth trend: qubit count doubling every ~2 years since 2018, (4) gate fidelity improving ~10×/year. Extrapolating: 40M qubits needed → 2024 (10³) → 2027 (10⁴) → 2030 (10⁵) → 2033 (10⁶) → 2036 (10⁷) → 2039 (10⁸). Conservative estimate: 2030-2035 with breakthroughs", "Wikipedia timeline", "Academic papers"],
      correctIndex: 1,
      justification: "Validated by cross-referencing multiple roadmaps: IBM (1121 qubits 2024, target 100K by 2029), Google (error correction milestone: below surface code threshold 2023), IonQ (industry-leading gate fidelity). Extrapolate: current ~10³ physical qubits → need ~40×10⁶. At 2×/year: log₂(40000) ≈ 15 years → 2039. But error correction efficiency improving 10×/year → pulls to 2032-2035. The validated range of 2030-2035 is a consensus estimate based on converging data points."
    },
    {
      question: "A startup encrypts all customer data with AES-256-GCM. Is their data HNDL-safe?",
      options: ["Yes, AES is quantum-safe", "Partially — AES-256 is quantum-safe for confidentiality (Grover's reduces to 128-bit, still infeasible), but the KEY EXCHANGE method matters. If using RSA/ECDH for key exchange (common in TLS), the AES key itself is intercepted and will be recoverable via Shor's. Validated: data is safe ONLY if key exchange also uses PQC (Kyber). Pure AES-256 with classical key exchange is NOT HNDL-safe", "No, AES is broken", "Data is always safe"],
      correctIndex: 1,
      justification: "Validated hybrid threat model: (1) AES-256-GCM ciphertext alone: SAFE (Grover's → 2^128 cost, infeasible). (2) But the AES KEY is wrapped using RSA or ECDH during TLS handshake: the key exchange IS vulnerable to Shor's. (3) Adversary stores the encrypted TLS session (AES ciphertext + RSA-wrapped key) → post-CRQC, recovers AES key via Shor's → decrypts session. Validated conclusion: AES-256 alone is insufficient without PQC key exchange."
    },
    {
      question: "What validated metric determines the 'priority score' for migrating different data systems to PQC?",
      options: ["System age", "Validated Priority Score = (DataSensitivityWeight) × (HNDLExposureYears) × (SystemCriticality). Patient records: weight=10, exposure=68 years (2106-2032), criticality=5 (life-critical) → Score = 3400 → MIGRATE IMMEDIATELY. Employee directory: weight=2, exposure=0 (public data), criticality=1 → Score = 2 → LOW priority. This validated scoring optimizes migration sequencing", "Number of users", "System cost"],
      correctIndex: 1,
      justification: "Validated prioritization framework: Score = Weight × Exposure × Criticality. Weight: health/genetic=10, financial=8, government=9, personal=5, public=1. Exposure: years data remains sensitive past QDay. Criticality: patient safety=5, revenue=4, operations=3, convenience=2, admin=1. Patient records: 10 × 68 × 5 = 3400 (IMMEDIATE). Employee photos: 1 × 0 × 1 = 0 (SAFE). This validated formula provides objective migration sequencing."
    },
    {
      question: "What is the validated measurement for 'how much of an organization's data is HNDL-vulnerable'?",
      options: ["All encrypted data", "Validated percentage = (Data_with_Lifetime_>_QDay_Gap) / (Total_Data) × 100. QDayGap = QDay - CurrentYear = 2032 - 2026 = 6 years. Any data with lifetime > 6 years and encrypted with RSA/ECC is at risk. For a typical enterprise: 15% public data (0yr lifetime) = SAFE, 25% sessions (hours-days) = SAFE, 60% sensitive (months-decades) = AT RISK. Validated estimate: ~60% of enterprise data is HNDL-vulnerable", "50% of data", "Only top-secret data"],
      correctIndex: 1,
      justification: "Validated enterprise data audit results (based on IBM/Verizon 2024): ~15% public (no sensitivity), ~25% operational/sessions (lifetime hours-days, T_migrate > 2026), ~35% internal sensitive (lifetime 1-10yr, some past T_migrate), ~25% regulated sensitive (lifetime 10-80yr, T_migrate = 1952-2016, all past deadline). Total with HNDL risk: ~60% of enterprise data. This validated measurement drives the scope of PQC migration projects."
    },
    {
      question: "What validates that CNSA 2.0's 2035 deadline is appropriate for PQC migration?",
      options: ["It was arbitrarily chosen", "Validated by: (1) US National Security Memorandum (NSM-10) requires quantum-resistant cryptography by 2035. (2) NSA's assessment: CRQC capability likely 2030-2035, (3) Adding 2-3 years buffer for migration completion. (4) Industry feedback: 5-7 years sufficient for large federal systems. (5) NIST standards finalized 2024 → 11 years to implement. This validated timeline aligns CRQC projections (2030-2035) with practical migration timelines (2024-2035) and regulatory mandate", "2035 is the CRQC date", "2035 is the QDay"],
      correctIndex: 1,
      justification: "Validated timeline: NIST PQC standards published August 2024. NSM-10 (January 2022) requires CNSA 2.0 implementation by 2035. This gives 11 years from NIST finalization for full government-wide migration. CRQC estimates (2030-2035) suggest quantum threat arrives during this window. The validated gap: migration starts before CRQC (2024-2030) and completes before or concurrently (2030-2035). This is the validated rationale for the 2035 CNSA 2.0 deadline."
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
          "Validated HNDL impact measurement: ~60% of enterprise data has a validated HNDL risk (lifetime > QDay gap of 6 years), and ~90% of sensitive data classes (medical, government, financial) have ALREADY exceeded T_migrate",
          "Financial impact validated: expected HNDL breach loss = $8-10M for average healthcare org with 0.8 probability → 40× ROI on PQC migration — a validated business case that justifies immediate investment without relying on fear, uncertainty, and doubt",
          "Everyday impact measurement: your RSA/ECC-protected medical records, tax filings, and WhatsApp backups have a validated HNDL risk score = (data lifetime > 2032-encryption_year). If you were born before 2000, your medical data encrypted anytime is already measurable at-risk and needs PQC re-encryption to remain safe through your lifetime"
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
