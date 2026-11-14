import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Heart, CheckCircle2, Lock } from 'lucide-react';

export function Footer({ setActivePage }) {
  return (
    <footer className="bg-gradient-to-b from-[#0A1128] to-[#060A16] text-[#F8F7F3] border-t border-[#18285A] pt-14 pb-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col (2 cols on md) */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => setActivePage && setActivePage('landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Animated Winged Logo */}
              <div className="w-9 h-9 rounded-xl bg-[#101B35] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-md group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                  <path 
                    d="M 12 10 C 17 20, 22 28, 25 32 C 22 24, 18 16, 15 12 Z" 
                    fill="#C6A15B" 
                  />
                  <path 
                    d="M 25 32 C 28 26, 33 16, 38 8 C 34 14, 30 22, 26 28 Z" 
                    fill="#E6C77B" 
                  />
                </svg>
              </div>

              <div>
                <span className="font-serif font-bold text-xl text-white tracking-tight leading-none block">
                  VERITY
                </span>
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#C6A15B] uppercase block mt-0.5">
                  BRAND GOVERNANCE
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              Intelligent pre-publication brand governance platform for high-trust enterprises. Grounded in deterministic rules, verified evidence retrieval, and audited human approvals.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#E6C77B] pt-2">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>100% Human Final Authority — AI Never Auto-Approves.</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A15B] mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button 
                  onClick={() => setActivePage('dashboard')} 
                  className="hover:text-white transition-colors"
                >
                  Governance Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('new-review')} 
                  className="hover:text-white transition-colors"
                >
                  Launch New Review
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('brand-hub')} 
                  className="hover:text-white transition-colors"
                >
                  Brand Knowledge Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('insights')} 
                  className="hover:text-white transition-colors"
                >
                  Policy Telemetry Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A15B] mb-3.5">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button 
                  onClick={() => setActivePage('trust')} 
                  className="hover:text-white transition-colors"
                >
                  Security Architecture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('roadmap')} 
                  className="hover:text-white transition-colors"
                >
                  Roadmap & Limitations
                </button>
              </li>
              <li>
                <a 
                  href="/docs" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>OpenAPI Swagger</span>
                  <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                </a>
              </li>
              <li>
                <a 
                  href="/redoc" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>ReDoc Specification</span>
                  <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Identity */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A15B] mb-3.5">
              Hackathon Identity
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="p-3 rounded-xl bg-[#101B35]/80 border border-gray-800 text-[11px] space-y-1">
                <div className="text-white font-semibold">Team COGNEXA</div>
                <div className="text-[#E6C77B]">WCC Forge 48 Hour Sprint</div>
                <div className="text-gray-500 font-mono text-[10px]">Inkloom Brand Governance Track</div>
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                Zero client credential exposure. SHA-256 version-bound audits.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#18285A]/70 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 VERITY by Team COGNEXA. Consistent. Compliant. Trustworthy.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Deterministic Layer 1-3</span>
            <span>•</span>
            <span>PostgreSQL & SQLite Dual-Engine</span>
            <span>•</span>
            <span className="text-[#C6A15B]">Production Grade</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
