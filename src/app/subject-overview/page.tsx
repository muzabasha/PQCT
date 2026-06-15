"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const modules = [
  {
    id: 1, path: '/modules/1-need-pqc', title: 'The Quantum Threat',
    icon: '⚛️', color: 'border-primary/30',
    topics: [
      { name: "Why Classical Crypto Fails", type: 'Concept', status: 'active' },
      { name: "Shor's Period Finding", type: 'Math', status: 'active' },
      { name: "Complexity: Exp vs Poly", type: 'Math', status: 'active' },
      { name: "Virtual Lab: QFT Simulator", type: 'Lab', status: 'active' },
    ]
  },
  {
    id: 2, path: '/modules/2-rsa-ecc', title: 'RSA & Elliptic Curves',
    icon: '🔐', color: 'border-secondary/30',
    topics: [
      { name: "RSA Key Generation", type: 'Concept', status: 'active' },
      { name: "Modular Exponentiation", type: 'Math', status: 'active' },
      { name: "ECC: Scalar Multiplication", type: 'Math', status: 'active' },
      { name: "Virtual Lab: RSA/ECC Simulator", type: 'Lab', status: 'active' },
    ]
  },
  {
    id: 3, path: '/modules/3-shor-grover', title: "Shor's & Grover's Algorithms",
    icon: '🌊', color: 'border-math/30',
    topics: [
      { name: "Shor's Algorithm Deep Dive", type: 'Concept', status: 'active' },
      { name: "Grover's Amplitude Amplification", type: 'Math', status: 'active' },
      { name: "Complexity Comparison", type: 'Math', status: 'active' },
      { name: "Virtual Lab: Dual Simulator", type: 'Lab', status: 'active' },
    ]
  },
  {
    id: 4, path: '/modules/4-shor-impact', title: 'Harvest Now, Decrypt Later',
    icon: '⏳', color: 'border-destructive/30',
    topics: [
      { name: "HNDL Threat Model", type: 'Concept', status: 'active' },
      { name: "T_migrate Formula", type: 'Math', status: 'active' },
      { name: "Sector Risk Mapping", type: 'Application', status: 'active' },
      { name: "Virtual Lab: Migration Calculator", type: 'Lab', status: 'active' },
    ]
  },
  {
    id: 5, path: '/modules/5-pqc', title: 'Post-Quantum Cryptography',
    icon: '🛡️', color: 'border-success/30',
    topics: [
      { name: "Learning With Errors (LWE)", type: 'Concept', status: 'active' },
      { name: "McEliece Code-Based Crypto", type: 'Math', status: 'active' },
      { name: "NIST Standards: Kyber, Dilithium", type: 'Application', status: 'active' },
      { name: "Virtual Lab: PQC Simulator", type: 'Lab', status: 'active' },
    ]
  },
  {
    id: 6, path: '/modules/6-dashboard', title: 'Comparative Dashboard',
    icon: '📊', color: 'border-accent/30',
    topics: [
      { name: "Algorithm Comparison", type: 'Analysis', status: 'active' },
      { name: "Progress Analytics", type: 'Tool', status: 'active' },
      { name: "Topic Dependency Map", type: 'Tool', status: 'active' },
      { name: "Prerequisite Navigator", type: 'Tool', status: 'active' },
    ]
  },
];

const typeColors: Record<string, string> = {
  'Concept': 'bg-primary/10 text-primary',
  'Math': 'bg-math/10 text-math',
  'Lab': 'bg-success/10 text-success',
  'Application': 'bg-accent/10 text-accent',
  'Analysis': 'bg-secondary/10 text-secondary',
  'Tool': 'bg-slate-100 text-slate-600',
};

export default function SubjectOverview() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12 md:space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Complete Curriculum View
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">Subject Overview</h1>
        <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Full syllabus coverage for Post-Quantum Cryptography Training (PQCT). 
          6 modules, 24+ topics, aligned with NIST standards and NEP 2020.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Modules', value: '6', color: 'text-primary' },
          { label: 'Topics', value: '24+', color: 'text-secondary' },
          { label: 'Virtual Labs', value: '6', color: 'text-success' },
          { label: 'PBL Projects', value: '5', color: 'text-math' },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 md:p-6 rounded-2xl text-center">
            <div className={`text-2xl md:text-4xl font-black font-mono ${stat.color}`}>{stat.value}</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Learning Flow */}
      <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <span className="text-primary">→</span> Learning Flow (Sequential)
        </h2>
        <div className="flex gap-3 items-center overflow-x-auto pb-2 scrollbar-thin">
          {modules.map((mod, i) => (
            <div key={mod.id} className="flex items-center gap-3 flex-shrink-0">
              <Link href={mod.path}
                className="px-3 md:px-4 py-2 bg-white border border-slate-200 hover:border-primary/50 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-1 md:gap-2">
                <span className="text-base md:text-lg">{mod.icon}</span>
                <span className="text-slate-700 whitespace-nowrap">{mod.title}</span>
              </Link>
              {i < modules.length - 1 && <span className="text-muted-foreground text-lg md:text-xl flex-shrink-0">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Module Details */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-black font-outfit">Module Breakdown</h2>
        {modules.map((mod, i) => (
          <motion.div key={mod.id}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }} viewport={{ once: true }}
            className={`glass border ${mod.color} rounded-2xl md:rounded-3xl overflow-hidden`}
          >
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-3xl md:text-4xl">{mod.icon}</span>
                  <div>
                    <div className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Module {mod.id}</div>
                    <h3 className="text-lg md:text-2xl font-bold">{mod.title}</h3>
                  </div>
                </div>
                <Link href={mod.path}
                  className="self-stretch md:self-auto text-center px-4 md:px-5 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs md:text-sm hover:opacity-90 transition-all">
                  Open Module
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {mod.topics.map((topic, j) => (
                  <div key={j} className="bg-white/80 border border-slate-200 p-3 md:p-4 rounded-xl space-y-1 md:space-y-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColors[topic.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {topic.type}
                    </span>
                    <div className="text-[11px] md:text-sm font-medium text-slate-700 leading-tight">{topic.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical Sections Strip */}
            <div className="border-t border-slate-200 px-4 md:px-8 py-3 md:py-4 flex flex-wrap gap-2 md:gap-3 bg-white/60">
              {['Storytelling', 'Math Modelling', 'Virtual Lab', 'ABL', 'PBL', 'Questions', 'HITL Review'].map(sec => (
                <span key={sec} className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  ✓ {sec}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
