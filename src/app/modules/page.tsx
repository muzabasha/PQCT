"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const modules = [
  { id: 1, path: '/modules/1-need-pqc', title: 'The Quantum Threat', desc: 'Why classical cryptography fails against quantum computers. Complexity classes, period finding, and the RSA collapse model.', icon: '⚛️', accent: 'primary', topics: 4, labs: 1, abls: 4, pbl: 1 },
  { id: 2, path: '/modules/2-rsa-ecc', title: 'RSA & Elliptic Curves', desc: 'Build, encrypt, and decrypt with real mathematical operations. Includes a working RSA key generator and ECC visualizer.', icon: '🔐', accent: 'secondary', topics: 4, labs: 1, abls: 4, pbl: 1 },
  { id: 3, path: '/modules/3-shor-grover', title: "Shor's & Grover's", desc: 'Simulate the two quantum algorithms that break classical cryptography. Compare step counts: classical vs quantum.', icon: '🌊', accent: 'math', topics: 4, labs: 1, abls: 4, pbl: 1 },
  { id: 4, path: '/modules/4-shor-impact', title: 'Harvest Now, Decrypt Later', desc: 'Calculate your migration deadline. Understand why HNDL is an active threat today — not a future concern.', icon: '⏳', accent: 'destructive', topics: 4, labs: 1, abls: 4, pbl: 1 },
  { id: 5, path: '/modules/5-pqc', title: 'Post-Quantum Cryptography', desc: 'Lattice-based, code-based, and hash-based algorithms. Simulate LWE key generation and explore NIST FIPS 203/204/205.', icon: '🛡️', accent: 'success', topics: 4, labs: 1, abls: 4, pbl: 1 },
  { id: 6, path: '/modules/6-dashboard', title: 'Comparative Dashboard', desc: 'Side-by-side algorithm comparison, learning progress tracker, and topic dependency graph.', icon: '📊', accent: 'accent', topics: 4, labs: 0, abls: 0, pbl: 0 },
];

const accentMap: Record<string, { border: string; badge: string; glow: string }> = {
  primary:     { border: 'border-primary/30',     badge: 'bg-primary/10 text-primary',     glow: 'hover:shadow-primary/10' },
  secondary:   { border: 'border-secondary/30',   badge: 'bg-secondary/10 text-secondary', glow: 'hover:shadow-secondary/10' },
  math:        { border: 'border-math/30',         badge: 'bg-math/10 text-math',           glow: 'hover:shadow-math/10' },
  destructive: { border: 'border-destructive/30', badge: 'bg-destructive/10 text-destructive', glow: 'hover:shadow-destructive/10' },
  success:     { border: 'border-success/30',     badge: 'bg-success/10 text-success',     glow: 'hover:shadow-success/10' },
  accent:      { border: 'border-accent/30',      badge: 'bg-accent/10 text-accent',       glow: 'hover:shadow-accent/10' },
};

export default function ModulesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-12">
      <div className="space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Full Curriculum
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">All Modules</h1>
        <p className="text-sm md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          6 modules covering the complete post-quantum cryptography curriculum. 
          Each module includes storytelling, math modelling, virtual labs, ABL, PBL, and a human review gate.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 p-3 md:p-4 glass rounded-2xl text-[10px] md:text-sm">
        <div className="flex items-center gap-1 md:gap-2"><span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary" />Concepts</div>
        <div className="flex items-center gap-1 md:gap-2"><span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-math" />Math</div>
        <div className="flex items-center gap-1 md:gap-2"><span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-success" />Lab</div>
        <div className="flex items-center gap-1 md:gap-2"><span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent" />Activity</div>
        <div className="flex items-center gap-1 md:gap-2"><span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-secondary" />Project</div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {modules.map((mod, i) => {
          const colors = accentMap[mod.accent];
          return (
            <motion.div key={mod.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} viewport={{ once: true }}
            >
              <Link href={mod.path} className="block group">
                <div className={`glass border ${colors.border} rounded-2xl md:rounded-3xl p-4 md:p-8 hover:scale-[1.01] hover:shadow-2xl ${colors.glow} transition-all`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {mod.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <span className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded ${colors.badge}`}>Module {mod.id}</span>
                        </div>
                        <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">{mod.title}</h2>
                        <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed max-w-2xl">{mod.desc}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-1.5 md:gap-2 md:min-w-[140px] md:items-end">
                      {[
                        { label: 'Topics', val: mod.topics, show: mod.topics > 0 },
                        { label: 'Virtual Labs', val: mod.labs, show: mod.labs > 0 },
                        { label: 'ABL Levels', val: mod.abls, show: mod.abls > 0 },
                        { label: 'PBL Project', val: mod.pbl, show: mod.pbl > 0 },
                      ].filter(x => x.show).map((item, j) => (
                        <div key={j} className="text-[10px] font-bold text-muted-foreground bg-slate-900 border border-slate-800 px-2 md:px-3 py-0.5 md:py-1 rounded-lg">
                          {item.val} {item.label}
                        </div>
                      ))}
                      <div className="text-xs md:text-sm font-bold text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all mt-1 md:mt-2 flex items-center gap-1">
                        Open <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
