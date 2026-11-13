import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, 
  Sparkles, Layers, FileCheck, Eye, Lock, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';

import { CinematicHeroExperience } from '../components/animation/CinematicHeroExperience';
import { SectionDivider } from '../components/animation/SectionDivider';
import { ThreeLayersInteractive } from '../components/animation/ThreeLayersInteractive';
import { WorkflowJourney } from '../components/animation/WorkflowJourney';
import { AnimatedMetric } from '../components/animation/AnimatedMetric';

export function LandingPage({ setActivePage }) {
  return (
    <div className="bg-ivory text-ink selection:bg-gold/30 selection:text-ink">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-midnight text-ivory pt-16 sm:pt-20 pb-24 sm:pb-32 border-b border-navy-2">
        {/* Soft Aurora Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#2B3A8F]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy border border-gold/40 text-xs font-semibold text-gold-light mb-6 shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Intelligent Brand Governance for High-Trust Organisations</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            >
              Your Brand. Your Standards. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-champagne">
                Every Piece of Content.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              VERITY ensures every piece of content reflects your brand standards before publication. Detect inconsistencies, verify approved information, receive evidence-backed corrections and maintain control through human review.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => setActivePage('new-review')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold shadow-glow transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Start Reviewing Content</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setActivePage('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy hover:bg-navy-2 text-white border border-gray-700/80 font-medium transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Explore Demo Workspace</span>
                <ChevronRight className="w-4 h-4 text-gold" />
              </button>
            </motion.div>

          </div>

          {/* Real, Custom-Coded Cinematic Hero Animation Canvas */}
          <div className="mt-8 sm:mt-12">
            <CinematicHeroExperience
              onNavigateReview={() => setActivePage('new-review')}
              onNavigateDashboard={() => setActivePage('dashboard')}
            />
          </div>

        </div>
      </section>

      {/* Trust Strip with Animated Numeric Counters */}
      <section className="bg-navy py-8 border-b border-navy-2 text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-navy-2">
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value={3}
                suffix=" Layers"
                label="Rules, Retrieval, Validated AI"
                subtext="Deterministic & grounded"
                highlightColor="text-gold"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value={100}
                suffix="%"
                label="Human Authority"
                subtext="Reviewer sign-off required"
                highlightColor="text-teal"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value="0 Secrets"
                label="Zero Client Leakage"
                subtext="Strict backend execution"
                highlightColor="text-gold-light"
              />
            </div>
            <div className="pt-2 md:pt-0">
              <AnimatedMetric
                value="SHA-256"
                label="Version-Bound Audit"
                subtext="Cryptographic trail verification"
                highlightColor="text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* The Three Pillars Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold">
            Round 2 Core Innovations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2">
            The Three Pillars of Verity Governance
          </h2>
          <p className="text-sm text-gray-600 mt-3">
            Engineered specifically for Inkloom's high-reliability governance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-gold group-hover:text-midnight transition-colors">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">Evidence-Backed Detection</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Every single finding is rigorously tied to an approved fact ID or guideline passage. When no factual grounding exists, VERITY explicitly reports:
              </p>
              <div className="p-3 bg-mist rounded-lg border border-gray-200 font-mono text-xs text-ink">
                "No approved supporting evidence found."
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gold font-medium">
              <span>Zero hallucinated claims</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-teal group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">Intent-Preserving Corrections</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Corrections retain the creator's voice without inventing marketing claims. Shown in a side-by-side word diff where original copy is never overwritten.
              </p>
              <div className="p-3 bg-champagne/40 rounded-lg border border-gold/30 text-xs text-ink font-sans">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky/20 text-sky-800 flex items-center justify-center mb-5 font-serif font-bold text-xl group-hover:bg-sky group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">Adaptive Governance Insights</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Surfaces rules that authors frequently dismiss or challenge, flagging them as "Possibly Unclear" with guidance to clarify policy phrasing.
              </p>
              <div className="p-3 bg-mist rounded-lg border border-gray-200 text-xs text-ink font-sans">
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

      {/* Interactive 3-Layer Defensive Architecture Showcase */}
      <section className="py-12 bg-navy-2/20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThreeLayersInteractive />
        </div>
      </section>

      {/* 5-Step Workflow Section with Connected Journey */}
      <section id="how-it-works" className="py-20 bg-mist/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold">
              End-To-End Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2">
              How Content Moves Through Verity
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              From raw brand guidelines ingestion to cryptographically signed publication authority.
            </p>
          </div>

          <WorkflowJourney />
        </div>
      </section>

      {/* Content Types Marquee */}
      <section className="py-16 bg-midnight text-ivory border-b border-navy-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-gold-light">Universal Publication Support</p>
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
              className="px-4 py-2 rounded-xl bg-navy border border-gray-700/80 text-xs font-medium text-gray-200 shadow-sm"
            >
              {type}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Final Action CTA Section */}
      <section className="py-20 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-midnight via-navy to-midnight p-10 sm:p-14 rounded-3xl text-ivory border border-gold/40 shadow-2xl relative overflow-hidden">
            {/* Subtle Gold Aura in CTA */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 blur-[90px] rounded-full pointer-events-none" />

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to verify content with zero guesswork?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
              Explore the pre-loaded <strong>Verity Learning</strong> demonstration brand, test adversarial injection drafts, and experience the full review-to-approval workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                onClick={() => setActivePage('new-review')}
                className="px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold shadow-glow transition-all active:scale-95"
              >
                Launch New Review
              </button>
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-navy-2 hover:bg-navy text-white border border-gray-600 font-medium transition-all active:scale-95"
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
