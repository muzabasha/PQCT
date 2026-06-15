"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const modules = [
  {
    id: 1, path: '/modules/1-need-pqc',
    title: 'The Quantum Threat',
    desc: 'Why classical cryptography fails against quantum computers.',
    icon: '⚛️', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', tag: 'text-primary',
    topics: ['Complexity Classes', "Shor's Period Finding", 'RSA Collapse Model'],
  },
  {
    id: 2, path: '/modules/2-rsa-ecc',
    title: 'RSA & Elliptic Curves',
    desc: 'Build, encrypt, and decrypt with real mathematical operations.',
    icon: '🔐', color: 'from-secondary/20 to-indigo-500/10', border: 'border-secondary/30', tag: 'text-secondary',
    topics: ['Key Generation', 'Modular Exponentiation', 'ECC Scalar Multiplication'],
  },
  {
    id: 3, path: '/modules/3-shor-grover',
    title: "Shor's & Grover's",
    desc: 'Simulate the two quantum algorithms that break classical crypto.',
    icon: '🌊', color: 'from-math/20 to-pink-500/10', border: 'border-math/30', tag: 'text-math',
    topics: ['QFT Period Extraction', 'Amplitude Amplification', 'Complexity Comparison'],
  },
  {
    id: 4, path: '/modules/4-shor-impact',
    title: 'Harvest Now, Decrypt Later',
    desc: "The active threat that doesn't wait for Q-Day.",
    icon: '⏳', color: 'from-destructive/20 to-orange-500/10', border: 'border-destructive/30', tag: 'text-destructive',
    topics: ['HNDL Threat Model', 'T_migrate Formula', 'Sector Risk Mapping'],
  },
  {
    id: 5, path: '/modules/5-pqc',
    title: 'Post-Quantum Cryptography',
    desc: 'The NIST-standardized algorithms that survive the quantum era.',
    icon: '🛡️', color: 'from-success/20 to-emerald-500/10', border: 'border-success/30', tag: 'text-success',
    topics: ['LWE & Lattices', 'McEliece Code-Based', 'Kyber / Dilithium / SPHINCS+'],
  },
  {
    id: 6, path: '/modules/6-dashboard',
    title: 'Comparative Dashboard',
    desc: 'Side-by-side analysis of all algorithms and your learning progress.',
    icon: '📊', color: 'from-accent/20 to-yellow-500/10', border: 'border-accent/30', tag: 'text-accent',
    topics: ['Algorithm Comparison', 'Progress Tracker', 'Learning Analytics'],
  },
];

const pillars = [
  { icon: '📖', label: 'Storytelling First', desc: 'Every topic begins with a relatable analogy before any math.' },
  { icon: '∑', label: 'Mathematical Rigour', desc: 'KaTeX-rendered equations with symbol-by-symbol explanations.' },
  { icon: '🧪', label: 'Virtual Lab', desc: 'Interactive simulations you can tune and observe in real time.' },
  { icon: '🎯', label: 'Activity Based', desc: '4-level ABL: Teacher Do → We Do → Group Do → Individual Do.' },
  { icon: '🚀', label: 'Project Based', desc: 'Full PBL framework with scope, risk, timeline, and milestones.' },
  { icon: '✅', label: 'Human Review', desc: 'HITL gate after every topic — no progression without approval.' },
];

