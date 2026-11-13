import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, FileUp, Cpu, GitCompare, ShieldCheck } from 'lucide-react';

/**
 * 5-Step Connected Workflow Journey
 * 01 Brand Setup
 * 02 Content Submission
 * 03 Intelligent Analysis
 * 04 Evidence and Corrections
 * 05 Human Approval
 * Connected with animated gold line as active step changes.
 */
export function WorkflowJourney() {
  const [activeStep, setActiveStep] = useState(2); // default to Intelligent Analysis

  const steps = [
    {
      num: '01',
      title: 'Brand Setup',
      icon: Settings,
      desc: 'Define approved voice, canonical terminology, prohibited claims, and upload guideline documents.',
      detail: 'Compiles tenant-isolated regex dictionaries, vector fact embeddings, and editorial tone guidelines.',
    },
    {
      num: '02',
      title: 'Content Submission',
      icon: FileUp,
      desc: 'Paste social copy, ad headlines, email drafts, or upload documents (PDF, DOCX) for pre-publication screening.',
      detail: 'Extracts clean AST paragraphs, preserving layout metadata and author provenance.',
    },
    {
      num: '03',
      title: 'Intelligent Analysis',
      icon: Cpu,
      desc: '3-Layer defensive engine scans draft tokens, flags violations, and queries fact store with zero hallucination.',
      detail: 'Executes deterministic rule verification (L1) and vector semantic retrieval (L2) in under 12ms.',
    },
    {
      num: '04',
      title: 'Evidence & Corrections',
      icon: GitCompare,
      desc: 'Review evidence-backed findings and accept side-by-side revisions with word-level diffs.',
      detail: 'Preserves creator intent while replacing prohibited claims with approved fact citations.',
    },
    {
      num: '05',
      title: 'Human Approval',
      icon: ShieldCheck,
      desc: 'Reviewer verifies and approves exact version hash. Fully audited with SHA-256 seal.',
      detail: 'Binds immutable sign-off authority to user credentials and generates verifiable PDF compliance reports.',
    },
  ];

  return (
    <div id="how-it-works" className="w-full">
      {/* 5-Step Connected Progress Bar on desktop */}
      <div className="relative mb-10 hidden md:block">
        <div className="absolute top-6 left-12 right-12 h-[2px] bg-gray-200 -z-0" />
        <motion.div
          className="absolute top-6 left-12 h-[2px] bg-[#C6A15B] -z-0"
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
                      ? 'bg-[#C6A15B] text-[#101B35] ring-4 ring-[#C6A15B]/30 shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-[#101B35] text-[#E6C77B]'
                      : 'bg-white text-gray-400 border border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`font-mono text-xs font-bold mt-2.5 ${
                    isCurrent ? 'text-[#C6A15B]' : 'text-gray-500'
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
                  ? 'bg-white border-[#C6A15B] shadow-card-hover ring-1 ring-[#C6A15B]/50'
                  : 'bg-white/80 border-gray-200/90 shadow-sm hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-2xl font-bold text-[#C6A15B]/70">{step.num}</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#C6A15B]/20 text-[#C6A15B]' : 'bg-mist text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-ink text-sm mb-1.5">{step.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.desc}</p>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2.5 border-t border-[#C6A15B]/20 text-[11px] text-gray-500 font-sans italic">
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
