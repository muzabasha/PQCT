"use client";

import { motion } from 'framer-motion';
import { MathEquation } from './MathEquation';
import { ActivityBlock } from './ActivityBlock';
import { PBLBlock } from './PBLBlock';
import { QuestionsBlock } from './QuestionsBlock';
import { HITLFeedback } from './HITLFeedback';

interface TopicTemplateProps {
  topicId: string;
  topicName: string;
  story: {
    title: string;
    content: string;
    analogy: string;
    reflectiveQuestions: string[];
    connectToTopic: string;
  };
  mathModelling: {
    need: string;
    motivation: string;
    challenges: { realWorld: string; technical: string };
    advantages: string[];
    limitations: string[];
    equations: any[];
    simulationResults: string;
  };
  abl: any[];
  pbl: any;
  questions: any[];
  virtualLab: {
    title: string;
    description: string;
    controls: string[];
    dataFlow: string;
    processExplanation: string;
    component: React.ReactNode;
  };
  summary: {
    insights: string[];
    advantages: string[];
    disadvantages: string[];
    futureScope: string;
    industrialApps: string[];
    careerRelevance: string;
  };
  onNextTopic: () => void;
}

export function TopicTemplate(props: TopicTemplateProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
      {/* SECTION 1: STORYTELLING */}
      <section id="story" className="pt-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-black font-outfit tracking-tighter">
              {props.story.title}
            </h1>
            <div className="h-2 w-24 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="story-card p-10 rounded-[3rem] glass relative">
                <span className="absolute -top-6 -left-6 text-6xl">🎭</span>
                <p className="text-2xl font-serif italic text-slate-300 leading-relaxed">
                  "{props.story.content}"
                </p>
              </div>
              
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <h4 className="text-accent font-bold mb-4 uppercase tracking-widest text-sm">Reflective Questions</h4>
                <ul className="space-y-3">
                  {props.story.reflectiveQuestions.map((q, i) => (
                    <li key={i} className="text-lg text-slate-400 flex gap-4">
                      <span className="text-accent font-bold">?</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-primary/5 border border-primary/20 p-10 rounded-[3rem]">
                <h3 className="text-2xl font-bold text-primary mb-6">Connecting to the Concept</h3>
                <p className="text-xl text-slate-300 leading-relaxed mb-8">
                  {props.story.connectToTopic}
                </p>
                <div className="flex items-center gap-4 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-2xl">💡</div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Actual Topic</div>
                    <div className="text-xl font-bold text-white">{props.topicName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MATHEMATICAL MODELLING */}
      <section id="math" className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
          <div>
            <h2 className="text-4xl font-black font-outfit mb-2">Mathematical Modelling</h2>
            <p className="text-muted-foreground text-lg">Rigorous analysis and interpretation of the core algorithms.</p>
          </div>
          <div className="bg-math/10 text-math px-6 py-2 rounded-full font-bold text-sm border border-math/20">
            Formal Definition Section
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-3xl h-full">
              <h3 className="text-xl font-bold mb-6 text-math">Need & Motivation</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">The Challenge</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{props.mathModelling.challenges.realWorld}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Technical Barrier</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{props.mathModelling.challenges.technical}</p>
                </div>
                <div className="pt-4 flex flex-wrap gap-2">
                  {props.mathModelling.advantages.map((adv, i) => (
                    <span key={i} className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded border border-success/20">
                      ✓ {adv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {props.mathModelling.equations.map((eq, i) => (
              <MathEquation key={i} {...eq} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: VIRTUAL LAB (Placed here for better flow) */}
      <section id="lab" className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black font-outfit">Virtual Interactive Lab</h2>
          <p className="text-muted-foreground text-xl">Learn by Doing (NEP 2020 Standard)</p>
        </div>
        
        <div className="glass rounded-[3rem] overflow-hidden border-2 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
            <div className="lg:col-span-3 bg-slate-950 p-8 flex flex-col">
              <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/20 relative overflow-hidden">
                {props.virtualLab.component}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 p-4 bg-slate-900/40 rounded-xl">
                 <div className="flex gap-4">
                   {props.virtualLab.controls.map((c, i) => (
                     <button key={i} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
                       {c}
                     </button>
                   ))}
                 </div>
                 <div className="text-xs text-muted-foreground italic">
                   Real-time Visualization Engine Active
                 </div>
              </div>
            </div>
            <div className="p-8 border-l border-border/50 space-y-8 bg-slate-900/20">
              <div>
                <h4 className="font-bold mb-3 text-primary">Process Visualization</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{props.virtualLab.dataFlow}</p>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-primary">Execution Logic</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{props.virtualLab.processExplanation}</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl">
                <h4 className="text-[10px] font-bold text-primary uppercase mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Latency</span>
                    <span className="text-slate-200">1.2ms</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Throughput</span>
                    <span className="text-slate-200">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ACTIVITY BASED LEARNING */}
      <section id="abl" className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border/50"></div>
          <h2 className="text-3xl font-bold font-outfit uppercase tracking-tighter">Activity Based Learning</h2>
          <div className="h-px flex-1 bg-border/50"></div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {props.abl.map((activity, i) => (
            <ActivityBlock key={i} {...activity} />
          ))}
        </div>
      </section>

      {/* SECTION 4: PROJECT BASED LEARNING */}
      <section id="pbl" className="space-y-16">
        <h2 className="text-4xl font-black font-outfit">Project Based Learning</h2>
        <PBLBlock {...props.pbl} />
      </section>

      {/* SECTION 5: QUESTIONS */}
      <section id="questions" className="space-y-12">
        <h2 className="text-3xl font-bold font-outfit">Mastery Assessment (2-Mark Questions)</h2>
        <QuestionsBlock questions={props.questions} />
      </section>

      {/* SUMMARY & INSIGHTS */}
      <section id="summary" className="space-y-12 pb-12 border-b border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-2xl insight-card">
            <h4 className="font-bold text-success mb-3 flex items-center gap-2"><span>💎</span> Key Insights</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              {props.summary.insights.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="glass p-6 rounded-2xl project-card">
            <h4 className="font-bold text-secondary mb-3 flex items-center gap-2"><span>🔭</span> Future Scope</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{props.summary.futureScope}</p>
          </div>
          <div className="glass p-6 rounded-2xl concept-card">
            <h4 className="font-bold text-primary mb-3 flex items-center gap-2"><span>🏢</span> Industrial Apps</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              {props.summary.industrialApps.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="glass p-6 rounded-2xl story-card">
            <h4 className="font-bold text-accent mb-3 flex items-center gap-2"><span>💼</span> Career Relevance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{props.summary.careerRelevance}</p>
          </div>
        </div>
      </section>

      {/* HITL FEEDBACK */}
      <HITLFeedback topicName={props.topicName} onContinue={props.onNextTopic} />
    </div>
  );
}
