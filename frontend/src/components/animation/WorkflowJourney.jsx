import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, FileUp, Cpu, GitCompare, ShieldCheck, ChevronRight } from 'lucide-react';

export function WorkflowJourney() {
  const [activeStep, setActiveStep] = useState(2); // default to engine step

  const steps = [
    {
      num: '01',
      title: 'Brand Setup',
      icon: Settings,
      short: 'Guidelines Ingest',
      desc: 'Define approved voice, facts, terminology & upload PDF guidelines into tenant vault.',
      detail: 'Creates strict regex dictionaries, embedding vectors, and token prohibitions for tenant isolation.',
    },
    {
      num: '02',
      title: 'Submit Copy',
      icon: FileUp,
      short: 'Multi-Channel Input',
      desc: 'Paste ad copy, email drafts, or upload documents (PDF, DOCX) for pre-publication review.',
      detail: 'Extracts clean AST paragraphs, preserving layout metadata and author ownership.',
    },
    {
      num: '03',
      title: '3-Layer Engine',
      icon: Cpu,
      short: 'Tri-Tier Analysis',
      desc: 'Deterministic rules, fact retrieval, and validated AI analyze content with 0 hallucination.',
      detail: 'Scores compliance against R1-R6 rulesets, pulls exact corroborating fact citations.',
    },
    {
      num: '04',
      title: 'Intent Diff',
      icon: GitCompare,
      short: 'Side-by-Side Review',
      desc: 'Review evidence-backed findings and accept side-by-side revisions with word-level diffs.',
      detail: 'Protects creator tone while swapping prohibited phrases with verified fact statements.',
    },
    {
      num: '05',
      title: 'Human Sign-off',
      icon: ShieldCheck,
      short: 'Cryptographic Audit',
      desc: 'Reviewer verifies and approves exact version hash. Fully audited with SHA-256 seal.',
      detail: 'Persists immutable audit log with reviewer timestamp and exportable compliance certificates.',
    },
  ];

  return (
    <div className="w-full">
      {/* 5-Step Connected Progress Bar on desktop */}
      <div className="relative mb-8 hidden md:block">
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-gray-300 -z-0" />
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-[2px] bg-gold -z-0"
          animate={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        <div className="grid grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= activeStep;
            const isCurrent = idx === activeStep;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className="flex flex-col items-center group text-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gold text-midnight ring-4 ring-gold/25 shadow-glow scale-110'
                      : isCompleted
                      ? 'bg-navy text-gold-light'
                      : 'bg-white text-gray-400 border border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`font-mono text-xs font-bold mt-2 ${
                    isCurrent ? 'text-gold' : 'text-gray-500'
                  }`}
                >
                  {step.num}
                </span>
                <span
                  className={`text-xs font-semibold mt-0.5 ${
                    isCurrent ? 'text-ink font-bold' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              onClick={() => setActiveStep(idx)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-gold shadow-card-hover ring-1 ring-gold/40'
                  : 'bg-white/80 border-gray-200/90 shadow-sm hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-2xl font-bold text-gold/60">{step.num}</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-gold/20 text-gold' : 'bg-mist text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-ink text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.desc}</p>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-gold/20 text-[11px] text-gray-500 font-sans italic">
                  {step.detail}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