function ProgressSnapshot() {
  const [progress, setProgress] = useState({ completed: 0, total: 5, streak: 0 });

  useEffect(() => {
    const modKeys = [
      'the-quantum-threat',
      'rsa--elliptic-curves',
      "shor's--grover's",
      'harvest-now-decrypt-later',
      'post-quantum-cryptography',
    ];
    let completedCount = 0;
    modKeys.forEach(key => {
      const insightData = localStorage.getItem(`saved-insights-${key}`);
      const checkData = localStorage.getItem(`mini-checkpoints-${key}`);
      if (insightData || checkData) {
        const insights = insightData ? JSON.parse(insightData) : [];
        const cps = checkData ? Object.values(JSON.parse(checkData) as Record<string, boolean>) : [];
        if (insights.length > 0 || cps.some(Boolean)) completedCount++;
      }
    });
    const lastVisit = localStorage.getItem('last-visit');
    const today = new Date().toDateString();
    const streak = lastVisit === today ? (parseInt(localStorage.getItem('streak') || '0', 10)) : lastVisit ? 1 : 0;
    localStorage.setItem('last-visit', today);
    localStorage.setItem('streak', String(streak));
    setProgress({ completed: completedCount, total: modKeys.length, streak });
  }, []);

  return (
    <section className="container mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-4 md:p-6 border border-primary/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Progress</div>
              <div className="text-lg md:text-2xl font-bold text-white">
                {progress.completed} <span className="text-slate-500">/ {progress.total} modules</span>
              </div>
            </div>
            <div className="w-24 md:w-32">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Streak</div>
              <div className="text-lg md:text-2xl font-bold text-yellow-400">{progress.streak} days</div>
            </div>
            <Link
              href="/modules/6-dashboard"
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold text-xs md:text-sm rounded-xl transition"
            >
              Full Dashboard →
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-32 pb-16 md:pb-32">
      {/* Hero */}
      <section className="min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 space-y-6 md:space-y-8 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-sm font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            NEP 2020 Aligned · NIST PQC Standards
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Post-Quantum
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-math bg-clip-text text-transparent">
              Cryptography Lab
            </span>
          </h1>

          <p className="text-base md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-2">
            Measure and validate the impact of post-quantum cryptography techniques.
            Quantify threat levels, benchmark performance, and validate security through interactive simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4">
            <Link href="/modules/1-need-pqc"
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-primary text-primary-foreground rounded-2xl font-black text-base md:text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/25">
              Begin Learning →
            </Link>
            <Link href="/subject-overview"
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 glass border border-slate-700 text-slate-300 rounded-2xl font-bold text-base md:text-lg hover:bg-slate-800 transition-all">
              View Curriculum
            </Link>
            <a href="https://scholar-sparkle-web.lovable.app" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 glass border border-secondary/40 text-secondary rounded-2xl font-bold text-base md:text-lg hover:bg-secondary/10 hover:border-secondary/60 transition-all">
              👤 Resource Person
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 flex-col items-center gap-2 text-muted-foreground text-xs md:text-sm hidden md:flex"
        >
          <span>Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.div>
        </motion.div>
      </section>

      {/* Quick Progress Snapshot */}
      <ProgressSnapshot />

      {/* Pedagogical Pillars */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-black font-outfit mb-3 md:mb-4">Built on 6 Pedagogical Pillars</h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">Every topic is designed to move from intuition to mastery using proven learning science.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {pillars.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-colors group"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{p.label}</div>
              <div className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Module Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-black font-outfit mb-1 md:mb-2">6 Core Modules</h2>
            <p className="text-sm md:text-lg text-muted-foreground">Complete syllabus coverage from classical threats to quantum-safe solutions.</p>
          </div>
          <Link href="/modules" className="self-stretch md:self-auto text-center px-5 md:px-6 py-3 glass border border-slate-700 text-slate-300 rounded-xl font-bold text-xs md:text-sm hover:bg-slate-800 transition-all">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {modules.map((mod, i) => (
            <motion.div key={mod.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            >
              <Link href={mod.path} className="block h-full group">
                <div className={`h-full glass bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl md:rounded-3xl p-5 md:p-8 hover:scale-[1.02] hover:shadow-2xl transition-all flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <span className="text-2xl md:text-4xl">{mod.icon}</span>
                      <span className={`text-[10px] md:text-xs font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-slate-800 ${mod.tag}`}>
                        Module {mod.id}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-white transition-colors">{mod.title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">{mod.desc}</p>
                    <div className="space-y-1">
                      {mod.topics.map((t, j) => (
                        <div key={j} className="text-[10px] text-slate-500 flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full ${mod.tag.replace('text-', 'bg-')}`} />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-8 flex items-center gap-2 text-xs md:text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                    Start Topic
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="glass rounded-2xl md:rounded-[3rem] p-6 md:p-16 text-center relative overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-black font-outfit">Ready to become quantum-safe?</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with Module 1 and progress through the complete PQCT curriculum. 
              Each topic awaits your review before proceeding.
            </p>
            <Link href="/modules/1-need-pqc"
              className="inline-block px-8 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl font-black text-base md:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/25">
              Start Module 1: The Quantum Threat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
