import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, 
  Sparkles, Layers, FileCheck, Eye, Lock, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';

export function LandingPage({ setActivePage }) {
  // Live Review Signature Animation State (14s loop)
  const [animStage, setAnimStage] = useState(0); 
  // 0: Typing draft, 1: Scanning, 2: Flagging violations, 3: Intent-preserving fix, 4: Approved stamp
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setAnimStage((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="bg-ivory text-ink">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-midnight text-ivory pt-20 pb-28 border-b border-navy-2">
        {/* Soft Aurora Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2B3A8F]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy border border-gold/40 text-xs font-semibold text-gold-light mb-6 shadow-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Intelligent Brand Governance for High-Trust Organisations</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Consistent. Compliant. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-champagne">
                Trustworthy.
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              VERITY checks content <span className="text-white font-medium">before publication</span> against your approved guidelines, facts, and visual identity. Every finding is evidence-linked, every correction preserves intent, and <strong className="text-gold">humans retain 100% final approval authority</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActivePage('new-review')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-midnight font-semibold shadow-glow transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Reviewing Content</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy hover:bg-navy-2 text-white border border-gray-700/60 font-medium transition-all"
              >
                Explore How It Works
              </button>
            </div>

          </div>

          {/* Signature Live Review Interactive Simulation Card */}
          <div 
            className="mt-16 max-w-3xl mx-auto bg-navy/90 rounded-2xl border border-gold/40 p-6 shadow-2xl backdrop-blur-sm cursor-pointer transition-all hover:border-gold"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-navy-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
                <span className="font-semibold text-gold-light tracking-wide uppercase">Live Analysis Simulation</span>
              </div>
              <span className="text-[11px] text-gray-400 italic">
                {isPaused ? 'Paused on hover' : 'Demonstration loop (Sample A)'}
              </span>
            </div>

            {/* Simulated Content Box */}
            <div className="relative min-h-[140px] p-5 rounded-xl bg-midnight/90 border border-gray-800 text-sm leading-relaxed font-sans overflow-hidden">
              
              {/* Scan Beam */}
              {animStage === 1 && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/15 to-transparent animate-shimmer pointer-events-none" />
              )}

              {/* Text states */}
              {animStage < 3 ? (
                <p className="text-gray-200">
                  Our platform{' '}
                  <span className={`${animStage >= 2 ? 'bg-coral/25 text-coral underline decoration-wavy px-1 rounded' : ''} transition-all`}>
                    guarantees 100% results
                  </span>{' '}
                  and is{' '}
                  <span className={`${animStage >= 2 ? 'bg-amber/25 text-amber-300 underline decoration-wavy px-1 rounded' : ''} transition-all`}>
                    the best learning platform in India!
                  </span>
                </p>
              ) : (
                <p className="text-gray-200">
                  Our platform{' '}
                  <span className="bg-teal/20 text-teal font-medium px-1 rounded">
                    supports online learning
                  </span>{' '}
                  with live and recorded classes for learners across India.
                </p>
              )}

              {/* Tooltip Badges on Stage 2 */}
              {animStage === 2 && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-coral/20 text-coral border border-coral/40 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Rule R2: Prohibited absolute claim</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber/20 text-amber-300 border border-amber/40 px-2 py-0.5 rounded">
                    <HelpCircle className="w-3 h-3" />
                    <span>Rule R3: No approved supporting evidence found.</span>
                  </span>
                </div>
              )}

              {/* Reviewer Stamp on Stage 4 */}
              {animStage === 4 && (
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-navy-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal/30 text-teal text-xs flex items-center justify-center font-bold">
                      EV
                    </div>
                    <span className="text-xs text-gray-300">Elena Vance (Senior Reviewer)</span>
                  </div>

                  <div className="px-3 py-1 rounded bg-teal/20 border-2 border-teal text-teal text-xs font-bold uppercase tracking-wider shadow-md transform rotate-[-2deg]">
                    ✓ Approved v2 (Hash: e7a9...)
                  </div>
                </div>
              )}

            </div>

            {/* Pipeline Stage Indicators */}
            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[11px]">
              {['1. Draft Submitted', '2. Engine Scan', '3. Evidence Linked', '4. Intent Fix', '5. Human Approval'].map((step, idx) => (
                <div 
                  key={idx}
                  className={`py-1 rounded border transition-all ${
                    animStage === idx ? 'bg-gold/20 border-gold text-gold font-bold' : 'border-gray-800 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-navy py-6 border-b border-navy-2 text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-serif text-2xl font-bold text-gold">3 Layers</p>
              <p className="text-xs text-gray-400 mt-1">Rules, Retrieval, Validated AI</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-teal">100%</p>
              <p className="text-xs text-gray-400 mt-1">Human Final Decision Authority</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-gold-light">0 Secrets</p>
              <p className="text-xs text-gray-400 mt-1">Exposed in Browser Client</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white">SHA-256</p>
              <p className="text-xs text-gray-400 mt-1">Version-Bound Audit Trails</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Named Improvements Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Round 2 Core Innovations</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2">
            The Three Pillars of Verity Governance
          </h2>
          <p className="text-sm text-gray-600 mt-3">
            Designed specifically for Inkloom's high-reliability governance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-5 font-serif font-bold text-xl">
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
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal flex items-center justify-center mb-5 font-serif font-bold text-xl">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">Intent-Preserving Corrections</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Corrections retain the creator's voice without inventing marketing claims. Shown in a side-by-side word diff where original copy is never overwritten.
              </p>
              <div className="p-3 bg-champagne/40 rounded-lg border border-gold/30 text-xs text-ink">
                Replaces prohibited absolute claims strictly with approved fact wording (e.g. F-01).
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-teal font-medium">
              <span>Creator accepts, edits, or rejects</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky/20 text-sky-800 flex items-center justify-center mb-5 font-serif font-bold text-xl">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">Adaptive Governance Insights</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Surfaces rules that authors frequently dismiss or challenge, flagging them as "Possibly Unclear" with guidance to clarify policy phrasing.
              </p>
              <div className="p-3 bg-mist rounded-lg border border-gray-200 text-xs text-ink">
                Telemetry guides policy team reviews without letting AI rewrite policy itself.
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-sky-800 font-medium">
              <span>Continuous governance refinement</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            </div>
          </div>

        </div>
      </section>

      {/* 5-Step Workflow Section */}
      <section id="how-it-works" className="py-20 bg-mist/50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">End-To-End Architecture</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2">
              How Content Moves Through Verity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Brand Setup', desc: 'Define approved voice, facts, terminology & upload PDF guidelines.' },
              { num: '02', title: 'Submit Copy', desc: 'Paste ad copy, email drafts, or upload documents for review.' },
              { num: '03', title: '3-Layer Engine', desc: 'Deterministic rules, fact retrieval, and validated AI analyze content.' },
              { num: '04', title: 'Intent Diff', desc: 'Review evidence-backed findings and accept side-by-side revisions.' },
              { num: '05', title: 'Human Sign-off', desc: 'Reviewer verifies and approves exact version hash. Fully audited.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative">
                <span className="font-serif text-2xl font-bold text-gold/40 block mb-2">{step.num}</span>
                <h4 className="font-bold text-ink text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Marquee */}
      <section className="py-14 bg-midnight text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">Universal Publication Support</p>
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
            <span key={i} className="px-4 py-2 rounded-xl bg-navy border border-gray-700/80 text-xs font-medium text-gray-200">
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-midnight via-navy to-midnight p-10 sm:p-14 rounded-3xl text-ivory border border-gold/40 shadow-2xl relative overflow-hidden">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to verify content with zero guesswork?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Explore the pre-loaded <strong>Verity Learning</strong> demonstration brand, test adversarial injection drafts, and experience the full review-to-approval workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActivePage('new-review')}
                className="px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold shadow-glow transition-all"
              >
                Launch New Review
              </button>
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-navy-2 hover:bg-navy text-white border border-gray-600 font-medium transition-all"
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
