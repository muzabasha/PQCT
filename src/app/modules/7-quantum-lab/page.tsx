"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const budgetCategories = [
  {
    category: 'Quantum Computing Hardware',
    items: [
      { name: 'IBM Quantum System One (on-premise) or equivalent', cost: 150000000, unit: '1 unit', essential: true },
      { name: 'Superconducting qubit processor (20-50 qubits)', cost: 50000000, unit: '1 unit', essential: true },
      { name: 'Cryogenic dilution refrigerator (Bluefors LD or similar)', cost: 35000000, unit: '1 unit', essential: true },
      { name: 'Control electronics & wiring (Quantum Machines OPX+)', cost: 15000000, unit: '1 set', essential: true },
      { name: 'Classical control server cluster', cost: 8000000, unit: '1 cluster', essential: true },
    ],
  },
  {
    category: 'Simulation & Emulation Hardware',
    items: [
      { name: 'GPU server (NVIDIA A100/H100 x 4) for Qiskit/Cirq', cost: 25000000, unit: '1 server', essential: true },
      { name: 'High-performance computing (HPC) cluster', cost: 20000000, unit: '1 cluster', essential: false },
      { name: 'FPGA-based quantum emulator (Qibo/QSim)', cost: 12000000, unit: '1 unit', essential: false },
      { name: 'Quantum annealing system (D-Wave Advantage or equivalent)', cost: 80000000, unit: '1 unit', essential: false },
    ],
  },
  {
    category: 'Software & Platform Licenses',
    items: [
      { name: 'IBM Qiskit Runtime & premium access (3yr)', cost: 5000000, unit: '3yr license', essential: true },
      { name: 'Quantum simulation platforms (AWS Braket/Azure Quantum)', cost: 3000000, unit: '3yr license', essential: true },
      { name: 'Quantum cryptography SDKs & toolkits (liboqs, OpenQKD)', cost: 500000, unit: 'perpetual', essential: true },
      { name: 'Matlab/Mathematica with quantum toolboxes', cost: 1500000, unit: '3yr license', essential: false },
      { name: 'Penetration testing & security validation tools', cost: 2000000, unit: '3yr license', essential: false },
    ],
  },
  {
    category: 'Infrastructure & Setup',
    items: [
      { name: 'Lab renovation & cleanroom setup (class 1000)', cost: 25000000, unit: 'lump sum', essential: true },
      { name: 'HVAC & environmental control (20°C ± 0.5°C)', cost: 8000000, unit: '1 system', essential: true },
      { name: 'UPS & power conditioning (100 kVA)', cost: 5000000, unit: '1 system', essential: true },
      { name: 'EMI shielding & Faraday cage installation', cost: 4000000, unit: '1 installation', essential: true },
      { name: 'Fire suppression & safety systems', cost: 3000000, unit: '1 system', essential: true },
      { name: 'Network infrastructure (10 GbE fiber, isolated VLAN)', cost: 2000000, unit: '1 setup', essential: true },
    ],
  },
  {
    category: 'Faculty & Research Staff (Annual)',
    items: [
      { name: 'Principal Investigator (1)', cost: 3000000, unit: 'per year', essential: true },
      { name: 'Co-Investigators (2-3)', cost: 5000000, unit: 'per year (total)', essential: true },
      { name: 'Research Scientists (3-4)', cost: 6000000, unit: 'per year (total)', essential: true },
      { name: 'PhD Scholars (6-8 @ ₹3L/yr each)', cost: 2400000, unit: 'per year (total)', essential: true },
      { name: 'Lab Technicians & Engineers (2-3)', cost: 2400000, unit: 'per year (total)', essential: true },
      { name: 'Project Management & Admin', cost: 1800000, unit: 'per year', essential: false },
    ],
  },
  {
    category: 'Recurring Operational Costs (Annual)',
    items: [
      { name: 'Liquid helium refill (cryogenic maintenance)', cost: 5000000, unit: 'per year', essential: true },
      { name: 'Electricity & utilities (150-200 kW load)', cost: 4000000, unit: 'per year', essential: true },
      { name: 'Cloud quantum access credits (IBM/AWS/Azure)', cost: 3000000, unit: 'per year', essential: true },
      { name: 'Maintenance & calibration contracts', cost: 3500000, unit: 'per year', essential: true },
      { name: 'Consumables & spare parts', cost: 1500000, unit: 'per year', essential: true },
      { name: 'Conference travel & collaboration (domestic)', cost: 1500000, unit: 'per year', essential: false },
      { name: 'International collaboration & travel', cost: 2500000, unit: 'per year', essential: false },
    ],
  },
];

