import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, BookOpen, BarChart3, ShieldCheck, 
  RotateCcw, Download, Compass, X, Command
} from 'lucide-react';

export function CommandPalette({ isOpen, setIsOpen, setActivePage, onResetDemo }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const actions = [
    { id: 'new-review', label: 'Submit Content for Review', icon: Plus, page: 'new-review', desc: 'Run pre-publication checks' },
    { id: 'dashboard', label: 'Go to Dashboard', icon: BarChart3, page: 'dashboard', desc: 'Overview of recent reviews' },
    { id: 'brand-hub', label: 'Open Brand Knowledge Hub', icon: BookOpen, page: 'brand-hub', desc: 'Rules, facts & guidelines' },
    { id: 'submissions', label: 'Submission History & Audit', icon: ShieldCheck, page: 'submissions', desc: 'Immutable version ledger' },
    { id: 'insights', label: 'Governance Insights & Heatmap', icon: BarChart3, page: 'insights', desc: 'Policy telemetry analytics' },
    { id: 'trust', label: 'Security & Responsible AI', icon: ShieldCheck, page: 'trust', desc: 'Privacy & ethical guidelines' },
    { id: 'roadmap', label: 'Product Roadmap & Limits', icon: Compass, page: 'roadmap', desc: 'Current vs future scope' },
    { id: 'reset', label: 'Reset Demo Workspace', icon: RotateCcw, action: onResetDemo, desc: 'Restore Verity Learning defaults' },
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-midnight/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-mist/40">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Type a command or search pages... (e.g. review, brand, reset)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-ink focus:outline-none placeholder-gray-400"
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-gray-400 italic">No matching actions found.</p>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.action) item.action();
                    else if (item.page) setActivePage(item.page);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-mist transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-gold/20 group-hover:text-gold flex items-center justify-center text-gray-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-ink block">{item.label}</span>
                      <span className="text-[11px] text-gray-500">{item.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Jump ↵</span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 bg-mist/60 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Use <strong>Esc</strong> to close</span>
          <span className="font-mono">VERITY Command Hub</span>
        </div>

      </div>
    </div>
  );
}
