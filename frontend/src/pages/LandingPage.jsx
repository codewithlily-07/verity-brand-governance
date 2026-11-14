import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, 
  Sparkles, Layers, FileCheck, Eye, Lock, RefreshCw, ChevronRight, HelpCircle,
  Check, UserCheck, Shield
} from 'lucide-react';

import { HeroStage } from '../components/hero/HeroStage';
import { ProblemSection } from '../components/animation/ProblemSection';
import { SectionDivider } from '../components/animation/SectionDivider';
import { FourLayersArchitecture } from '../components/animation/FourLayersArchitecture';
import { WorkflowJourney } from '../components/animation/WorkflowJourney';
import { AnimatedMetric } from '../components/animation/AnimatedMetric';
import { CinematicHeroExperience } from '../components/animation/CinematicHeroExperience';

export function LandingPage({ setActivePage }) {
  const [showLiveScanner, setShowLiveScanner] = useState(false);

  return (
    <div className="bg-[#040A1C] text-white selection:bg-[#E8B84B]/30 selection:text-white">
      
      {/* ==================================================
          1. THE CINEMATIC HERO OPENING EXPERIENCE (16:9 STAGE)
          ================================================== */}
      <section className="relative w-full pt-16 sm:pt-20 bg-[#040A1C]">
        <HeroStage setActivePage={setActivePage} />
      </section>

      {/* ==================================================
          2. CORE VALUE PROPOSITION & DISPLAY HEADLINE
          ================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#040A1C] via-[#071230] to-[#0D1D4A] border-b border-[#18285A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1D4A] border border-[#E8B84B]/40 text-xs font-semibold text-[#FFF1B8] mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B84B]" />
            <span className="tracking-wide uppercase text-[11px] font-mono">
              INTELLIGENT BRAND GOVERNANCE FOR HIGH-TRUST ORGANISATIONS
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.14]">
            Your Brand. Your Standards. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] via-[#E8B84B] to-[#FFF1B8]">
              Every Piece of Content.
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto font-sans">
            VERITY ensures every piece of content reflects your brand standards before publication. Detect inconsistencies, verify approved information, receive evidence-backed corrections and maintain control through human review.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className="btn-gold-sweep w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold shadow-glow text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#071230]" />
            </button>

            <button
              type="button"
              onClick={() => setActivePage('new-review')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0D1D4A] hover:bg-[#18285A] text-[#FFF1B8] border border-[#E8B84B]/50 font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Reviewing Content</span>
              <ChevronRight className="w-4 h-4 text-[#E8B84B]" />
            </button>
          </div>

          {/* Three Compact Principles */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-gray-800/80 text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 text-[#E8B84B] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Evidence-Backed Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-teal/20 text-teal flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Intent-Preserving Corrections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FFF1B8]/20 text-[#FFF1B8] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Human-Controlled Approval</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          3. TRUST STRIP WITH ANIMATED NUMERIC COUNTERS
          ================================================== */}
      <section className="bg-[#071230] py-8 border-b border-[#18285A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#18285A]">
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value={4}
                suffix=" Layers"
                label="Rules, Facts, AI, Sign-off"
                subtext="Deterministic & grounded"
                highlightColor="text-[#E8B84B]"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value={100}
                suffix="%"
                label="Human Authority"
                subtext="Reviewer sign-off mandatory"
                highlightColor="text-teal"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value="0 Secrets"
                label="Zero Client Leakage"
                subtext="Strict backend execution"
                highlightColor="text-[#FFF1B8]"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value="SHA-256"
                label="Version-Bound Audit"
                subtext="Cryptographic integrity"
                highlightColor="text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* ==================================================
          4. THE PRE-PUBLICATION DILEMMA & PROBLEM SECTION
          ================================================== */}
      <ProblemSection />

      {/* Section Divider */}
      <SectionDivider />

      {/* ==================================================
          5. THE THREE PILLARS SECTION
          ================================================== */}
      <section id="product" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8B84B] font-bold">
            Core Governance Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
            The Three Pillars of Verity Governance
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            Engineered specifically for Inkloom's high-reliability governance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-[#071230] rounded-2xl border border-gray-800 p-6 sm:p-7 shadow-xl hover:border-[#E8B84B]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E8B84B]/15 text-[#E8B84B] flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-[#E8B84B] group-hover:text-[#071230] transition-colors">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Evidence-Backed Detection</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Every single finding is rigorously tied to an approved fact ID or guideline passage. When no factual grounding exists, VERITY explicitly reports:
              </p>
              <div className="p-3 bg-[#0D1D4A] rounded-lg border border-gray-800 font-mono text-xs text-[#FFF1B8]">
                "No approved supporting evidence found."
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-1.5 text-xs text-[#E8B84B] font-medium">
              <span>Zero hallucinated claims</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-[#071230] rounded-2xl border border-gray-800 p-6 sm:p-7 shadow-xl hover:border-[#E8B84B]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-teal group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Intent-Preserving Corrections</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Corrections retain the creator's voice without inventing marketing claims. Shown in a side-by-side word diff where original copy is never overwritten.
              </p>
              <div className="p-3 bg-[#0D1D4A] rounded-lg border border-[#E8B84B]/30 text-xs text-[#FFF1B8] font-sans">
                Replaces prohibited absolute claims strictly with approved fact wording (e.g. F-01).
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-1.5 text-xs text-teal font-medium">
              <span>Creator accepts, edits, or rejects</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="bg-[#071230] rounded-2xl border border-gray-800 p-6 sm:p-7 shadow-xl hover:border-[#E8B84B]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky/20 text-sky-400 flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-sky group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Adaptive Governance Insights</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Surfaces rules that authors frequently dismiss or challenge, flagging them as "Possibly Unclear" with guidance to clarify policy phrasing.
              </p>
              <div className="p-3 bg-[#0D1D4A] rounded-lg border border-gray-800 text-xs text-[#FFF1B8] font-sans">
                Telemetry guides policy team reviews without letting AI rewrite policy itself.
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <span>Continuous governance refinement</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ==================================================
          6. FOUR-TIER DEFENSIVE ARCHITECTURE SHOWCASE
          ================================================== */}
      <section className="py-12 bg-[#071230] border-y border-[#18285A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FourLayersArchitecture />
        </div>
      </section>

      {/* ==================================================
          7. 5-STEP CONNECTED WORKFLOW JOURNEY
          ================================================== */}
      <section className="py-20 bg-[#040A1C] border-b border-[#18285A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-[#E8B84B] font-bold">
              End-To-End Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              How Content Moves Through Verity
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              From raw brand guidelines ingestion to cryptographically signed publication authority.
            </p>
          </div>

          <WorkflowJourney />
        </div>
      </section>

      {/* ==================================================
          8. OPTIONAL INTERACTIVE SCANNER EXPERIENCE DRAWER
          ================================================== */}
      <section className="py-16 bg-[#071230] border-b border-[#18285A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8B84B] font-bold">
            Interactive AST Inspection
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Experience the Live Multi-Layer Scanner
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Test the 6-frame token scanner with real-time laser sweeps, evidence citations, and cryptographic human sign-off.
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowLiveScanner(!showLiveScanner)}
              className="px-5 py-2.5 rounded-xl bg-[#0D1D4A] hover:bg-[#18285A] text-[#FFF1B8] border border-[#E8B84B]/60 font-semibold text-xs transition-all"
            >
              {showLiveScanner ? 'Hide Scanner Simulator' : 'Launch Scanner Simulator'}
            </button>
          </div>
        </div>

        {showLiveScanner && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in-95 duration-300">
            <CinematicHeroExperience
              onNavigateReview={() => setActivePage('new-review')}
              onNavigateDashboard={() => setActivePage('dashboard')}
            />
          </div>
        )}
      </section>

      {/* ==================================================
          9. UNIVERSAL CONTENT TYPES SUPPORTED
          ================================================== */}
      <section id="resources" className="py-16 bg-[#040A1C] text-white border-b border-[#18285A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-[#FFF1B8]">Universal Publication Support</p>
          <h3 className="font-serif text-2xl font-bold text-white mt-1">Review Across Every Publishing Channel</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto px-4">
          {[
            '📢 Social Media Posts',
            '🎯 Promotional Advertisements',
            '✉️ Marketing Email Campaigns',
            '🌐 Website & Landing Page Copy',
            '📰 Press Releases & Announcements',
            '📄 PDF & DOCX Institutional Reports'
          ].map((type, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-xl bg-[#0D1D4A] border border-gray-700/80 text-xs font-medium text-gray-200 shadow-sm"
            >
              {type}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ==================================================
          10. FINAL ACTION CTA
          ================================================== */}
      <section className="py-20 bg-[#040A1C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#071230] via-[#0D1D4A] to-[#071230] p-10 sm:p-14 rounded-3xl text-white border border-[#E8B84B]/40 shadow-2xl relative overflow-hidden">
            {/* Subtle Gold Aura in CTA */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8B84B]/10 blur-[90px] rounded-full pointer-events-none" />

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to verify content with zero guesswork?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
              Explore the pre-loaded <strong>Verity Learning</strong> demonstration brand, test adversarial injection drafts, and experience the full review-to-approval workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                type="button"
                onClick={() => setActivePage('new-review')}
                className="btn-gold-sweep px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E8B84B] to-[#FFF1B8] text-[#071230] font-bold shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wide"
              >
                Launch New Review
              </button>
              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-[#18285A] hover:bg-[#0D1D4A] text-[#FFF1B8] border border-gray-600 font-medium transition-all active:scale-95 text-xs"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
