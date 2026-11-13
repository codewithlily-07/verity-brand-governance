import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, Cpu, UserCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

/**
 * 4-Layer Architecture Diagram
 * - Layer 1: Brand Rules
 * - Layer 2: Evidence Retrieval
 * - Layer 3: AI Contextual Analysis
 * - Layer 4: Human Approval
 * Features animated connections between layers and telemetry inspection.
 */
export function FourLayersArchitecture() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 0,
      title: 'Layer 1: Brand Rules',
      subtitle: 'Deterministic Python regex & exact token filters',
      badge: 'Deterministic · <5ms',
      icon: ShieldCheck,
      color: '#C6A15B',
      description:
        'Executes strict organizational rules: prohibited absolute claims (R2), non-canonical company naming (R1), and blacklisted competitor terms. Runs deterministically with zero generative randomness.',
      specs: [
        { label: 'Evaluation Latency', val: '< 6 milliseconds' },
        { label: 'False Positive Rate', val: '0.0% on strict tokens' },
        { label: 'Rule Extensibility', val: 'Custom JSON/Regex schemas' },
      ],
      sampleOutput: 'Breach Detected: Prohibited term "guarantees 100%" matched Rule R2.',
    },
    {
      id: 1,
      title: 'Layer 2: Evidence Retrieval',
      subtitle: 'Vector semantic RAG against approved facts',
      badge: 'Evidence Bound · 100% Traceable',
      icon: Database,
      color: '#19A883',
      description:
        'Every factual claim in copy is matched against the organization’s verified fact repository. If no corroborating fact is verified, the claim is flagged with explicit citation: "No approved supporting evidence found."',
      specs: [
        { label: 'Fact Verification', val: 'Cosine threshold >= 0.78' },
        { label: 'Citation Type', val: 'Direct Knowledge Vault ID' },
        { label: 'Strictness', val: 'Blocks unsubstantiated statistics' },
      ],
      sampleOutput: 'Grounded Evidence: Fact F-01 retrieved (Confidence: 0.94).',
    },
    {
      id: 2,
      title: 'Layer 3: AI Contextual Analysis',
      subtitle: 'Grounded synthesis with temperature 0.0',
      badge: 'Zero Hallucination · Guarded',
      icon: Cpu,
      color: '#5B8DEF',
      description:
        'When brand rules or facts require copy revisions, Layer 3 generates intent-preserving suggestions. The model is constrained strictly to the verified fact text, preventing generative embellishments.',
      specs: [
        { label: 'Sampling Temperature', val: '0.0 (Deterministic)' },
        { label: 'Diff Output', val: 'Word-by-word AST replacement' },
        { label: 'Verification Hook', val: 'Cross-checked against Layer 1' },
      ],
      sampleOutput: 'Suggested Revision: Replaced claim with approved Fact F-01 wording.',
    },
    {
      id: 3,
      title: 'Layer 4: Human Approval',
      subtitle: 'Cryptographic sign-off & SHA-256 seal',
      badge: 'Final Authority · Audited',
      icon: UserCheck,
      color: '#E6C77B',
      description:
        'AI never publishes autonomously. Every review must conclude with human verification from authorized reviewers. Decisions are sealed with SHA-256 version hashes and full immutable audit trails.',
      specs: [
        { label: 'Approval Roles', val: 'Role-Based Access (Reviewer+)' },
        { label: 'Audit Binding', val: 'Immutable SHA-256 Hash' },
        { label: 'Compliance Export', val: 'Signed PDF/JSON Certificate' },
      ],
      sampleOutput: 'Audit Sealed: Approved by Elena Vance (Senior Reviewer) · Hash: e7a9f4c2...',
    },
  ];

  return (
    <div id="trust-security" className="w-full max-w-6xl mx-auto rounded-3xl bg-[#0B1428] border border-gray-800 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A15B]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E6C77B] font-bold">
          Four-Tier Defensive Architecture
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
          Engineered for Zero Guesswork
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          Deterministic rules, verified evidence retrieval, guarded AI contextual analysis, and mandatory human sign-off.
        </p>
      </div>

      {/* 4 Layer Connected Horizontal Step Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8 relative z-10">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#101B35] border-[#C6A15B] shadow-[0_0_20px_rgba(198,161,91,0.25)] ring-1 ring-[#C6A15B]'
                  : 'bg-[#101B35]/40 border-gray-800 hover:border-gray-700 hover:bg-[#101B35]/70'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#C6A15B] text-[#101B35]' : 'bg-[#18285A] text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#E6C77B] font-bold">
                  0{layer.id + 1}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-white mb-0.5">{layer.title}</h4>
              <p className="text-[11px] text-gray-400 line-clamp-1">{layer.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Active Layer Deep Dive Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-[#101B35]/90 rounded-2xl border border-gray-800 p-6 sm:p-8 relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#C6A15B]/15 text-[#E6C77B] border border-[#C6A15B]/40">
                  {layers[activeLayer].badge}
                </span>
              </div>
              <h4 className="font-serif text-2xl font-bold text-white mb-2">
                {layers[activeLayer].title}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                {layers[activeLayer].description}
              </p>

              {/* Sample output log */}
              <div className="p-3.5 rounded-lg bg-[#0B1428] border border-[#18285A] font-mono text-xs text-[#E6C77B] flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-teal animate-ping flex-shrink-0" />
                <span className="truncate">{layers[activeLayer].sampleOutput}</span>
              </div>
            </div>

            {/* Technical Specs Metric Column */}
            <div className="w-full lg:w-80 bg-[#0B1428] rounded-xl border border-gray-800 p-5 space-y-3.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-800">
                Layer Verification Metrics
              </div>
              {layers[activeLayer].specs.map((spec, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="font-mono text-[#E6C77B] font-semibold">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

