import React from 'react';
import { Shield, Sparkles, User, RefreshCw, FileText, BarChart3, BookOpen, Layers } from 'lucide-react';

export function Navbar({ activePage, setActivePage, role, setRole, onResetDemo }) {
  return (
    <header className="sticky top-0 z-50 bg-midnight text-ivory border-b border-navy-2/60 shadow-md">
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
            <button
              onClick={() => setActivePage('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'dashboard' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('new-review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'new-review' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              New Review
            </button>
            <button
              onClick={() => setActivePage('brand-hub')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'brand-hub' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              Brand Hub
            </button>
            <button
              onClick={() => setActivePage('submissions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'submissions' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActivePage('insights')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'insights' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActivePage('trust')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'trust' ? 'bg-gold text-midnight shadow' : 'text-gray-300 hover:text-white hover:bg-navy-2'
              }`}
            >
              Trust & AI
            </button>
          </nav>

          {/* Right Controls: Role Switcher & Reset */}
          <div className="flex items-center gap-3">
            {/* Demo Workspace Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy border border-gold/30 text-[11px] text-champagne">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span>Verity Learning (Demo)</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-navy-2/80 px-2 py-1 rounded-lg border border-gray-700/60 text-xs">
              <User className="w-3.5 h-3.5 text-gold" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
                title="Demo roles switch reviewer simulation"
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
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
