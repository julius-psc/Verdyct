'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconLayoutDashboardFilled,
  IconFolderFilled,
  IconSettings,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { PieChart, Eye, Hammer, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
}

interface Project {
  name: string;
  agents: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }>;
}

const PROJECTS: Project[] = [
  {
    name: 'Project Alpha',
    agents: [
      { icon: PieChart, label: 'The Analyst' },
      { icon: Eye, label: 'The Spy' },
      { icon: Hammer, label: 'The Architect' },
      { icon: TrendingUp, label: 'The Financier' },
    ],
  },
  {
    name: 'Project Beta',
    agents: [
      { icon: PieChart, label: 'The Analyst' },
      { icon: Eye, label: 'The Spy' },
      { icon: Hammer, label: 'The Architect' },
      { icon: TrendingUp, label: 'The Financier' },
    ],
  },
  {
    name: 'Project Gamma',
    agents: [
      { icon: PieChart, label: 'The Analyst' },
      { icon: Eye, label: 'The Spy' },
      { icon: Hammer, label: 'The Architect' },
      { icon: TrendingUp, label: 'The Financier' },
    ],
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  const handleProjectsClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setIsProjectsExpanded(!isProjectsExpanded);
  };

  const topNavItems: NavItem[] = [
    { icon: IconLayoutDashboardFilled, label: 'Dashboard', href: '/dashboard' },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: IconSettings, label: 'Settings', href: '/settings' },
    { icon: IconLogout, label: 'Log Out', href: '/logout' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 280 : 72,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative h-screen bg-[#1B1818] border-r border-neutral-800 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-neutral-800 px-4">
        <motion.div
          animate={{
            width: isExpanded ? 120 : 40,
          }}
          transition={{ duration: 0.3 }}
          className="relative h-10 overflow-hidden"
        >
          <Image
            src="/assets/brand/logos/default-logo.svg"
            alt="Verdyct"
            width={isExpanded ? 120 : 40}
            height={40}
            className="object-contain w-full h-full"
          />
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
        {/* Top Navigation Items */}
        <div className="space-y-1">
          {topNavItems.map((item) => (
            <NavButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              href={item.href}
            />
          ))}

          {/* Projects Section */}
          <div>
            <button
              onClick={handleProjectsClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-all"
            >
              <IconFolderFilled className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Projects
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      rotate: isProjectsExpanded ? 90 : 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto"
                  >
                    <IconChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Projects Dropdown */}
            <AnimatePresence>
              {isExpanded && isProjectsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="ml-5 mt-1 space-y-2 border-l border-neutral-700 pl-4">
                    {PROJECTS.map((project, projectIndex) => (
                      <ProjectItem
                        key={projectIndex}
                        project={project}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation Items */}
        <div className="mt-auto space-y-1 pt-4 border-t border-neutral-800">
          {bottomNavItems.map((item) => (
            <NavButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              href={item.href}
            />
          ))}
        </div>
      </nav>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:bg-neutral-700 transition-colors"
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <IconChevronLeft className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </button>
    </motion.aside>
  );
}

interface NavButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isExpanded: boolean;
  href?: string;
}

function NavButton({ icon: Icon, label, isExpanded, href }: NavButtonProps) {
  const content = (
    <>
      <Icon className="w-5 h-5 shrink-0" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden mr-auto"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const className = "w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-all";

  if (href) {
    return (
      <Link href={href} className={className} title={!isExpanded ? label : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={className}
      title={!isExpanded ? label : undefined}
    >
      {content}
    </button>
  );
}

interface ProjectItemProps {
  project: Project;
}

function ProjectItem({ project }: ProjectItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-neutral-400 hover:bg-neutral-800/30 hover:text-white transition-all text-sm"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconChevronRight className="w-3 h-3" />
        </motion.div>
        <span className="font-medium">{project.name}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-1 space-y-1">
              {project.agents.map((agent, index) => {
                const projectPath = project.name.replace(/\s+/g, '').replace(/^(.)/, (c) => c.toLowerCase());
                const agentPath = agent.label.replace(/^The\s+/, '').toLowerCase();

                return (
                  <Link
                    key={index}
                    href={`/${projectPath}/${agentPath}`}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-neutral-500 hover:bg-neutral-800/30 hover:text-neutral-300 transition-all text-xs"
                  >
                    <agent.icon className="w-3.5 h-3.5 shrink-0" />
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
