'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconLayoutDashboardFilled,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconCircleDashedCheck,
  IconBan,
  IconUser,
  IconDotsVertical,
  IconTrash,
  IconEdit,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { PieChart, Eye, Hammer, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { fetchProjects, updateProject, deleteProject } from '../../../lib/api';
import { createClient } from '@/utils/supabase/client';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
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

  const [loading, setLoading] = useState(false);

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

  const topNavItems: NavItem[] = [
    { icon: IconLayoutDashboardFilled, label: 'Dashboard', href: '/dashboard' },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: IconUser, label: 'Profile', href: '/profile' },
    { icon: IconSettings, label: 'Settings', href: '/settings' },
    { icon: IconLogout, label: 'Log Out', href: '/logout' },
  ];

  return (
    <aside className="w-72 h-screen bg-[#1B1818] border-r border-neutral-800 flex flex-col shrink-0">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/brand/logos/default-logo.svg"
            alt="Verdyct"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-white tracking-tight">Verdyct</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col px-4 py-6 overflow-y-auto custom-scrollbar">
        {/* Top Navigation Items */}
        <div className="space-y-1 mb-8">
          {topNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href || '#'}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5 text-neutral-500" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Approved Section */}
        {approvedProjects.length > 0 && (
          <div className="mb-8">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Approved Ventures
            </h3>
            <div className="space-y-2">
              {approvedProjects.map((project) => (
                <ProjectItem key={project.id} project={project} type="approved" refreshProjects={loadProjects} />
              ))}
            </div>
          </div>
        )}

        {/* Rejected Section */}
        {rejectedProjects.length > 0 && (
          <div className="mb-8">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Rejected Ventures
            </h3>
            <div className="space-y-2">
              {rejectedProjects.map((project) => (
                <ProjectItem key={project.id} project={project} type="rejected" refreshProjects={loadProjects} />
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
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5 text-neutral-500" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

interface ProjectItemProps {
  project: SidebarProject;
  type: 'approved' | 'rejected';
  refreshProjects: () => void;
}

function ProjectItem({ project, type, refreshProjects }: ProjectItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setActionLoading(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        const success = await deleteProject(project.id, token);
        if (success) {
          refreshProjects();
        }
      }
      setActionLoading(false);
    }
  };

  return (
    <div className="relative group/item">
      <div
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group ${isExpanded || isEditing ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          }`}
      >
        {/* Status Indicator */}
        <div
          onClick={() => !isEditing && setIsExpanded(!isExpanded)}
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
              onClick={() => setIsExpanded(!isExpanded)}
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
                        handleDelete();
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
              onClick={() => setIsExpanded(!isExpanded)}
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
