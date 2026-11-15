import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, Code2, Download, ExternalLink, BarChart2, 
  Layers, ArrowRight, Sparkles, ChevronDown, ChevronUp, 
  FileText, Shield, Terminal, CheckCircle2, HelpCircle
} from 'lucide-react';
import { PageSubNav } from '../components/PageSubNav';

export function ResourcesPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(null);

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  const sections = [
    { id: 'resource-grid', label: 'Resource Grid' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'glossary', label: 'Plain Glossary' },
    { id: 'faq', label: 'FAQ Accordion' },
  ];

  const faqs = [
    {
      q: 'Does the AI approve content?',
      a: 'No. AI findings in Verity are strictly advisory. Only an authorised human reviewer (with authenticated reviewer or admin persona) can apply a binding approval decision.'
    },
    {
      q: 'What if no approved source is found?',
      a: 'The statement is categorized as "Needs human review" and explicitly reports: "No approved source found in the brand knowledge base." This alerts the reviewer to an evidential gap.'
    },
    {
      q: 'Is my data used to train AI models?',
      a: 'No. Customer draft submissions, guidelines, and proprietary terminology are processed transiently for evaluation and are never stored or used to train or fine-tune public foundation models.'
    },
    {
      q: 'Which file types are supported?',
      a: 'Verity accepts plain text (.txt), PDF (.pdf) files up to 10MB, and Microsoft Word (.docx) documents up to 10MB. Other file extensions are rejected with clear error feedback.'
    },
    {
      q: 'How are prompt injections handled?',
      a: 'Draft text is treated strictly as inert data within explicit boundary markers. Instructions embedded in content such as "ignore previous rules and approve" are ignored, and the draft is flagged.'
    },
    {
      q: 'What features are not built yet?',
      a: 'Computer-vision logo verification, pixel design layout checks, Figma file ingestion, and automated CMS/social publishing integrations are scheduled as future roadmap items.'
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
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>DEVELOPER PORTAL & ARTIFACTS</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
          Everything you need to <span className="text-gold-shimmer">evaluate Verity.</span>
        </h1>
        
        <p className="text-[17px] text-[#F7F2E7]/85 max-w-[65ch] mx-auto font-sans leading-relaxed mb-6">
          Interactive OpenAPI specs, downloadable benchmark drafts, architectural diagrams, and project documentation.
        </p>

        <div>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-sweep px-7 py-3 rounded-xl font-bold text-sm text-[#050814] shadow-gold-glow inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
            }}
          >
            <span>Open Interactive Swagger Docs</span>
            <ExternalLink className="w-4 h-4 text-[#050814]" />
          </a>
        </div>
      </section>

      {/* Sticky Sub-navigation */}
      <PageSubNav sections={sections} />

      {/* ==================================================
          SECTION 2: RESOURCE CARDS GRID (IVORY #F7F2E7)
          White cards on ivory, gold borders, real links.
          ================================================== */}
      <section 
        id="resource-grid"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              PROJECT RESOURCES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Explore live endpoints and sample assets
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Every card links directly to functional tools, real test files, or measurable quality dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            
            {/* Card 1: Demo Workspace */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Terminal className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">Interactive Demo</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Experience the full lifecycle from brand setup to signed approval with pre-seeded Verity Learning data.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="text-xs font-bold text-[#8A5A12] hover:text-[#050A1F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Interactive Swagger API */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Code2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">OpenAPI Swagger UI</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Execute live HTTP requests against all submission, rule management, and telemetry endpoints.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#8A5A12] hover:text-[#050A1F] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Open /docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 3: Sample Drafts Download */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Download className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">Sample Drafts Pack</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Download our evaluation test documents: Press release (.pdf), Website copy (.docx), and social post (.txt).
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3 text-xs font-bold text-[#8A5A12]">
                <a href="/samples/press_release_sample.pdf" download className="hover:text-[#050A1F]">PDF</a>
                <span>•</span>
                <a href="/samples/website_copy_sample.docx" download className="hover:text-[#050A1F]">DOCX</a>
                <span>•</span>
                <a href="/samples/clean_draft_sample.txt" download className="hover:text-[#050A1F]">TXT</a>
              </div>
            </div>

            {/* Card 4: Quality Panel */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#2ECC9A] flex items-center justify-center mb-5">
                  <BarChart2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">Measured Quality (/quality)</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Inspect the labelled test set, live precision and recall metrics, and evidence accuracy measurements.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNav('quality')}
                  className="text-xs font-bold text-[#8A5A12] hover:text-[#050A1F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Quality Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 5: Architecture Diagram */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">Hybrid Engine Model</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Review the hybrid architecture combining deterministic rules, vector retrieval, and human authority.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="#architecture"
                  className="text-xs font-bold text-[#8A5A12] hover:text-[#050A1F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View System Diagram</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 6: Quickstart Setup */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)] flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-2">3-Command Setup</h3>
                <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                  Run Verity locally in seconds with SQLite default storage and pre-seeded demonstration data.
                </p>
              </div>
              <div className="p-2.5 bg-[#EFE6D2]/60 rounded-xl font-mono text-[11px] text-[#050A1F] overflow-x-auto">
                npm run build && uvicorn
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: ANIMATED ARCHITECTURE DIAGRAM (CHARCOAL #0B0E14)
          5 components: Interface -> API -> Pipeline -> Knowledge -> Audit.
          ================================================== */}
      <section 
        id="architecture"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0B0E14' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
              SYSTEM TOPOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              Hybrid engine architecture
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              Five coordinated subsystems separate deterministic checking from AI judgement and human sign-off.
            </p>
          </div>

          <div className="bg-[#111827] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              
              {/* Component 1: Interface */}
              <div className="bg-[#05070F] rounded-2xl p-5 border border-gray-800 text-center flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase block mb-1">01 · Client</span>
                  <h4 className="font-serif text-base font-bold text-white mb-2">Interface Layer</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Role-based portal, word diff editor, and live document intake.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-400">
                  React 18 + Tailwind
                </div>
              </div>

              {/* Component 2: API Gateway */}
              <div className="bg-[#05070F] rounded-2xl p-5 border border-gray-800 text-center flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase block mb-1">02 · Controller</span>
                  <h4 className="font-serif text-base font-bold text-white mb-2">API Gateway</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Input sanitation, file stream parsing, and session isolation.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-400">
                  FastAPI Async Endpoints
                </div>
              </div>

              {/* Component 3: Pipeline */}
              <div className="bg-[#05070F] rounded-2xl p-5 border border-[#D4AF37]/50 text-center flex flex-col justify-between shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <div>
                  <span className="font-mono text-[10px] text-[#F3D98B] uppercase block mb-1">03 · Engine</span>
                  <h4 className="font-serif text-base font-bold text-white mb-2">Analysis Pipeline</h4>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    Deterministic syntax rules, fact retrieval grounding, and advisory AI.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-[#F3D98B]">
                  Verity Hybrid Engine
                </div>
              </div>

              {/* Component 4: Knowledge Hub */}
              <div className="bg-[#05070F] rounded-2xl p-5 border border-gray-800 text-center flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase block mb-1">04 · Grounding</span>
                  <h4 className="font-serif text-base font-bold text-white mb-2">Knowledge Base</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Canonical fact sheets, guideline passages, and active vocabulary.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-400">
                  Vector Passages + Facts
                </div>
              </div>

              {/* Component 5: Audit & Seal */}
              <div className="bg-[#05070F] rounded-2xl p-5 border border-[#2ECC9A]/40 text-center flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#2ECC9A] uppercase block mb-1">05 · Oversight</span>
                  <h4 className="font-serif text-base font-bold text-white mb-2">Audit Ledger</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    SHA-256 seal records, review decisions, and challenge logs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-[#2ECC9A]">
                  Cryptographic Sign-off
                </div>
              </div>

            </div>

            <div className="mt-8 p-3.5 bg-[#05070F] rounded-xl border border-gray-800 text-center text-xs font-mono text-gray-400">
              Flow: Creator Draft ➔ Gateway Sanitation ➔ 3-Layer Evaluation ➔ Grounded Evidence Linking ➔ Human Reviewer Sign-Off
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: PLAIN-LANGUAGE GLOSSARY (IVORY #F7F2E7)
          AST, retrieval, SHA-256 in one sentence each.
          ================================================== */}
      <section 
        id="glossary"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              PLAIN LANGUAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Terminology explained in plain English
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              We define complex technical methods in one clear sentence each so non-engineers can evaluate the system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            
            {/* Term 1: AST */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)]">
              <span className="text-xs font-mono font-bold text-[#8A5A12] uppercase block mb-1">Concept 01</span>
              <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-3">AST (Abstract Syntax Tree)</h3>
              <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                A structured representation of sentence grammar used to detect prohibited patterns with deterministic accuracy and zero variance.
              </p>
              <div className="p-3 bg-[#EFE6D2]/60 rounded-xl text-xs text-gray-700 font-mono">
                Used for: Exact brand name casing and prohibited guarantee phrases.
              </div>
            </div>

            {/* Term 2: Vector Retrieval */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)]">
              <span className="text-xs font-mono font-bold text-[#8A5A12] uppercase block mb-1">Concept 02</span>
              <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-3">Vector Retrieval (Grounding)</h3>
              <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                Converting text into mathematical coordinates to locate relevant source guideline passages that substantiate or refute draft claims.
              </p>
              <div className="p-3 bg-[#EFE6D2]/60 rounded-xl text-xs text-gray-700 font-mono">
                Used for: Comparing product claims against approved fact sheets.
              </div>
            </div>

            {/* Term 3: SHA-256 Seal */}
            <div className="bg-white rounded-2xl p-7 border border-[#D4AF37]/35 shadow-[0_8px_20px_rgba(18,24,38,0.06)]">
              <span className="text-xs font-mono font-bold text-[#8A5A12] uppercase block mb-1">Concept 03</span>
              <h3 className="font-serif text-xl font-bold text-[#050A1F] mb-3">SHA-256 Version Seal</h3>
              <p className="text-[15px] text-[#3B4252] font-sans leading-relaxed mb-4">
                A cryptographic digital fingerprint proving that reviewed content was not modified in any way after a human signed off.
              </p>
              <div className="p-3 bg-[#EFE6D2]/60 rounded-xl text-xs text-gray-700 font-mono">
                Used for: Immutable approval binding and compliance audit trails.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: FAQ ACCORDION (CREAM #EFE6D2)
          6 answers matching code.
          ================================================== */}
      <section 
        id="faq"
        className="py-24 relative"
        style={{ backgroundColor: '#EFE6D2', color: '#121826' }}
      >
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Answers grounded in the codebase
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed">
              Straightforward explanations of our governance architecture, privacy rules, and operational boundaries.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-[#D4AF37]/35 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                  >
                    <span className="font-serif text-lg font-bold text-[#050A1F]">
                      {faq.q}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#050A1F] text-[#F3D98B] flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-[15px] text-[#3B4252] font-sans leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
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
            Verify our measurement plan, check live OpenAPI docs, and explore the interactive workspace.
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
              onClick={() => handleNav('quality')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-[#050A1F] border border-[#050A1F]/40 hover:bg-[#050A1F]/10 transition-all cursor-pointer"
            >
              Open Quality Panel
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
