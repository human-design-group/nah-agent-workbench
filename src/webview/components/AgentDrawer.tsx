import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench.js';
import { X, Folder, ChevronRight, ChevronDown, Clock, Calendar, Settings, ExternalLink, MessageSquare, Activity, Globe, Puzzle, LayoutGrid, CheckSquare } from 'lucide-react';

interface AgentDrawerProps {
  agent: AgentConfig;
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  onOpenNativeApp: () => void;
}

const DRAWER_TABS = [
  { id: 'sessions', label: 'Sessions', icon: MessageSquare },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'portals', label: 'Portals', icon: Globe },
  { id: 'plugins', label: 'Plugins', icon: Puzzle },
  { id: 'apps', label: 'Apps', icon: LayoutGrid },
  { id: 'workboard', label: 'Workboard', icon: CheckSquare },
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Agent Workbench',
    totalSessions: 14,
    sessions: [
      { id: 's1', name: 'Milestone 1 · Layout Precision', updatedAt: '10m ago' },
      { id: 's2', name: 'Figma Token Extraction', updatedAt: '1h ago' },
      { id: 's3', name: 'ACP Protocol Wiring', updatedAt: '3h ago' },
      { id: 's4', name: 'Superpowers TDD Harness', updatedAt: '1d ago' },
      { id: 's5', name: 'VSIX Release Pipeline', updatedAt: '2d ago' },
    ]
  },
  {
    id: 'proj-2',
    name: 'Giotto',
    totalSessions: 8,
    sessions: [
      { id: 'g1', name: 'Design System Tokens', updatedAt: '4h ago' },
      { id: 'g2', name: 'Canvas Visual Engine', updatedAt: '1d ago' },
    ]
  },
  {
    id: 'proj-3',
    name: 'Sapien',
    totalSessions: 19,
    sessions: [
      { id: 'sp1', name: 'Trading Platform Scoping', updatedAt: '2d ago' },
      { id: 'sp2', name: 'Genomics & Intelligence Bridge', updatedAt: '3d ago' },
    ]
  },
  {
    id: 'proj-4',
    name: 'PāGōPāGō',
    totalSessions: 6,
    sessions: [
      { id: 'p1', name: 'Commerce Workflow Engine', updatedAt: '4d ago' },
    ]
  }
];

const DEFAULT_TASKS = [
  { id: 't1', name: 'Overnight Maintenance & Compaction', cron: 'Daily 3:00 AM' },
  { id: 't2', name: 'Weekly Skill Audit & Sync', cron: 'Sunday 4:00 AM' },
  { id: 't3', name: 'Heartbeat Control-Plane Check', cron: 'Every 30m' },
];

