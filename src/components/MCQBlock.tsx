"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  justification: string;
}

interface MCQBlockProps {
  title: string;
  subtitle: string;
  icon: string;
  items: string[];
  mcqs: MCQ[];
}

export function MCQBlock({ title, subtitle, icon, items, mcqs }: MCQBlockProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelected(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = (qIdx: number) => {
    setSubmitted(prev => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="h-px flex-1 bg-border/50" />
        <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter flex items-center gap-2 md:gap-3">
          <span>{icon}</span> {title}
        </h2>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      <p className="text-sm md:text-lg text-muted-foreground text-center">{subtitle}</p>

      {items.length > 0 && (
        <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl">
          <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-primary">Core Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 bg-white/80 p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-200">
                <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] md:text-xs font-bold">{i + 1}</span>
                <span className="text-[11px] md:text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <h3 className="text-lg md:text-2xl font-bold font-outfit">Knowledge Check — MCQs</h3>
        <p className="text-sm md:text-base text-muted-foreground">Select the best answer for each question, then check your understanding.</p>

        {mcqs.map((mcq, qIdx) => (
          <div key={qIdx} className={`glass rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-300 ${
            submitted[qIdx]
              ? selected[qIdx] === mcq.correctIndex
                ? 'border-success/30'
                : 'border-destructive/30'
              : 'border-slate-200'
          }`}>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] md:text-sm font-bold">
                  {qIdx + 1}
                </span>
                <p className="text-sm md:text-lg font-bold text-slate-100 leading-snug pt-0.5 md:pt-1">{mcq.question}</p>
              </div>

              <div className="grid grid-cols-1 gap-1.5 md:gap-2 pl-8 md:pl-12">
                {mcq.options.map((opt, optIdx) => {
                  const isSelected = selected[qIdx] === optIdx;
                  const isCorrect = submitted[qIdx] && optIdx === mcq.correctIndex;
                  const isWrong = submitted[qIdx] && isSelected && optIdx !== mcq.correctIndex;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => !submitted[qIdx] && handleSelect(qIdx, optIdx)}
                      className={`text-left px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
                        isCorrect
                          ? 'bg-success/20 text-success border border-success/40'
                          : isWrong
                            ? 'bg-destructive/20 text-destructive border border-destructive/40'
                            : isSelected
                              ? 'bg-primary/10 text-primary border border-primary/30'
                              : 'bg-white/80 text-slate-700 border border-slate-200 hover:border-primary/30'
                      }`}
                    >
                      <span className="font-mono mr-2 md:mr-3 opacity-60">{String.fromCharCode(65 + optIdx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!submitted[qIdx] && selected[qIdx] !== undefined && (
                <div className="pl-8 md:pl-12">
                  <button
                    onClick={() => handleSubmit(qIdx)}
                    className="px-5 md:px-6 py-1.5 md:py-2 bg-primary text-primary-foreground rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:opacity-90 transition-all"
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {submitted[qIdx] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`pl-8 md:pl-12 p-3 md:p-4 rounded-lg md:rounded-xl ${
                    selected[qIdx] === mcq.correctIndex
                      ? 'bg-success/5 border border-success/20'
                      : 'bg-destructive/5 border border-destructive/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <span className={`font-bold text-xs md:text-sm ${selected[qIdx] === mcq.correctIndex ? 'text-success' : 'text-destructive'}`}>
                      {selected[qIdx] === mcq.correctIndex ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-primary">Justification: </span>
                    {mcq.justification}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
