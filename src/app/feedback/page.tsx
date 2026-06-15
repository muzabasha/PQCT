"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FeedbackPage() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');
  const [form, setForm] = useState({ module: '1', section: 'Storytelling', rating: '5', comments: '', suggestion: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitted');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-12">
      <div className="space-y-2 md:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Human-in-the-Loop Review
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter">Feedback & Review</h1>
        <p className="text-sm md:text-xl text-muted-foreground leading-relaxed">
          This platform implements a recursive human review loop. 
          Your feedback directly shapes how each topic is refined before the next one is generated.
        </p>
      </div>

      <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-3 md:space-y-4">
        <h2 className="text-base md:text-xl font-bold flex items-center gap-2"><span>🔄</span> How the HITL Loop Works</h2>
        <div className="space-y-2 md:space-y-3">
          {[
            { step: 1, text: 'Topic content is generated using the 6-section pedagogical framework.', color: 'bg-primary' },
            { step: 2, text: 'Execution pauses. You review: story, math, lab, activities, project, questions.', color: 'bg-secondary' },
            { step: 3, text: 'You approve, request changes, or add specific improvement notes here.', color: 'bg-accent' },
            { step: 4, text: 'The platform regenerates improved content based on your specific feedback.', color: 'bg-math' },
            { step: 5, text: 'Only after your explicit approval does the next topic begin generation.', color: 'bg-success' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 md:gap-4 items-start">
              <div className={`w-6 h-6 md:w-8 md:h-8 ${item.color} rounded-full flex-shrink-0 flex items-center justify-center font-black text-white text-[10px] md:text-sm`}>
                {item.step}
              </div>
              <p className="text-slate-300 pt-0.5 md:pt-1 leading-relaxed text-xs md:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {status === 'idle' ? (
        <form onSubmit={handleSubmit} className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-2xl font-bold">Submit Review</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Module</label>
              <select value={form.module} onChange={e => setForm({...form, module: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white outline-none focus:ring-2 focus:ring-primary">
                {[1,2,3,4,5,6].map(m => <option key={m} value={m}>Module {m}</option>)}
              </select>
            </div>
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Section Reviewed</label>
              <select value={form.section} onChange={e => setForm({...form, section: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white outline-none focus:ring-2 focus:ring-primary">
                {['Storytelling', 'Math Modelling', 'Virtual Lab', 'Activity Based Learning', 'Project Based Learning', 'Questions', 'Full Module'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Overall Rating</label>
            <div className="flex gap-2 md:gap-3">
              {[1,2,3,4,5].map(r => (
                <button type="button" key={r} onClick={() => setForm({...form, rating: String(r)})}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl font-black text-base md:text-lg transition-all ${form.rating === String(r) ? 'bg-primary text-primary-foreground scale-110' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Observations & Comments</label>
            <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})}
              rows={3} placeholder="What worked well? What needs improvement? Were the analogies effective? Was the math depth appropriate?"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Specific Improvement Suggestion</label>
            <textarea value={form.suggestion} onChange={e => setForm({...form, suggestion: e.target.value})}
              rows={2} placeholder="'Please add a numerical example for LWE with n=3' or 'The Grover analogy needs more humor' etc."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button type="submit"
              className="flex-1 bg-primary text-primary-foreground py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:opacity-90 active:scale-95 transition-all">
              ✅ Approve & Submit Review
            </button>
            <button type="button"
              className="px-5 md:px-6 py-3 md:py-4 glass border border-slate-700 text-slate-300 rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:bg-slate-800 transition-all">
              Request Changes
            </button>
          </div>
        </form>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass border-2 border-success/30 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center space-y-4 md:space-y-6">
          <div className="text-4xl md:text-6xl">✅</div>
          <h2 className="text-2xl md:text-3xl font-black text-success">Review Submitted!</h2>
          <p className="text-sm md:text-lg text-slate-400">
            Thank you for your review of Module {form.module} — {form.section}. 
            Your feedback will be incorporated before the next topic is generated.
          </p>
          <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl md:rounded-2xl text-left space-y-1 md:space-y-2">
            <div className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase">Your Review Summary</div>
            <div className="text-xs md:text-sm text-slate-300">Module: {form.module} | Section: {form.section} | Rating: {form.rating}/5</div>
            {form.comments && <div className="text-xs md:text-sm text-slate-400 italic">"{form.comments}"</div>}
          </div>
          <button onClick={() => setStatus('idle')}
            className="px-6 md:px-8 py-2 md:py-3 bg-primary text-primary-foreground rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:opacity-90 transition-all">
            Submit Another Review
          </button>
        </motion.div>
      )}
    </div>
  );
}
