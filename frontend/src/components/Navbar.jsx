import React, { useState, useEffect } from 'react';
import { 
  Shield, Sparkles, User, RefreshCw, Bell, Command, 
  HelpCircle, CheckCircle2, ExternalLink
} from 'lucide-react';

export function Navbar({ activePage, setActivePage, role, setRole, onResetDemo, onOpenCommandPalette, onOpenOnboarding }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/clear', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
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

          {/* Right Controls: Command Palette, Notifications, Role, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Command Palette Button */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-2/60 border border-gray-700 hover:border-gold text-gray-300 hover:text-white text-xs transition-all"
              title="Open Command Palette (Ctrl+K or ⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-mono">⌘K</span>
            </button>

            {/* Quick Onboarding Trigger */}
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 text-gray-300 hover:text-gold rounded-lg transition-colors"
              title="Open Onboarding Wizard"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-1.5 text-gray-300 hover:text-gold rounded-lg transition-colors relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-coral" />
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotes && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 text-xs text-ink overflow-hidden animate-fadeIn">
                  <div className="p-3 bg-mist border-b border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-xs">Governance Notifications</span>
                    <button onClick={markAllRead} className="text-[10px] text-gold hover:underline">
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-400 italic">No notifications.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 hover:bg-mist/50 transition-colors ${!n.read ? 'bg-champagne/20 font-medium' : ''}`}>
                          <span className="font-bold block text-ink">{n.title}</span>
                          <p className="text-[11px] text-gray-600 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-gray-400 block mt-1">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
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
