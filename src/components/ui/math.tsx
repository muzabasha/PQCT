import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathProps {
  math: string;
  block?: boolean;
}

export function Math({ math, block = false }: MathProps) {
  if (block) {
    return <div className="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-inner overflow-x-auto"><BlockMath math={math} /></div>;
  }
  return <span className="text-blue-300 font-medium"><InlineMath math={math} /></span>;
}

export function MathSteps({ steps }: { steps: { step: string; formula: string; values: string; message?: string }[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            {i + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-200">{step.step}</h4>
            {step.message ? (
               <p className="text-slate-400 mt-1">{step.message}</p>
            ) : (
               <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <div className="text-xs text-slate-500 mb-1">Formula</div>
                   <Math math={step.formula} />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 mb-1">Values</div>
                   <Math math={step.values} />
                 </div>
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
