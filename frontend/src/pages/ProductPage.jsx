import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen, UploadCloud, Layers, ShieldCheck, Sliders,
  CheckCircle2, TrendingUp, ArrowRight, Sparkles, FileText,
  UserCheck, Users, Briefcase, KeyRound, AlertTriangle, HelpCircle
} from 'lucide-react';
import { PageSubNav } from '../components/PageSubNav';
import { TechnicalDetailsExpander } from '../components/TechnicalDetailsExpander';

export function ProductPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  const sections = [
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'example-finding', label: 'Sample Finding' },
    { id: 'personas', label: 'Who It Serves' },
    { id: 'cta', label: 'Get Started' },
  ];

  return (
    <div className="min-h-screen text-[#14203D] select-none bg-[#FAF8F2]">

      {/* ==================================================
          SECTION 1: HERO (NAVY LIKE: #0A1226 to #101B35 with gold glow)
          ================================================== */}
      <section
        className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#F3EAD3]/20 flex flex-col items-center justify-center min-h-[38vh]"
        style={{
          background: 'linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
          backgroundImage: 'radial-gradient(ellipse at 85% 10%, rgba(226,184,87,0.12), transparent 55%), linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1226]/80 border border-[#E2B857]/40 text-sm font-sans font-semibold tracking-wider text-[#E2B857] mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#E2B857]" />
          <span>ONE WORKSPACE FROM DRAFT TO APPROVAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF8F2] mb-3 tracking-tight">
          Intelligent Pre-Publication <span className="text-[#E2B857]">Brand Governance</span>
        </h1>

        <p className="text-[17px] text-[#D5DBEE] max-w-[65ch] mx-auto font-sans leading-relaxed mb-6">
          Unify marketing, communications, and editorial standards before content reaches public channels.
        </p>

        <div>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="px-7 py-3 rounded-xl font-bold text-sm text-[#101B35] bg-[#E2B857] hover:bg-[#F3EAD3] shadow-[0_2px_12px_rgba(226,184,87,0.35)] inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Demo Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#101B35]" />
          </button>
        </div>
      </section>

      {/* Sticky Sub-navigation with scroll indicator */}
      <PageSubNav sections={sections} />

      {/* ==================================================
          SECTION 2: SEVEN CAPABILITIES (IVORY #FAF8F2)
          ================================================== */}
      <section
        id="capabilities"
        className="py-20 relative bg-[#FAF8F2]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-sans font-semibold tracking-widest text-[#8A6A24] uppercase block mb-2">
              CORE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#14203D] mb-3">
              Seven tools to verify every public statement
            </h2>
            <div className="w-16 h-0.5 bg-[#E2B857] mx-auto mb-3" />
            <p className="text-[17px] text-[#4A5675] font-sans leading-relaxed max-w-[68ch] mx-auto">
              Every stage of content preparation is covered, from guideline setup to post-publication governance insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {/* Capability 1: Brand Knowledge Hub */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <BookOpen className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Brand Knowledge Hub
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  Manage approved corporate facts, deterministic brand rules, and terminology pairs in one shared repository.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm space-y-1.5 mb-2 font-sans">
                  <div className="flex items-center justify-between text-sm text-[#4A5675]">
                    <span className="font-medium">Approved Fact F-01</span>
                    <span className="text-[#065F46] font-bold">✓ Verified</span>
                  </div>
                  <p className="text-[#14203D] italic text-sm">"Verity Learning supports online learning."</p>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Relational schema supporting SQLite with PostgreSQL compatibility</span>
                <span>• BM25 keyword matching & approved fact catalog with local retrieval</span>
                <span>• Strict versioning of guidelines (Current vs Superseded)</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 2: Content Intake */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <UploadCloud className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Content Intake
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  Paste draft text or upload PDF and Microsoft Word documents up to 10MB with automatic text extraction.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm flex items-center justify-between font-sans">
                  <span className="text-[#14203D] font-medium">press_release_v2.pdf</span>
                  <span className="px-2.5 py-0.5 rounded bg-white text-[#14203D] border border-[#14203D]/20 text-sm font-semibold">10MB Limit</span>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• PyMuPDF text stream extractor with fallback</span>
                <span>• python-docx OpenXML paragraph parser</span>
                <span>• Document text treated as data, inert to prompt injections</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 3: Multi-layer Analysis */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Multi-layer Analysis
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  Combines instantaneous deterministic rules, fact retrieval grounding, and advisory AI interpretation.
                </p>

                {/* Mini-UI Mockup: Three Layers */}
                <div className="p-2.5 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm space-y-1 font-sans">
                  <div className="flex items-center gap-1.5 text-[#14203D]">
                    <span className="w-2 h-2 rounded-full bg-[#065F46]" />
                    <span>L1: Rules Engine (Exact)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#14203D]">
                    <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                    <span>L2: Fact Retrieval (Grounding)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#14203D]">
                    <span className="w-2 h-2 rounded-full bg-[#6D28D9]" />
                    <span>L3: AI Review (Advisory)</span>
                  </div>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Deterministic regex with case normalization</span>
                <span>• Sentence boundary and quote offset tracking</span>
                <span>• Temperature 0.0 with strict quote-grounding check</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 4: Evidence-led Findings */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Evidence-led Findings
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  Every issue displays the approved guideline passage or explicitly marks where source evidence is missing.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm font-sans">
                  <span className="text-sm uppercase text-[#B91C1C] font-bold block mb-0.5">High Severity Claim</span>
                  <p className="text-[#14203D] text-sm">Evidence: "No approved source found in knowledge base."</p>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Three verdict classes: verified violation, source concern, review</span>
                <span>• Icon + text severity: High (▲), Medium (◆), Low (●)</span>
                <span>• Accessibility issues tagged separately from policy claims</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 5: Correction Suggestions */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <Sliders className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Correction Suggestions
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  Review side-by-side wording fixes that preserve your communicative intent without injecting new claims.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-2.5 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm space-y-1.5 font-sans">
                  <div className="text-[#B91C1C] flex items-center gap-1.5">
                    <span aria-hidden="true" className="font-bold text-sm">−</span>
                    <span className="border-b border-[#B91C1C]/40 px-1 py-0.5 rounded bg-[#B91C1C]/10 font-medium">"best learning platform"</span>
                  </div>
                  <div className="text-[#065F46] font-bold flex items-center gap-1.5">
                    <span aria-hidden="true" className="font-bold text-sm">+</span>
                    <span className="border-b border-[#065F46]/40 px-1 py-0.5 rounded bg-[#065F46]/10">"accredited learning platform"</span>
                  </div>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Word-level LCS token diff generator</span>
                <span>• Author's original text is never overwritten</span>
                <span>• Revision saves as a new version with SHA-256 tamper-evident hash</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 6: Review Workspace */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                  <UserCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                  Review Workspace
                </h3>
                <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed mb-4">
                  An authorised human reviewer inspects evidence, leaves audit comments, and owns final approval.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#F3EAD3]/50 rounded-xl border border-[#E2B857]/25 text-sm flex items-center justify-between font-sans">
                  <span className="text-[#14203D] font-medium">Decision Gate:</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20 font-bold text-sm">
                    Approved ✓
                  </span>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Reviewer approval binds strictly to reviewed version hash</span>
                <span>• Immutable SHA-256 seal records author, reviewer & timestamp</span>
                <span>• Authorised override log preserves exception rationale</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 7: Governance Insights */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between hover:shadow-lg transition-all md:col-span-2 lg:col-span-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5 shadow-sm">
                    <TrendingUp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                    Adaptive Governance Insights
                  </h3>
                  <p className="text-[16px] text-[#4A5675] font-sans leading-relaxed max-w-[70ch]">
                    Repeatedly challenged or overridden rules highlight policies that may be unclear, recommending reviews rather than letting an AI rewrite guidelines.
                  </p>
                </div>

                <div className="bg-[#F3EAD3]/60 p-4 rounded-xl border border-[#E2B857]/30 text-sm space-y-1.5 min-w-[260px] font-sans">
                  <span className="text-[#8A6A24] uppercase text-sm block font-semibold">Telemetry Flag:</span>
                  <div className="text-[#14203D] font-bold">Rule R6 (slang & tone): 42% challenge rate</div>
                  <div className="text-[#8A6A24] text-sm">Recommendation: Clarify casual tone allowance for social copy.</div>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Challenge and override frequency aggregates</span>
                <span>• Average turnaround time per review stage</span>
                <span>• Unregistered terminology frequency analysis</span>
              </TechnicalDetailsExpander>
            </div>

          </div>

        </div>
      </section>

      {/* 48px gradient blend: Ivory to Champagne */}
      <div className="h-12 bg-gradient-to-b from-[#FAF8F2] to-[#F3EAD3]" />

      {/* ==================================================
          SECTION 3: WHAT ONE FINDING LOOKS LIKE (CHAMPAGNE #F3EAD3)
          ================================================== */}
      <section
        id="example-finding"
        className="py-20 relative bg-[#F3EAD3]"
      >
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-sans font-semibold tracking-widest text-[#7A5B18] uppercase block mb-2">
              REAL-WORLD WORKFLOW EXAMPLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#14203D] mb-3">
              What one finding looks like
            </h2>
            <div className="w-16 h-0.5 bg-[#E2B857] mx-auto mb-3" />
            <p className="text-[17px] text-[#4A5675] font-sans leading-relaxed">
              Step through how a single unverified promotional sentence is caught, explained, corrected, and decided.
            </p>
          </div>

          {/* Finding Interactive Card */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#E2B857]/40 shadow-xl max-w-3xl mx-auto">

            {/* Step 1: Draft Text In */}
            <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F2] border border-[#E2B857]/30">
              <span className="text-sm font-sans text-[#8A6A24] uppercase font-semibold tracking-wider block mb-1">
                01 · Submitted Draft Text
              </span>
              <p className="text-lg font-serif text-[#14203D] font-medium">
                “The country’s leading platform, now 50% faster.”
              </p>
            </div>

            {/* Step 2: Detected Issue */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/25">
              <div className="p-2 rounded-lg bg-[#FEE2E2] text-[#B91C1C] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-sans font-bold text-[#B91C1C] uppercase">
                    Detected Issue (High Severity)
                  </span>
                  <span className="text-sm px-2.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-sans font-medium">
                    Rule R3 · Superlative
                  </span>
                </div>
                <p className="text-[15px] text-[#14203D] font-sans">
                  Unsupported promotional claim with unverified superlative and metric.
                </p>
              </div>
            </div>

            {/* Step 3: Evidence */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-[#FFFBEB] border border-[#D97706]/30">
              <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#D97706] shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-sans font-bold text-[#92400E] uppercase block mb-1">
                  Evidence Citation
                </span>
                <p className="text-[15px] text-[#14203D] font-sans">
                  No approved source found in the brand knowledge base.
                </p>
              </div>
            </div>

            {/* Step 4: Suggestion */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-[#ECFDF5] border border-[#059669]/30">
              <div className="p-2 rounded-lg bg-[#D1FAE5] text-[#059669] shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-sans font-bold text-[#065F46] uppercase block mb-1">
                  Intent-Preserving Suggestion
                </span>
                <p className="text-[15px] text-[#14203D] font-sans leading-relaxed">
                  Replace with a verifiable statement, for example one that cites an approved test report.
                </p>
              </div>
            </div>

            {/* Step 5: Final Decision */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#101B35] border border-[#E2B857]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[#F4F1E8]">
              <div>
                <span className="text-sm font-sans text-[#E2B857] uppercase font-semibold block mb-0.5">
                  Final Decision Authority
                </span>
                <p className="text-[15px] text-[#FAF8F2] font-semibold">
                  Human reviewer approval is required before publishing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleNav('new-review')}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#101B35] bg-[#E2B857] hover:bg-[#F3EAD3] whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition-colors"
              >
                <span>Run this draft in the demo</span>
                <ArrowRight className="w-4 h-4 text-[#101B35]" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 48px gradient blend: Champagne to Ivory */}
      <div className="h-12 bg-gradient-to-b from-[#F3EAD3] to-[#FAF8F2]" />

      {/* ==================================================
          SECTION 4: WHO IT SERVES (IVORY #FAF8F2)
          ================================================== */}
      <section
        id="personas"
        className="py-20 relative bg-[#FAF8F2]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-sans font-semibold tracking-widest text-[#8A6A24] uppercase block mb-2">
              TARGET PERSONAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#14203D] mb-3">
              Built for every role in content publication
            </h2>
            <div className="w-16 h-0.5 bg-[#E2B857] mx-auto mb-3" />
            <p className="text-[17px] text-[#4A5675] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Each persona receives specialized views with no password barriers in demo mode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Role 1: Content Creator */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-sm font-sans text-[#8A6A24] font-bold uppercase tracking-wider">Persona 01</span>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mt-1 mb-2">
                  Content Creators
                </h3>
                <p className="text-[15px] text-[#4A5675] font-sans leading-relaxed">
                  Draft freely while getting immediate guidance on brand terminology and prohibited claims before submitting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F3EAD3] text-sm text-[#4A5675] font-sans font-medium">
                Key view: New Review & Word Diff
              </div>
            </div>

            {/* Role 2: Marketing Manager */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5">
                  <Briefcase className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-sm font-sans text-[#8A6A24] font-bold uppercase tracking-wider">Persona 02</span>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mt-1 mb-2">
                  Marketing Managers
                </h3>
                <p className="text-[15px] text-[#4A5675] font-sans leading-relaxed">
                  Track release velocity, campaign risk heatmaps, and publication readiness across all active distribution channels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F3EAD3] text-sm text-[#4A5675] font-sans font-medium">
                Key view: Dashboard & Analytics
              </div>
            </div>

            {/* Role 3: Brand Administrator */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-sm font-sans text-[#8A6A24] font-bold uppercase tracking-wider">Persona 03</span>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mt-1 mb-2">
                  Brand Administrators
                </h3>
                <p className="text-[15px] text-[#4A5675] font-sans leading-relaxed">
                  Maintain canonical guidelines, index approved fact sheets, and refine rules flagged as unclear by telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F3EAD3] text-sm text-[#4A5675] font-sans font-medium">
                Key view: Brand Knowledge Hub
              </div>
            </div>

            {/* Role 4: Authorised Reviewer */}
            <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B35] text-[#059669] flex items-center justify-center mb-5">
                  <KeyRound className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-sm font-sans text-[#8A6A24] font-bold uppercase tracking-wider">Persona 04</span>
                <h3 className="font-serif text-xl font-bold text-[#14203D] mt-1 mb-2">
                  Authorised Reviewers
                </h3>
                <p className="text-[15px] text-[#4A5675] font-sans leading-relaxed">
                  Inspect evidence citations, request edits with comments, and record authoritative audit sign-offs with full tamper-evident traceability.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F3EAD3] text-sm text-[#4A5675] font-sans font-medium">
                Key view: Review Sign-Off Centre
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 48px gradient blend: Ivory to Midnight */}
      <div className="h-12 bg-gradient-to-b from-[#FAF8F2] to-[#0A1226]" />

      {/* ==================================================
          SECTION 5: CALL TO ACTION (MIDNIGHT #0A1226)
          ================================================== */}
      <section
        id="cta"
        className="py-20 text-center relative overflow-hidden bg-[#0A1226]"
        style={{
          background: 'linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(226,184,87,0.12), transparent 60%), linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF8F2] mb-3">
            See one draft go from check to approval.
          </h2>
          <p className="text-[17px] text-[#D5DBEE] max-w-xl mx-auto mb-8 font-sans leading-relaxed">
            Test the live three-layer analysis engine and experience human-in-the-loop sign-off without passwords.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-[#101B35] bg-[#E2B857] hover:bg-[#F3EAD3] shadow-[0_2px_12px_rgba(226,184,87,0.35)] transition-all active:scale-95 cursor-pointer"
            >
              Explore Demo Workspace
            </button>
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#FAF8F2] border border-[#F3EAD3]/40 hover:bg-white/5 transition-all cursor-pointer"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
