import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, FileQuestion, BookOpen,
  CalendarDays, FileText, Lightbulb, ChevronLeft, ChevronRight,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard',         icon: LayoutDashboard },
  { path: '/chat',       label: 'AI Chat',            icon: MessageSquare },
  { path: '/quiz',       label: 'Quiz Generator',     icon: FileQuestion },
  { path: '/flashcards', label: 'Flashcards',         icon: BookOpen },
  { path: '/studyplan',  label: 'Study Plan',         icon: CalendarDays },
  { path: '/summarizer', label: 'Summarizer',         icon: FileText },
  { path: '/explain',    label: 'Concept Explainer',  icon: Lightbulb },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col flex-shrink-0 border-r border-border bg-surface transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-8 border-b border-border ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Lumina
              </span>
              <span className="text-t3 text-xs font-normal">Your Study Buddy</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-t2 hover:bg-s3 hover:text-t1'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center gap-2 mx-2 mb-4 px-3 py-2 rounded-lg text-t3 hover:text-t2 hover:bg-s3 transition-colors text-xs"
        >
          {collapsed ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}