import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, 
  Sparkles, Layers, FileCheck, Eye, Lock, RefreshCw, ChevronRight, HelpCircle,
  Check, UserCheck, Shield, Sparkle
} from 'lucide-react';

import { VerityCinematicVisual } from '../components/animation/VerityCinematicVisual';
import { CinematicHeroExperience } from '../components/animation/CinematicHeroExperience';
import { ProblemSection } from '../components/animation/ProblemSection';
import { SectionDivider } from '../components/animation/SectionDivider';
import { FourLayersArchitecture } from '../components/animation/FourLayersArchitecture';
import { WorkflowJourney } from '../components/animation/WorkflowJourney';
import { AnimatedMetric } from '../components/animation/AnimatedMetric';

export function LandingPage({ setActivePage }) {
  const [heroViewMode, setHeroViewMode] = useState('cinematic'); // 'cinematic' | 'scanner'

  return (
    <div className="bg-[#F8F7F3] text-[#101B35] selection:bg-[#C6A15B]/30 selection:text-[#101B35]">
      
      {/* ==================================================
          CINEMATIC HERO SECTION
          ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#070C1A] via-[#0B1428] to-[#0A1128] text-white pt-12 sm:pt-16 pb-20 sm:pb-28 border-b border-[#18285A]">
        {/* Soft Aurora Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#18285A]/35 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#C6A15B]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Hero Heading & Content — Staggered Entrance from Below to Upward */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101B35] border border-[#C6A15B]/50 text-xs font-semibold text-[#E6C77B] mb-6 shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="tracking-wide uppercase text-[11px] font-mono">
                INTELLIGENT BRAND GOVERNANCE FOR HIGH-TRUST ORGANISATIONS
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.12]"
            >
              Your Brand. <br />
              Your Standards. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6A15B] via-[#E6C77B] to-[#F8F7F3]">
                Every Piece of Content.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              VERITY ensures every piece of content reflects your brand standards before publication. Detect inconsistencies, verify approved information, receive evidence-backed corrections and maintain control through human review.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <button
                type="button"
                onClick={() => setActivePage('new-review')}
                className="btn-gold-sweep w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#E6C77B] text-[#101B35] font-bold shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-95 text-sm uppercase tracking-wide"
              >
                <span>Start Reviewing Content</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#101B35] hover:bg-[#18285A] text-white border border-gray-700/80 font-medium transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
              >
                <span>Explore Demo Workspace</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </motion.div>

            {/* Three Compact Principles */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-gray-800/80 text-xs text-gray-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C6A15B]/20 text-[#C6A15B] flex items-center justify-center">
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
                <div className="w-5 h-5 rounded-full bg-[#E6C77B]/20 text-[#E6C77B] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Human-Controlled Approval</span>
              </div>
            </motion.div>

          </div>

          {/* View Mode Toggle: Cinematic Golden Sphere vs Live Scanner Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="p-1 rounded-xl bg-[#101B35]/80 border border-[#C6A15B]/30 flex items-center gap-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setHeroViewMode('cinematic')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  heroViewMode === 'cinematic'
                    ? 'bg-[#C6A15B] text-[#101B35] shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ✦ Cinematic Brand Sphere
              </button>
              <button
                type="button"
                onClick={() => setHeroViewMode('scanner')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  heroViewMode === 'scanner'
                    ? 'bg-[#C6A15B] text-[#101B35] shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ⚙ Live Scanner Simulation
              </button>
            </div>
          </motion.div>

          {/* Centerpiece Hero Canvas — Animated from Below Upward */}
          <motion.div
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {heroViewMode === 'cinematic' ? (
              <VerityCinematicVisual onSelectMode={() => setHeroViewMode('scanner')} />
            ) : (
              <CinematicHeroExperience
                onNavigateReview={() => setActivePage('new-review')}
                onNavigateDashboard={() => setActivePage('dashboard')}
              />
            )}
          </motion.div>

        </div>
      </section>

      {/* Trust Strip with Animated Numeric Counters */}
      <section className="bg-[#101B35] py-8 border-b border-[#18285A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#18285A]">
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value={4}
                suffix=" Layers"
                label="Rules, Facts, AI, Sign-off"
                subtext="Deterministic & grounded"
                highlightColor="text-[#C6A15B]"
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
                highlightColor="text-[#E6C77B]"
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

      {/* The Pre-Publication Dilemma & Problem Section */}
      <ProblemSection />

      {/* Section Divider */}
      <SectionDivider />

      {/* The Three Pillars Section */}
      <section id="product" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C6A15B] font-bold">
            Core Governance Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101B35] mt-2">
            The Three Pillars of Verity Governance
          </h2>
          <p className="text-sm text-gray-600 mt-3">
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
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-[#C6A15B] group-hover:text-[#101B35] transition-colors">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#101B35] mb-2">Evidence-Backed Detection</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Every single finding is rigorously tied to an approved fact ID or guideline passage. When no factual grounding exists, VERITY explicitly reports:
              </p>
              <div className="p-3 bg-mist rounded-lg border border-gray-200 font-mono text-xs text-[#101B35]">
                "No approved supporting evidence found."
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-[#C6A15B] font-medium">
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
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-teal group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#101B35] mb-2">Intent-Preserving Corrections</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Corrections retain the creator's voice without inventing marketing claims. Shown in a side-by-side word diff where original copy is never overwritten.
              </p>
              <div className="p-3 bg-champagne/40 rounded-lg border border-[#C6A15B]/30 text-xs text-[#101B35] font-sans">
                Replaces prohibited absolute claims strictly with approved fact wording (e.g. F-01).
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-teal font-medium">
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
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky/20 text-sky-800 flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-sky group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#101B35] mb-2">Adaptive Governance Insights</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Surfaces rules that authors frequently dismiss or challenge, flagging them as "Possibly Unclear" with guidance to clarify policy phrasing.
              </p>
              <div className="p-3 bg-mist rounded-lg border border-gray-200 text-xs text-[#101B35] font-sans">
                Telemetry guides policy team reviews without letting AI rewrite policy itself.
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-sky-800 font-medium">
              <span>Continuous governance refinement</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4-Layer Defensive Architecture Showcase */}
      <section className="py-12 bg-[#101B35]/5 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FourLayersArchitecture />
        </div>
      </section>

      {/* 5-Step Connected Workflow Journey */}
      <section className="py-20 bg-mist/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C6A15B] font-bold">
              End-To-End Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101B35] mt-2">
              How Content Moves Through Verity
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              From raw brand guidelines ingestion to cryptographically signed publication authority.
            </p>
          </div>

          <WorkflowJourney />
        </div>
      </section>

      {/* Universal Content Types Marquee */}
      <section id="resources" className="py-16 bg-[#0B1428] text-white border-b border-[#18285A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-[#E6C77B]">Universal Publication Support</p>
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
              className="px-4 py-2 rounded-xl bg-[#101B35] border border-gray-700/80 text-xs font-medium text-gray-200 shadow-sm"
            >
              {type}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Final Action CTA Section */}
      <section className="py-20 bg-[#F8F7F3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#0B1428] via-[#101B35] to-[#0B1428] p-10 sm:p-14 rounded-3xl text-white border border-[#C6A15B]/40 shadow-2xl relative overflow-hidden">
            {/* Subtle Gold Aura in CTA */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A15B]/10 blur-[90px] rounded-full pointer-events-none" />

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
                className="btn-gold-sweep px-8 py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#E6C77B] text-[#101B35] font-bold shadow-lg transition-all active:scale-95"
              >
                Launch New Review
              </button>
              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-[#18285A] hover:bg-[#101B35] text-white border border-gray-600 font-medium transition-all active:scale-95"
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