const fundingAgencies = [
  {
    name: 'National Quantum Mission (NQM) — DST',
    type: 'Central Government',
    budget: '₹6,003 Cr (2023-2031)',
    focus: 'Quantum computing, communication, sensing & materials — 4 thematic hubs (IISc, TIFR, IITs, ISI)',
    grants: 'Up to ₹200 Cr per hub for infrastructure; ₹5-10 Cr/yr for PI grants',
    website: 'https://dst.gov.in/national-quantum-mission',
    icon: '🇮🇳',
    color: 'border-primary/40 bg-primary/5',
    tag: 'bg-primary/10 text-primary',
  },
  {
    name: 'MeitY (Ministry of Electronics & IT)',
    type: 'Central Government',
    budget: '₹3,200 Cr (Quantum & AI combined)',
    focus: 'Quantum computing applications, cybersecurity, PQC integration, quantum-safe cryptography standards',
    grants: '₹5-50 Cr for quantum technology projects; C-DAC quantum computing initiative',
    website: 'https://www.meity.gov.in',
    icon: '💻',
    color: 'border-secondary/40 bg-secondary/5',
    tag: 'bg-secondary/10 text-secondary',
  },
  {
    name: 'SERB (Science & Engineering Research Board)',
    type: 'Central Government',
    budget: '₹850 Cr/yr (core research)',
    focus: 'Fundamental quantum research, early-career grants, quantum algorithms & error correction',
    grants: 'CRG: up to ₹1 Cr/3yr; Core Research: up to ₹3 Cr/3yr; J.C. Bose Fellowship: ₹2.5 Cr/5yr',
    website: 'https://www.serb.gov.in',
    icon: '🔬',
    color: 'border-success/40 bg-success/5',
    tag: 'bg-success/10 text-success',
  },
  {
    name: 'DRDO (Defence R&D Organisation)',
    type: 'Defence',
    budget: '₹950 Cr (quantum technologies)',
    focus: 'Quantum key distribution (QKD), quantum-resistant defence communication, quantum sensing for navigation',
    grants: 'Project-specific: ₹10-100 Cr for defence quantum applications',
    website: 'https://www.drdo.gov.in',
    icon: '🛡️',
    color: 'border-destructive/40 bg-destructive/5',
    tag: 'bg-destructive/10 text-destructive',
  },
  {
    name: 'ISRO (Indian Space Research Organisation)',
    type: 'Space',
    budget: '₹500 Cr (quantum communication)',
    focus: 'Satellite-based QKD, quantum communication for space, quantum-secured satellite links',
    grants: 'Joint research programs with academia: ₹5-25 Cr',
    website: 'https://www.isro.gov.in',
    icon: '🚀',
    color: 'border-accent/40 bg-accent/5',
    tag: 'bg-accent/10 text-accent',
  },
  {
    name: 'DBT (Dept. of Biotechnology)',
    type: 'Central Government',
    budget: '₹200 Cr (quantum bio)',
    focus: 'Quantum biology, quantum sensing for biomedical applications, molecular simulations',
    grants: '₹1-10 Cr for interdisciplinary quantum-bio projects',
    website: 'https://dbtindia.gov.in',
    icon: '🧬',
    color: 'border-math/40 bg-math/5',
    tag: 'bg-math/10 text-math',
  },
  {
    name: 'DST-ICPS (International Cooperation)',
    type: 'Central Government',
    budget: '₹150 Cr (bilateral programs)',
    focus: 'India-UK quantum (IQUIST), India-France, India-Israel, India-EU quantum collaborations',
    grants: '₹1-5 Cr for bilateral exchanges; joint proposals with international partners',
    website: 'https://dst.gov.in/international-cooperation',
    icon: '🤝',
    color: 'border-primary/30 bg-primary/5',
    tag: 'bg-primary/10 text-primary',
  },
  {
    name: 'State Govts & Private Sector',
    type: 'State/Private',
    budget: 'Variable',
    focus: 'Karnataka (₹350 Cr quantum valley), Telangana (quantum hub), Maharashtra, TN — plus TCS, Infosys, Wipro R&D',
    grants: '₹10-100 Cr for state-level quantum centres; CSR funding via corporate R&D partnerships',
    website: 'varies by state',
    icon: '🏛️',
    color: 'border-secondary/30 bg-secondary/5',
    tag: 'bg-secondary/10 text-secondary',
  },
];

