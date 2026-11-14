import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, Layers, FileCheck, 
  Cpu, Lock, Search, FileText, Check, AlertTriangle, Eye, Sparkles
} from 'lucide-react';
import { FourLayersArchitecture } from '../components/animation/FourLayersArchitecture';
import { WorkflowJourney } from '../components/animation/WorkflowJourney';

export function HowItWorksPage({ setActivePage }) {
  return (
    <div className="bg-[#060B1F] text-[#F5F1E6] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto text-center border-b border-[#18285A]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B3D] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-5">
          <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>FOUR-TIER GOVERNANCE ARCHITECTURE</span>
        </div>
        <h1 className="text-fluid-h1 font-serif font-bold text-white mb-4">
          How VERITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B]">Governs Content</span>
        </h1>
        <p className="text-fluid-p text-[#9AA6C7] max-w-2xl mx-auto font-sans leading-relaxed">
          Explore the deterministic analysis engine, vector retrieval grounding, and cryptographic human sign-off protocols powering enterprise pre-publication governance.
        </p>
      </section>

      {/* 2. Deep Dive: The Four-Tier Architecture */}
      <section className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-fluid-h2 font-serif font-bold text-white mb-3">
            Multi-Layer Analysis Pipeline
          </h2>
          <p className="text-[#9AA6C7] text-sm sm:text-base">
            Every submission passes through four specialized evaluation tiers before arriving in front of a human reviewer.
          </p>
        </div>

        {/* FourLayersArchitecture Component */}
        <div className="mb-16">
          <FourLayersArchitecture />
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          
          <div className="verity-glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B]">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase">Tier 1</span>
                <h3 className="text-lg font-bold text-white">Deterministic AST & Pattern Matching</h3>
              </div>
            </div>
            <p className="text-sm text-[#9AA6C7] leading-relaxed mb-4">
              Direct regex, exact brand casing, and Abstract Syntax Tree (AST) scanning detect prohibited superlatives, unapproved competitor naming, and regulatory compliance flags with microsecond latency.
            </p>
            <div className="bg-[#0A1230] p-3 rounded-lg border border-[#18285A] font-mono text-xs text-[#2ECC9A]">
              ✓ Deterministic execution · 0% hallucination variance
            </div>
          </div>

          <div className="verity-glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase">Tier 2</span>
                <h3 className="text-lg font-bold text-white">Semantic Vector Knowledge Retrieval</h3>
              </div>
            </div>
            <p className="text-sm text-[#9AA6C7] leading-relaxed mb-4">
              Embeddings match draft statements against the organisation's approved knowledge base. Every claim is validated against indexed corporate guidelines, product fact sheets, and legal disclaimers.
            </p>
            <div className="bg-[#0A1230] p-3 rounded-lg border border-[#18285A] font-mono text-xs text-[#2ECC9A]">
              ✓ Precise source citation · Cosine similarity scoring
            </div>
          </div>

          <div className="verity-glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase">Tier 3</span>
                <h3 className="text-lg font-bold text-white">Intent-Preserving Correction Synthesis</h3>
              </div>
            </div>
            <p className="text-sm text-[#9AA6C7] leading-relaxed mb-4">
              When inconsistencies are flagged, the engine drafts side-by-side replacements that maintain the author's original communicative intent while substituting canonical terminology and approved phrasing.
            </p>
            <div className="bg-[#0A1230] p-3 rounded-lg border border-[#18285A] font-mono text-xs text-[#F5A623]">
              ✓ Author intent preserved · Human retains accept/reject
            </div>
          </div>

          <div className="verity-glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase">Tier 4</span>
                <h3 className="text-lg font-bold text-white">Cryptographic Human Approval Gate</h3>
              </div>
            </div>
            <p className="text-sm text-[#9AA6C7] leading-relaxed mb-4">
              Publication gates require an authorized human sign-off. Approvals generate a tamper-evident SHA-256 seal linking document version, reviewer identity, timestamp, and audit trail into an immutable record.
            </p>
            <div className="bg-[#0A1230] p-3 rounded-lg border border-[#18285A] font-mono text-xs text-[#2ECC9A]">
              ✓ SHA-256 audit fingerprint · Zero autonomous publishing
            </div>
          </div>

        </div>
      </section>

      {/* 3. The 5-Step Workflow Journey */}
      <section className="py-20 bg-[#0A1230] border-y border-[#18285A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111B3D] border border-[#D4AF37]/30 text-xs font-mono text-[#F3D98B] mb-3">
              <span>END-TO-END JOURNEY</span>
            </div>
            <h2 className="text-fluid-h2 font-serif font-bold text-white mb-3">
              From Draft to Cryptographically Approved Release
            </h2>
            <p className="text-[#9AA6C7] text-sm sm:text-base">
              Explore the five sequential milestones every piece of content travels through.
            </p>
          </div>

          <WorkflowJourney />
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-fluid-h2 font-serif font-bold text-white mb-4">
          Experience the Engine in Real-Time
        </h2>
        <p className="text-[#9AA6C7] text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
          Test sample content against the Verity Learning guidelines inside the interactive demo workspace.
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
            onClick={() => setActivePage('trust-security')}
            className="px-6 py-3 rounded-xl bg-[#111B3D] text-[#F3D98B] border border-[#D4AF37]/50 font-semibold text-sm hover:bg-[#111B3D]/80"
          >
            Trust & Security Architecture
          </button>
        </div>
      </section>

    </div>
  );
}
