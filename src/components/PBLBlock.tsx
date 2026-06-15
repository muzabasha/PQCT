"use client";

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
  milestones: { date: string; task: string }[];
  teamRoles: Record<string, string>;
}

export function PBLBlock({ scope, feasibility, risks, objectives, outcomes, teamRoles }: PBLProps) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl project-card">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-secondary">🚀</span> Project Scope & Feasibility
            </h3>
            <p className="text-slate-700 mb-6 leading-relaxed">{scope}</p>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Feasibility Study</h4>
              <p className="text-slate-600 text-sm italic">{feasibility}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border-l-4 border-secondary">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span>🎯</span> Objectives
              </h4>
              <ul className="space-y-2">
                {objectives.map((obj, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
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
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
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
                <div key={i} className="flex items-center justify-between bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-700">{risk.description}</span>
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
                  <div className="text-xs text-slate-600">{task}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