const quantumLabsIndia = [
  {
    name: 'Quantum Information & Computation (QuIC) Lab',
    institution: 'IISc Bangalore',
    city: 'Bengaluru',
    focus: 'Quantum algorithms, quantum error correction, quantum complexity theory, topological quantum computing',
    established: 2012,
    director: 'Prof. Apoorva Patel / Prof. Arun M. (group leads)',
    facilities: 'HPC cluster for quantum simulation, access to IBM Quantum cloud, Qiskit dev environment, FPGA-based emulators',
    outcomes: 'Foundational work in quantum algorithm design, quantum error-correcting codes, India\'s first quantum computing PhDs',
    notable: 'Part of NQM quantum computing thematic hub; collaboration with IBM, MIT, Cambridge',
    icon: '🎓',
    color: 'from-blue-500/15 to-cyan-500/10',
    border: 'border-blue-500/25',
  },
  {
    name: 'Centre for Quantum Information & Quantum Computing (CQIQC)',
    institution: 'ISI Kolkata',
    city: 'Kolkata',
    focus: 'Quantum communication, quantum cryptography, quantum information theory, entanglement theory',
    established: 2010,
    director: 'Prof. Sibasish Ghosh / Prof. Ujjwal Sen',
    facilities: 'Quantum optics lab with entangled photon sources, QKD testbed, quantum state tomography setup',
    outcomes: 'Pioneering work in quantum key distribution protocols, entanglement distillation, quantum teleportation demonstrations',
    notable: 'One of India\'s oldest quantum research centres; extensive international collaborations with EU quantum programs',
    icon: '🏛️',
    color: 'from-secondary/15 to-indigo-500/10',
    border: 'border-secondary/25',
  },
  {
    name: 'TIFR Quantum Information & Computing (QIC) Group',
    institution: 'TIFR Mumbai',
    city: 'Mumbai',
    focus: 'Quantum many-body systems, quantum simulation, adiabatic quantum computing, quantum chaos',
    established: 2011,
    director: 'Prof. G. Baskaran / Prof. R. Sensarma',
    facilities: 'HPC clusters (100+ TFLOPS), cold atom lab, access to D-Wave quantum annealer via partnership',
    outcomes: 'Theoretical breakthroughs in quantum many-body physics, quantum simulation algorithms, topological phases',
    notable: 'NQM hub for quantum materials; partnership with D-Wave Systems for quantum annealing research',
    icon: '⚛️',
    color: 'from-accent/15 to-yellow-500/10',
    border: 'border-accent/25',
  },
  {
    name: 'Quantum Optics & Quantum Information Lab',
    institution: 'IIT Delhi',
    city: 'New Delhi',
    focus: 'Quantum communication, quantum key distribution (QKD), free-space quantum optics, quantum memories',
    established: 2015,
    director: 'Prof. R. P. Singh / Prof. Ananya',
    facilities: 'QKD testbed, entangled photon source (SPDC), single-photon detectors (Si-APD, SNSPD), free-space optical link',
    outcomes: 'Field demonstrations of QKD over 50 km fibre; free-space QKD over 10 km; quantum memory proof-of-concept',
    notable: 'MeitY-funded quantum communication testbed; collaboration with DRDO for secure defence communication',
    icon: '🔦',
    color: 'from-success/15 to-emerald-500/10',
    border: 'border-success/25',
  },
  {
    name: 'Centre for Excellence in Quantum Technology (CEQuT)',
    institution: 'IIT Madras',
    city: 'Chennai',
    focus: 'Quantum computing hardware (superconducting qubits), quantum control electronics, quantum error correction, PQC',
    established: 2019,
    director: 'Prof. P. A. Manoj / Prof. Shankar P.',
    facilities: 'Dilution refrigerator (Bluefors LD 400), superconducting qubit fabrication lab (cleanroom class 100), control electronics',
    outcomes: 'First superconducting qubit demonstration in India; development of indigenous quantum control electronics; PQC migration framework',
    notable: 'NQM hub; fabrication of transmon qubits; indigenous cryogenic CMOS controller IC design; $5M NSF-IISc-IITM collaboration',
    icon: '💎',
    color: 'from-math/15 to-pink-500/10',
    border: 'border-math/25',
  },
  {
    name: 'Quantum Technology Lab',
    institution: 'IIT Jodhpur',
    city: 'Jodhpur',
    focus: 'Quantum sensors, quantum metrology, NV centre-based sensing, quantum materials, quantum simulation',
    established: 2020,
    director: 'Prof. D. Bhattacharya',
    facilities: 'NV centre diamond magnetometry setup, confocal microscopy, cryostat (4K), microwave electronics',
    outcomes: 'High-sensitivity magnetometry using NV centres; quantum sensing for biomedical applications; materials for quantum devices',
    notable: 'SERB-funded quantum sensor development; DRDO collaboration for navigation-grade quantum sensors; international patents filed',
    icon: '🧭',
    color: 'from-destructive/15 to-orange-500/10',
    border: 'border-destructive/25',
  },
  {
    name: 'Quantum Information Processing Group',
    institution: 'RRI Bangalore',
    city: 'Bengaluru',
    focus: 'Quantum optics, cavity QED, ion trap quantum computing, quantum networking',
    established: 2013,
    director: 'Prof. S. A. Rangwala / Prof. H. S. S. Ramachandra',
    facilities: 'Ion trap setup, high-finesse optical cavities, single-photon sources, ultra-high vacuum systems, laser cooling setup',
    outcomes: 'Trapped ion qubit coherence > 1 sec; cavity-mediated quantum gates; quantum node for quantum networks',
    notable: 'One of few Indian labs with trapped ion capability; DST-funded quantum internet testbed; Nature Physics publications',
    icon: '🔬',
    color: 'from-primary/15 to-cyan-500/10',
    border: 'border-primary/25',
  },
  {
    name: 'Centre for Quantum Science & Technology (CQST)',
    institution: 'IIIT Hyderabad',
    city: 'Hyderabad',
    focus: 'Quantum algorithms, quantum machine learning, quantum cryptography, quantum software verification',
    established: 2021,
    director: 'Prof. S. K. V. / Prof. Indranil C.',
    facilities: 'Qiskit/Cirq simulation cluster (16-node GPU), IBM Quantum premium access, quantum SDK development lab',
    outcomes: '30+ papers in quantum ML; Qiskit-based algorithm benchmarks; quantum cryptography protocol verification tools',
    notable: 'Microsoft Azure Quantum partnership; Google Quantum AI collaborator; open-source quantum software contributions',
    icon: '🤖',
    color: 'from-success/15 to-emerald-500/10',
    border: 'border-success/25',
  },
  {
    name: 'Quantum Photonics Lab',
    institution: 'IIT Kanpur',
    city: 'Kanpur',
    focus: 'Integrated quantum photonics, silicon photonic quantum chips, quantum photonic circuits',
    established: 2018,
    director: 'Prof. A. K. Sharma',
    facilities: 'EBL lithography, photonic chip fabrication (SiN/SiO₂), cryogenic single-photon detectors, fibre packaging',
    outcomes: 'On-chip entangled photon pair generation; integrated photonic quantum circuits; programmable quantum photonic chip prototype',
    notable: 'MeitY-funded integrated photonics project; collaboration with MIT photonics group; first Indian quantum photonic chip demo',
    icon: '🔮',
    color: 'from-accent/15 to-amber-500/10',
    border: 'border-accent/25',
  },
  {
    name: 'C-DAC Quantum Computing Centre',
    institution: 'C-DAC Bangalore (Ministry of MeitY)',
    city: 'Bengaluru',
    focus: 'Quantum computing simulation, quantum compiler development, HPC-quantum integration, PQC toolkit development',
    established: 2020,
    director: 'Dr. S. K. Sinha (Director General, C-DAC)',
    facilities: 'C-DAC PARAM HPC (10+ PFLOPS), quantum emulation stack, HPC-QC integration framework, software stack for quantum',
    outcomes: 'India\'s first quantum computing simulator (QSim); quantum compiler suite; quantum-safe cryptography library; HPC-QC hybrid framework',
    notable: 'QSim platform with 300+ qubit simulation capacity; MeitY flagship quantum computing initiative; deployed at 50+ Indian institutions',
    icon: '🖥️',
    color: 'from-secondary/15 to-indigo-500/10',
    border: 'border-secondary/25',
  },
];

