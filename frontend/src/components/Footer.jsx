import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function Footer({ setActivePage }) {
  return (
    <footer className="bg-midnight text-ivory border-t border-navy-2 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                <span className="text-gold text-xs font-bold">V</span>
              </div>
              <span className="font-serif font-bold text-lg text-white">VERITY</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Intelligent pre-publication brand governance platform.
              Evidence-linked rule detection, intent-preserving corrections, and audited human approvals.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gold-light">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>100% Human Final Authority — AI Never Auto-Approves.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => setActivePage('dashboard')} className="hover:text-white">Dashboard</button></li>
              <li><button onClick={() => setActivePage('new-review')} className="hover:text-white">New Review</button></li>
              <li><button onClick={() => setActivePage('brand-hub')} className="hover:text-white">Brand Knowledge Hub</button></li>
              <li><button onClick={() => setActivePage('insights')} className="hover:text-white">Governance Insights</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Trust & Ethics</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => setActivePage('trust')} className="hover:text-white">Security & Responsible AI</button></li>
              <li><button onClick={() => setActivePage('roadmap')} className="hover:text-white">Roadmap & Limitations</button></li>
              <li><a href="/docs" target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-1">OpenAPI Specs <ExternalLink className="w-3 h-3"/></a></li>
              <li><span className="text-gray-500 text-xs">Team COGNEXA • WCC Forge 48</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-navy-2/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 VERITY by Team COGNEXA. Inkloom AI Problem Statement.</p>
          <p className="mt-2 sm:mt-0">Built for high-trust institutional communication.</p>
        </div>
      </div>
    </footer>
  );
}
