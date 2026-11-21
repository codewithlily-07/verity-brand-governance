import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Layers, 
  Search, ArrowRight, ArrowLeft, UserCheck, FileCheck, Sparkles,
  ChevronDown, ChevronUp, RefreshCw, Lock, Hash, Check, ThumbsUp
} from 'lucide-react';
import { GoldRefineWord } from '../components/animation/GoldRefineWord';

export function HowItWorksPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'workflow' | 'labels' | 'try'
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(0);

  // Try it yourself state with Gold Refinement
  const [sampleText, setSampleText] = useState(
    "Our platform guarantees 100% results and is the best learning platform in India!"
  );
  const [checked, setChecked] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const [resolvedFindings, setResolvedFindings] = useState(false);

  const handleFixIt = () => {
    setIsRefining(true);
    setTimeout(() => {
      setSampleText("Our platform supports verified learning outcomes and is a leading online learning platform in India!");
      setIsRefining(false);
      setResolvedFindings(true);
    }, 700);
  };

  // Sync with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['layers', 'workflow', 'labels', 'try'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  const layers = [
    {
      id: 'brand-rules',
      number: '01',
      title: 'Brand Rules',
      shortLine: 'Checks your draft against your own brand rules, instantly.',
      whatItDoes: 'Layer 01 runs deterministic regular expressions, terminology dictionaries, and pattern-matching rules in under 15 milliseconds. It catches absolute guarantees, prohibited words, missing legal disclaimers, and competitor mentions before any external AI is invoked.',
      examplePhrase: '“guarantees 100% results”',
      exampleContext: 'Flagged by Rule R2 (Absolute Guarantees). Corporate policy permits factual capabilities, but prohibits absolute success guarantees.',
      whatYouSee: {
        badge: 'Rule R2 Violation',
        severity: 'High',
        fix: 'Change to “supports verified learning outcomes”'
      },
      techDetails: [
        'Deterministic compiled regex matching with sub-15ms execution time',
        'Direct vocabulary and casing dictionary lookup with normalized Unicode',
        'Zero external API dependencies; operates 100% offline with zero latency',
        'Pre-execution prompt injection defense halts malicious inputs'
      ]
    },
    {
      id: 'evidence-check',
      number: '02',
      title: 'Evidence Check',
      shortLine: 'Looks every claim up in your approved facts and guideline passages.',
      whatItDoes: 'Layer 02 grounds factual and statistical assertions against your approved brand fact repository and official source passages. When copy makes empirical claims without supporting corporate facts, it flags the missing citation immediately.',
      examplePhrase: '“the best learning platform in India”',
      exampleContext: 'Flagged by Rule R3 (Unsupported Superlatives). No accredited third-party benchmark or approved corporate fact exists in the brand vault.',
      whatYouSee: {
        badge: 'Missing Citation',
        severity: 'High',
        fix: 'Change to “leading online learning platform in India” or cite accredited survey'
      },
      techDetails: [
        'Deterministic and BM25 keyword retrieval against approved brand statements',
        'Exact and fuzzy Jaccard token overlap scoring against verified fact catalog',
        'Explicit missing-evidence citation label when assertion lacks verified backing',
        'Full tenant isolation ensuring fact sheets are never co-mingled'
      ]
    },
    {
      id: 'ai-review',
      number: '03',
      title: 'AI Review (optional)',
      shortLine: 'Reads tone and context that fixed rules cannot catch.',
      whatItDoes: 'Layer 03 analyzes nuanced tone, passive-aggressive framing, subtle sarcasm, and contextual brand fit using strictly bounded AI prompts. If no API key is provided or the network is unavailable, Verity operates gracefully with 100% accuracy using Layers 01 and 02.',
      examplePhrase: '“Sign up now before it is too late, guys!”',
      exampleContext: 'Flagged for Informal Slang & Artificial Urgency. Brand guidelines recommend an authoritative, welcoming, and professional voice.',
      whatYouSee: {
        badge: 'Tone Mismatch',
        severity: 'Medium',
        fix: 'Change to “Explore our certified curriculum today.”'
      },
      techDetails: [
        'Strictly bounded JSON-schema inference enforcing pre-registered rule IDs only',
        'Zero-hallucination guardrails: the model cannot invent new rules or fake citations',
        'Deterministic fallback: 100% functional when offline or without external AI keys',
        'System prompt defense blocks instructions attempting to override governance'
      ]
    },
    {
      id: 'human-approval',
      number: '04',
      title: 'Human Approval',
      shortLine: 'A person makes the final call.',
      whatItDoes: 'Verity never publishes copy autonomously. Authorised Reviewers inspect findings, evaluate intent-preserving corrections side-by-side, and apply an authoritative approval stamp with an immutable SHA-256 fingerprint.',
      examplePhrase: 'Approved Version 2 (Hash: e3b0c442...)',
      exampleContext: 'Reviewed by Authorised Reviewer with recorded audit justification and permanent tamper-evident seal.',
      whatYouSee: {
        badge: 'Tamper-Evident Seal',
        severity: 'Approved',
        fix: 'Ready for export to CMS, email, and social publishing channels'
      },
      techDetails: [
        'Role-separated sign-off gate: Creators submit; only Reviewers/Admins can approve',
        'SHA-256 tamper-evident fingerprint calculated over normalized content and metadata',
        'Optimistic concurrency control via integer lock_version prevents race conditions',
        'Immutable audit event trail recorded permanently in durable storage'
      ]
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Set Up',
      description: 'Define your brand rules, approved facts, terminology glossary, and designated reviewers in the Brand Hub.'
    },
    {
      number: '2',
      title: 'Submit',
      description: 'Creators draft copy directly or import campaign text. Verity creates an immutable Version 1 with a SHA-256 digest.'
    },
    {
      number: '3',
      title: 'Check',
      description: 'The four-tier engine scans the draft in milliseconds, grounding every empirical claim against verified facts.'
    },
    {
      number: '4',
      title: 'Fix',
      description: 'Review inline, intent-preserving replacements. Apply verified fixes with one click to generate Version 2.'
    },
    {
      number: '5',
      title: 'Approve',
      description: 'An authorised reviewer evaluates the side-by-side diff and issues a permanent tamper-evident approval stamp.'
    }
  ];

  const currentLayer = layers[selectedLayer];

  return (
    <div className="w-full bg-[#FAF8F2] text-[#14203D] min-h-screen">

      {/* =========================================================================
          HERO SECTION: Midnight-to-Navy gradient with Soft Gold Glow (NO BLUE)
          ========================================================================= */}
      <section 
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
          color: '#FAF8F2'
        }}
      >
        {/* Soft gold ambient glow (top right) */}
        <div 
          className="absolute -top-24 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #E2B857 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1226]/80 border border-[#E2B857]/40 text-[#E2B857] text-sm font-semibold tracking-wider uppercase mb-5">
            <ShieldCheck className="w-4 h-4 text-[#E2B857]" />
            <span>4-Tier Governance Architecture</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F2] mb-5 leading-tight">
            How Verity <span className="text-[#E2B857]">Works</span>
          </h1>

          <p className="text-[17px] sm:text-xl text-[#D5DBEE] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            From raw draft to authoritatively sealed publication in four disciplined verification layers.
          </p>

          {/* Sub-Tab Bar: Navy Like #13203F with champagne border, solid gold pill active */}
          <div className="inline-flex p-1.5 rounded-full bg-[#13203F] border border-[#F3EAD3]/30 backdrop-blur-md shadow-2xl max-w-full overflow-x-auto min-h-[44px]">
            {[
              { id: 'layers', label: 'Four Layers' },
              { id: 'workflow', label: '5-Step Workflow' },
              { id: 'labels', label: 'Finding Labels' },
              { id: 'try', label: 'Try It Yourself' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-2.5 min-h-[44px] rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap outline-none focus:outline-none focus:ring-2 focus:ring-[#E2B857] cursor-pointer ${
                    isActive
                      ? 'bg-[#E2B857] text-[#101B35] font-bold shadow-md'
                      : 'text-[#FAF8F2] hover:text-[#FAF8F2] hover:underline hover:decoration-[#E2B857] hover:underline-offset-4 bg-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 48px Smooth Gradient Blend from Navy to Ivory */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #FAF8F2 100%)'
          }}
        />
      </section>

      {/* =========================================================================
          TAB 1: FOUR LAYERS (Warm Ivory Band #FAF8F2)
          ========================================================================= */}
      {activeTab === 'layers' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Row of 4 Stepper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {layers.map((layer, idx) => {
              const isSelected = selectedLayer === idx;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 outline-none focus:outline-none focus:ring-2 focus:ring-[#E2B857] cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#E2B857] shadow-lg ring-1 ring-[#E2B857]/60'
                      : 'bg-[#FFFFFF]/80 border-[#F3EAD3] hover:bg-[#FFFFFF] hover:border-[#E2B857]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold font-sans uppercase tracking-wider ${isSelected ? 'text-[#8A6A24]' : 'text-[#4A5675]'}`}>
                      Layer {layer.number}
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected ? 'bg-[#E2B857] text-[#101B35]' : 'bg-[#FAF8F2] text-[#4A5675] border border-[#F3EAD3]'
                    }`}>
                      {idx + 1}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#14203D] mb-1">
                    {layer.title}
                  </h2>
                  <p className="text-sm text-[#4A5675] leading-relaxed">
                    {layer.shortLine}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Layer "Paper" Card (White on Ivory) */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2B857]/30 p-8 sm:p-10 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#F3EAD3]">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-[#8A6A24] font-sans">
                  Detailed Layer Specification — Layer {currentLayer.number}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14203D] mt-1">
                  {currentLayer.title}
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EAD3]/70 border border-[#E2B857]/40 text-[#14203D] text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>Deterministic Integrity Active</span>
              </div>
            </div>

            {/* What it does */}
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#14203D] mb-2 font-sans">
                What It Does
              </h4>
              <p className="text-[17px] text-[#4A5675] leading-relaxed max-w-4xl font-sans">
                {currentLayer.whatItDoes}
              </p>
            </div>

            {/* Example & What you see */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#E2B857]/20">
                <h5 className="text-sm font-bold uppercase tracking-wider text-[#8A6A24] mb-2 font-sans">
                  Example Input Phrase
                </h5>
                <p className="font-serif text-lg text-[#14203D] italic mb-2">
                  {currentLayer.examplePhrase}
                </p>
                <p className="text-sm text-[#4A5675] leading-relaxed">
                  {currentLayer.exampleContext}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#E2B857]/20 flex flex-col justify-between">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-[#14203D] mb-2 font-sans">
                    What You See In The Review Centre
                  </h5>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E2B857]/40 text-[#14203D] text-sm font-semibold mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
                    <span>{currentLayer.whatYouSee.badge}</span>
                    <span className="text-[#8A6A24] font-bold">({currentLayer.whatYouSee.severity})</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F3EAD3] text-sm text-[#065F46] font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#065F46] flex-shrink-0" />
                  <span>Proposed fix: {currentLayer.whatYouSee.fix}</span>
                </div>
              </div>
            </div>

            {/* Collapsed Technical Details Accordion */}
            <div className="border border-[#F3EAD3] rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setTechOpen(!techOpen)}
                className="w-full px-6 py-4 bg-[#FAF8F2] hover:bg-[#F3EAD3]/50 transition-colors flex items-center justify-between text-left text-sm font-semibold text-[#14203D] outline-none focus:outline-none focus:ring-2 focus:ring-[#E2B857] cursor-pointer"
                aria-expanded={techOpen}
              >
                <span className="flex items-center gap-2 font-serif text-base font-bold">
                  <Cpu className="w-4 h-4 text-[#8A6A24]" />
                  Technical Specifications & Engineering Contracts
                </span>
                {techOpen ? <ChevronUp className="w-5 h-5 text-[#8A6A24]" /> : <ChevronDown className="w-5 h-5 text-[#8A6A24]" />}
              </button>

              {techOpen && (
                <div className="p-6 bg-[#FFFFFF] border-t border-[#F3EAD3] text-sm text-[#4A5675] space-y-2.5 font-sans">
                  {currentLayer.techDetails.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8A6A24] mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: 5-STEP WORKFLOW (Deep Slate Navy Band #101B35)
          ========================================================================= */}
      {activeTab === 'workflow' && (
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 text-[#FAF8F2]"
          style={{ backgroundColor: '#101B35' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#E2B857]">
                Continuous Audit Trail
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F2] mt-1 mb-3">
                The 5-Step Governance Lifecycle
              </h2>
              <p className="text-[17px] text-[#D5DBEE] max-w-xl mx-auto font-sans">
                Every piece of copy passes through five transparent checkpoints from authoring to publication.
              </p>
            </div>

            {/* 5-Step Lifecycle White Container Box */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2B857]/30 p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto text-[#14203D]">
              
              {/* Stepper with 5 Numbered Gold Circles */}
              <div className="flex items-center justify-between max-w-3xl mx-auto mb-10 px-2 overflow-x-auto pb-3">
                {steps.map((st, sIdx) => {
                  const isSelected = selectedStep === sIdx;
                  return (
                    <div key={sIdx} className="flex flex-col items-center cursor-pointer group px-2" onClick={() => setSelectedStep(sIdx)}>
                      <button
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-200 outline-none focus:outline-none focus:ring-2 focus:ring-[#E2B857] cursor-pointer ${
                          isSelected 
                            ? 'bg-[#E2B857] text-[#101B35] shadow-[0_0_15px_rgba(226,184,87,0.5)] scale-110' 
                            : 'bg-[#FAF8F2] border border-[#F3EAD3] text-[#14203D] hover:border-[#E2B857]'
                        }`}
                        aria-label={`Step ${st.number}: ${st.title}`}
                      >
                        {st.number}
                      </button>
                      <span className={`text-sm mt-2 font-medium tracking-wide whitespace-nowrap ${isSelected ? 'text-[#8A6A24] font-bold' : 'text-[#4A5675]'}`}>
                        {st.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected Step Card (Light Warm Ivory Surface inside White Box) */}
              <div className="bg-[#FAF8F2] rounded-2xl border border-[#E2B857]/20 p-7 sm:p-9 shadow-sm max-w-2xl mx-auto text-center">
                <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A24] font-sans">
                  Stage 0{steps[selectedStep].number} of 05
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14203D] mt-2 mb-4">
                  {steps[selectedStep].title}
                </h3>
                <p className="text-[17px] text-[#4A5675] leading-relaxed max-w-xl mx-auto mb-8 font-sans">
                  {steps[selectedStep].description}
                </p>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedStep(prev => Math.max(0, prev - 1))}
                    disabled={selectedStep === 0}
                    className="px-5 py-2.5 rounded-xl border border-[#F3EAD3] bg-white text-[#14203D] text-sm font-semibold hover:bg-[#FAF8F2] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors cursor-pointer shadow-sm min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#14203D]" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStep(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={selectedStep === steps.length - 1}
                    className="px-5 py-2.5 rounded-xl bg-[#E2B857] text-[#101B35] text-sm font-bold hover:bg-[#F3EAD3] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md cursor-pointer min-h-[44px]"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 text-[#101B35]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: FINDING LABELS (Soft Champagne Band #F3EAD3)
          ========================================================================= */}
      {activeTab === 'labels' && (
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 text-[#14203D]"
          style={{ backgroundColor: '#F3EAD3' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#8A6A24]">
                Transparent Findings Taxonomy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14203D] mt-1 mb-3">
                Clear Labels, Zero Ambiguity
              </h2>
              <p className="text-[17px] text-[#4A5675] max-w-xl mx-auto font-sans">
                Every flagged passage is classified into one of three unambiguous categories with verifiable evidence citations.
              </p>
            </div>

            {/* 3 White Paper Cards on Champagne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1: Confirmed Rule Violation */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#B91C1C] border border-[#B91C1C]/30 text-sm font-bold mb-4">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Confirmed Rule Violation</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                    Deterministic Breach
                  </h3>
                  <p className="text-[15px] text-[#4A5675] leading-relaxed mb-4">
                    The copy violates an explicit, registered brand rule such as banned terminology, missing disclaimer, or competitor disparagement.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E2B857]/20 text-sm">
                  <span className="font-bold text-[#B91C1C] block mb-1">Example Flag:</span>
                  <p className="italic text-[#14203D]">“We guarantee 100% placement within 30 days.”</p>
                  <span className="text-sm text-[#4A5675] mt-1 block">Rule R2: Absolute Guarantees</span>
                </div>
              </div>

              {/* Card 2: Evidence-Backed Concern */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#D97706]/30 text-sm font-bold mb-4">
                    <Search className="w-4 h-4" />
                    <span>Evidence-Backed Concern</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                    Missing Corporate Fact
                  </h3>
                  <p className="text-[15px] text-[#4A5675] leading-relaxed mb-4">
                    An empirical metric or factual claim lacks grounding in your approved fact sheets, requiring verification before release.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E2B857]/20 text-sm">
                  <span className="font-bold text-[#92400E] block mb-1">Example Flag:</span>
                  <p className="italic text-[#14203D]">“Over 500,000 active students enrolled.”</p>
                  <span className="text-sm text-[#4A5675] mt-1 block">No verified fact matching “500,000 active”</span>
                </div>
              </div>

              {/* Card 3: Needs Human Review */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#059669]/30 text-sm font-bold mb-4">
                    <UserCheck className="w-4 h-4" />
                    <span>Needs Human Review</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#14203D] mb-2">
                    Tone & Context Nuance
                  </h3>
                  <p className="text-[15px] text-[#4A5675] leading-relaxed mb-4">
                    Nuanced phrasing that may sound overly casual, aggressive, or ambiguous. Human editorial judgment is requested.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E2B857]/20 text-sm">
                  <span className="font-bold text-[#065F46] block mb-1">Example Flag:</span>
                  <p className="italic text-[#14203D]">“Don’t miss out on this crazy opportunity!”</p>
                  <span className="text-sm text-[#4A5675] mt-1 block">Tone guideline: authoritative and calm</span>
                </div>
              </div>
            </div>

            {/* Severity Legend with High Contrast Icons */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4 text-sm font-sans">
              <div className="flex items-center gap-2">
                <span className="text-[#B91C1C] font-black text-base">▲</span>
                <span className="font-bold text-[#14203D]">High Severity:</span>
                <span className="text-[#4A5675]">Blocks approval directly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8A6A24] font-black text-base">◆</span>
                <span className="font-bold text-[#14203D]">Medium Severity:</span>
                <span className="text-[#4A5675]">Requires author review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#065F46] font-black text-base">●</span>
                <span className="font-bold text-[#14203D]">Low Severity:</span>
                <span className="text-[#4A5675]">Advisory editorial note</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: TRY IT YOURSELF (Midnight Band #0A1226)
          ========================================================================= */}
      {activeTab === 'try' && (
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 text-[#FAF8F2]"
          style={{ backgroundColor: '#0A1226' }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#E2B857]">
                Live Interactive Demonstration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F2] mt-1 mb-3">
                Experience Real-Time Governance
              </h2>
              <p className="text-[17px] text-[#D5DBEE] max-w-xl mx-auto font-sans">
                Test how Verity analyzes marketing copy, extracts citations, and surfaces intent-preserving fixes.
              </p>
            </div>

            {/* Interactive Preview Container (White Box) */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2B857]/30 p-6 sm:p-8 shadow-2xl text-[#14203D]">
              <div className="flex items-center justify-between mb-3 text-sm text-[#4A5675]">
                <span className="font-semibold text-[#8A6A24]">Input Draft Copy:</span>
                <span className="italic">Sample Ad Copy (Social Campaign)</span>
              </div>

              {/* Live Preview Display with Gold Refinement */}
              {isRefining ? (
                <div className="w-full p-4 rounded-xl bg-[#FAF8F2] border border-[#E2B857]/50 text-[#14203D] text-base mb-4 font-serif leading-relaxed shadow-inner">
                  <span>Our platform </span>
                  <GoldRefineWord
                    originalText="guarantees 100% results"
                    correctedText="supports verified learning outcomes"
                    isRefining={isRefining}
                    isResolved={resolvedFindings}
                    durationMs={700}
                    isLightBackground={true}
                  />
                  <span> and is the </span>
                  <GoldRefineWord
                    originalText="best learning platform in India!"
                    correctedText="leading online learning platform in India."
                    isRefining={isRefining}
                    isResolved={resolvedFindings}
                    durationMs={700}
                    isLightBackground={true}
                  />
                </div>
              ) : (
                <textarea
                  value={sampleText}
                  onChange={(e) => {
                    setSampleText(e.target.value);
                    setChecked(false);
                    setResolvedFindings(false);
                  }}
                  rows={3}
                  className="w-full p-4 rounded-xl bg-[#FAF8F2] border border-[#F3EAD3] text-[#14203D] text-base focus:ring-2 focus:ring-[#E2B857] focus:bg-white focus:outline-none mb-4 font-sans leading-relaxed"
                  placeholder="Paste marketing copy here..."
                />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <span className="text-sm text-[#4A5675]">
                  Deterministic Layer 01 & Layer 02 verification with Gold Refinement:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChecked(true);
                      setResolvedFindings(false);
                    }}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FAF8F2] border border-[#F3EAD3] text-[#14203D] font-semibold text-sm hover:bg-[#F3EAD3]/50 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[#8A6A24]" />
                    <span>Check Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFixIt}
                    disabled={isRefining || resolvedFindings}
                    className="px-6 py-2.5 min-h-[44px] rounded-xl bg-[#E2B857] text-[#101B35] font-bold text-sm hover:bg-[#F3EAD3] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#101B35]" />
                    <span>{isRefining ? 'Refining Copy...' : resolvedFindings ? 'Refined & Verified' : 'Fix it'}</span>
                  </button>
                </div>
              </div>

              {/* Findings Results Preview */}
              {checked && (
                <div className="space-y-3 pt-4 border-t border-[#F3EAD3]">
                  <div className="flex items-center justify-between text-sm text-[#4A5675] mb-1">
                    <span className="font-bold text-[#8A6A24] uppercase tracking-wider">
                      {resolvedFindings ? 'All Findings Resolved' : 'Analysis Results: 2 High-Severity Findings Detected'}
                    </span>
                    <span className="text-[#065F46] font-semibold">Latency: 12ms</span>
                  </div>

                  {resolvedFindings ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-[#ECFDF5] border border-[#059669]/30 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-[#065F46]" />
                        <div>
                          <span className="font-bold text-[#065F46] block">Verified & Brand Compliant</span>
                          <span className="text-sm text-[#4A5675]">Grounded in corporate fact sheets. Impurities refined into verified copy.</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#065F46] bg-[#D1FAE5] px-3 py-1 rounded-full">
                        Resolved
                      </span>
                    </motion.div>
                  ) : (
                    <>
                      {/* Finding 1 */}
                      <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#B91C1C]/40 flex items-start gap-3 text-sm">
                        <AlertTriangle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#14203D]">Rule R2: Absolute Guarantees</span>
                            <span className="px-2.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-bold text-sm">▲ HIGH</span>
                          </div>
                          <p className="text-[#4A5675] mt-1">
                            Flagged text: <span className="text-[#8A6A24] font-semibold underline">“guarantees 100% results”</span>. Brand guidelines prohibit absolute success claims.
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3EAD3]">
                            <span className="text-[#065F46] font-semibold">
                              Suggested: “supports verified learning outcomes”
                            </span>
                            <button
                              type="button"
                              onClick={handleFixIt}
                              className="px-3.5 py-1.5 rounded-lg bg-[#E2B857] text-[#101B35] font-bold text-sm hover:bg-[#F3EAD3] flex items-center gap-1 shadow-sm cursor-pointer min-h-[36px]"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#101B35]" />
                              <span>Fix it</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Finding 2 */}
                      <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#B91C1C]/40 flex items-start gap-3 text-sm">
                        <AlertTriangle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#14203D]">Rule R3: Unsupported Superlative</span>
                            <span className="px-2.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] font-bold text-sm">▲ HIGH</span>
                          </div>
                          <p className="text-[#4A5675] mt-1">
                            Flagged text: <span className="text-[#8A6A24] font-semibold underline">“best learning platform in India”</span>. No verified third-party accreditation on record.
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3EAD3]">
                            <span className="text-[#065F46] font-semibold">
                              Suggested: “leading online learning platform in India”
                            </span>
                            <button
                              type="button"
                              onClick={handleFixIt}
                              className="px-3.5 py-1.5 rounded-lg bg-[#E2B857] text-[#101B35] font-bold text-sm hover:bg-[#F3EAD3] flex items-center gap-1 shadow-sm cursor-pointer min-h-[36px]"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#101B35]" />
                              <span>Fix it</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Call to Action Link to Full Workspace */}
              <div className="mt-8 pt-6 border-t border-[#F3EAD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm text-[#4A5675]">
                  Ready to test with your own brand rules and guidelines?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActivePage('dashboard');
                  }}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#101B35] text-[#FAF8F2] hover:bg-[#0A1226] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Open Full Demo Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#FAF8F2]" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          BOTTOM CALL TO ACTION (Navy to Midnight Blend - The ONE dark band)
          ========================================================================= */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8 text-center text-[#FAF8F2] relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #101B35 0%, #0A1226 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F2] mb-4">
            Start Governing Brand Integrity Today
          </h2>
          <p className="text-[17px] text-[#D5DBEE] mb-8 font-sans">
            Explore our pre-seeded demonstration workspace or review the full API and architecture documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('dashboard');
              }}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-xl bg-[#E2B857] text-[#101B35] font-bold text-sm hover:bg-[#F3EAD3] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#101B35]" />
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('resources');
              }}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[44px] rounded-xl border border-[#F3EAD3]/40 text-[#FAF8F2] hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer"
            >
              Read Architecture & Specs
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
