"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Question {
  type: 'Conceptual' | 'Numerical' | 'Application' | 'ProblemSolving';
  text: string;
  answer: string;
  explanation: string;
  keyPoints: string[];
  commonMistakes: string[];
  tips: string[];
}

export function QuestionsBlock({ questions }: { questions: Question[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {questions.map((q, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-widest`}>
                {q.type}
              </span>
              <span className="text-xs font-bold text-muted-foreground">2 Marks</span>
            </div>
            <h4 className="text-lg font-bold text-slate-100 leading-snug">
              {q.text}
            </h4>
          </div>
          
          <button 
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className="w-full py-4 px-6 bg-white/80 hover:bg-white transition-colors text-sm font-bold text-primary flex items-center justify-between border-t border-border/20"
          >
            {activeIndex === i ? 'Hide Solution' : 'View Detailed Solution'}
            <span>{activeIndex === i ? '↑' : '→'}</span>
          </button>

          <AnimatePresence>
            {activeIndex === i && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white/95 border-t border-border/20"
              >
                <div className="p-6 space-y-6">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-success mb-2">Model Answer</h5>
                    <p className="text-sm text-slate-700 leading-relaxed">{q.answer}</p>
                  </div>
                  
                  <div className="bg-white/80 p-4 rounded-xl space-y-4">
                    <div>
                      <h6 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Key Points for Discussion</h6>
                      <ul className="grid grid-cols-1 gap-1">
                        {q.keyPoints.map((kp, j) => (
                          <li key={j} className="text-xs text-slate-600 flex gap-2">
                            <span className="text-primary">•</span> {kp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-1">Common Mistakes</h6>
                        <ul className="space-y-1">
                          {q.commonMistakes.map((cm, j) => (
                            <li key={j} className="text-[10px] text-slate-600 italic">
                              ❌ {cm}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Retention Tip</h6>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          💡 {q.tips[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
