import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, Cpu, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export function ThreeLayersInteractive() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 0,
      title: 'Layer 1: Deterministic Brand Rules',
      subtitle: 'Instant Python regex & token matching',
      badge: 'Zero Hallucination · <5ms',
      icon: ShieldCheck,
      color: 'gold',
      borderColor: 'border-gold',
      bgColor: 'bg-gold/10',
      description:
        'Executes strict organizational rules: prohibited absolute claims (R2), non-canonical company naming (R1), and blacklisted competitor references. Runs deterministically with zero generative randomness.',
      specs: [
        { label: 'Evaluation Speed', val: '< 8 milliseconds' },
        { label: 'False Positive Target', val: '0.0% on strict terms' },
        { label: 'Rule Extensibility', val: 'Custom JSON/Regex schemas' },
      ],
      sampleOutput: 'Breach Detected: Prohibited term "guarantees 100%" matched Rule R2.',
    },
    {
      id: 1,
      title: 'Layer 2: Grounded Fact Retrieval',
      subtitle: 'Vector semantic RAG against approved facts',
      badge: 'Evidence Bound · 100% Traceable',
      icon: Database,
      color: 'teal',
      borderColor: 'border-teal',
      bgColor: 'bg-teal/10',
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
      title: 'Layer 3: Controlled AI Intent Diffing',
      subtitle: 'Grounded synthesis with temperature 0.0',
      badge: 'Human Guided · Audited',
      icon: Cpu,
      color: 'sky',
      borderColor: 'border-sky',
      bgColor: 'bg-sky/10',
      description:
        'When brand rules or facts require copy revisions, Layer 3 generates intent-preserving suggestions. The model is constrained strictly to the verified fact text, preventing generative embellishments.',
      specs: [
        { label: 'Sampling Temperature', val: '0.0 (Deterministic)' },
        { label: 'Diff Output', val: 'Word-by-word AST replacement' },
        { label: 'Final Authority', val: 'Human Reviewer Sign-off' },
      ],
      sampleOutput: 'Suggested Revision: Replaced claim with approved Fact F-01 wording.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-midnight border border-gray-800 p-6 sm:p-8 text-ivory shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <span className="text-xs font-mono uppercase tracking-wider text-gold-light">
          Three-Tier Defensive Architecture
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          How the 3-Layer Engine Verifies Content
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Combining deterministic rules, verified fact retrieval, and zero-hallucination AI synthesis.
        </p>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 relative z-10">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-navy border-gold shadow-[0_0_20px_rgba(200,163,90,0.2)]'
                  : 'bg-navy/40 border-gray-800 hover:border-gray-700 hover:bg-navy/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-gold text-midnight' : 'bg-navy-2 text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-gold-light uppercase">
                  L{layer.id + 1}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-white">{layer.title.split(':')[0]}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{layer.subtitle}</p>
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
          className="bg-navy/80 rounded-2xl border border-gray-800 p-6 sm:p-7 relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gold/15 text-gold-light border border-gold/40">
                  {layers[activeLayer].badge}
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-white mb-2">
                {layers[activeLayer].title}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                {layers[activeLayer].description}
              </p>

              {/* Sample output log */}
              <div className="p-3 rounded-lg bg-midnight/90 border border-navy-2 font-mono text-xs text-gold-light flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal animate-ping flex-shrink-0" />
                <span className="truncate">{layers[activeLayer].sampleOutput}</span>
              </div>
            </div>

            {/* Technical Specs Metric Column */}
            <div className="w-full lg:w-72 bg-midnight/80 rounded-xl border border-gray-800 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-800">
                Performance Telemetry
              </div>
              {layers[activeLayer].specs.map((spec, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="font-mono text-gold-light font-medium">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

