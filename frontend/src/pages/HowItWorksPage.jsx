import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Cpu, Layers, Search, FileText, CheckCircle2, AlertTriangle, 
  HelpCircle, ShieldCheck, ArrowRight, Sparkles, UserCheck, 
  GitCommit, Clock, FileCode, Check
} from 'lucide-react';
import { PageSubNav } from '../components/PageSubNav';
import { TechnicalDetailsExpander } from '../components/TechnicalDetailsExpander';

export function HowItWorksPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const [activeLayer, setActiveLayer] = useState(0);

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  const sections = [
    { id: 'four-layers', label: 'Four Layers' },
    { id: 'timeline', label: '5-Step Workflow' },
    { id: 'verdict-labels', label: 'Finding Labels' },
    { id: 'try-samples', label: 'Try It Yourself' },
  ];

  const layersData = [
    {
      step: '01',
      name: 'Brand Rules',
      type: 'Deterministic Engine',
      role: 'Analyses draft in milliseconds',
      headline: 'Layer 1: Deterministic Syntax & Rule Matching',
      summary: 'Catches exact prohibited terms, unapproved casing, and banned absolute guarantees instantly.',
      input: '“Our platform guarantees 100% results and is the best in India!”',
      output: 'Flagged: Rule R2 (absolute guarantee) & Rule R3 (unsupported superlative). Severity: High.',
      technical: [
        'Deterministic regular expression parsing and exact pattern matching',
        'Normalised whitespace and Unicode casing comparisons',
        'Runs locally and synchronously with zero network latency'
      ]
    },
    {
      step: '02',
      name: 'Evidence Retrieval',
      type: 'Knowledge Retrieval',
      role: 'Grounds claims against sources',
      headline: 'Layer 2: Retrieval-Grounded Fact Matching',
      summary: 'Compares draft factual assertions against your indexed company fact sheets and policy documents.',
      input: '“Subscriptions remain at Rs. 499 for the 2024 academic cycle.”',
      output: 'Citation Gap: No approved fact for "Rs. 499" or "2024 cycle" found in current brand vault.',
      technical: [
        'Vector passage retrieval matching draft claims against approved guidelines',
        'Cosine similarity scoring against tenant-partitioned knowledge chunks',
        'Explicit missing evidence label when similarity falls below verification threshold'
      ]
    },
    {
      step: '03',
      name: 'AI Review',
      type: 'Contextual AI (Advisory)',
      role: 'Interprets subtle tone nuances',
      headline: 'Layer 3: AI Contextual Interpretation',
      summary: 'Detects nuanced tone discrepancies, passive voice issues, and context-dependent brand claims.',
      input: '“Our revolutionary world-class platform lets users easily master courses without trying.”',
      output: 'Tone advisory: "Revolutionary" and "without trying" conflict with our modest, trustworthy brand voice.',
      technical: [
        'Google Gemini 1.5 Flash (temperature 0.0, deterministic generation)',
        'Server-side quote grounding check rejecting any hallucinated findings',
        'Content treated strictly as inert data to prevent prompt injection overrides'
      ]
    },
    {
      step: '04',
      name: 'Human Approval',
      type: 'Authorised Reviewer',
      role: 'Owns the final release decision',
      headline: 'Layer 4: Human Review & Cryptographic Sign-Off',
      summary: 'An authorised person reviews findings, inspects cited sources, and issues the binding approval.',
      input: 'Reviewer inspects revised version v2 with all high-severity findings resolved.',
      output: 'Approved by Elena Vance (Reviewer). SHA-256 seal generated: 8f4e2b1a... Immutable audit record logged.',
      technical: [
        'Approval applies exclusively to the inspected version content hash',
        'Cryptographic SHA-256 seal binds author, reviewer, timestamp, and text',
        'Full compliance override log preserves exception justification'
      ]
    }
  ];

  return (
    <div className="min-h-screen text-[#F7F2E7] select-none">
      
      {/* ==================================================
          SECTION 1: HERO (NAVY #0A1230, Max 45vh)
          ================================================== */}
      <section 
        className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#D4AF37]/20 flex flex-col items-center justify-center min-h-[38vh] max-h-[45vh]"
        style={{ backgroundColor: '#0A1230' }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A1F] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-3">
          <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>FOUR-LAYER VERIFICATION PIPELINE</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
          How Verity <span className="text-gold-shimmer">Works</span>
        </h1>
        
        <p className="text-[17px] text-[#F7F2E7]/85 max-w-[65ch] mx-auto font-sans leading-relaxed mb-6">
          See how Verity checks a draft, finds the evidence, and leaves the decision to a person.
        </p>

        <div>
          <button
            type="button"
            onClick={() => handleNav('new-review')}
            className="btn-gold-sweep px-7 py-3 rounded-xl font-bold text-sm text-[#050814] shadow-gold-glow inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
            }}
          >
            <span>Launch Live Pipeline Demo</span>
            <ArrowRight className="w-4 h-4 text-[#050814]" />
          </button>
        </div>
      </section>

      {/* Sticky Sub-navigation */}
      <PageSubNav sections={sections} />

      {/* ==================================================
          SECTION 2: FOUR LAYERS INTERACTIVE STEPPER (CHARCOAL #0B0E14)
          Dark elevated cards, active gold tab, travelling light pulse, technical expander.
          Note: Layers 1-3 analyse, Layer 4 is the human decision.
          ================================================== */}
      <section 
        id="four-layers"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0B0E14' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
              PIPELINE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              Four layers from analysis to decision
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              Layers 1 to 3 perform automated analysis; Layer 4 is the human authority gate.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="relative mb-10">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gray-800 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              {layersData.map((layer, idx) => {
                const isActive = activeLayer === idx;
                return (
                  <button
                    key={layer.step}
                    type="button"
                    onClick={() => setActiveLayer(idx)}
                    className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                      isActive 
                        ? 'bg-[#111827] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]' 
                        : 'bg-[#0B0E14] border-gray-700 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#F3D98B]' : 'text-[#D4AF37]'}`}>
                        Layer {layer.step}
                      </span>
                      {idx === 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2ECC9A]/20 text-[#2ECC9A] font-bold">
                          Human
                        </span>
                      )}
                    </div>
                    <div className={`font-serif text-base font-bold ${isActive ? 'text-white' : 'text-[#F7F2E7]'}`}>
                      {layer.name}
                    </div>
                    <div className="text-[12px] text-[#E2E8F0] mt-0.5 font-sans">
                      {layer.role}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Layer Details Card */}
          <div className="bg-[#111827] rounded-3xl p-7 sm:p-10 border border-[#D4AF37]/35 shadow-luxury">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                  {layersData[activeLayer].type}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {layersData[activeLayer].headline}
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-mono self-start">
                {activeLayer < 3 ? 'Automated Analysis Tier' : 'Authorised Human Gate'}
              </span>
            </div>

            <p className="text-[17px] text-[#F7F2E7]/90 font-sans leading-relaxed mb-8 max-w-[68ch]">
              {layersData[activeLayer].summary}
            </p>

            {/* Input / Output Example Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="p-4 rounded-2xl bg-[#05070F] border border-gray-800">
                <span className="text-xs font-mono text-gray-400 uppercase block mb-1">
                  Example Input (Draft Text)
                </span>
                <p className="text-sm font-sans text-gray-200 leading-relaxed italic">
                  {layersData[activeLayer].input}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#05070F] border border-[#D4AF37]/30">
                <span className="text-xs font-mono text-[#F3D98B] uppercase block mb-1">
                  Layer Output / Action
                </span>
                <p className="text-sm font-sans text-white leading-relaxed font-medium">
                  {layersData[activeLayer].output}
                </p>
              </div>
            </div>

            {/* Technical Expander */}
            <TechnicalDetailsExpander title={`Technical specifications for Layer ${activeLayer + 1}`}>
              {layersData[activeLayer].technical.map((item, i) => (
                <div key={i}>• {item}</div>
              ))}
            </TechnicalDetailsExpander>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: 5-STEP WORKFLOW TIMELINE (IVORY #F7F2E7)
          High-contrast white cards, dark text, role chips, gold progress line.
          ================================================== */}
      <section 
        id="timeline"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              LIFECYCLE STEPS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              The 5-step workflow from intake to sign-off
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Every content asset follows a structured sequence with clear ownership boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Step 01: Set up */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-3xl font-extrabold text-[#8A5A12]">01</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EFE6D2] text-[#8A5A12]">
                    Admin
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2">Set up</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Administrator registers brand source documents, approved facts, and terminology pairs.
                </p>
              </div>
            </div>

            {/* Step 02: Submit */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-3xl font-extrabold text-[#8A5A12]">02</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EFE6D2] text-[#8A5A12]">
                    Creator
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2">Submit</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Content creator pastes draft copy or uploads a PDF or Word DOCX document.
                </p>
              </div>
            </div>

            {/* Step 03: Analyse */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-3xl font-extrabold text-[#8A5A12]">03</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-gray-100 text-gray-800">
                    Engine
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2">Analyse</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Rules, retrieval grounding, and advisory AI evaluate the draft against active policy.
                </p>
              </div>
            </div>

            {/* Step 04: Resolve */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-3xl font-extrabold text-[#8A5A12]">04</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EFE6D2] text-[#8A5A12]">
                    Creator
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2">Resolve</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Creator edits fixes side by side with the original draft, preserving original voice.
                </p>
              </div>
            </div>

            {/* Step 05: Approve */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-3xl font-extrabold text-[#065F46]">05</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20">
                    Reviewer
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2">Approve</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed">
                  Reviewer applies cryptographic sign-off with mandatory reason and version seal.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: EVERY FINDING IS LABELLED (NAVY #0A1230 - The ONE navy section!)
          Three cards: Verified violation (crimson), Source-backed concern (amber), Needs review (violet).
          Severity legend: High, Medium, Low (icon plus text).
          ================================================== */}
      <section 
        id="verdict-labels"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0A1230' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#F3D98B] uppercase block mb-2">
              TRANSPARENT TAXONOMY
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              Every finding is clearly labelled
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              Verity categorizes issues into three unambiguous verdicts so reviewers understand the evidential backing immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
            
            {/* Card 1: Verified rule violation */}
            <div className="bg-[#111827] rounded-2xl p-7 border border-[#E5484D]/40 shadow-luxury">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-[#E5484D]" />
                <span className="text-xs font-mono font-bold uppercase text-[#E5484D] tracking-wider">
                  Deterministic Match
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Verified rule violation
              </h3>
              <p className="text-[15px] text-[#F7F2E7]/85 font-sans leading-relaxed mb-4">
                Triggered by an exact rule pattern match, such as prohibited absolute claims or misspelled brand name casing.
              </p>
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-xs font-mono text-gray-300">
                Evidence: Direct link to guideline section and rule ID (e.g. Rule R1 or R2).
              </div>
            </div>

            {/* Card 2: Source-backed concern */}
            <div className="bg-[#111827] rounded-2xl p-7 border border-[#F5A623]/40 shadow-luxury">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
                <span className="text-xs font-mono font-bold uppercase text-[#F5A623] tracking-wider">
                  Retrieval Grounded
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Source-backed concern
              </h3>
              <p className="text-[15px] text-[#F7F2E7]/85 font-sans leading-relaxed mb-4">
                Identified through contextual analysis and directly substantiated by a matched guideline passage or factual assertion.
              </p>
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-xs font-mono text-gray-300">
                Evidence: Verbatim excerpt from approved policy document with citation.
              </div>
            </div>

            {/* Card 3: Needs human review */}
            <div className="bg-[#111827] rounded-2xl p-7 border border-[#A78BFA]/40 shadow-luxury">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-[#A78BFA]" />
                <span className="text-xs font-mono font-bold uppercase text-[#A78BFA] tracking-wider">
                  Evidence Gap
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Needs human review
              </h3>
              <p className="text-[15px] text-[#F7F2E7]/85 font-sans leading-relaxed mb-4">
                No supporting source passage was found in the brand knowledge base; a human reviewer must evaluate the statement.
              </p>
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-xs font-mono text-gray-300">
                Evidence: Explicitly notes "No approved source found in brand knowledge base."
              </div>
            </div>

          </div>

          {/* Severity Legend (Icon + Text Always) */}
          <div className="bg-[#05070F] rounded-2xl p-6 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F3D98B] font-semibold">
              Severity Legend (Always Icon + Text):
            </span>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-2 text-[#E5484D] font-bold">
                <span className="text-sm">▲</span>
                <span>High Severity (Blocks approval unless overridden)</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5A623] font-bold">
                <span className="text-sm">◆</span>
                <span>Medium Severity (Warning)</span>
              </div>
              <div className="flex items-center gap-2 text-[#9AA6C7] font-bold">
                <span className="text-sm">●</span>
                <span>Low Severity (Advisory note)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: TRY IT YOURSELF (CREAM #EFE6D2)
          Sample draft chips, then gold band call to action.
          ================================================== */}
      <section 
        id="try-samples"
        className="py-24 relative"
        style={{ backgroundColor: '#EFE6D2', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              INTERACTIVE TEST SUITE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Try the three sample scenarios
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Jump straight into pre-seeded evaluation drafts to test detection, evidence gaps, and false positives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Scenario 1: Social Post */}
            <div 
              onClick={() => handleNav('new-review')}
              className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-[#EFE6D2] text-[#8A5A12] text-xs font-mono font-bold">
                  Scenario 01
                </span>
                <span className="text-xs font-mono text-[#4B5563] font-medium">Social Post</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2 group-hover:text-[#8A5A12] transition-colors">
                Social Media Launch Post
              </h3>
              <p className="text-[14px] text-[#3B4252] font-sans mb-4">
                What to look for: Unsupported superlative ("best in India") and lowercase brand casing flagged with verifiable alternatives.
              </p>
              <div className="text-xs text-[#8A5A12] font-bold inline-flex items-center gap-1">
                <span>Load in demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Scenario 2: Press Release */}
            <div 
              onClick={() => handleNav('new-review')}
              className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-[#EFE6D2] text-[#8A5A12] text-xs font-mono font-bold">
                  Scenario 02
                </span>
                <span className="text-xs font-mono text-[#4B5563] font-medium">Press Release (PDF)</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2 group-hover:text-[#8A5A12] transition-colors">
                Pricing & Expansion Release
              </h3>
              <p className="text-[14px] text-[#3B4252] font-sans mb-4">
                What to look for: Outdated dates (2024 vs current) and unapproved price points sent to reviewer with evidence gap shown.
              </p>
              <div className="text-xs text-[#8A5A12] font-bold inline-flex items-center gap-1">
                <span>Load in demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Scenario 3: Website Copy */}
            <div 
              onClick={() => handleNav('new-review')}
              className="bg-white rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)] cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-[#EFE6D2] text-[#8A5A12] text-xs font-mono font-bold">
                  Scenario 03
                </span>
                <span className="text-xs font-mono text-[#4B5563] font-medium">Website Copy (DOCX)</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#050A1F] mb-2 group-hover:text-[#8A5A12] transition-colors">
                Platform Architecture Overview
              </h3>
              <p className="text-[14px] text-[#3B4252] font-sans mb-4">
                What to look for: Tone and terminology ("revolutionary", "world-class") checked against voice guide with side-by-side fixes.
              </p>
              <div className="text-xs text-[#8A5A12] font-bold inline-flex items-center gap-1">
                <span>Load in demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Gold Band Call to Action */}
      <section 
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
            Experience deterministic rules, evidence-linked findings, and human reviewer authority in action.
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
              onClick={() => handleNav('brand-hub')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#050A1F] border border-[#050A1F]/40 hover:bg-[#050A1F]/10 transition-all cursor-pointer"
            >
              Inspect Brand Hub
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
