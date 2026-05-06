"use client";

import { useState } from 'react';
import { Math } from '@/components/ui/math';

export default function EquationSandbox() {
  const [equation, setEquation] = useState('E = mc^2');

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Equation Sandbox</h1>
        <p className="text-xl text-slate-400">Type LaTeX to render instantly</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <textarea 
          value={equation} 
          onChange={(e) => setEquation(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white font-mono h-32 focus:outline-none focus:border-blue-500"
          placeholder="Enter LaTeX equation..."
        />
        
        <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 min-h-[150px] flex items-center justify-center overflow-x-auto text-2xl">
          <Math block math={equation} />
        </div>
      </div>
    </div>
  );
}
