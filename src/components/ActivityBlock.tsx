"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ActivityProps {
  level: number;
  title: string;
  objective: string;
  instructions: string[];
  materials: string[];
  expectedOutput: string;
  assessmentRubrics: string[];
  time: string;
}

export function ActivityBlock({ level, title, objective, instructions, materials, expectedOutput, assessmentRubrics, time }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    "from-blue-500 to-cyan-500",   // Level 1
    "from-emerald-500 to-teal-500", // Level 2
    "from-amber-500 to-orange-500", // Level 3
    "from-rose-500 to-pink-500"    // Level 4
  ];

  const labels = [
    "Teacher Do",
    "Teacher + Student",
    "All Students Do",
    "Individual Do"
  ];

  return (
    <div className={`glass rounded-3xl overflow-hidden transition-all duration-500 ${isOpen ? 'ring-2 ring-primary/30 shadow-2xl' : 'hover:translate-y-[-4px]'}`}>
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[level-1]} flex items-center justify-center font-black text-2xl text-white shadow-lg`}>
            {level}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {labels[level-1]} • {time}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-8 space-y-8 bg-white/60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                      <span>🎯</span> Objective
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{objective}</p>
                  </div>
                  <div>
                    <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                      <span>🛠️</span> Materials Needed
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {materials.map((m, i) => (
                        <li key={i} className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-700 border border-slate-200">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                    <span>📝</span> Step-by-Step Instructions
                  </h4>
                  <ul className="space-y-3">
                    {instructions.map((step, i) => (
                      <li key={i} className="flex gap-4 group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {i + 1}
                        </span>
                        <span className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/20">
                <div>
                  <h4 className="text-success font-bold mb-3 flex items-center gap-2">
                    <span>✨</span> Expected Output
                  </h4>
                  <p className="text-slate-600 text-sm italic">{expectedOutput}</p>
                </div>
                <div>
                  <h4 className="text-accent font-bold mb-3 flex items-center gap-2">
                    <span>📊</span> Assessment Rubric
                  </h4>
                  <ul className="space-y-1">
                    {assessmentRubrics.map((r, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-2">
                        <span className="text-accent">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
