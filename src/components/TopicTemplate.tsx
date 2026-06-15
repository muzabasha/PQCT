"use client";

import { MathEquation } from './MathEquation';
import { ActivityBlock } from './ActivityBlock';
import { PBLBlock } from './PBLBlock';
import { QuestionsBlock } from './QuestionsBlock';
import { HITLFeedback } from './HITLFeedback';
import { MCQBlock } from './MCQBlock';

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  justification: string;
}

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
  prerequisites?: {
    topics: string[];
    mcqs: MCQ[];
  };
  recap?: {
    summary: string[];
    mcqs: MCQ[];
  };
  skills?: { icon: string; name: string; description: string }[];
  nepAlignment?: { policy: string; icon: string; description: string }[];
  miniActivity?: {
    title: string;
    instructions: string;
    checkpoints: string[];
    reflection: string;
  };
  onNextTopic: () => void;
}

type Section = { id: string; label: string; icon: string; condition?: (p: TopicTemplateProps) => boolean };
const sections: Section[] = [
  { id: 'prerequisites', label: 'Prerequisites', icon: '📋', condition: (p) => !!p.prerequisites },
  { id: 'story', label: 'Story', icon: '🎭' },
  { id: 'math', label: 'Math', icon: '∑' },
  { id: 'lab', label: 'Lab', icon: '🧪' },
  { id: 'abl', label: 'ABL', icon: '🎯' },
  { id: 'pbl', label: 'PBL', icon: '🚀' },
  { id: 'questions', label: 'Questions', icon: '❓' },
  { id: 'mini-activity', label: 'Quick Check', icon: '⚡', condition: (p) => !!p.miniActivity },
  { id: 'summary', label: 'Summary', icon: '💎' },
  { id: 'skills', label: 'Skills', icon: '🎯', condition: (p) => !!p.skills },
  { id: 'nep-policy', label: 'NEP 2020', icon: '📜', condition: (p) => !!p.nepAlignment },
  { id: 'recap', label: 'Recap', icon: '📌', condition: (p) => !!p.recap },
];

