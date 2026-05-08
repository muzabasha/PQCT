"use client";

import { motion } from 'framer-motion';

interface Milestone {
  date: string;
  task: string;
}

interface Risk {
  description: string;
  level: 'Low' | 'Medium' | 'High';
}

interface PBLProps {
  scope: string;
  feasibility: string;
  risks: Risk[];
  budget: string;
  timeline: string;
  objectives: string[];
  outcomes: string[];
  milestones: Milestone[];
  teamRoles: Record<string, string>;
}

export function PBLBlock({ scope, feasibility, risks, budget, timeline, objectives, outcomes, milestones, teamRoles }: PBLProps) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl project-card">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-secondary">🚀</span> Project Scope & Feasibility
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">{scope}</p>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Feasibility Study</h4>
              <p className="text-slate-400 text-sm italic">{feasibility}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border-l-4 border-secondary">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span>🎯</span> Objectives
              </h4>
              <ul className="space-y-2">
                {objectives.map((obj, i) => (
                  <li key={i} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-secondary">•</span> {obj}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-6 rounded-2xl border-l-4 border-success">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span>🏆</span> Expected Outcomes
              </h4>
              <ul className="space-y-2">
                {outcomes.map((out, i) => (
                  <li key={i} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-success">•</span> {out}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span>⚠️</span> Risk Management
            </h4>
            <div className="space-y-3">
              {risks.map((risk, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300">{risk.description}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    risk.level === 'High' ? 'bg-destructive/20 text-destructive' :
                    risk.level === 'Medium' ? 'bg-accent/20 text-accent' :
                    'bg-success/20 text-success'
                  }`}>
                    {risk.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span>👥</span> Team Roles
            </h4>
            <div className="space-y-3">
              {Object.entries(teamRoles).map(([role, task], i) => (
                <div key={i} className="space-y-1">
                  <div className="text-xs font-bold text-secondary">{role}</div>
                  <div className="text-xs text-slate-400">{task}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline / Gantt Visualization */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
          <span className="text-secondary">📅</span> Implementation Timeline
        </h3>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-slate-800 md:left-1/2"></div>
          <div className="space-y-12">
            {milestones.map((ms, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-1/2"></div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-secondary rounded-full border-4 border-slate-950 -translate-x-1/2 flex items-center justify-center z-10 shadow-lg shadow-secondary/20">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-secondary/30 transition-colors">
                    <div className="text-secondary font-bold text-sm mb-1">{ms.date}</div>
                    <div className="text-slate-200 font-medium">{ms.task}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
