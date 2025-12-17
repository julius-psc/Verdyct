'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconLayoutDashboardFilled,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconChevronLeft,
  IconCircleDashedCheck,
  IconBan,
  IconUser,
  IconDotsVertical,
  IconTrash,
  IconEdit,
  IconCheck,
  IconX,
  IconPlus,
  IconLink,
  IconArrowUp,
  IconAlertTriangle,
  IconLoader2
} from '@tabler/icons-react';
import { PieChart, Eye, Hammer, TrendingUp, AudioLines } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { fetchProjects, updateProject, deleteProject } from '../../../lib/api';
import { createClient } from '@/utils/supabase/client';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary';
}

interface SidebarProject {
  id: string;
  name: string;
  status: string;
  agents: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }>;
}

export default function Sidebar() {
  const [approvedProjects, setApprovedProjects] = useState<SidebarProject[]>([]);
  const [rejectedProjects, setRejectedProjects] = useState<SidebarProject[]>([]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectInput, setNewProjectInput] = useState("");
  const [analysisType, setAnalysisType] = useState<'small' | 'full'>('small');
  const [projectToDelete, setProjectToDelete] = useState<SidebarProject | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadProjects = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const apiProjects = await fetchProjects(token);
    if (apiProjects.length > 0) {
      const sidebarProjects = apiProjects.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        agents: [
          { icon: PieChart, label: 'The Analyst' },
          { icon: Eye, label: 'The Spy' },
          { icon: Hammer, label: 'The Architect' },
          { icon: TrendingUp, label: 'The Financier' },
        ]
      }));

      setApprovedProjects(sidebarProjects.filter(p => p.status === 'approved'));
      setRejectedProjects(sidebarProjects.filter(p => p.status === 'rejected'));
    } else {
      setApprovedProjects([]);
      setRejectedProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleNewProjectSubmit = () => {
    if (!newProjectInput.trim()) return;
    router.push(`/analyzing?idea=${encodeURIComponent(newProjectInput)}&type=${analysisType}`);
    setIsNewProjectModalOpen(false);
    setNewProjectInput("");
    setAnalysisType('small'); // Reset
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewProjectSubmit();
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    // Optimistic UI update
    setApprovedProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    setRejectedProjects(prev => prev.filter(p => p.id !== projectToDelete.id));

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      const success = await deleteProject(projectToDelete.id, token);
      if (!success) {
        await loadProjects();
        alert("Failed to delete project");
      }
    }
    setProjectToDelete(null);
  };

  const topNavItems: NavItem[] = [
    { icon: IconLayoutDashboardFilled, label: 'Dashboard', href: '/dashboard' },
    {
      icon: IconPlus,
      label: 'New Project',
      onClick: () => setIsNewProjectModalOpen(true),
      variant: 'default'
    },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: IconSettings, label: 'Settings', href: '/settings' },
    { icon: IconLogout, label: 'Log Out', href: '/logout' },
  ];

  return (
    <>
      <aside
        className={`${isCollapsed ? 'w-20' : 'w-72'} h-full bg-[#1B1818] border-r border-neutral-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 z-50 w-6 h-6 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <IconChevronRight className="w-4 h-4" /> : <IconChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-neutral-800 transition-all`}>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/brand/logos/default-logo.svg"
              alt="Verdyct"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            {!isCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                Verdyct
              </span>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col px-3 py-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {/* Top Navigation Items */}
          <div className="space-y-1 mb-8">
            {topNavItems.map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 text-neutral-500 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 text-neutral-500 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              )
            ))}
          </div>

          {/* Approved Section */}
          {approvedProjects.length > 0 && (
            <div className="mb-8">
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
                  Approved Ventures
                </h3>
              )}
              {isCollapsed && <div className="h-4 border-b border-neutral-800 mb-4 mx-2" />}

              <div className="space-y-2">
                {approvedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    type="approved"
                    refreshProjects={loadProjects}
                    onDeleteClick={() => setProjectToDelete(project)}
                    isCollapsed={isCollapsed}
                    isExpanded={expandedProjectId === project.id}
                    onToggle={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rejected Section */}
          {rejectedProjects.length > 0 && (
            <div className="mb-8">
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
                  Rejected Ventures
                </h3>
              )}

              <div className="space-y-2">
                {rejectedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    type="rejected"
                    refreshProjects={loadProjects}
                    onDeleteClick={() => setProjectToDelete(project)}
                    isCollapsed={isCollapsed}
                    isExpanded={expandedProjectId === project.id}
                    onToggle={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation Items */}
          <div className="mt-auto pt-6 border-t border-neutral-800 space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href || '#'}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 text-neutral-500 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl z-10"
            >
              <div className="relative bg-[#1B1818] rounded-3xl border border-white/10 p-4 flex flex-col gap-3 shadow-2xl">
                {/* Textarea */}
                <textarea
                  placeholder="Describe your idea..."
                  className="w-full bg-transparent text-white placeholder:text-white/40 resize-none outline-none text-base p-2"
                  rows={3}
                  value={newProjectInput}
                  onChange={(e) => setNewProjectInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />

                {/* Analysis Type Toggle */}
                <div className="flex items-center gap-6 px-2 pb-2">
                  <label className={`flex items-center gap-2 cursor-pointer transition-opacity ${analysisType === 'small' ? 'opacity-100' : 'opacity-50'}`}>
                    <input
                      type="radio"
                      name="analysisType"
                      value="small"
                      checked={analysisType === 'small'}
                      onChange={(e) => setAnalysisType(e.target.value as 'small' | 'full')}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border border-white/50 flex items-center justify-center ${analysisType === 'small' ? 'bg-white' : 'bg-transparent'}`}>
                      {analysisType === 'small' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span className="text-white text-sm font-medium">Small (Free)</span>
                  </label>

                  <label className={`flex items-center gap-2 cursor-pointer transition-opacity ${analysisType === 'full' ? 'opacity-100' : 'opacity-50'}`}>
                    <input
                      type="radio"
                      name="analysisType"
                      value="full"
                      checked={analysisType === 'full'}
                      onChange={(e) => setAnalysisType(e.target.value as 'small' | 'full')}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border border-white/50 flex items-center justify-center ${analysisType === 'full' ? 'bg-white' : 'bg-transparent'}`}>
                      {analysisType === 'full' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span className="text-white text-sm font-medium">Full (1 Credit)</span>
                  </label>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between relative z-20">
                  {/* Left: Attach Button (Disabled) */}
                  <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-white/30 cursor-not-allowed group relative transition-colors">
                    <IconLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Attach</span>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                      Coming Soon
                    </div>
                  </button>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button disabled className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-white/30 flex items-center justify-center cursor-not-allowed group relative transition-colors">
                      <AudioLines className="w-5 h-5" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                        Coming Soon
                      </div>
                    </button>

                    {/* Submit Button */}
                    <button
                      onClick={handleNewProjectSubmit}
                      disabled={!newProjectInput.trim()}
                      className="w-10 h-10 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <IconArrowUp className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectToDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md z-10 bg-[#1B1818] border border-neutral-800 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <IconAlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Delete Project?</h3>
                  <p className="text-sm text-neutral-400">
                    This will permanently delete <span className="text-white font-medium">"{projectToDelete.name}"</span> and all associated data. This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-4">
                  <button
                    onClick={() => setProjectToDelete(null)}
                    className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ProjectItemProps {
  project: SidebarProject;
  type: 'approved' | 'rejected';
  refreshProjects: () => void;
  onDeleteClick: () => void;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectItem({ project, type, refreshProjects, onDeleteClick, isCollapsed, isExpanded, onToggle }: ProjectItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRename = async () => {
    if (!editName.trim() || editName === project.name) {
      setIsEditing(false);
      return;
    }

    setActionLoading(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      const success = await updateProject(project.id, { name: editName }, token);
      if (success) {
        refreshProjects();
      }
    }
    setActionLoading(false);
    setIsEditing(false);
  };

  if (isCollapsed) {
    return (
      <div className="w-full flex justify-center py-2 group relative">
        <Link href={`/${project.id}/analyst`} className="shrink-0 cursor-pointer">
          {type === 'approved' ? (
            <div className="w-3 h-3 rounded-full bg-neutral-600 group-hover:bg-green-500 transition-colors" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-neutral-600 group-hover:bg-red-500 transition-colors" />
          )}
        </Link>
        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-neutral-800 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
          {project.name}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/item">
      <div
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group ${isExpanded || isEditing ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          }`}
      >
        {/* Status Indicator */}
        <div
          onClick={() => !isEditing && onToggle()}
          className={`shrink-0 cursor-pointer ${isEditing ? 'opacity-50' : ''}`}
        >
          {type === 'approved' ? (
            <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-neutral-600 group-hover:bg-green-500/50'}`} />
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-neutral-600 group-hover:bg-red-500/50'}`} />
          )}
        </div>

        {/* Name / Input */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black/50 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-neutral-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') {
                    setEditName(project.name);
                    setIsEditing(false);
                  }
                }}
              />
              <button onClick={handleRename} className="p-0.5 hover:text-green-400 text-neutral-500">
                <IconCheck className="w-3 h-3" />
              </button>
              <button onClick={() => { setEditName(project.name); setIsEditing(false); }} className="p-0.5 hover:text-red-400 text-neutral-500">
                <IconX className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => onToggle()}
              className="text-sm font-medium truncate w-full text-left cursor-pointer"
            >
              {project.name}
            </div>
          )}
        </div>

        {/* Chevron / Actions */}
        {!isEditing && (
          <div className="flex items-center">
            {/* 3 dots menu trigger - only visible on hover or if menu open */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors ${isMenuOpen ? 'opacity-100 text-white' : 'opacity-0 group-hover/item:opacity-100'}`}
              >
                <IconDotsVertical className="w-4 h-4" />
              </button>

              {/* Context Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[#252525] border border-neutral-800 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setIsEditing(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <IconEdit className="w-3 h-3" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onDeleteClick();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <IconTrash className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-neutral-600 group-hover:text-neutral-400 cursor-pointer ml-1"
              onClick={() => onToggle()}
            >
              <IconChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && !isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-1 pl-3 border-l border-neutral-800 space-y-0.5 py-1">
              {project.agents.map((agent, index) => {
                const agentPath = agent.label.replace(/^The\s+/, '').toLowerCase();
                return (
                  <Link
                    key={index}
                    href={`/${project.id}/${agentPath}`}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-neutral-500 hover:text-white hover:bg-neutral-800/30 transition-colors"
                  >
                    <agent.icon className="w-4 h-4 shrink-0 opacity-70" />
                    <span>{agent.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
