'use client';

import { AlertCircle, Clock, Eye, PieChart, Hammer, TrendingUp } from 'lucide-react';
import Widget from './Widget';

interface ActionItem {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  reason: string;
  timestamp: string;
  impact?: string;
  suggestedAction?: string;
}

interface AgentActivity {
  agent: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'queued';
  details: string;
  avgTime: string;
}

const ACTIONS: ActionItem[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Project Alpha - Financier Agent Blocked',
    reason: 'Cannot calculate burn rate (Missing Architect Output)',
    timestamp: '2h ago',
    impact: 'High Impact',
    suggestedAction: 'Rerun Architect'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Project Beta - Analyst Agent Failed',
    reason: 'SWOT analysis inconclusive (Low data quality from Spy)',
    timestamp: '5h ago',
    impact: 'Medium Impact',
    suggestedAction: 'Update Sources'
  },
];

const AGENTS: AgentActivity[] = [
  { agent: 'Analyst', icon: PieChart, status: 'queued', details: 'Queued: 3 Projects', avgTime: '12m' },
  { agent: 'Spy', icon: Eye, status: 'active', details: 'Active: Project Gamma', avgTime: '45m' },
  { agent: 'Architect', icon: Hammer, status: 'queued', details: 'Queued: 1 Project', avgTime: '28m' },
  { agent: 'Financier', icon: TrendingUp, status: 'active', details: 'Active: Project Delta', avgTime: '15m' },
];

export function RequiredActionsWidget({ projects = [] }: { projects?: any[] }) {
  // Generate actions from projects
  const actions: ActionItem[] = [];

  projects.forEach((project, idx) => {
    if (project.status === 'rejected') {
      actions.push({
        id: `rejected-${idx}`,
        type: 'critical',
        title: `${project.name}`,
        reason: 'Idea validation failed - Review rescue plan for improvement suggestions',
        timestamp: new Date(project.created_at).toLocaleDateString(),
        impact: 'High Impact',
        suggestedAction: 'View Rescue Plan'
      });
    } else if (project.status === 'approved' && idx < 2) {
      // Show only first 2 approved as info
      actions.push({
        id: `approved-${idx}`,
        type: 'warning',
        title: `${project.name}`,
        reason: 'Full analysis complete - Ready for review',
        timestamp: new Date(project.created_at).toLocaleDateString(),
        impact: 'Medium Impact',
        suggestedAction: 'View Report'
      });
    }
  });

  // Fallback if no actions
  const displayActions = actions.length > 0 ? actions : ACTIONS;

  return (
    <Widget title="Required Actions">
      <div className="space-y-3">
        {displayActions.map((item) => (
          <div
            key={item.id}
            className={`group border rounded-xl p-4 transition-all duration-300 ${item.type === 'critical'
              ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
              : 'border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-1.5 rounded-full ${item.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                {item.type === 'critical' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white truncate pr-2">{item.title}</h4>
                  <span className="text-[10px] text-neutral-500 whitespace-nowrap">{item.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">{item.reason}</p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.impact && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.type === 'critical'
                        ? 'border-red-500/30 text-red-400 bg-red-500/10'
                        : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                        }`}>
                        {item.impact}
                      </span>
                    )}
                  </div>
                  <button className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${item.type === 'critical'
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    }`}>
                    {item.suggestedAction || 'Resolve Issue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function AgentStatusWidget({ projects = [] }: { projects?: any[] }) {
  // Calculate agent activity from projects
  const agentActivity: AgentActivity[] = [
    { agent: 'Analyst', icon: PieChart, status: 'queued', details: 'Queued: 0 Projects', avgTime: '12m' },
    { agent: 'Spy', icon: Eye, status: 'queued', details: 'Queued: 0 Projects', avgTime: '45m' },
    { agent: 'Architect', icon: Hammer, status: 'queued', details: 'Queued: 0 Projects', avgTime: '28m' },
    { agent: 'Financier', icon: TrendingUp, status: 'queued', details: 'Queued: 0 Projects', avgTime: '15m' },
  ];

  // Count completed projects with each agent
  const completedCount = {
    analyst: 0,
    spy: 0,
    architect: 0,
    financier: 0
  };

  projects.forEach(project => {
    if (project.report_json?.agents) {
      const agents = project.report_json.agents;
      if (agents.analyst) completedCount.analyst++;
      if (agents.spy) completedCount.spy++;
      if (agents.architect) completedCount.architect++;
      if (agents.financier) completedCount.financier++;
    }
  });

  // Update activity details
  agentActivity[0].details = `Completed: ${completedCount.analyst} Projects`;
  agentActivity[1].details = `Completed: ${completedCount.spy} Projects`;
  agentActivity[2].details = `Completed: ${completedCount.architect} Projects`;
  agentActivity[3].details = `Completed: ${completedCount.financier} Projects`;

  // Mark as active if there are completed projects
  if (completedCount.analyst > 0) agentActivity[0].status = 'active';
  if (completedCount.spy > 0) agentActivity[1].status = 'active';
  if (completedCount.architect > 0) agentActivity[2].status = 'active';
  if (completedCount.financier > 0) agentActivity[3].status = 'active';

  return (
    <Widget title="Agent Pipeline Status">
      <div className="space-y-3">
        {agentActivity.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <div
              key={idx}
              className="group flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl transition-colors ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white mb-0.5">{agent.agent}</div>
                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                    {agent.details}
                  </div>
                </div>
              </div>
              <div className="text-right pl-4 border-l border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">Avg Time</div>
                <div className="text-xs font-mono text-white">{agent.avgTime}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

export default function ActionStatusSection() {
  return (
    <>
      <RequiredActionsWidget />
      <AgentStatusWidget />
    </>
  );
}
