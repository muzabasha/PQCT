"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface EquationProps {
  latex: string;
  symbols: Record<string, string>;
  meaning: string;
  whyNeeded: string;
  interpretation: string;
  numericalExample: string;
}

export function MathEquation({ latex, symbols, meaning, whyNeeded, interpretation, numericalExample }: EquationProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-slate-900/40 border border-math/20 rounded-2xl p-6 my-6 transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-math/10 text-math px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
          Mathematical Model
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-muted-foreground hover:text-math transition-colors"
        >
          {showDetails ? "Hide Analysis" : "Show Full Analysis"}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-xl mb-6 border border-slate-800">
        <BlockMath math={latex} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <div>
            <h4 className="text-math font-bold mb-2 uppercase tracking-tighter">Symbol Decoding</h4>
            <ul className="space-y-1">
              {Object.entries(symbols).map(([symbol, desc]) => (
                <li key={symbol} className="flex gap-2">
                  <span className="font-mono text-math"><InlineMath math={symbol} /></span>
                  <span className="text-slate-400">: {desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-math font-bold mb-2 uppercase tracking-tighter">Meaning</h4>
            <p className="text-slate-300 leading-relaxed">{meaning}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-math font-bold mb-2 uppercase tracking-tighter">Why is this needed?</h4>
            <p className="text-slate-300 leading-relaxed">{whyNeeded}</p>
          </div>
          <div>
            <h4 className="text-math font-bold mb-2 uppercase tracking-tighter">Interpretation</h4>
            <p className="text-slate-300 leading-relaxed">{interpretation}</p>
          </div>
        </div>
      </div>

      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-slate-800 space-y-4"
        >
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <h4 className="text-success font-bold mb-3 uppercase tracking-tighter flex items-center gap-2">
              <span>🔢</span> Numerical Example
            </h4>
            <p className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {numericalExample}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
