import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Sparkles, User, RefreshCw, Bell, Command, 
  HelpCircle, CheckCircle2, ExternalLink, LogIn, LogOut, Check
} from 'lucide-react';
import { markNotificationRead, clearAllNotifications } from '../lib/api';

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
  const dropdownRef = useRef(null);
  const bellButtonRef = useRef(null);

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

  // Click-outside and Escape listener with proper cleanup
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
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && showNotes) {
        setShowNotes(false);
        if (bellButtonRef.current) bellButtonRef.current.focus();
      }
    }

    if (showNotes) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotes]);

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

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-midnight text-ivory border-b border-navy-2/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Seal */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('landing')}>
            <div className="relative w-9 h-9 rounded-full bg-midnight border-2 border-gold flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
                <path d="M30 48 L46 66 L72 32" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                VERITY
              </span>
              <span className="text-[10px] tracking-widest text-gold-light uppercase block font-sans font-medium -mt-1">
                Brand Governance
              </span>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'new-review', label: 'New Review' },
              { id: 'brand-hub', label: 'Brand Hub' },
              { id: 'review', label: 'Review Centre' },
              { id: 'submissions', label: 'History' },
              { id: 'insights', label: 'Insights & Heatmap' },
              { id: 'trust', label: 'Trust & AI' },
              { id: 'roadmap', label: 'Roadmap' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePage === item.id ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Command Palette, Notifications, Role, Auth, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Command Palette Button */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-2/60 border border-gray-700 hover:border-gold text-gray-300 hover:text-white text-xs transition-all"
              title="Open Command Palette (Ctrl+K or ⌘K)"
              aria-label="Open Command Palette"
            >
              <Command className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-mono">⌘K</span>
            </button>

            {/* Quick Onboarding Trigger */}
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 text-gray-300 hover:text-gold rounded-lg transition-colors"
              title="Open Onboarding Wizard"
              aria-label="Open Onboarding Wizard"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                ref={bellButtonRef}
                onClick={() => setShowNotes(prev => !prev)}
                className="p-1.5 text-gray-300 hover:text-gold rounded-lg transition-colors relative"
                title="System Notifications"
                aria-haspopup="true"
                aria-expanded={showNotes}
                aria-label={`System Notifications, ${unreadCount} unread`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 text-[9px] font-bold rounded-full bg-coral text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotes && (
                <div 
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 text-xs text-ink overflow-hidden animate-fadeIn"
                  role="region"
                  aria-label="Notifications Panel"
                >
                  <div className="p-3 bg-mist border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-ink">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-coral/10 text-coral font-bold text-[10px]">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-[11px] text-gold hover:text-gold-light font-medium flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                        <p className="font-medium text-xs">No notifications yet</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Events and alerts will appear here as reviews occur.</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 hover:bg-mist/70 transition-colors cursor-pointer text-left ${!n.read ? 'bg-champagne/15' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`font-semibold text-xs text-ink ${!n.read ? 'text-midnight font-bold' : ''}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {formatTimestamp(n.created_at)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-navy-2/80 px-2 py-1 rounded-lg border border-gray-700/60 text-xs">
              <User className="w-3.5 h-3.5 text-gold" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
                title="Simulate reviewer vs author persona"
              >
                <option value="creator" className="bg-navy text-white">Creator</option>
                <option value="reviewer" className="bg-navy text-white">Reviewer</option>
                <option value="admin" className="bg-navy text-white">Admin</option>
              </select>
            </div>

            {/* User Auth or Sign In Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('profile')}
                  className="px-2.5 py-1 rounded-lg bg-navy-2/80 border border-gold/40 hover:border-gold text-xs font-medium text-white transition-all"
                  title="View User Profile"
                >
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-gray-400 hover:text-coral rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('login')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold hover:bg-gold-light text-midnight text-xs font-bold transition-all shadow"
                title="Sign in with an account"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              title="Reset Demo Data"
              className="p-1.5 text-gray-400 hover:text-gold hover:bg-navy-2 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Reset</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
