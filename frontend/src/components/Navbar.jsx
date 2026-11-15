import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Sparkles, User, RefreshCw, Bell, Command, 
  HelpCircle, CheckCircle2, ExternalLink, LogIn, LogOut, Check,
  ArrowLeft, ChevronDown
} from 'lucide-react';
import { markNotificationRead, clearAllNotifications, switchRole } from '../lib/api';

/**
 * App Top Bar Component:
 * - Solid navy #0A1230, height 64px, 1px gold bottom border
 * - Items ivory 15px, active item a gold pill (#D4AF37, navy text), hover gold text
 * - One row at 1366px with no wrapping
 * - Primary items: Dashboard, New Review, Brand Hub, Review Centre, Insights, Quality, Trust & AI
 * - Right cluster: ⌘K search, help, notifications, role switcher, Back to website, Sign In / Profile
 * - "Reset demo workspace" in role menu with confirmation dialog
 */
export function Navbar({ 
  activePage, 
  setActivePage, 
  role, 
  setRole, 
  onResetDemo, 
  onOpenCommandPalette, 
  onOpenOnboarding,
  currentUser,
  onLogout,
  onSelectSubmission
}) {
  const [notifications, setNotifications] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const dropdownRef = useRef(null);
  const bellButtonRef = useRef(null);
  const roleMenuRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      // Ignore network errors
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Click-outside and Escape listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showNotes &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target)
      ) {
        setShowNotes(false);
      }
      if (
        showRoleMenu &&
        roleMenuRef.current &&
        !roleMenuRef.current.contains(event.target)
      ) {
        setShowRoleMenu(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setShowNotes(false);
        setShowRoleMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotes, showRoleMenu]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await clearAllNotifications();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to clear notifications:', e);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      } catch (e) {}
    }
    
    setShowNotes(false);
    if (notif.link && notif.link.includes('/submissions/')) {
      const parts = notif.link.split('/');
      const subId = parts[parts.length - 1];
      if (onSelectSubmission) onSelectSubmission(subId);
      setActivePage('results');
    }
  };

  const handleRoleChange = async (newRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
    try {
      await switchRole(newRole);
    } catch (err) {
      console.error('Failed to switch role session on server:', err);
    }
  };

  const roleLabels = {
    creator: 'Content Creator',
    manager: 'Marketing Manager',
    admin: 'Brand Administrator',
    reviewer: 'Authorised Reviewer'
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'new-review', label: 'New Review' },
    { id: 'brand-hub', label: 'Brand Hub' },
    { id: 'review', label: 'Review Centre' },
    { id: 'insights', label: 'Insights' },
    { id: 'quality', label: 'Quality' },
    { id: 'trust', label: 'Trust & AI' }
  ];

  return (
    <header 
      className="sticky top-0 z-40 w-full select-none"
      style={{
        backgroundColor: '#0A1230',
        height: '64px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 2px 20px rgba(5, 8, 20, 0.5)'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LEFT: Logo & Wordmark */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0 mr-4" 
          onClick={() => setActivePage('landing')}
          title="Back to Landing Page"
        >
          <div className="w-8 h-7 flex items-center justify-center">
            <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" fill="none">
              <defs>
                <linearGradient id="appNavV1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2B2"/>
                  <stop offset="40%" stopColor="#D4AF37"/>
                  <stop offset="100%" stopColor="#8A5A12"/>
                </linearGradient>
                <linearGradient id="appNavV2" x1="0%" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F3D98B"/>
                  <stop offset="100%" stopColor="#D4AF37"/>
                </linearGradient>
              </defs>
              <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#appNavV1)"/>
              <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#appNavV2)"/>
            </svg>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B] leading-none block">
              VERITY
            </span>
            <span className="text-[7.5px] font-mono tracking-[0.35em] text-[#D4AF37]/80 uppercase block mt-0.5 leading-none">
              WORKSPACE
            </span>
          </div>
        </div>

        {/* CENTER: Primary Navigation Items (One row at 1366px with no wrapping) */}
        <nav className="flex items-center flex-nowrap gap-1 lg:gap-1.5 overflow-x-auto py-1">
          {navItems.map(item => {
            const isActive = activePage === item.id || (item.id === 'review' && activePage === 'submissions');
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-3 py-1.5 rounded-full text-[15px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#D4AF37] text-[#0A1230] font-bold shadow-[0_2px_8px_rgba(212,175,55,0.4)]' 
                    : 'text-[#F7F2E7] hover:text-[#F3D98B] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT CLUSTER: ⌘K search, help, notifications, role switcher, Back to website, Sign In */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-4">
          
          {/* Back to website Link */}
          <button
            onClick={() => setActivePage('landing')}
            className="hidden xl:inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#F3D98B] font-medium transition-colors px-2 py-1 rounded hover:bg-white/5"
            title="Return to public marketing website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to website</span>
          </button>

          {/* ⌘K Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-gray-300 hover:text-white text-xs transition-all cursor-pointer"
            title="Open Command Palette (Ctrl+K or ⌘K)"
            aria-label="Open Command Palette"
          >
            <Command className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-mono hidden sm:inline">⌘K</span>
          </button>

          {/* Help Button (Onboarding trigger) */}
          <button
            onClick={onOpenOnboarding}
            className="p-1.5 text-gray-300 hover:text-[#D4AF37] rounded-lg transition-colors cursor-pointer"
            title="Open Onboarding Guide"
            aria-label="Open Onboarding Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              ref={bellButtonRef}
              onClick={() => setShowNotes(prev => !prev)}
              className="p-1.5 text-gray-300 hover:text-[#D4AF37] rounded-lg transition-colors relative cursor-pointer"
              title="System Notifications"
              aria-haspopup="true"
              aria-expanded={showNotes}
              aria-label={`System Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B91C1C] animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 text-[9px] font-bold rounded-full bg-[#B91C1C] text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotes && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl border border-[#E6DDC8] shadow-2xl z-50 text-xs text-[#2B3345] overflow-hidden"
                role="region"
                aria-label="Notifications Panel"
              >
                <div className="p-3 bg-[#F6F1E7] border-b border-[#E6DDC8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0A1230]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#B91C1C]/15 text-[#B91C1C] font-bold text-[10px]">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead} 
                      className="text-[11px] text-[#8A5A12] hover:text-[#0A1230] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#5B6478]">
                      <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-xs">No notifications yet</p>
                      <p className="text-[11px] text-[#5B6478] mt-0.5">Events and alerts appear here as reviews occur.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer text-left ${!n.read ? 'bg-[#FBF1CF]/30' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold text-xs text-[#0A1230] ${!n.read ? 'font-bold' : ''}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#5B6478] whitespace-nowrap">
                            {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B6478] mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher with Dropdown Menu & Reset Demo Action */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setShowRoleMenu(prev => !prev)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/40 text-xs text-[#F7F2E7] transition-all cursor-pointer"
              title="Current Active Role (Click to switch persona or reset workspace)"
            >
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-[#F3D98B] hidden sm:inline">{roleLabels[role] || role}</span>
              <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E6DDC8] shadow-2xl z-50 p-2 text-xs text-[#2B3345]">
                <div className="px-3 py-2 border-b border-gray-100">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#5B6478] tracking-wider block">
                    Active Persona
                  </span>
                  <p className="text-[11px] text-[#0A1230] font-semibold mt-0.5">
                    {roleLabels[role]}
                  </p>
                </div>

                <div className="py-1">
                  {[
                    { id: 'creator', label: 'Content Creator', email: 'creator@verity.internal' },
                    { id: 'manager', label: 'Marketing Manager', email: 'manager@verity.internal' },
                    { id: 'admin', label: 'Brand Administrator', email: 'admin@verity.internal' },
                    { id: 'reviewer', label: 'Authorised Reviewer', email: 'reviewer@verity.internal' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        role === r.id ? 'bg-[#FBF1CF] text-[#8A6A00] font-bold' : 'hover:bg-gray-50 text-[#2B3345]'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-xs">{r.label}</div>
                        <div className="text-[10px] text-[#5B6478]">{r.email}</div>
                      </div>
                      {role === r.id && <Check className="w-3.5 h-3.5 text-[#8A6A00]" />}
                    </button>
                  ))}
                </div>

                {/* Reset Demo Workspace Item */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onResetDemo();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#B91C1C] hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#B91C1C]" />
                    <span>Reset demo workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActivePage('profile')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-[#D4AF37]/40 text-xs font-medium text-[#F7F2E7] transition-all cursor-pointer"
                title="View User Profile"
              >
                {currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-gray-400 hover:text-[#B91C1C] rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('login')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#0A1230] text-xs font-bold transition-all shadow-sm cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
              }}
              title="Sign in with an account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