export const AgentDrawer: React.FC<AgentDrawerProps> = ({
  agent,
  isOpen,
  onClose,
  onSelectSession,
  onOpenNativeApp,
}) => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({ 'proj-1': true });

  if (!isOpen) return null;

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="agent-drawer-overlay" onClick={onClose}>
      <div className="agent-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-agent-name">{agent.name}</span>
            <span className="drawer-subtext">Native Workspace Hub</span>
          </div>
          <button className="icon-button" onClick={onClose} title="Close Panel">
            <X size={15} />
          </button>
        </div>

        {/* Category Tabs (Figma sidebar-content 2090:11585) */}
        <div className="drawer-nav-tabs">
          {DRAWER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`drawer-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="drawer-body">
          {activeTab === 'sessions' && (
            <>
              {/* Conversation History Section */}
              <div className="drawer-section">
                <div className="section-title">
                  <Clock size={12} />
                  <span>Conversation History</span>
                </div>
                <div className="session-list">
                  <div
                    className="session-item active"
                    onClick={() => onSelectSession(agent.sessionId)}
                  >
                    <MessageSquare size={11} color="#38bdf8" />
                    <span className="session-item-name">{agent.sessionName}</span>
                    <span className="session-item-tag">Active</span>
                  </div>
                  <div className="session-item">
                    <MessageSquare size={11} />
                    <span className="session-item-name">Session 00 · System Bootstrap</span>
                    <span className="session-item-time">2h ago</span>
                  </div>
                </div>
              </div>

              {/* Scheduled Tasks Section */}
              <div className="drawer-section">
                <div className="section-title">
                  <Calendar size={12} />
                  <span>Scheduled Tasks</span>
                </div>
                <div className="task-list">
                  {DEFAULT_TASKS.map((t) => (
                    <div key={t.id} className="task-item">
                      <div className="task-dot" />
                      <div className="task-info">
                        <span className="task-name">{t.name}</span>
                        <span className="task-cron">{t.cron}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="drawer-section">
                <div className="section-title">
                  <Folder size={12} />
                  <span>Projects</span>
                </div>
                <div className="project-list">
                  {DEFAULT_PROJECTS.map((proj) => {
                    const isExpanded = !!expandedProjects[proj.id];
                    return (
                      <div key={proj.id} className="project-item-group">
                        <div
                          className="project-row"
                          onClick={() => toggleProject(proj.id)}
                        >
                          <div className="project-row-left">
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            <Folder size={12} color="#94a3b8" />
                            <span className="project-name">{proj.name}</span>
                          </div>
                          <span className="project-count">({proj.totalSessions})</span>
                        </div>

                        {isExpanded && (
                          <div className="project-sub-sessions">
                            {proj.sessions.slice(0, 5).map((s) => (
                              <div
                                key={s.id}
                                className="sub-session-item"
                                onClick={() => onSelectSession(s.id)}
                              >
                                <span className="sub-session-bullet">•</span>
                                <span className="sub-session-name">{s.name}</span>
                                <span className="sub-session-time">{s.updatedAt}</span>
                              </div>
                            ))}
                            {proj.totalSessions > 5 && (
                              <button
                                type="button"
                                className="show-all-btn"
                                onClick={() => console.log('Show all for project', proj.name)}
                              >
                                Show all ({proj.totalSessions})
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="drawer-section">
              <div className="section-title">
                <Activity size={12} />
                <span>Live Activity & Events</span>
              </div>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-bullet" />
                  <div className="activity-text">
                    <span className="activity-action">Tool execution complete:</span> nah-remember state synced
                    <span className="activity-time">Just now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-bullet" />
                  <div className="activity-text">
                    <span className="activity-action">Context compacted:</span> 12.4k tokens saved
                    <span className="activity-time">5m ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-bullet" />
                  <div className="activity-text">
                    <span className="activity-action">Branch switched:</span> main @ 1a15447
                    <span className="activity-time">15m ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="drawer-section">
              <div className="section-title">
                <Globe size={12} />
                <span>Connected Portals & MCPs</span>
              </div>
              <div className="portal-list">
                <div className="portal-item active">
                  <span className="portal-dot online" />
                  <div className="portal-info">
                    <span className="portal-name">nah-bridge</span>
                    <span className="portal-desc">Ecosystem discovery (stdio)</span>
                  </div>
                  <span className="portal-status-badge">Connected</span>
                </div>
                <div className="portal-item active">
                  <span className="portal-dot online" />
                  <div className="portal-info">
                    <span className="portal-name">mcp-gateway</span>
                    <span className="portal-desc">100+ on-demand tools</span>
                  </div>
                  <span className="portal-status-badge">Connected</span>
                </div>
                <div className="portal-item active">
                  <span className="portal-dot online" />
                  <div className="portal-info">
                    <span className="portal-name">nah-nexus</span>
                    <span className="portal-desc">AES-128 secret vault</span>
                  </div>
                  <span className="portal-status-badge">Connected</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plugins' && (
            <div className="drawer-section">
              <div className="section-title">
                <Puzzle size={12} />
                <span>Installed Skills & Plugins</span>
              </div>
              <div className="plugin-list">
                <div className="plugin-item">
                  <Puzzle size={12} color="#38bdf8" />
                  <span className="plugin-name">nah-remember</span>
                  <span className="plugin-tag">Active</span>
                </div>
                <div className="plugin-item">
                  <Puzzle size={12} color="#38bdf8" />
                  <span className="plugin-name">nah-knows</span>
                  <span className="plugin-tag">Active</span>
                </div>
                <div className="plugin-item">
                  <Puzzle size={12} color="#38bdf8" />
                  <span className="plugin-name">nah-behave</span>
                  <span className="plugin-tag">Enforced</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="drawer-section">
              <div className="section-title">
                <LayoutGrid size={12} />
                <span>Agent Runtimes & Native Apps</span>
              </div>
              <div className="app-cards-grid">
                <div className="app-card" onClick={onOpenNativeApp}>
                  <span className="app-title">Hermes Gateway</span>
                  <span className="app-desc">Uno CoS Hub</span>
                  <ExternalLink size={10} color="#38bdf8" />
                </div>
                <div className="app-card" onClick={onOpenNativeApp}>
                  <span className="app-title">OpenCode</span>
                  <span className="app-desc">Omo Developer</span>
                  <ExternalLink size={10} color="#38bdf8" />
                </div>
                <div className="app-card" onClick={onOpenNativeApp}>
                  <span className="app-title">OpenClaw</span>
                  <span className="app-desc">Humano Design</span>
                  <ExternalLink size={10} color="#38bdf8" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workboard' && (
            <div className="drawer-section">
              <div className="section-title">
                <CheckSquare size={12} />
                <span>Active Workboard / Kanban</span>
              </div>
              <div className="workboard-tasks">
                <div className="workboard-card in-progress">
                  <span className="workboard-tag tag-progress">In Progress</span>
                  <span className="workboard-task-title">Figma UI Parity Transformation</span>
                  <span className="workboard-meta">Assigned to Astro · Due Today</span>
                </div>
                <div className="workboard-card done">
                  <span className="workboard-tag tag-done">Done</span>
                  <span className="workboard-task-title">Linear Token Saturation Meter</span>
                  <span className="workboard-meta">Merged #1a15447</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Settings Bar */}
        <div className="drawer-footer" onClick={onOpenNativeApp} title="Open in Native Application / Browser">
          <div className="footer-left">
            <Settings size={13} color="#94a3b8" />
            <span className="footer-label">Settings & Native App</span>
          </div>
          <ExternalLink size={12} color="#38bdf8" />
        </div>
      </div>
    </div>
  );
};
