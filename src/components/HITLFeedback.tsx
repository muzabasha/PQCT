"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface HITLProps {
  topicName: string;
  onContinue: () => void;
}

export function HITLFeedback({ topicName, onContinue }: HITLProps) {
  const [status, setStatus] = useState<'pending' | 'submitted'>('pending');

  return (
    <div className="my-20 p-12 glass rounded-[3rem] border-2 border-primary/20 bg-primary/5 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="relative z-10 space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Human-in-the-Loop Review
        </div>

        <h2 className="text-4xl font-black font-outfit">
          Mastery Check: {topicName}
        </h2>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          I have completed the content generation for this topic using the recursive pedagogical strategy. 
          Please review the sections above and provide your feedback.
        </p>

        {status === 'pending' ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={() => setStatus('submitted')}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Approve & Proceed to Next Topic
            </button>
            <button 
              className="px-10 py-4 glass border border-slate-700 text-slate-300 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Review Again
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-success/10 border border-success/30 p-8 rounded-3xl"
          >
            <div className="text-success text-2xl font-bold mb-2">Topic Approved!</div>
            <p className="text-success/80">Proceeding to the next topic in the syllabus...</p>
            <button 
              onClick={onContinue}
              className="mt-6 px-8 py-3 bg-success text-white rounded-xl font-bold hover:scale-105 transition-all"
            >
              Continue
            </button>
          </motion.div>
        )}

        <div className="pt-12 text-sm text-slate-500 italic">
          Tip: You can suggest improvements in the chat, and I will regenerate the sections accordingly.
        </div>
      </motion.div>
    </div>
  );
}
