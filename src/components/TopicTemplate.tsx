"use client";

import { useState, useEffect } from 'react';
import { MathEquation } from './MathEquation';
import { ActivityBlock } from './ActivityBlock';
import { PBLBlock } from './PBLBlock';
import { QuestionsBlock } from './QuestionsBlock';
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
    procedure: string[];
    observations: { prompt: string; hint: string }[];
    conclusion: string;
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
  const [storyReflections, setStoryReflections] = useState<Record<string, string>>({});
  const [miniCheckpoints, setMiniCheckpoints] = useState<Record<string, boolean>>({});
  const [miniReflection, setMiniReflection] = useState('');
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [summaryInsight, setSummaryInsight] = useState('');
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    const savedReflections = localStorage.getItem(`story-reflections-${moduleKey}`);
    if (savedReflections) setStoryReflections(JSON.parse(savedReflections));
    const savedCheckpoints = localStorage.getItem(`mini-checkpoints-${moduleKey}`);
    if (savedCheckpoints) setMiniCheckpoints(JSON.parse(savedCheckpoints));
    const savedMiniReflection = localStorage.getItem(`mini-reflection-${moduleKey}`);
    if (savedMiniReflection) setMiniReflection(savedMiniReflection);
    const savedSkillRatings = localStorage.getItem(`skill-ratings-${moduleKey}`);
    if (savedSkillRatings) setSkillRatings(JSON.parse(savedSkillRatings));
    const savedSummaryInsight = localStorage.getItem(`summary-insight-${moduleKey}`);
    if (savedSummaryInsight) setSummaryInsight(savedSummaryInsight);
    const savedInsightsList = localStorage.getItem(`saved-insights-${moduleKey}`);
    if (savedInsightsList) setSavedInsights(JSON.parse(savedInsightsList));
  }, []);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`story-reflections-${moduleKey}`, JSON.stringify(storyReflections));
  }, [storyReflections]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`mini-checkpoints-${moduleKey}`, JSON.stringify(miniCheckpoints));
  }, [miniCheckpoints]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`mini-reflection-${moduleKey}`, miniReflection);
  }, [miniReflection]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`skill-ratings-${moduleKey}`, JSON.stringify(skillRatings));
  }, [skillRatings]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`summary-insight-${moduleKey}`, summaryInsight);
  }, [summaryInsight]);

  useEffect(() => {
    const moduleKey = props.topicName.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem(`saved-insights-${moduleKey}`, JSON.stringify(savedInsights));
  }, [savedInsights]);
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24 space-y-12 md:space-y-24">
      {/* Sticky Section Navigation */}
      <div className="sticky top-20 z-40 -mx-4 md:-mx-6 px-4 md:px-6 py-2 md:py-3 bg-white/95 backdrop-blur-xl border-b border-border/50 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {sections.filter(s => !s.condition || s.condition(props)).map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-primary hover:bg-primary/10 transition-all whitespace-nowrap flex items-center gap-1.5">
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
                <p className="text-base md:text-2xl font-serif italic text-slate-700 leading-relaxed mt-4 md:mt-0">
                  "{props.story.content}"
                </p>
              </div>
              
              <div className="bg-slate-50/80 border border-slate-200 p-4 md:p-8 rounded-2xl md:rounded-3xl">
                <h4 className="text-accent font-bold mb-3 md:mb-4 uppercase tracking-widest text-[10px] md:text-sm">Reflective Questions</h4>
                <div className="space-y-3 md:space-y-4">
                  {props.story.reflectiveQuestions.map((q, i) => (
                    <div key={i} className="space-y-1.5">
                      <p className="text-sm md:text-lg text-slate-600 flex gap-3 md:gap-4">
                        <span className="text-accent font-bold shrink-0">?</span> {q}
                      </p>
                      <textarea
                        value={storyReflections[i] ?? ''}
                        onChange={e => setStoryReflections(prev => ({ ...prev, [i]: e.target.value }))}
                        placeholder="Type your reflection here..."
                        rows={2}
                        className="w-full text-xs md:text-sm bg-white/90 border border-slate-200 rounded-lg p-2 md:p-3 text-slate-200 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-primary/5 border border-primary/20 p-6 md:p-10 rounded-2xl md:rounded-[3rem]">
                <h3 className="text-lg md:text-2xl font-bold text-primary mb-4 md:mb-6">Connecting to the Concept</h3>
                <p className="text-base md:text-xl text-slate-700 leading-relaxed mb-6 md:mb-8">
                  {props.story.connectToTopic}
                </p>
                <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white/80 rounded-xl md:rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center text-lg md:text-2xl">💡</div>
                  <div>
                    <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Actual Topic</div>
                    <div className="text-base md:text-xl font-bold text-foreground">{props.topicName}</div>
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
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{props.mathModelling.challenges.realWorld}</p>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 md:mb-2">Technical Barrier</h4>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{props.mathModelling.challenges.technical}</p>
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

      {/* SECTION 6: VIRTUAL LAB — STEM Learn by Doing */}
      <section id="lab" className="space-y-8 md:space-y-16">
        <div className="text-center space-y-2 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-outfit">Virtual Interactive Lab</h2>
          <p className="text-sm md:text-xl text-muted-foreground">STEM Approach — Learn by Doing (NEP 2020)</p>
        </div>
        
        <div className="glass rounded-2xl md:rounded-[3rem] overflow-hidden border-2 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px] md:min-h-[600px]">
            <div className="lg:col-span-3 bg-white p-4 md:p-8 flex flex-col">
              <div className="flex-1 rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50/40 relative overflow-hidden">
                {props.virtualLab.component}
              </div>
              <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 bg-slate-50/80 rounded-lg md:rounded-xl">
                 <div className="flex gap-2 md:gap-4">
                   {props.virtualLab.controls.map((c, i) => (
                     <button key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] md:text-xs font-bold transition-colors">
                       {c}
                     </button>
                   ))}
                 </div>
                 <div className="text-[10px] md:text-xs text-muted-foreground italic">
                   Interactive Simulation Active — Follow the procedure below
                 </div>
              </div>
            </div>
            <div className="p-4 md:p-8 border-t md:border-t-0 md:border-l border-border/50 space-y-4 md:space-y-8 bg-slate-50/40 overflow-y-auto">
              <div>
                <h4 className="font-bold mb-2 md:mb-3 text-primary text-sm md:text-base flex items-center gap-2">
                  <span>📋</span> Guided Procedure
                </h4>
                <ol className="space-y-2 md:space-y-3">
                  {props.virtualLab.procedure.map((step, i) => (
                    <li key={i} className="text-[10px] md:text-xs text-slate-700 leading-relaxed flex gap-2">
                      <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-bold mb-2 md:mb-3 text-primary text-sm md:text-base flex items-center gap-2">
                  <span>🔍</span> Record Your Observations
                </h4>
                <div className="space-y-3 md:space-y-4">
                  {props.virtualLab.observations.map((obs, i) => (
                    <div key={i} className="bg-slate-100/80 border border-slate-200/80 rounded-lg p-3">
                      <p className="text-[10px] md:text-xs text-slate-200 mb-1">{obs.prompt}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-600 italic">{obs.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-success/10 border border-success/20 p-3 md:p-4 rounded-lg md:rounded-xl">
                <h4 className="text-[10px] font-bold text-success uppercase mb-2">💡 What Did You Learn?</h4>
                <p className="text-[10px] md:text-xs text-slate-700 leading-relaxed">{props.virtualLab.conclusion}</p>
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
            <ul className="text-[10px] md:text-xs text-slate-600 space-y-1 md:space-y-2">
              {props.summary.insights.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{s}</span>
                  <button
                    onClick={() => setSavedInsights(prev => prev.includes(s) ? prev : [...prev, s])}
                    className={`shrink-0 ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded transition ${
                      savedInsights.includes(s)
                        ? 'bg-success/20 text-success'
                        : 'bg-slate-100 text-slate-600 hover:text-success'
                    }`}
                  >
                    {savedInsights.includes(s) ? 'Saved' : 'Save'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl project-card">
            <h4 className="font-bold text-secondary mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>🔭</span> Future Scope</h4>
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">{props.summary.futureScope}</p>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl concept-card">
            <h4 className="font-bold text-primary mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>🏢</span> Industrial Apps</h4>
            <ul className="text-[10px] md:text-xs text-slate-600 space-y-1 md:space-y-2">
              {props.summary.industrialApps.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl story-card">
            <h4 className="font-bold text-accent mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base"><span>💼</span> Career Relevance</h4>
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">{props.summary.careerRelevance}</p>
          </div>
        </div>

        {/* Personal Insight Journal */}
        <div className="glass p-5 md:p-8 rounded-2xl border border-primary/20">
          <h4 className="font-bold text-primary mb-3 flex items-center gap-2 text-sm md:text-base">
            <span>📝</span> Your Insight Journal
          </h4>
          <div className="flex gap-2 md:gap-3">
            <textarea
              value={summaryInsight}
              onChange={e => setSummaryInsight(e.target.value)}
              placeholder="Write your personal insight or takeaway from this module..."
              rows={2}
              className="flex-1 text-xs md:text-sm bg-white/90 border border-slate-200 rounded-lg p-2 md:p-3 text-slate-200 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition"
            />
            <button
              onClick={() => {
                if (summaryInsight.trim()) {
                  setSavedInsights(prev => [...prev, summaryInsight.trim()]);
                  setSummaryInsight('');
                }
              }}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold text-xs rounded-lg transition self-end"
            >
              Save
            </button>
          </div>
          {savedInsights.filter(i => !i.startsWith('NEP:')).length > 0 && (
            <div className="mt-4 space-y-1">
              <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Saved Journal Entries</h5>
              {savedInsights.filter(i => !i.startsWith('NEP:')).reverse().map((entry, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] md:text-xs text-slate-600 p-2 bg-slate-50/80 rounded-lg">
                  <span className="text-primary shrink-0">📌</span>
                  <span>{entry}</span>
                  <button
                    onClick={() => setSavedInsights(prev => prev.filter((_, j) => j !== prev.indexOf(entry) || prev.indexOf(entry) !== prev.lastIndexOf(entry) ? j !== prev.indexOf(entry) : j !== prev.length - 1 - i))}
                    className="ml-auto text-slate-500 hover:text-red-400 text-[9px] font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
            <p className="text-sm md:text-base text-slate-600 mb-6">{props.miniActivity.instructions}</p>
            {Object.keys(miniCheckpoints).length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{Object.values(miniCheckpoints).filter(Boolean).length} / {props.miniActivity.checkpoints.length}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(miniCheckpoints).filter(Boolean).length / props.miniActivity.checkpoints.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-secondary tracking-widest mb-3">Checkpoints</h4>
                <ul className="space-y-2">
                  {props.miniActivity.checkpoints.map((cp, i) => (
                    <li key={i}>
                      <button
                        onClick={() => setMiniCheckpoints(prev => ({ ...prev, [i]: !prev[i] }))}
                        className={`w-full flex gap-3 text-sm text-left items-start p-2 rounded-lg transition ${
                          miniCheckpoints[i] ? 'bg-secondary/10 text-secondary' : 'text-slate-700 hover:bg-slate-100/80'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold mt-0.5 transition ${
                          miniCheckpoints[i]
                            ? 'bg-secondary border-secondary text-white'
                            : 'border-slate-300 text-transparent'
                        }`}>
                          {miniCheckpoints[i] ? '✓' : i + 1}
                        </span>
                        {cp}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/80 border border-slate-200 p-5 md:p-6 rounded-xl md:rounded-2xl">
                <h4 className="text-xs font-bold uppercase text-accent tracking-widest mb-3">Reflection</h4>
                <textarea
                  value={miniReflection}
                  onChange={e => setMiniReflection(e.target.value)}
                  placeholder="Write your reflection on this activity..."
                  rows={4}
                  className="w-full text-xs md:text-sm bg-white/90 border border-slate-200 rounded-lg p-2 md:p-3 text-slate-200 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none transition mb-3"
                />
                {miniReflection.trim() && (
                  <p className="text-[10px] text-accent italic">Reflection saved ✓</p>
                )}
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
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">{skill.description}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setSkillRatings(prev => ({ ...prev, [i]: star }))}
                      className={`text-lg transition hover:scale-110 ${
                        star <= (skillRatings[i] ?? 0) ? 'text-yellow-400' : 'text-slate-700'
                      }`}
                      title={`Rate ${star} out of 5`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-500 ml-2">
                    {skillRatings[i] ? `${skillRatings[i]}/5` : 'Self-assess'}
                  </span>
                </div>
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
              <div key={i} className="bg-white/85 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-accent/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                  <h4 className="font-bold text-xs md:text-sm text-accent uppercase tracking-wider">{item.policy}</h4>
                </div>
                <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">{item.description}</p>
                <button
                  onClick={() => {
                    const newSaved = [...savedInsights, `NEP: ${item.policy} — ${item.description}`];
                    setSavedInsights(newSaved);
                  }}
                  className="mt-3 text-[9px] md:text-[10px] text-accent/60 hover:text-accent transition font-bold"
                >
                  + Log this alignment
                </button>
              </div>
            ))}
          </div>
          {savedInsights.filter(i => i.startsWith('NEP:')).length > 0 && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <h4 className="text-xs font-bold text-accent uppercase mb-2">Your Logged Alignments</h4>
              <ul className="space-y-1">
                {savedInsights.filter(i => i.startsWith('NEP:')).map((insight, i) => (
                  <li key={i} className="text-[10px] text-slate-600 flex gap-2">
                    <span className="text-accent">✓</span> {insight.replace('NEP: ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                  <li key={i} className="flex gap-2 md:gap-3 text-slate-700 text-xs md:text-sm leading-relaxed">
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

    </div>
  );
}
