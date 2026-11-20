import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, Code2, Download, ExternalLink, BarChart2, 
  Layers, ArrowRight, Sparkles, ChevronDown, ChevronUp, 
  FileText, Shield, Terminal, CheckCircle2, HelpCircle,
  Search, Cpu, Database, Hash, GitBranch, Lock, Clock, Check
} from 'lucide-react';

export function ResourcesPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'architecture' | 'glossary' | 'faq'
  const [gridSearch, setGridSearch] = useState('');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [openFaq, setOpenFaq] = useState(0); // first FAQ open by default

  // Sync with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['grid', 'architecture', 'glossary', 'faq'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  const resourceCards = [
    {
      id: 'quickstart',
      title: 'Quick Start Guide',
      line: 'Get up and running with a verified brand workspace in 3 minutes.',
      readTime: '3 min read',
      icon: BookOpen,
      action: () => setActivePage && setActivePage('dashboard'),
      actionLabel: 'Open Demo Workspace'
    },
    {
      id: 'brand-setup',
      title: 'Brand Setup Guide',
      line: 'Configure custom terminology, banned phrases, and approved facts.',
      readTime: '5 min read',
      icon: Shield,
      action: () => setActivePage && setActivePage('brand-hub'),
      actionLabel: 'Explore Brand Hub'
    },
    {
      id: 'read-finding',
      title: 'How to Read a Finding',
      line: 'Understand deterministic flags, evidence citations, and confidence scores.',
      readTime: '4 min read',
      icon: Search,
      action: () => setActivePage && setActivePage('how-it-works'),
      actionLabel: 'View Finding Taxonomy'
    },
    {
      id: 'approval-flow',
      title: 'How Approval Works',
      line: 'Role gates, compliance overrides, and cryptographic SHA-256 seals.',
      readTime: '4 min read',
      icon: Lock,
      action: () => setActivePage && setActivePage('review'),
      actionLabel: 'View Review Centre'
    },
    {
      id: 'api-docs',
      title: 'API Documentation',
      line: 'Interactive OpenAPI / Swagger docs for programmatic governance checks.',
      readTime: 'API Reference',
      icon: Terminal,
      href: '/docs',
      isExternal: true,
      actionLabel: 'Open Swagger Docs'
    },
    {
      id: 'repo',
      title: 'Source Code Repository',
      line: 'Explore the full-stack repository, Pydantic schemas, and test suite.',
      readTime: 'GitHub',
      icon: GitBranch,
      href: 'https://github.com/codewithlily-07/verity-brand-governance',
      isExternal: true,
      actionLabel: 'Visit GitHub'
    },
    {
      id: 'benchmarks',
      title: 'Benchmark & Quality Report',
      line: 'Real-world precision, recall, and evidence grounding benchmarks.',
      readTime: 'Evaluation Suite',
      icon: BarChart2,
      action: () => setActivePage && setActivePage('quality'),
      actionLabel: 'View Benchmark Report'
    },
    {
      id: 'changelog',
      title: 'Changelog & Architecture Notes',
      line: 'Track milestones, Round 3 improvements, and architectural evolutions.',
      readTime: 'v3.0.0 Stable',
      icon: Clock,
      action: () => setActivePage && setActivePage('roadmap'),
      actionLabel: 'View Roadmap'
    }
  ];

  const filteredCards = resourceCards.filter(c => 
    c.title.toLowerCase().includes(gridSearch.toLowerCase()) ||
    c.line.toLowerCase().includes(gridSearch.toLowerCase())
  );

  const architectureSteps = [
    {
      step: '1',
      title: 'Interface',
      pill: 'React 18 / Tailwind',
      icon: Layers,
      description: 'Responsive SPA featuring dual-role review gates, side-by-side diff previews, and WCAG AA accessible typography.'
    },
    {
      step: '2',
      title: 'API Gateway',
      pill: 'FastAPI / Python 3.11+',
      icon: Terminal,
      description: 'Asynchronous REST gateway executing input sanitization, RBAC role validation, and optimistic concurrency checks.'
    },
    {
      step: '3',
      title: 'Analysis Engine',
      pill: '4-Tier Verification',
      icon: Cpu,
      description: 'Sub-15ms deterministic regex scanner, BM25 fact grounder, and strictly bounded optional AI fallback.'
    },
    {
      step: '4',
      title: 'Knowledge Base',
      pill: 'Facts & Guidelines',
      icon: Database,
      description: 'Tenant-partitioned catalog of verified corporate statements, approved statistics, and forbidden terminology.'
    },
    {
      step: '5',
      title: 'Audit Ledger',
      pill: 'SQLite WAL & SHA-256',
      icon: Hash,
      description: 'Cryptographic SHA-256 version seals, concurrency lock protection, and immutable compliance audit trails.'
    }
  ];

  const glossaryTerms = [
    {
      term: 'Finding',
      definition: 'An explicit issue identified in draft copy, citing a registered brand rule, guideline, or missing corporate evidence.'
    },
    {
      term: 'Evidence Citation',
      definition: 'A verified quote from approved corporate source passages or fact sheets supporting an empirical assertion in the copy.'
    },
    {
      term: 'Grounding Verdict',
      definition: 'The verification status of a factual claim: Verified by data, Contradicted by records, or Unsupported (citation missing).'
    },
    {
      term: 'Version Seal',
      definition: 'An immutable SHA-256 cryptographic digest binding the draft text, author identity, and timestamp together.'
    },
    {
      term: 'Authorised Reviewer',
      definition: 'A designated human team member with certified credentials required to issue a binding approval or rejection.'
    },
    {
      term: 'Claim Evidence Ledger',
      definition: 'An itemized inventory of every empirical metric, comparative statement, and guarantee extracted from the copy.'
    },
    {
      term: 'Compliance Override',
      definition: 'A documented, mandatory justification recorded in the permanent audit trail when approving copy with open blockers.'
    },
    {
      term: 'Deterministic Engine',
      definition: 'A rule-checking system executing compiled regular expressions that operates locally with 100% reproducibility and zero hallucination.'
    }
  ];

  const filteredGlossary = glossaryTerms.filter(t => 
    t.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    t.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const faqs = [
    {
      q: 'What does Verity check?',
      a: 'Verity checks marketing and corporate copy across four tiers: deterministic brand rules (banned phrasing, casing, required legal disclaimers), approved corporate facts (metrics, pricing, offerings), contextual tone (informal slang, passive aggressiveness), and final human sign-off authority.'
    },
    {
      q: 'Does AI approve content?',
      a: 'Never. Verity adheres to a strict human-in-the-loop guarantee. AI suggestions are strictly advisory and bounded to verified rule codes. Only an authenticated human reviewer can issue a binding approval decision with a cryptographic SHA-256 seal.'
    },
    {
      q: 'Where does my data go?',
      a: 'Your copy is processed within your isolated workspace. Content is never co-mingled across tenants, never retained for public model training, and never transmitted to third parties without explicit workspace authorization.'
    },
    {
      q: 'What if there is no AI key?',
      a: 'Verity is designed offline-first. If no Google Gemini API key is configured or the external network is unreachable, Layer 01 (Deterministic Rules) and Layer 02 (Approved Fact Grounding) execute locally with 100% precision, zero latency, and zero service interruption.'
    },
    {
      q: 'How are versions approved?',
      a: 'When an author applies fixes, Verity creates a new numbered version with an immutable SHA-256 digest. An authorised reviewer compares Version 1 and Version 2 side-by-side. Approval stamps the version with the reviewer name, timestamp, and cryptographic hash in the permanent audit ledger.'
    },
    {
      q: 'What do the labels mean?',
      a: 'Flags are categorized into three unambiguous types: Confirmed Rule Violation (a direct breach of an active brand rule), Evidence-Backed Concern (an empirical statement lacking corporate fact sheet grounding), and Needs Human Review (a contextual tone nuance requiring human editorial judgment).'
    },
    {
      q: 'Is the demo data real?',
      a: 'Yes. The pre-seeded demo brand ("Verity Learning") contains real rules (R1 to R7), approved facts (F-01 to F-03), and terminology glossaries. The evaluation suite runs real automated engine scans over 30 labelled benchmark test cases with 100% precision and zero mocked results.'
    },
    {
      q: 'Who can approve?',
      a: 'Only users holding the "Authorised Reviewer" or "Brand Administrator" persona can approve drafts or authorize compliance overrides. Content Creators can draft, run reviews, and apply fixes, but are strictly prohibited from approving their own releases.'
    }
  ];

  return (
    <div className="w-full bg-[#FAF8F2] text-[#14203D] min-h-screen">

      {/* =========================================================================
          HERO SECTION: Midnight-to-Navy gradient with Soft Gold Glow (NO BLUE)
          ========================================================================= */}
      <section 
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
          color: '#F4F1E8'
        }}
      >
        {/* Soft gold ambient glow (top right) - NO BLUE */}
        <div 
          className="absolute -top-24 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #E2B857 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17254A] border border-[#E2B857]/30 text-[#E2B857] text-xs font-semibold tracking-wider uppercase mb-5">
            <BookOpen className="w-4 h-4 text-[#E2B857]" />
            <span>Developer & Governance Documentation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4F1E8] mb-5 leading-tight">
            Resources & Documentation
          </h1>

          <p className="text-lg sm:text-xl text-[#D5DBEE] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Architectural guides, technical specifications, terminology glossaries, and integration resources for Verity.
          </p>

          {/* Segmented Tab Controls */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0A1226]/80 border border-[#E2B857]/30 backdrop-blur-md shadow-2xl max-w-full overflow-x-auto">
            {[
              { id: 'grid', label: 'Resource Grid' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'glossary', label: 'Plain Glossary' },
              { id: 'faq', label: 'FAQ Accordion' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm sm:text-[15px] font-semibold transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857] ${
                    isActive
                      ? 'bg-[#E2B857] text-[#0A1226] font-bold shadow-md'
                      : 'text-[#F4F1E8] hover:text-[#F3EAD3] hover:bg-white/5'
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
          SUB-TAB 1: RESOURCE GRID (Warm Ivory Band #FAF8F2)
          ========================================================================= */}
      {activeTab === 'grid' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Search Box */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A6A24] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={gridSearch}
                onChange={(e) => setGridSearch(e.target.value)}
                placeholder="Search guides, API docs, and benchmarks..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E6DDC8] text-sm text-[#14203D] placeholder-[#4A5675] shadow-sm focus:ring-2 focus:ring-[#8A6A24] focus:outline-none"
              />
            </div>
          </div>

          {/* Grid of 8 White Paper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={card.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E6DDC8] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] border border-[#E6DDC8] flex items-center justify-center text-[#8A6A24] mb-4 group-hover:bg-[#F3EAD3]/60 transition-colors">
                      <IconComp className="w-5 h-5 text-[#8A6A24]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6A24] font-sans block mb-1">
                      {card.readTime}
                    </span>
                    <h2 className="font-serif text-lg font-bold text-[#14203D] mb-2">
                      {card.title}
                    </h2>
                    <p className="text-xs text-[#4A5675] leading-relaxed mb-6 font-sans">
                      {card.line}
                    </p>
                  </div>

                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.isExternal ? '_blank' : '_self'}
                      rel={card.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A6A24] hover:text-[#14203D] transition-colors pt-3 border-t border-[#E6DDC8]/60"
                    >
                      <span>{card.actionLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={card.action}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A6A24] hover:text-[#14203D] transition-colors pt-3 border-t border-[#E6DDC8]/60 text-left outline-none"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12 text-[#4A5675]">
              <p>No resources found matching "{gridSearch}".</p>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          SUB-TAB 2: ARCHITECTURE (Soft Champagne Band #F3EAD3)
          ========================================================================= */}
      {activeTab === 'architecture' && (
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 text-[#14203D]"
          style={{ backgroundColor: '#F3EAD3' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A24]">
                Component Topology
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14203D] mt-1 mb-3">
                Full-Stack Architecture & Dataflow
              </h2>
              <p className="text-base text-[#4A5675] max-w-xl mx-auto font-sans">
                Five tightly integrated layers operating synchronously with deterministic-first precedence.
              </p>
            </div>

            {/* Five White Cards in a Row Connected by Thin Gold Arrow Line */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                {architectureSteps.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[#FFFFFF] rounded-2xl border border-[#E6DDC8] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-7 h-7 rounded-full bg-[#FAF8F2] border border-[#E6DDC8] flex items-center justify-center font-bold text-xs text-[#8A6A24]">
                            {item.step}
                          </span>
                          <IconComp className="w-4 h-4 text-[#8A6A24]" />
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#14203D] mb-1">
                          {item.title}
                        </h3>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-[#FAF8F2] border border-[#E6DDC8] text-[10px] font-semibold text-[#8A6A24] mb-3">
                          {item.pill}
                        </div>
                        <p className="text-xs text-[#4A5675] leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architectural Guarantees Box */}
            <div className="mt-12 bg-[#FFFFFF] rounded-2xl border border-[#E6DDC8] p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
              <h4 className="font-serif text-lg font-bold text-[#14203D] mb-3 text-center">
                Honest Architectural Guarantees
              </h4>
              <div className="space-y-2.5 text-xs text-[#4A5675] font-sans">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E9E78] mt-0.5 flex-shrink-0" />
                  <span><strong>Deterministic-first precedence:</strong> Layer 01 and Layer 02 evaluate rules and facts synchronously before any AI inference is triggered.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E9E78] mt-0.5 flex-shrink-0" />
                  <span><strong>Offline operational fallback:</strong> When operating without an external LLM API key, Verity operates with 100% precision using local regex and BM25 search.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E9E78] mt-0.5 flex-shrink-0" />
                  <span><strong>Cryptographic immutability:</strong> Approved drafts are sealed with an irreversible SHA-256 fingerprint; any post-approval modification invalidates the seal.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SUB-TAB 3: PLAIN GLOSSARY (Warm Ivory Band #FAF8F2)
          ========================================================================= */}
      {activeTab === 'glossary' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Glossary Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A6A24] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search definitions and governance concepts..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E6DDC8] text-sm text-[#14203D] placeholder-[#4A5675] shadow-sm focus:ring-2 focus:ring-[#8A6A24] focus:outline-none"
              />
            </div>
          </div>

          {/* Two-Column Grid of Plain Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGlossary.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E6DDC8] p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#E2B857]" />
                  <h3 className="font-serif text-lg font-bold text-[#14203D]">
                    {item.term}
                  </h3>
                </div>
                <p className="text-sm text-[#4A5675] leading-relaxed font-sans pl-4">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-[#4A5675]">
              <p>No glossary terms found matching "{glossarySearch}".</p>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          SUB-TAB 4: FAQ ACCORDION (Soft Champagne Band #F3EAD3)
          ========================================================================= */}
      {activeTab === 'faq' && (
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 text-[#14203D]"
          style={{ backgroundColor: '#F3EAD3' }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A24]">
                Frequently Asked Questions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14203D] mt-1 mb-3">
                Plain-Language Answers
              </h2>
              <p className="text-base text-[#4A5675] max-w-xl mx-auto font-sans">
                Everything you need to know about verification logic, security, and human approval authority.
              </p>
            </div>

            {/* Accordion List (One open at a time, keyboard accessible) */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#E6DDC8] overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A24]"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-base sm:text-lg font-bold text-[#14203D]">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#8A6A24] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#8A6A24] flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-[#4A5675] leading-relaxed border-t border-[#E6DDC8]/60 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          BOTTOM CALL TO ACTION (Navy to Midnight Blend)
          ========================================================================= */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8 text-center text-[#F4F1E8] relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #101B35 0%, #0A1226 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F1E8] mb-4">
            Ready to Explore the Platform?
          </h2>
          <p className="text-base text-[#D5DBEE] mb-8 font-sans">
            Jump into our interactive demo workspace or test your own campaign copy in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('dashboard');
              }}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-xl bg-[#E2B857] text-[#0A1226] font-bold text-base hover:brightness-105 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#0A1226]" />
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('how-it-works');
              }}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[44px] rounded-xl border border-[#E2B857]/70 text-[#F4F1E8] hover:bg-white/5 font-semibold text-base transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
