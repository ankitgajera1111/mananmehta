import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Film,
  Megaphone,
  FileText,
  User,
  Mail,
  Inbox,
  Settings,
  Eye,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../../lib/utils';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/home', label: 'Home & Banner', icon: Home },
  { to: '/admin/films', label: 'Films', icon: Film },
  { to: '/admin/ads', label: 'Ads', icon: Megaphone },
  { to: '/admin/credits', label: 'Credits', icon: FileText },
  { to: '/admin/about', label: 'About Page', icon: User },
  { to: '/admin/contact', label: 'Contact Page', icon: Mail },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/visibility', label: 'Page Visibility', icon: Eye },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = ({ children, unreadCount = 0 }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-amber-500/15 text-amber-500'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/5'
            )
          }
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{label}</span>
          {label === 'Messages' && unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-[#0a0a0a] text-[10px] font-bold min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-[#0d0d0d] border-b border-[#f5f5f0]/10">
        <span className="font-display tracking-wider">ADMIN</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="p-2 rounded hover:bg-[#f5f5f0]/10"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex">
        <aside
          className={cn(
            'fixed lg:sticky top-0 left-0 z-30 w-64 h-screen bg-[#0d0d0d] border-r border-[#f5f5f0]/10 p-4 flex-col justify-between transition-transform',
            menuOpen ? 'flex translate-x-0' : 'hidden lg:flex -translate-x-full lg:translate-x-0'
          )}
        >
          <div>
            <div className="px-2 py-4 mb-4">
              <p className="font-display text-xl tracking-wider">MANAN</p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500 mt-1">
                Content Manager
              </p>
            </div>
            {nav}
          </div>

          <div className="space-y-1 pt-4 border-t border-[#f5f5f0]/10">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/5"
            >
              <ExternalLink className="w-4 h-4" />
              View site
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#f5f5f0]/60 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
            {user && (
              <p className="px-4 pt-2 text-[10px] text-[#f5f5f0]/30 truncate">
                {user.email}
              </p>
            )}
          </div>
        </aside>

        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-20 bg-black/60"
          />
        )}

        <main className="flex-1 min-w-0 p-4 lg:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
