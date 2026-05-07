"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ActivityLevel {
  title: string;
  description: string;
  instructions: string[];
}

interface PedagogyProps {
  story: string;
  whatLearned: string[];
  topicName: string;
  topicIntroduction: string;
  activities: ActivityLevel[];
}

export function Pedagogy({ story, whatLearned, topicName, topicIntroduction, activities }: PedagogyProps) {
  const [showTopic, setShowTopic] = useState(false);
  const [activeInstruction, setActiveInstruction] = useState<number | null>(null);

  return (
    <div className="space-y-12">
      {/* Story Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
          <span className="text-3xl">📖</span> The Story
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-slate-300 leading-relaxed italic font-serif">
            "{story}"
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">What did we just learn?</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatLearned.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm flex items-start gap-3"
              >
                <span className="text-amber-500 mt-1">✨</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {!showTopic ? (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowTopic(true)}
              className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
            >
              Reveal the Actual Topic
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-12 pt-12 border-t border-slate-800"
          >
            <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Introducing: {topicName}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-4xl">
              {topicIntroduction}
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* ABL Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Activity Based Learning (ABL)</h2>
          <p className="text-slate-500">Follow the steps for each phase of discovery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className={`bg-slate-900/60 border ${activeInstruction === i ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800'} p-6 rounded-2xl relative overflow-hidden group transition-all`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black text-white">{i + 1}</span>
              </div>
              <h4 className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-2">Level {i + 1}</h4>
              <h5 className="text-white font-bold text-lg mb-3">{activity.title}</h5>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {activity.description}
              </p>
              
              <button 
                onClick={() => setActiveInstruction(activeInstruction === i ? null : i)}
                className="text-xs font-bold text-amber-500/80 hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                {activeInstruction === i ? 'Hide Instructions' : 'View Activity Steps'}
                <span>{activeInstruction === i ? '↑' : '↓'}</span>
              </button>

              <AnimatePresence>
                {activeInstruction === i && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-800"
                  >
                    <ul className="space-y-3">
                      {activity.instructions.map((step, si) => (
                        <li key={si} className="text-xs text-slate-300 flex gap-2">
                          <span className="text-amber-500 font-bold">{si + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
