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
  const [activeStep, setActiveStep] = useState(0);

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
    <div className="min-h-screen text-[#F7F2E7] select-none">
      
      {/* ==================================================
          SECTION 1: HERO (NAVY #0A1230, Max 45vh)
          Short hero: gold eyebrow, H1, one-sentence subtitle, one gold button.
          ================================================== */}
      <section 
        className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#D4AF37]/20 flex flex-col items-center justify-center min-h-[38vh] max-h-[45vh]"
        style={{ backgroundColor: '#0A1230' }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A1F] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>ONE WORKSPACE FROM DRAFT TO APPROVAL</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
          Intelligent Pre-Publication <span className="text-gold-shimmer">Brand Governance</span>
        </h1>
        
        <p className="text-[17px] text-[#F7F2E7]/85 max-w-[65ch] mx-auto font-sans leading-relaxed mb-6">
          Unify marketing, communications, and editorial standards before content reaches public channels.
        </p>

        <div>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="btn-gold-sweep px-7 py-3 rounded-xl font-bold text-sm text-[#050814] shadow-gold-glow inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
            }}
          >
            <span>Explore Demo Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#050814]" />
          </button>
        </div>
      </section>

      {/* Sticky Sub-navigation with scroll indicator */}
      <PageSubNav sections={sections} />

      {/* ==================================================
          SECTION 2: SEVEN CAPABILITIES (IVORY #F7F2E7)
          White cards, 1px gold border, soft shadow, dark text, tiny animated mini-UIs.
          ================================================== */}
      <section 
        id="capabilities"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              CORE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Seven tools to verify every public statement
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[68ch] mx-auto">
              Every stage of content preparation is covered, from guideline setup to post-publication governance insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            
            {/* Capability 1: Brand Knowledge Hub */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <BookOpen className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Brand Knowledge Hub
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Manage approved corporate facts, deterministic brand rules, and terminology pairs in one shared repository.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-xs space-y-1.5 mb-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-700">
                    <span>Approved Fact F-01</span>
                    <span className="text-[#065F46] font-bold">✓ Verified</span>
                  </div>
                  <p className="text-gray-900 italic text-[11px]">"Verity Learning supports online learning."</p>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• SQLite relational storage with SQLite / Postgres support</span>
                <span>• Vector passage embeddings (cosine similarity index)</span>
                <span>• Strict versioning of guidelines (Current vs Superseded)</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 2: Content Intake */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <UploadCloud className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Content Intake
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Paste draft text or upload PDF and Microsoft Word documents up to 10MB with automatic text extraction.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-xs flex items-center justify-between">
                  <span className="text-gray-800">press_release_v2.pdf</span>
                  <span className="px-2 py-0.5 rounded bg-white text-gray-800 border border-gray-400 text-[10px]">10MB Limit</span>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• PyMuPDF text stream extractor with fallback</span>
                <span>• python-docx OpenXML paragraph parser</span>
                <span>• Document text treated as data, inert to prompt injections</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 3: Multi-layer Analysis */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Multi-layer Analysis
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Combines instantaneous deterministic rules, fact retrieval grounding, and advisory AI interpretation.
                </p>

                {/* Mini-UI Mockup: Three Layers */}
                <div className="p-2.5 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#065F46]" />
                    <span>L1: Rules Engine (Exact)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                    <span>L2: Fact Retrieval (Grounding)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-800">
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
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Evidence-led Findings
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Every issue displays the approved guideline passage or explicitly marks where source evidence is missing.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-xs">
                  <span className="text-[10px] uppercase text-[#B91C1C] font-bold block mb-0.5">High Severity Claim</span>
                  <p className="text-gray-900 text-[11px]">Evidence: "No approved source found in knowledge base."</p>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Three verdict classes: verified violation, source concern, review</span>
                <span>• Icon + text severity: High (▲), Medium (◆), Low (●)</span>
                <span>• Accessibility issues tagged separately from policy claims</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 5: Correction Suggestions */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <Sliders className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Correction Suggestions
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Review side-by-side wording fixes that preserve your communicative intent without injecting new claims.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-2.5 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-[11px] space-y-1">
                  <div className="line-through text-[#B91C1C]">"best learning platform"</div>
                  <div className="text-[#065F46] font-bold">"accredited learning platform"</div>
                </div>
              </div>

              <TechnicalDetailsExpander isLight={true}>
                <span>• Word-level LCS token diff generator</span>
                <span>• Author's original text is never overwritten</span>
                <span>• Revision saves as a new version with cryptographic hash</span>
              </TechnicalDetailsExpander>
            </div>

            {/* Capability 6: Review Workspace */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                  <UserCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                  Review Workspace
                </h3>
                <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  An authorised human reviewer inspects evidence, leaves audit comments, and owns final approval.
                </p>

                {/* Mini-UI Mockup */}
                <div className="p-3 bg-[#EFE6D2]/50 rounded-xl border border-[#D4AF37]/25 font-mono text-xs flex items-center justify-between">
                  <span className="text-gray-800">Decision Gate:</span>
                  <span className="px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20 font-bold text-[11px]">
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

            {/* Capability 7: Governance Insights (Full width on lg) */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all md:col-span-2 lg:col-span-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5 shadow-sm">
                    <TrendingUp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">
                    Adaptive Governance Insights
                  </h3>
                  <p className="text-[16px] text-[#3B4252] font-sans leading-relaxed max-w-[70ch]">
                    Repeatedly challenged or overridden rules highlight policies that may be unclear, recommending reviews rather than letting an AI rewrite guidelines.
                  </p>
                </div>

                <div className="bg-[#EFE6D2]/50 p-4 rounded-xl border border-[#D4AF37]/25 font-mono text-xs space-y-1.5 min-w-[260px]">
                  <span className="text-gray-700 uppercase text-[10px] block font-sans font-semibold">Telemetry Flag:</span>
                  <div className="text-gray-900 font-bold">Rule R6 (slang & tone): 42% challenge rate</div>
                  <div className="text-[#8A5A12] text-[11px]">Recommendation: Clarify casual tone allowance for social copy.</div>
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

      {/* ==================================================
          SECTION 3: WHAT ONE FINDING LOOKS LIKE (CHARCOAL #0B0E14)
          Animated finding card using exact example.
          ================================================== */}
      <section 
        id="example-finding"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0B0E14', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}
      >
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
              REAL-WORLD WORKFLOW EXAMPLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              What one finding looks like
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              Step through how a single unverified promotional sentence is caught, explained, corrected, and decided.
            </p>
          </div>

          {/* Finding Interactive Card */}
          <div className="bg-[#111827] rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 shadow-luxury max-w-3xl mx-auto">
            
            {/* Step 1: Draft Text In */}
            <div className="mb-6 p-4 rounded-2xl bg-[#05070F] border border-gray-800">
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                01 · Submitted Draft Text
              </span>
              <p className="text-lg font-serif text-white font-medium">
                “The country’s leading platform, now 50% faster.”
              </p>
            </div>

            {/* Step 2: Detected Issue */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-gray-800">
              <div className="p-2 rounded-lg bg-[#E5484D]/15 text-[#E5484D] shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#F87171] uppercase">
                    Detected Issue (High Severity)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-200 font-mono">
                    Rule R3 · Superlative
                  </span>
                </div>
                <p className="text-[15px] text-[#F7F2E7] font-sans">
                  Unsupported promotional claim with unverified superlative and metric.
                </p>
              </div>
            </div>

            {/* Step 3: Evidence */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-gray-800">
              <div className="p-2 rounded-lg bg-[#F5A623]/15 text-[#F5A623] shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#F5A623] uppercase block mb-1">
                  Evidence Citation
                </span>
                <p className="text-[15px] text-[#F7F2E7] font-sans">
                  No approved source found in the brand knowledge base.
                </p>
              </div>
            </div>

            {/* Step 4: Suggestion */}
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-[#2ECC9A]/10 border border-[#2ECC9A]/30">
              <div className="p-2 rounded-lg bg-[#2ECC9A]/20 text-[#2ECC9A] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#2ECC9A] uppercase block mb-1">
                  Intent-Preserving Suggestion
                </span>
                <p className="text-[15px] text-[#F7F2E7] font-sans leading-relaxed">
                  Replace with a verifiable statement, for example one that cites an approved test report.
                </p>
              </div>
            </div>

            {/* Step 5: Final Decision */}
            <div className="p-4 rounded-xl bg-[#050A1F] border border-[#D4AF37]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase block mb-0.5">
                  Final Decision Authority
                </span>
                <p className="text-[15px] text-white font-semibold">
                  Human reviewer approval is required before publishing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleNav('new-review')}
                className="btn-gold-sweep px-5 py-2.5 rounded-xl font-bold text-xs text-[#050814] whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
                }}
              >
                <span>Run this draft in the demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#050814]" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: WHO IT SERVES (CREAM #EFE6D2)
          Four role cards on cream, white cards, dark text.
          ================================================== */}
      <section 
        id="personas"
        className="py-24 relative"
        style={{ backgroundColor: '#EFE6D2', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              TARGET PERSONAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Built for every role in content publication
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Each persona receives specialized views with no password barriers in demo mode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Role 1: Content Creator */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-mono text-[#8A5A12] font-bold uppercase tracking-wider">Persona 01</span>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mt-1 mb-2">
                  Content Creators
                </h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Draft freely while getting immediate guidance on brand terminology and prohibited claims before submitting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-mono">
                Key view: New Review & Word Diff
              </div>
            </div>

            {/* Role 2: Marketing Manager */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Briefcase className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-mono text-[#8A5A12] font-bold uppercase tracking-wider">Persona 02</span>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mt-1 mb-2">
                  Marketing Managers
                </h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Track release velocity, campaign risk heatmaps, and publication readiness across all active distribution channels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-mono">
                Key view: Dashboard & Analytics
              </div>
            </div>

            {/* Role 3: Brand Administrator */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-mono text-[#8A5A12] font-bold uppercase tracking-wider">Persona 03</span>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mt-1 mb-2">
                  Brand Administrators
                </h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Maintain canonical guidelines, index approved fact sheets, and refine rules flagged as unclear by telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-mono">
                Key view: Brand Knowledge Hub
              </div>
            </div>

            {/* Role 4: Authorised Reviewer */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#2ECC9A] flex items-center justify-center mb-5">
                  <KeyRound className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-mono text-[#8A5A12] font-bold uppercase tracking-wider">Persona 04</span>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mt-1 mb-2">
                  Authorised Reviewers
                </h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Inspect evidence citations, request edits with comments, and apply cryptographic sign-offs with full auditability.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-mono">
                Key view: Review Sign-Off Centre
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: CALL TO ACTION (FULL-WIDTH GOLD GRADIENT BAND)
          ================================================== */}
      <section 
        id="cta"
        className="py-20 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F3D98B 0%, #D4AF37 50%, #A67C00 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
            See one draft go from check to approval.
          </h2>
          <p className="text-[17px] text-[#050A1F]/85 max-w-xl mx-auto mb-8 font-sans leading-relaxed">
            Test the live three-layer analysis engine and experience human-in-the-loop sign-off without passwords.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-[#F3D98B] bg-[#050A1F] hover:text-white shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              Explore Demo Workspace
            </button>
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#050A1F] border border-[#050A1F]/40 hover:bg-[#050A1F]/10 transition-all cursor-pointer"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
