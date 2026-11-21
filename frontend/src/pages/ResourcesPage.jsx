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
      line: 'A step-by-step walkthrough of the review centre, comments, and cryptographic seals.',
      readTime: '6 min read',
      icon: CheckCircle2,
      action: () => setActivePage && setActivePage('review'),
      actionLabel: 'Inspect Review Gate'
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      line: 'Interactive Swagger UI with OpenAPI schemas for all 18 endpoints.',
      readTime: 'Interactive docs',
      icon: Code2,
      href: '/docs',
      isExternal: true,
      actionLabel: 'Open Swagger UI'
    },
    {
      id: 'openapi-spec',
      title: 'OpenAPI Specification',
      line: 'Raw JSON specification for automated client generation and schema validation.',
      readTime: 'JSON file',
      icon: Terminal,
      href: '/openapi.json',
      isExternal: true,
      actionLabel: 'Download Spec'
    },
    {
      id: 'benchmark-data',
      title: 'Labelled Benchmark Dataset',
      line: 'Ground-truth benchmark of 4 drafts with 11 planted issues across marketing channels.',
      readTime: 'Quality corpus',
      icon: BarChart2,
      action: () => setActivePage && setActivePage('quality'),
      actionLabel: 'View Benchmark'
    },
    {
      id: 'architecture-guide',
      title: 'Architecture & Security',
      line: 'Multi-layer governance topology, credential boundaries, and threat matrix.',
      readTime: '7 min read',
      icon: Layers,
      action: () => setActiveTab('architecture'),
      actionLabel: 'Read Architecture'
    }
  ];

  const filteredCards = resourceCards.filter(c => 
    c.title.toLowerCase().includes(gridSearch.toLowerCase()) ||
    c.line.toLowerCase().includes(gridSearch.toLowerCase())
  );

  const architectureSteps = [
    {
      step: '1',
      title: 'React Single Page App',
      pill: 'Client Tier',
      description: 'Zero API keys in client JavaScript. Responsive, keyboard-accessible SPA built with Vite and Tailwind.',
      icon: Terminal
    },
    {
      step: '2',
      title: 'FastAPI Backend',
      pill: 'API Server',
      description: 'Pydantic validation, SQLite relational persistence, and streaming upload endpoints.',
      icon: Cpu
    },
    {
      step: '3',
      title: 'Deterministic Engine',
      pill: 'Layer 01 & 02',
      description: 'Instant sub-15ms regex compilation, vocabulary mapping, and local BM25 keyword search.',
      icon: Hash
    },
    {
      step: '4',
      title: 'Validated AI Advisory',
      pill: 'Layer 03',
      description: 'Temperature 0.0 with strict quote grounding. Gracefully bypassed when offline or unconfigured.',
      icon: Sparkles
    },
    {
      step: '5',
      title: 'Human Review Gate',
      pill: 'Layer 04',
      description: 'Authorised human sign-off with SHA-256 cryptographic seal binding approved content.',
      icon: Lock
    }
  ];

  const glossaryTerms = [
    {
      term: 'Approved Fact',
      definition: 'A verified corporate assertion stored in the Brand Hub (for example, "Verity Learning supports online learning"). Used to ground marketing copy against authoritative evidence.'
    },
    {
      term: 'Brand Rule',
      definition: 'An explicit deterministic rule configured by administrators (e.g. banning absolute guarantees or unverified superlatives) that evaluates instantaneously on draft intake.'
    },
    {
      term: 'Evidence Citation',
      definition: 'The approved guideline passage or corporate fact linked directly to a flagged finding, proving why a phrase was flagged.'
    },
    {
      term: 'Gold Refinement',
      definition: 'The visual transformation where flagged phrasing warms to amber and refines into verified copy, avoiding punitive strike-through lines.'
    },
    {
      term: 'Intent-Preserving Diff',
      definition: 'A side-by-side wording correction generated by word-level token alignment that corrects non-compliant phrases while preserving the author’s message.'
    },
    {
      term: 'Tamper-Evident Seal',
      definition: 'An irreversible SHA-256 cryptographic hash generated upon reviewer sign-off, mathematically binding the exact version text, author, reviewer, and timestamp.'
    },
    {
      term: 'Lock Version',
      definition: 'An integer counter incremented on every submission update to enforce optimistic concurrency control and prevent conflicting simultaneous approvals.'
    },
    {
      term: 'Advisory Finding',
      definition: 'An issue surfaced by Layer 03 (AI Review) regarding tone or nuance. Strictly advisory; human review is required before publishing.'
    }
  ];

  const filteredGlossary = glossaryTerms.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const faqs = [
    {
      q: 'Does Verity train foundation models on our uploaded drafts?',
      a: 'No. Customer draft copy and proprietary brand guidelines are processed transiently and are never transmitted to public model training pipelines or fine-tuning datasets.'
    },
    {
      q: 'Can Verity operate completely offline without external AI keys?',
      a: 'Yes. Layer 01 (Brand Rules) and Layer 02 (Evidence Check) are 100% deterministic and execute locally on the server in under 15 milliseconds. If no Gemini API key is configured, Layer 03 is gracefully skipped without errors.'
    },
    {
      q: 'What happens if two reviewers approve a draft at the exact same moment?',
      a: 'Verity implements strict optimistic concurrency control. Each draft carries an integer lock_version. If concurrent modifications collide, the server rejects the conflicting request with HTTP 409 Conflict.'
    },
    {
      q: 'How are file uploads handled safely against malicious inputs?',
      a: 'Uploads are strictly capped at 10MB and whitelisted to .pdf, .docx, and .txt. Document text is extracted via PyMuPDF and python-docx, wrapped in inert delimiters, and treated strictly as passive data.'
    },
    {
      q: 'Who can approve releases for publication?',
      a: 'Only users holding the "Authorised Reviewer" or "Brand Administrator" persona can approve drafts or authorize compliance overrides. Content Creators can draft, run reviews, and apply fixes, but are strictly prohibited from approving their own releases.'
    }
  ];

  return (
    <div className="w-full bg-[#FAF8F2] text-[#14203D] min-h-screen">

      {/* =========================================================================
          HERO SECTION: Warm Ivory Background #FAF7F0
          ========================================================================= */}
      <section 
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-[#E3DCCB]"
        style={{
          backgroundColor: '#FAF7F0',
          color: '#14213D'
        }}
      >
        {/* Soft gold ambient glow (top right) */}
        <div 
          className="absolute -top-24 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C9A24B 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-[#8A6A24] text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
            <BookOpen className="w-4 h-4 text-[#B8862B]" />
            <span>Developer & Governance Documentation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#14213D] mb-5 leading-tight">
            Resources & <span className="text-[#B8862B]">Documentation</span>
          </h1>

          <p className="text-[17px] sm:text-xl text-[#3F4A5F] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Architectural guides, technical specifications, terminology glossaries, and integration resources for Verity.
          </p>

          {/* Sub-Tab Bar */}
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#E3DCCB] backdrop-blur-md shadow-md max-w-full overflow-x-auto min-h-[44px]">
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
                  className={`px-5 py-2.5 min-h-[44px] rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap outline-none focus:outline-none focus:ring-2 focus:ring-[#C9A24B] cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A24B] text-[#14213D] font-bold shadow-md'
                      : 'text-[#3F4A5F] hover:text-[#14213D] hover:bg-[#F1ECE0]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
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
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E2B857]/30 text-sm text-[#14203D] placeholder-[#4A5675] shadow-sm focus:ring-2 focus:ring-[#E2B857] focus:outline-none"
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
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#101B35] text-[#E2B857] flex items-center justify-center mb-4 shadow-sm">
                      <IconComp className="w-5 h-5 text-[#E2B857]" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-[#8A6A24] font-sans block mb-1">
                      {card.readTime}
                    </span>
                    <h2 className="font-serif text-lg font-bold text-[#14203D] mb-2">
                      {card.title}
                    </h2>
                    <p className="text-sm text-[#4A5675] leading-relaxed mb-6 font-sans">
                      {card.line}
                    </p>
                  </div>

                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.isExternal ? '_blank' : '_self'}
                      rel={card.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8A6A24] hover:text-[#14203D] transition-colors pt-3 border-t border-[#F3EAD3]"
                    >
                      <span>{card.actionLabel}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={card.action}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8A6A24] hover:text-[#14203D] transition-colors pt-3 border-t border-[#F3EAD3] text-left outline-none cursor-pointer"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12 text-[#4A5675] text-sm font-medium">
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
              <span className="text-sm font-semibold uppercase tracking-wider text-[#8A6A24]">
                Component Topology
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14203D] mt-1 mb-3">
                Full-Stack Architecture & Dataflow
              </h2>
              <p className="text-[17px] text-[#4A5675] max-w-xl mx-auto font-sans">
                Five tightly integrated layers operating synchronously with deterministic-first precedence.
              </p>
            </div>

            {/* Five White Cards in a Row */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                {architectureSteps.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-8 h-8 rounded-full bg-[#101B35] text-[#E2B857] flex items-center justify-center font-bold text-sm">
                            {item.step}
                          </span>
                          <IconComp className="w-5 h-5 text-[#8A6A24]" />
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#14203D] mb-1">
                          {item.title}
                        </h3>
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3EAD3]/70 border border-[#E2B857]/30 text-sm font-semibold text-[#8A6A24] mb-3">
                          {item.pill}
                        </div>
                        <p className="text-sm text-[#4A5675] leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architectural Guarantees Box */}
            <div className="mt-12 bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
              <h4 className="font-serif text-lg font-bold text-[#14203D] mb-3 text-center">
                Honest Architectural Guarantees
              </h4>
              <div className="space-y-3 text-sm text-[#4A5675] font-sans">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#065F46] mt-0.5 flex-shrink-0" />
                  <span><strong className="text-[#14203D]">Deterministic-first precedence:</strong> Layer 01 and Layer 02 evaluate rules and facts synchronously before any AI inference is triggered.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#065F46] mt-0.5 flex-shrink-0" />
                  <span><strong className="text-[#14203D]">Offline operational fallback:</strong> When operating without an external LLM API key, Verity operates with 100% precision using local regex and BM25 search.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#065F46] mt-0.5 flex-shrink-0" />
                  <span><strong className="text-[#14203D]">Tamper-evident immutability:</strong> Approved drafts are sealed with an irreversible SHA-256 fingerprint; any post-approval modification invalidates the seal.</span>
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
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E2B857]/30 text-sm text-[#14203D] placeholder-[#4A5675] shadow-sm focus:ring-2 focus:ring-[#E2B857] focus:outline-none"
              />
            </div>
          </div>

          {/* Two-Column Grid of Plain Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGlossary.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2B857]" />
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
            <div className="text-center py-12 text-[#4A5675] text-sm font-medium">
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
              <span className="text-sm font-semibold uppercase tracking-wider text-[#8A6A24]">
                Frequently Asked Questions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14203D] mt-1 mb-3">
                Plain-Language Answers
              </h2>
              <p className="text-[17px] text-[#4A5675] max-w-xl mx-auto font-sans">
                Everything you need to know about verification logic, security, and human approval authority.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 outline-none focus:outline-none focus:ring-2 focus:ring-[#E2B857] cursor-pointer"
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
                      <div className="px-6 pb-6 pt-1 text-sm text-[#4A5675] leading-relaxed border-t border-[#F3EAD3] font-sans">
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
          BOTTOM CALL TO ACTION (Warm Sand #F1ECE0)
          ========================================================================= */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8 text-center text-[#14213D] relative overflow-hidden bg-[#F1ECE0] border-t border-[#E3DCCB]"
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14213D] mb-4">
            Ready to Explore the Platform?
          </h2>
          <p className="text-[17px] text-[#3F4A5F] mb-8 font-sans">
            Jump into our interactive demo workspace or test your own campaign copy in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('dashboard');
              }}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-xl bg-[#C9A24B] text-[#14213D] font-bold text-sm hover:bg-[#B8862B] hover:text-white active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#14213D]" />
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActivePage('how-it-works');
              }}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[44px] rounded-xl border border-[#14213D] bg-white text-[#14213D] hover:bg-[#FAF7F0] font-semibold text-sm transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
