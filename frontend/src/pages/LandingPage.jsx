import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, TrendingUp, ArrowRight, Sparkles, 
  CheckCircle2, Lock, Shield, Layers, Eye, Cpu
} from 'lucide-react';

import { HeroStage } from '../components/hero/HeroStage';
import { Footer } from '../components/Footer';

export function LandingPage({ setActivePage }) {
  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) {
      setActivePage(page);
    }
  };

  return (
    <div className="bg-[#060B1F] text-[#F5F1E6] selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* ==================================================
          SECTION 1: THE HERO (Fills single screen, concentric group)
          ================================================== */}
      <section className="relative w-full bg-[#060B1F] border-b border-[#18285A]">
        <HeroStage setActivePage={setActivePage} />
      </section>

      {/* ==================================================
          SECTION 2: THREE FEATURE CARDS (Review, Verify, Govern)
          Each keeps a 1-line summary and a "Learn more" link
          ================================================== */}
      <section className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B3D] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>THREE GOVERNANCE PILLARS</span>
          </div>
          <h2 className="text-fluid-h2 font-serif font-bold text-white mb-3">
            Intelligent Pre-Publication Governance
          </h2>
          <p className="text-sm sm:text-base text-[#9AA6C7] font-sans">
            Grounded in deterministic checks, vector knowledge retrieval, and human authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Review */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-6 shadow-glow">
                <FileSearch className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Review</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed font-sans mb-6">
                Automated syntax, claim, and terminology screening detecting drifts before publication.
              </p>
            </div>
            <div className="pt-4 border-t border-[#18285A]">
              <button
                type="button"
                onClick={() => handleNav('how-it-works')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors"
              >
                <span>Learn more about review engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Verify */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-6 shadow-glow">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Verify</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed font-sans mb-6">
                Deterministic vector grounding validating every claim against approved brand knowledge vaults.
              </p>
            </div>
            <div className="pt-4 border-t border-[#18285A]">
              <button
                type="button"
                onClick={() => handleNav('how-it-works')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors"
              >
                <span>Learn more about verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Govern */}
          <div className="verity-glass-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-6 shadow-glow">
                <TrendingUp className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Govern</h3>
              <p className="text-sm text-[#9AA6C7] leading-relaxed font-sans mb-6">
                Cryptographic human sign-offs with SHA-256 seals ensuring unapproved copy never goes live.
              </p>
            </div>
            <div className="pt-4 border-t border-[#18285A]">
              <button
                type="button"
                onClick={() => handleNav('trust-security')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors"
              >
                <span>Learn more about security & sign-off</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: 4-STEP TIMELINE (Review, Verify, Align, Govern)
          ================================================== */}
      <section className="py-24 bg-[#0A1230] border-y border-[#18285A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              WORKFLOW TIMELINE
            </span>
            <h2 className="text-fluid-h2 font-serif font-bold text-white mt-1 mb-3">
              The 4-Step Governance Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-[#9AA6C7] font-sans">
              From draft submission to immutable cryptographic release.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1: Review */}
            <div className="bg-[#111B3D]/70 p-6 rounded-2xl border border-[#D4AF37]/25 relative">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                Step 01
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Review</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed font-sans">
                Draft content is ingested across Markdown, DOCX, or PDF and parsed for syntax, terminology, and formatting compliance.
              </p>
            </div>

            {/* Step 2: Verify */}
            <div className="bg-[#111B3D]/70 p-6 rounded-2xl border border-[#D4AF37]/25 relative">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                Step 02
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Verify</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed font-sans">
                Statements are matched against indexed corporate knowledge vaults to verify factual accuracy with explicit citation IDs.
              </p>
            </div>

            {/* Step 3: Align */}
            <div className="bg-[#111B3D]/70 p-6 rounded-2xl border border-[#D4AF37]/25 relative">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                Step 03
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Align</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed font-sans">
                Side-by-side non-destructive corrections are proposed, preserving the author's voice while substituting canonical phrasing.
              </p>
            </div>

            {/* Step 4: Govern */}
            <div className="bg-[#111B3D]/70 p-6 rounded-2xl border border-[#D4AF37]/25 relative">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                Step 04
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Govern</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed font-sans">
                An authorized human reviewer executes the final sign-off, locking an immutable SHA-256 seal into the permanent audit log.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: TRUST STRIP (3-4 Badges)
          ================================================== */}
      <section className="py-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111B3D]/50 border border-[#D4AF37]/20">
            <Shield className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">SOC 2 Type II</p>
              <p className="text-[10px] text-[#9AA6C7]">Certified Security Protocols</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111B3D]/50 border border-[#D4AF37]/20">
            <Eye className="w-5 h-5 text-[#2ECC9A] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">WCAG 2.1 AA</p>
              <p className="text-[10px] text-[#9AA6C7]">Accessibility Standards</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111B3D]/50 border border-[#D4AF37]/20">
            <Cpu className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Deterministic AST</p>
              <p className="text-[10px] text-[#9AA6C7]">Zero-Variance Matching</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111B3D]/50 border border-[#D4AF37]/20">
            <Lock className="w-5 h-5 text-[#2ECC9A] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Zero Model Training</p>
              <p className="text-[10px] text-[#9AA6C7]">Strict Tenant Data Isolation</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: FINAL CALL TO ACTION
          ================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#0A1230] to-[#060B1F] border-t border-[#18285A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B3D] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>INTELLIGENT PRE-PUBLICATION GOVERNANCE</span>
          </div>

          <h2 className="text-fluid-h2 font-serif font-bold text-white mb-4">
            Ready to Protect Your Brand Equity?
          </h2>
          <p className="text-sm sm:text-base text-[#9AA6C7] max-w-xl mx-auto mb-10 font-sans leading-relaxed">
            Empower creators, reviewers, and compliance leads with automated pre-publication governance. Grounded in deterministic rules and human review.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className="btn-gold-sweep w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] hover:brightness-110 text-[#060B1F] font-bold text-xs uppercase tracking-wider shadow-glow flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#060B1F]" />
            </button>
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#111B3D]/80 hover:bg-[#111B3D] text-[#F3D98B] border border-[#D4AF37]/60 font-semibold text-xs transition-all active:scale-95 text-center"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6: FOOTER (4 Aligned Columns)
          ================================================== */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