const labOutcomes = [
  {
    area: 'Academic & Research Outcomes',
    items: [
      'PhD trained in quantum information science & quantum cryptography (10-15 PhDs in 5 years)',
      '50+ publications in top-tier journals (Nature, PRL, PRA, IEEE QE, Quantum)',
      'Establishment of interdisciplinary quantum research culture bridging physics, CS, EE, and math',
      'National & international collaborations with leading quantum research centres',
      'Regular quantum workshops, summer schools, and conferences hosted at the institute',
      'Patent filings in quantum algorithms, quantum hardware, and quantum communication protocols',
    ],
  },
  {
    area: 'Curriculum & Training Outcomes',
    items: [
      'Full-semester courses: Quantum Computing, Quantum Cryptography, Quantum Information Theory',
      'Hands-on lab courses using Qiskit, Cirq, and in-house quantum simulation platforms',
      'Industry-oriented certification programs for PQC migration and quantum-safe security',
      'MOOC/NPTEL courses on quantum computing reaching 10,000+ learners across India',
      'MTech program in Quantum Science & Engineering',
      'Faculty development programs training 50+ college teachers annually',
    ],
  },
  {
    area: 'Industrial & Societal Outcomes',
    items: [
      'Quantum-safe cryptography migration framework for Indian enterprises (banking, telecom, defence)',
      'Industry consulting: quantum threat assessment for BFSI, healthcare, and government sectors',
      'Quantum sensor prototypes for defence (navigation, timing) and biomedical (imaging, diagnostics)',
      'Startup incubation: spin-off companies in quantum security, quantum sensing, and quantum software',
      'Policy input for National Quantum Mission roadmap and quantum technology standards',
      'Quantum technology awareness & workforce development for Make in India & Atmanirbhar Bharat',
    ],
  },
  {
    area: 'Technology Outcomes',
    items: [
      'Indigenous quantum key distribution (QKD) system with >100 km fibre range',
      'Superconducting qubit testbed with >10 qubits fabricated in-house',
      'Quantum emulation platform with 500+ qubit simulation capacity',
      'Post-quantum cryptography integration toolkit for legacy system migration',
      'Quantum-classical hybrid algorithms for optimization (finance, logistics, drug discovery)',
      'Cryogenic CMOS controller IC for scalable qubit control',
    ],
  },
];

