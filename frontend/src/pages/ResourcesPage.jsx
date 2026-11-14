import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Code2, FileCode, Download, ExternalLink, 
  Sparkles, CheckCircle2, Shield, ArrowRight, HelpCircle
} from 'lucide-react';

export function ResourcesPage({ setActivePage }) {
  return (
    <div className="bg-[#060B1F] text-[#F5F1E6] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto text-center border-b border-[#18285A]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B3D] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-5">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>DOCUMENTATION & DEVELOPER PORTAL</span>
        </div>
        <h1 className="text-fluid-h1 font-serif font-bold text-white mb-4">
          Resources & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B]">Documentation</span>
        </h1>
        <p className="text-fluid-p text-[#9AA6C7] max-w-2xl mx-auto font-sans leading-relaxed">
          Technical specifications, integration guides, API endpoints, and architectural documentation for the VERITY brand governance platform.
        </p>
      </section>

      {/* 2. Resources Grid */}
      <section className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: API Reference */}
          <div className="verity-glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">FastAPI Interactive Docs</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed mb-4">
                Explore fully interactive OpenAPI Swagger UI documentation for all endpoints, including submission ingest, rule CRUD, review decisions, and insights.
              </p>
            </div>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors"
            >
              <span>Open Swagger API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Guidelines Schema */}
          <div className="verity-glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-4">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Guideline Parsers</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed mb-4">
                Learn how VERITY ingests unstructured corporate identity documents, extracting regex rules, approved facts, and color tokens from PDF and Word files.
              </p>
            </div>
            <button
              onClick={() => setActivePage('how-it-works')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors text-left"
            >
              <span>Explore Ingest Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Hackathon Disclosures */}
          <div className="verity-glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#111B3D] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Security & Disclosures</h3>
              <p className="text-xs text-[#9AA6C7] leading-relaxed mb-4">
                Review the responsible AI disclosures, tenant isolation guarantees, and cryptographic human authority design principles.
              </p>
            </div>
            <button
              onClick={() => setActivePage('trust-security')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3D98B] hover:text-white transition-colors text-left"
            >
              <span>Read Trust Whitepaper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Demo Workspace Reset & Evaluator Sandbox */}
        <div className="mt-12 verity-glass-card p-8 border-[#D4AF37]/50 bg-gradient-to-r from-[#111B3D]/90 to-[#0A1230]/90 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Hackathon Evaluator Quick-Start</h3>
            <p className="text-xs text-[#9AA6C7] max-w-xl">
              The live demo workspace is loaded with pre-configured rules for <em>Verity Learning</em>, including R1–R7 violations, sample PDF submissions, and audit metrics.
            </p>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-gold-sweep px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] text-[#060B1F] font-bold text-xs uppercase tracking-wider shrink-0 shadow-glow flex items-center gap-2"
          >
            <span>Open Demo Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#060B1F]" />
          </button>
        </div>

      </section>

    </div>
  );
}
