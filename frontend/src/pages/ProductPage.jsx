import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, Layers, TrendingUp, ArrowRight, 
  Sparkles, CheckCircle2, Sliders, Database, BarChart3, Lock
} from 'lucide-react';

export function ProductPage({ setActivePage }) {
  return (
    <div className="bg-[#060B1F] text-[#F5F1E6] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto text-center border-b border-[#18285A]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B3D] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>ENTERPRISE BRAND GOVERNANCE PLATFORM</span>
        </div>
        <h1 className="text-fluid-h1 font-serif font-bold text-white mb-4">
          The Intelligent Pre-Publication <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B]">
            Governance Suite
          </span>
        </h1>
        <p className="text-fluid-p text-[#9AA6C7] max-w-2xl mx-auto font-sans leading-relaxed">
          Unify marketing, communications, product copy, and legal compliance before content reaches publication. Powered by deterministic rules and human review.
        </p>
      </section>

      {/* 2. Four Core Modules Grid */}
      <section className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Module 1: Brand Knowledge Hub */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-5 shadow-glow">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">Module 01</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">Brand Knowledge Hub</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed mb-6 font-sans">
                The single source of truth for your brand standards. Manage deterministic syntax rules, approved corporate facts, canonical vocabulary pairs, and visual identity palettes.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Rule library with exact regex patterns and severity tiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Vector-indexed approved facts with verified citation sources</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Preferred vs. avoid terminology dictionary</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-5 border-t border-[#18285A]">
              <button
                onClick={() => setActivePage('brand-hub')}
                className="text-xs font-semibold text-[#F3D98B] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Open Brand Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 2: Analysis Engine */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-5 shadow-glow">
                <FileSearch className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">Module 02</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">Pre-Publication Analysis</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed mb-6 font-sans">
                Deep multi-tier document scanning across plain text, Markdown, DOCX, and PDF uploads. Identifies claim risks, terminology drifts, and prohibited superlatives in seconds.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Multi-format document parsing with line-by-line span tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Zero-variance deterministic rule screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Evidence citations linking findings directly to source clauses</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-5 border-t border-[#18285A]">
              <button
                onClick={() => setActivePage('new-review')}
                className="text-xs font-semibold text-[#F3D98B] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Start New Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 3: Side-by-Side Intent Diff */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-5 shadow-glow">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">Module 03</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">Intent-Preserving Corrections</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed mb-6 font-sans">
                Visual side-by-side diffing showing original draft copy versus brand-aligned proposals. Retains the author's authentic voice while replacing non-compliant phrases.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Visual redline diff with deletions and canonical additions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Per-finding acceptance, rejection, and editorial editing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>One-click export of clean aligned copy</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-5 border-t border-[#18285A]">
              <button
                onClick={() => setActivePage('dashboard')}
                className="text-xs font-semibold text-[#F3D98B] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>View Sample Diff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 4: Cryptographic Approvals & Insights */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-5 shadow-glow">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">Module 04</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">Governance Insights & Audit Trail</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed mb-6 font-sans">
                Enterprise analytics surfacing guideline violation heatmaps, repeat offenders, and compliance trends. Every sign-off creates an immutable SHA-256 bound record.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Cryptographic SHA-256 seal bound to document hash</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Rule violation heatmaps identifying training gaps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Exportable executive audit trail for legal & risk reviews</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-5 border-t border-[#18285A]">
              <button
                onClick={() => setActivePage('dashboard')}
                className="text-xs font-semibold text-[#F3D98B] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section className="py-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-[#18285A]">
        <h2 className="text-fluid-h2 font-serif font-bold text-white mb-4">
          Launch Your Brand Governance Workspace
        </h2>
        <p className="text-[#9AA6C7] text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
          Step inside the pre-seeded Verity Learning workspace and run live pre-publication audits immediately.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-gold-sweep px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] text-[#060B1F] font-bold text-sm uppercase tracking-wider shadow-glow flex items-center gap-2"
          >
            <span>Explore Demo Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#060B1F]" />
          </button>
          <button
            onClick={() => setActivePage('how-it-works')}
            className="px-6 py-3 rounded-xl bg-[#111B3D] text-[#F3D98B] border border-[#D4AF37]/50 font-semibold text-sm hover:bg-[#111B3D]/80"
          >
            How It Works
          </button>
        </div>
      </section>

    </div>
  );
}