const labTiers = [
  {
    tier: 'Tier 1 — Full-Spectrum Quantum Lab',
    cost: '₹40-50 Cr (setup) + ₹8-10 Cr/yr (operations)',
    scope: 'Quantum hardware (superconducting/trapped ion), quantum communication, quantum simulation, PQC validation',
    timeline: '5-7 years for full capability',
    institutions: 'IITs, IISc, IISERs, Central Universities with strong physics/CS depts',
    color: 'from-primary/20 to-cyan-500/20',
    border: 'border-primary/40',
  },
  {
    tier: 'Tier 2 — Quantum Simulation & Cryptography Lab',
    cost: '₹8-12 Cr (setup) + ₹3-5 Cr/yr (operations)',
    scope: 'Quantum algorithm simulation, PQC benchmarking, QKD testbed, quantum cryptography teaching',
    timeline: '2-3 years for full capability',
    institutions: 'Engineering colleges, state universities, private deemed universities',
    color: 'from-secondary/20 to-indigo-500/20',
    border: 'border-secondary/40',
  },
  {
    tier: 'Tier 3 — PQC & Quantum-Aware Security Lab',
    cost: '₹1-3 Cr (setup) + ₹0.5-1 Cr/yr (operations)',
    scope: 'Post-quantum cryptography integration, quantum threat assessment, crypto agility testing',
    timeline: '6 months - 1 year for full capability',
    institutions: 'All engineering colleges, degree colleges with computer science programs',
    color: 'from-success/20 to-emerald-500/20',
    border: 'border-success/40',
  },
];

type BudgetItem = typeof budgetCategories[number]['items'][number];

