import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

/**
 * Problem Section: The Cost of Unchecked Content
 * Staggered cards demonstrating real-world brand risks (hallucinations, naming chaos, compliance fines)
 * and an animated visual bridge connecting problem to Verity solution.
 */
export function ProblemSection() {
  const problems = [
    {
      id: 1,
      title: 'Hallucinated AI Claims',
      icon: AlertTriangle,
      tag: 'Liability Risk',
      severity: 'High',
      tagColor: 'bg-coral/15 text-coral border-coral/30',
      description:
        'Generative tools invent statistics, absolute guarantees, and unverifiable benchmarks without factual grounding in corporate knowledge.',
      example: '"Guarantees 100% outcomes with zero risk"',
      verityFix: 'Strict fact retrieval flags uncorroborated claims with exact Knowledge Vault citations.',
    },
    {
      id: 2,
      title: 'Brand Naming Drift',
      icon: ShieldAlert,
      tag: 'Brand Dilution',
      severity: 'Medium',
      tagColor: 'bg-amber/15 text-amber-400 border-amber/30',
      description:
        'Decentralized teams and marketing agencies produce inconsistent company names, outdated product titles, and unapproved slogans.',
      example: '"Verity EdTech" instead of "Verity Learning"',
      verityFix: 'Deterministic AST matching forces canonical registered trademark naming standards.',
    },
    {
      id: 3,
      title: 'Hyperbolic Sales Tone',
      icon: Zap,
      tag: 'Regulatory Threat',
      severity: 'High',
      tagColor: 'bg-coral/15 text-coral border-coral/30',
      description:
        'Aggressive hype copy and informal slang breach consumer protection standards and degrade institutional brand trust.',
      example: '"Insane crazy limited-time fire sale"',
      verityFix: 'Intent-preserving synthesis swaps promotional slang for authoritative institutional voice.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#0B1428] text-white border-y border-[#18285A] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-coral/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#C6A15B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/15 border border-coral/30 text-xs font-mono font-semibold text-coral mb-4"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">The Pre-Publication Dilemma</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
          >
            The High Cost of Unchecked Content
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-300 mt-4 leading-relaxed max-w-2xl mx-auto"
          >
            When publication velocity outpaces manual review, brands face compliance penalties, public corrections, and eroded consumer trust.
          </motion.p>
        </div>

        {/* 3 Sequential Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-[#101B35]/90 border border-gray-800 p-6 flex flex-col justify-between shadow-xl hover:border-[#C6A15B]/50 transition-all group backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#18285A] text-coral flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${prob.tagColor}`}>
                      {prob.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {prob.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                    {prob.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[#0B1428] border border-gray-800/80 text-xs font-mono text-coral/90 mb-4 line-through decoration-coral/60">
                    {prob.example}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-start gap-2 text-xs text-[#E6C77B]">
                  <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                  <span className="font-sans leading-tight">{prob.verityFix}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Animated Transition from Chaos to Verity Governance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#18285A]/80 via-[#101B35] to-[#18285A]/80 border border-[#C6A15B]/40 shadow-glow flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left backdrop-blur-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C6A15B] text-[#101B35] flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">
                Deterministic Protection Before Content Goes Live
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-lg">
                VERITY replaces subjective proofreading with verifiable rules, grounded fact retrieval, and human sign-off authority.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#C6A15B]/20 border border-[#C6A15B] text-[#E6C77B] text-xs font-mono font-bold tracking-wider uppercase">
              0% Hallucinations
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