export function TopicTemplate(props: TopicTemplateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24 space-y-12 md:space-y-24">
      {/* Sticky Section Navigation */}
      <div className="sticky top-20 z-40 -mx-4 md:-mx-6 px-4 md:px-6 py-2 md:py-3 bg-slate-950/90 backdrop-blur-xl border-b border-border/50 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {sections.filter(s => !s.condition || s.condition(props)).map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-primary hover:bg-primary/10 transition-all whitespace-nowrap flex items-center gap-1.5">
              <span>{s.icon}</span> {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 0: PREREQUISITES */}
      {props.prerequisites && (
        <section id="prerequisites" className="pt-20">
          <MCQBlock
            title="Prerequisites"
            subtitle="Review these foundational concepts before proceeding. Mastery of these ensures you get the most from this module."
            icon="📋"
            items={props.prerequisites.topics}
            mcqs={props.prerequisites.mcqs}
          />
        </section>
      )}

      {/* SECTION 1: STORYTELLING */}
      <section id="story" className="pt-12 md:pt-20">
        <div className="space-y-8 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-6xl font-black font-outfit tracking-tighter">
              {props.story.title}
            </h1>
            <div className="h-2 w-20 md:w-24 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div className="space-y-6 md:space-y-8">
              <div className="story-card p-6 md:p-10 rounded-2xl md:rounded-[3rem] glass relative">
                <span className="absolute -top-4 md:-top-6 -left-4 md:-left-6 text-3xl md:text-6xl">🎭</span>
                <p className="text-base md:text-2xl font-serif italic text-slate-300 leading-relaxed mt-4 md:mt-0">
                  "{props.story.content}"
                </p>
              </div>
              
              <div className="bg-slate-900/40 border border-slate-800 p-4 md:p-8 rounded-2xl md:rounded-3xl">
                <h4 className="text-accent font-bold mb-3 md:mb-4 uppercase tracking-widest text-[10px] md:text-sm">Reflective Questions</h4>
                <ul className="space-y-2 md:space-y-3">
                  {props.story.reflectiveQuestions.map((q, i) => (
                    <li key={i} className="text-sm md:text-lg text-slate-400 flex gap-3 md:gap-4">
                      <span className="text-accent font-bold">?</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-primary/5 border border-primary/20 p-6 md:p-10 rounded-2xl md:rounded-[3rem]">
                <h3 className="text-lg md:text-2xl font-bold text-primary mb-4 md:mb-6">Connecting to the Concept</h3>
                <p className="text-base md:text-xl text-slate-300 leading-relaxed mb-6 md:mb-8">
                  {props.story.connectToTopic}
                </p>
                <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-slate-950/50 rounded-xl md:rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center text-lg md:text-2xl">💡</div>
                  <div>
                    <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Actual Topic</div>
                    <div className="text-base md:text-xl font-bold text-white">{props.topicName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MATHEMATICAL MODELLING */}
      <section id="math" className="space-y-8 md:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 border-b border-border/50 pb-4 md:pb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black font-outfit mb-1 md:mb-2">Mathematical Modelling</h2>
            <p className="text-sm md:text-lg text-muted-foreground">Rigorous analysis and interpretation of the core algorithms.</p>
          </div>
          <div className="bg-math/10 text-math px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold text-[10px] md:text-sm border border-math/20 self-start md:self-auto">
            Formal Definition Section
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl h-full">
              <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6 text-math">Need & Motivation</h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 md:mb-2">The Challenge</h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{props.mathModelling.challenges.realWorld}</p>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 md:mb-2">Technical Barrier</h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{props.mathModelling.challenges.technical}</p>
                </div>
                <div className="pt-2 md:pt-4 flex flex-wrap gap-1 md:gap-2">
                  {props.mathModelling.advantages.map((adv, i) => (
                    <span key={i} className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded border border-success/20">
                      ✓ {adv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {props.mathModelling.equations.map((eq, i) => (
              <MathEquation key={i} {...eq} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: VIRTUAL LAB (Placed here for better flow) */}
      <section id="lab" className="space-y-8 md:space-y-16">
        <div className="text-center space-y-2 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-outfit">Virtual Interactive Lab</h2>
          <p className="text-sm md:text-xl text-muted-foreground">Learn by Doing (NEP 2020 Standard)</p>
        </div>
        
        <div className="glass rounded-2xl md:rounded-[3rem] overflow-hidden border-2 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px] md:min-h-[600px]">
            <div className="lg:col-span-3 bg-slate-950 p-4 md:p-8 flex flex-col">
              <div className="flex-1 rounded-xl md:rounded-2xl border border-slate-800 bg-slate-900/20 relative overflow-hidden">
                {props.virtualLab.component}
              </div>
              <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 bg-slate-900/40 rounded-lg md:rounded-xl">
                 <div className="flex gap-2 md:gap-4">
                   {props.virtualLab.controls.map((c, i) => (
                     <button key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] md:text-xs font-bold transition-colors">
                       {c}
                     </button>
                   ))}
                 </div>
                 <div className="text-[10px] md:text-xs text-muted-foreground italic">
                   Real-time Visualization Engine Active
                 </div>
              </div>
            </div>
            <div className="p-4 md:p-8 border-t md:border-t-0 md:border-l border-border/50 space-y-4 md:space-y-8 bg-slate-900/20">
              <div>
                <h4 className="font-bold mb-2 md:mb-3 text-primary text-sm md:text-base">Process Visualization</h4>
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{props.virtualLab.dataFlow}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2 md:mb-3 text-primary text-sm md:text-base">Execution Logic</h4>
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{props.virtualLab.processExplanation}</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 p-3 md:p-4 rounded-lg md:rounded-xl">
                <h4 className="text-[10px] font-bold text-primary uppercase mb-2">Performance Metrics</h4>
                <div className="space-y-1 md:space-y-2">
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
      <section id="abl" className="space-y-8 md:space-y-12">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-px flex-1 bg-border/50"></div>
          <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter text-center">Activity Based Learning</h2>
          <div className="h-px flex-1 bg-border/50"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {props.abl.map((activity, i) => (
            <ActivityBlock key={i} {...activity} />
          ))}
        </div>
      </section>

      {/* SECTION 4: PROJECT BASED LEARNING */}
      <section id="pbl" className="space-y-8 md:space-y-16">
        <h2 className="text-2xl md:text-4xl font-black font-outfit">Project Based Learning</h2>
        <PBLBlock {...props.pbl} />
      </section>

      {/* SECTION 5: QUESTIONS */}
      <section id="questions" className="space-y-8 md:space-y-12">
        <h2 className="text-xl md:text-3xl font-bold font-outfit">Mastery Assessment (2-Mark Questions)</h2>
        <QuestionsBlock questions={props.questions} />
      </section>

      {/* SUMMARY & INSIGHTS */}
      <section id="summary" className="space-y-8 md:space-y-12 pb-8 md:pb-12 border-b border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl insight-card">
            <h4 className="font-bold text-success mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>💎</span> Key Insights</h4>
            <ul className="text-[10px] md:text-xs text-slate-400 space-y-1 md:space-y-2">
              {props.summary.insights.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl project-card">
            <h4 className="font-bold text-secondary mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>🔭</span> Future Scope</h4>
            <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{props.summary.futureScope}</p>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl concept-card">
            <h4 className="font-bold text-primary mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>🏢</span> Industrial Apps</h4>
            <ul className="text-[10px] md:text-xs text-slate-400 space-y-1 md:space-y-2">
              {props.summary.industrialApps.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl story-card">
            <h4 className="font-bold text-accent mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>💼</span> Career Relevance</h4>
            <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{props.summary.careerRelevance}</p>
          </div>
        </div>
      </section>

      {/* MINI ACTIVITY — Quick Check */}
      {props.miniActivity && (
        <section id="mini-activity" className="space-y-6 md:space-y-8 pt-8 md:pt-12">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-px flex-1 bg-border/50" />
            <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter flex items-center gap-2 md:gap-3">
              <span>⚡</span> Quick Check Activity
            </h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="glass p-6 md:p-10 rounded-2xl md:rounded-3xl border-2 border-secondary/20">
            <h3 className="text-xl md:text-2xl font-bold mb-2">{props.miniActivity.title}</h3>
            <p className="text-sm md:text-base text-slate-400 mb-6">{props.miniActivity.instructions}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-secondary tracking-widest mb-3">Checkpoints</h4>
                <ul className="space-y-2">
                  {props.miniActivity.checkpoints.map((cp, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      {cp}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-5 md:p-6 rounded-xl md:rounded-2xl">
                <h4 className="text-xs font-bold uppercase text-accent tracking-widest mb-3">Reflection</h4>
                <p className="text-sm text-slate-400 leading-relaxed italic">{props.miniActivity.reflection}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SKILLS MAPPING */}
      {props.skills && (
        <section id="skills" className="space-y-6 md:space-y-8 pt-8 md:pt-12">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-px flex-1 bg-border/50" />
            <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter flex items-center gap-2 md:gap-3">
              <span>🎯</span> Skills You Earn
            </h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {props.skills.map((skill, i) => (
              <div key={i} className="glass p-5 md:p-6 rounded-xl md:rounded-2xl border border-primary/10 hover:border-primary/30 transition-all hover:translate-y-[-2px]">
                <div className="text-2xl md:text-3xl mb-3">{skill.icon}</div>
                <h4 className="font-bold text-sm md:text-base mb-2 text-primary">{skill.name}</h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEP 2020 & STEM POLICY ALIGNMENT */}
      {props.nepAlignment && (
        <section id="nep-policy" className="space-y-6 md:space-y-8 pt-8 md:pt-12">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-px flex-1 bg-border/50" />
            <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter flex items-center gap-2 md:gap-3">
              <span>📜</span> NEP 2020 & STEM Policy Alignment
            </h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {props.nepAlignment.map((item, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-accent/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                  <h4 className="font-bold text-xs md:text-sm text-accent uppercase tracking-wider">{item.policy}</h4>
                </div>
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RECAP SESSION */}
      {props.recap && (
        <section id="recap" className="pt-8 md:pt-12">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <h2 className="text-lg md:text-3xl font-bold font-outfit uppercase tracking-tighter flex items-center gap-2 md:gap-3">
                <span>📌</span> Recap Session
              </h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl">
              <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-accent">Point-to-Point Summary</h3>
              <ul className="space-y-2 md:space-y-3">
                {props.recap.summary.map((point, i) => (
                  <li key={i} className="flex gap-2 md:gap-3 text-slate-300 text-xs md:text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] md:text-xs font-bold mt-0.5">{i + 1}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-12">
            <MCQBlock
              title="Module Assessment"
              subtitle="Test your understanding of the key concepts covered in this module."
              icon="📝"
              items={[]}
              mcqs={props.recap.mcqs}
            />
          </div>
        </section>
      )}

      {/* HITL FEEDBACK */}
      <HITLFeedback topicName={props.topicName} onContinue={props.onNextTopic} />
    </div>
  );
}