export default function QuantumLabModule() {
  const [budgetToggles, setBudgetToggles] = useState<Record<string, boolean>>(() => {
    const toggles: Record<string, boolean> = {};
    budgetCategories.forEach(cat => cat.items.forEach(item => { toggles[item.name] = true; }));
    return toggles;
  });
  const [staffYears, setStaffYears] = useState(5);
  const [opYears, setOpYears] = useState(5);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedLab, setExpandedLab] = useState<number | null>(null);
  const [expandedAgency, setExpandedAgency] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'labs' | 'funding' | 'outcomes'>('plan');
  const [labFilter, setLabFilter] = useState('All');

  const toggleBudget = (name: string) => setBudgetToggles(prev => ({ ...prev, [name]: !prev[name] }));

  const totalSetup = budgetCategories
    .filter(cat => !['Faculty & Research Staff (Annual)', 'Recurring Operational Costs (Annual)'].includes(cat.category))
    .flatMap(cat => cat.items)
    .filter(item => budgetToggles[item.name])
    .reduce((sum, item) => sum + item.cost, 0);

  const totalStaff = budgetCategories
    .filter(cat => cat.category === 'Faculty & Research Staff (Annual)')
    .flatMap(cat => cat.items)
    .filter(item => budgetToggles[item.name])
    .reduce((sum, item) => sum + item.cost, 0) * staffYears;

  const totalOp = budgetCategories
    .filter(cat => cat.category === 'Recurring Operational Costs (Annual)')
    .flatMap(cat => cat.items)
    .filter(item => budgetToggles[item.name])
    .reduce((sum, item) => sum + item.cost, 0) * opYears;

  const grandTotal = totalSetup + totalStaff + totalOp;

  const formatRupees = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const filteredLabs = labFilter === 'All' ? quantumLabsIndia : quantumLabsIndia.filter(l => l.city === labFilter || l.focus.includes(labFilter));

  const cities = [...new Set(quantumLabsIndia.map(l => l.city))];

  const tabs = [
    { id: 'plan', label: 'Lab Plan & Budget', icon: '📋' },
    { id: 'labs', label: 'Quantum Labs in India', icon: '🔬' },
    { id: 'funding', label: 'Funding Agencies', icon: '💰' },
    { id: 'outcomes', label: 'Expected Outcomes', icon: '🎯' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 space-y-12">

      {/* Hero */}
      <section className="pt-12 md:pt-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Module 7 · Planning & Reference
        </div>
        <h1 className="text-3xl md:text-6xl font-black font-outfit tracking-tighter">
          Establishing a Quantum Lab
        </h1>
        <p className="text-sm md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          A comprehensive guide to establishing quantum computing and cryptography research laboratories 
          in Indian academic institutions — with budget estimates, funding sources, and a directory of 
          existing quantum labs across India.
        </p>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-2 bg-slate-950/90 backdrop-blur-xl border-b border-border/50">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'text-slate-400 hover:text-accent hover:bg-accent/10'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Lab Plan & Budget */}
      {activeTab === 'plan' && (
        <div className="space-y-10">

          {/* Tier Comparison */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3">
              <span>🏗️</span> Lab Tier Options
            </h2>
            <p className="text-sm text-muted-foreground">Choose the right scale for your institution&apos;s goals and resources.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {labTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-6 rounded-2xl border ${tier.border} bg-gradient-to-br ${tier.color} overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{tier.tier}</div>
                    <div className="text-lg font-bold text-white mb-2">{tier.cost}</div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-accent shrink-0">▸</span> {tier.scope}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-accent shrink-0">▸</span> Timeline: {tier.timeline}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-accent shrink-0">▸</span> Suitable for: {tier.institutions}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive Budget Planner */}
          <div className="glass rounded-3xl p-6 md:p-10 border-2 border-accent/20">
            <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3 mb-2">
              <span>💰</span> Interactive Budget Planner
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Toggle items to include in your budget. Staff and operational costs are multiplied by your selected duration.
            </p>

            {/* Timeline sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Staff Duration</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="range" min={1} max={10} value={staffYears} onChange={e => setStaffYears(Number(e.target.value))}
                    className="flex-1 accent-primary h-2 rounded-full appearance-none bg-slate-800 cursor-pointer" />
                  <span className="text-sm font-bold text-white min-w-[4rem]">{staffYears} yrs</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operations Duration</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="range" min={1} max={10} value={opYears} onChange={e => setOpYears(Number(e.target.value))}
                    className="flex-1 accent-primary h-2 rounded-full appearance-none bg-slate-800 cursor-pointer" />
                  <span className="text-sm font-bold text-white min-w-[4rem]">{opYears} yrs</span>
                </div>
              </div>
            </div>

            {/* Budget Items */}
            <div className="space-y-6">
              {budgetCategories.map((cat, ci) => (
                <div key={ci} className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === cat.category ? null : cat.category)}
                    className="w-full flex items-center justify-between p-3 md:p-4 bg-slate-900/60 hover:bg-slate-900 transition-colors"
                  >
                    <h3 className="font-bold text-sm md:text-base text-white">{cat.category}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatRupees(cat.items.filter(i => budgetToggles[i.name]).reduce((s, i) => s + i.cost, 0))}
                      </span>
                      <span className={`transition-transform ${expandedSection === cat.category ? 'rotate-180' : ''}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedSection === cat.category && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-slate-800">
                        {cat.items.map((item, ii) => (
                          <label key={ii} className="flex items-center gap-3 p-3 md:p-4 hover:bg-slate-900/40 transition-colors cursor-pointer border-b border-slate-800/50 last:border-b-0">
                            <input
                              type="checkbox"
                              checked={budgetToggles[item.name]}
                              onChange={() => toggleBudget(item.name)}
                              className="w-4 h-4 rounded border-slate-600 accent-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs md:text-sm text-slate-200 flex items-center gap-2">
                                {item.name}
                                {item.essential && <span className="text-[9px] text-accent font-bold">(essential)</span>}
                              </div>
                              <div className="text-[10px] text-muted-foreground">{item.unit}</div>
                            </div>
                            <div className="text-xs md:text-sm font-bold text-slate-300 text-right shrink-0">
                              {formatRupees(item.cost)}
                            </div>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="mt-8 p-6 bg-gradient-to-r from-accent/20 to-accent/5 rounded-2xl border border-accent/30">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Total</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <div className="text-[10px] text-muted-foreground">Setup (One-time)</div>
                  <div className="text-lg md:text-2xl font-bold text-white">{formatRupees(totalSetup)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Staff ({staffYears} yrs)</div>
                  <div className="text-lg md:text-2xl font-bold text-white">{formatRupees(totalStaff)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Operations ({opYears} yrs)</div>
                  <div className="text-lg md:text-2xl font-bold text-white">{formatRupees(totalOp)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Grand Total</div>
                  <div className="text-xl md:text-3xl font-black text-accent">{formatRupees(grandTotal)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phased Implementation Plan */}
          <div className="glass rounded-3xl p-6 md:p-10">
            <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3 mb-6">
              <span>📅</span> Phased Implementation Plan
            </h2>
            <div className="relative pl-8 space-y-8">
              {[
                { phase: 'Phase 1 (Months 1-6): Planning & Setup', items: ['Infrastructure assessment & lab space identification', 'Equipment procurement tenders & vendor selection', 'Faculty hiring & PhD scholar admissions', 'Curriculum design for quantum courses', 'Collaboration MOUs with existing quantum labs'] },
                { phase: 'Phase 2 (Months 7-18): Core Infrastructure', items: ['Lab renovation & cleanroom commissioning', 'HPC cluster & GPU server installation', 'Network & power infrastructure setup', 'Quantum simulation platform deployment (Qiskit/Cirq)', 'Basic QKD testbed installation'] },
                { phase: 'Phase 3 (Months 19-36): Advanced Capabilities', items: ['Cryogenic system installation (if applicable)', 'Quantum hardware testbed development', 'PQC benchmarking & migration toolkit', 'Industry collaboration projects start', 'International research partnerships active'] },
                { phase: 'Phase 4 (Years 4-7): Full Operations', items: ['Indigenous quantum device fabrication', 'Quantum communication network node', 'Spin-off company incubation', 'National quantum mission deliverables', 'Self-sustaining research ecosystem established'] },
              ].map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent border-2 border-slate-950" />
                  {i < 3 && <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-slate-800" />}
                  <h3 className="text-base md:text-lg font-bold text-accent mb-2">{p.phase}</h3>
                  <ul className="space-y-1">
                    {p.items.map((item, j) => (
                      <li key={j} className="text-xs md:text-sm text-slate-400 flex gap-2">
                        <span className="text-accent/60">▹</span> {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Quantum Labs in India */}
      {activeTab === 'labs' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3">
                <span>🔬</span> Quantum Labs in India
              </h2>
              <p className="text-sm text-muted-foreground">
                {quantumLabsIndia.length} leading quantum research laboratories across India
              </p>
            </div>
            <select
              value={labFilter}
              onChange={e => setLabFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 font-semibold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              <option value="All">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredLabs.map((lab, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`glass rounded-2xl overflow-hidden border ${lab.border} bg-gradient-to-br ${lab.color} hover:scale-[1.01] transition-all`}
              >
                <button
                  onClick={() => setExpandedLab(expandedLab === i ? null : i)}
                  className="w-full text-left p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{lab.icon}</span>
                        <h3 className="font-bold text-sm md:text-base text-white">{lab.name}</h3>
                      </div>
                      <div className="text-xs text-muted-foreground">{lab.institution} · {lab.city}</div>
                      <div className="text-xs text-slate-400 mt-2 line-clamp-2">{lab.focus}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500">Est. {lab.established}</span>
                      <span className={`transition-transform ${expandedLab === i ? 'rotate-180' : ''}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedLab === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-border/50">
                      <div className="p-5 md:p-6 space-y-4 bg-slate-950/30">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">Director/Lead</h4>
                          <p className="text-xs text-slate-300">{lab.director}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Facilities</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{lab.facilities}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-success mb-1">Key Research Outcomes</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{lab.outcomes}</p>
                        </div>
                        <div className="p-3 bg-slate-900/50 rounded-xl">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">Notable Achievements</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{lab.notable}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredLabs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No labs match your filter.</div>
          )}
        </div>
      )}

      {/* TAB 3: Funding Agencies */}
      {activeTab === 'funding' && (
        <div className="space-y-8">
          <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3">
            <span>💰</span> Funding Agencies in India
          </h2>
          <p className="text-sm text-muted-foreground">
            Key funding agencies supporting quantum technology research in Indian institutions.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {fundingAgencies.map((agency, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`glass rounded-2xl overflow-hidden border ${agency.color}`}
              >
                <button
                  onClick={() => setExpandedAgency(expandedAgency === i ? null : i)}
                  className="w-full text-left p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${agency.tag}`}>
                      {agency.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-sm md:text-base text-white">{agency.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground">{agency.type}</span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-[10px] font-bold text-accent">{agency.budget}</span>
                          </div>
                        </div>
                        <span className={`shrink-0 transition-transform ${expandedAgency === i ? 'rotate-180' : ''}`}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedAgency === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-border/50">
                      <div className="p-5 md:p-6 space-y-4 bg-slate-950/30">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Focus Areas</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{agency.focus}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-success mb-1">Grant Range</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{agency.grants}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">🌐</span>
                          <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{agency.website}</a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Proposal Tips */}
          <div className="glass rounded-3xl p-6 md:p-10 border-2 border-primary/20">
            <h3 className="text-lg md:text-2xl font-bold font-outfit mb-4 flex items-center gap-2">
              <span>💡</span> Proposal Writing Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { tip: 'Align with National Quantum Mission (NQM) thematic areas — quantum computing, communication, sensing, materials', icon: '🎯' },
                { tip: 'Demonstrate interdisciplinary collaboration (Physics + CS + EE + Math) — most agencies prioritize this', icon: '🤝' },
                { tip: 'Include industry partnerships (TCS, Infosys, Wipro, startups) for applied research components', icon: '🏭' },
                { tip: 'Highlight faculty expertise and existing infrastructure — show you can start delivering from Year 1', icon: '📊' },
                { tip: 'Budget realistically — under-estimation hurts credibility, over-estimation raises concerns', icon: '💰' },
                { tip: 'Include PhD scholar training plan — agencies value human resource development metrics', icon: '🎓' },
                { tip: 'Mention international collaboration plans — India-UK, India-France, India-Israel quantum partnerships are active', icon: '🌍' },
                { tip: 'Add a clear outcome matrix with 5-year measurable targets (papers, patents, PhDs, startups)', icon: '📈' },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <span className="text-lg shrink-0">{t.icon}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Expected Outcomes */}
      {activeTab === 'outcomes' && (
        <div className="space-y-8">
          <h2 className="text-xl md:text-3xl font-bold font-outfit flex items-center gap-3">
            <span>🎯</span> Expected Outcomes of a Quantum Lab
          </h2>
          <p className="text-sm text-muted-foreground">
            Tangible results that a well-established quantum lab can deliver across academic, industrial, 
            and societal dimensions.
          </p>

          <div className="space-y-6">
            {labOutcomes.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 md:p-8 border-l-4 border-accent"
              >
                <h3 className="text-base md:text-xl font-bold text-white mb-4">{area.area}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {area.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3 text-xs md:text-sm text-slate-400 p-2">
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* KPI Dashboard Preview */}
          <div className="glass rounded-3xl p-6 md:p-10 border-2 border-success/20">
            <h3 className="text-lg md:text-2xl font-bold font-outfit mb-6 flex items-center gap-2">
              <span>📊</span> 5-Year KPI Targets (Tier 1 Lab)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'PhD Graduates', value: '12-15', unit: 'scholars', color: 'text-primary' },
                { label: 'Journal Publications', value: '50+', unit: 'papers', color: 'text-secondary' },
                { label: 'Patents Filed', value: '8-12', unit: 'IP filings', color: 'text-accent' },
                { label: 'Industry Projects', value: '10+', unit: 'collaborations', color: 'text-success' },
                { label: 'Startups Incubated', value: '3-5', unit: 'spin-offs', color: 'text-math' },
                { label: 'Courses Launched', value: '6+', unit: 'new courses', color: 'text-primary' },
                { label: 'Students Trained', value: '500+', unit: 'per year', color: 'text-secondary' },
                { label: 'Grant Funding', value: '₹50+ Cr', unit: 'total secured', color: 'text-accent' },
              ].map((kpi, i) => (
                <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
                  <div className={`text-xl md:text-3xl font-black font-mono ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1">{kpi.label}</div>
                  <div className="text-[9px] text-slate-600">{kpi.unit}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="glass rounded-3xl p-6 md:p-10 bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 text-center">
            <h3 className="text-lg md:text-2xl font-bold font-outfit mb-3">🚀 Building India&apos;s Quantum Future</h3>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              With the National Quantum Mission allocating ₹6,003 crore (2023-2031) and multiple funding 
              agencies actively supporting quantum research, now is the opportune moment for Indian 
              institutions to establish quantum laboratories. The ecosystem already includes 10+ world-class 
              quantum labs across IISc, IITs, TIFR, ISI, and C-DAC — providing collaboration opportunities 
              and a talent pipeline. A well-planned quantum lab can position an institution at the forefront 
              of India&apos;s quantum revolution while delivering measurable outcomes in research, education, 
              industry engagement, and national technology sovereignty.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
