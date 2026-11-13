import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, 
  HelpCircle, FileText, ArrowRight, Zap, RefreshCw, Eye
} from 'lucide-react';

import { VerityParticleField } from './VerityParticleField';
import { VerityLogoReveal } from './VerityLogoReveal';
import { BrandScanningBeam } from './BrandScanningBeam';
import { FindingMarker } from './FindingMarker';
import { EvidenceConnector } from './EvidenceConnector';
import { CorrectionTransition } from './CorrectionTransition';
import { ApprovalSeal } from './ApprovalSeal';
import { AnalysisReplayButton } from './AnalysisReplayButton';

const SAMPLE_ISSUES = [
  {
    id: 'issue-1',
    ruleId: 'R1',
    ruleName: 'Canonical Brand Terminology',
    type: 'term',
    severity: 'medium',
    label: 'Brand Mismatch',
    originalText: 'Verity EdTech',
    correctedText: 'Verity Learning',
    evidenceSnippet: 'Brand Guide §1.2: The corporate brand name is strictly "Verity Learning".',
    evidenceSource: 'Inkloom Brand Manual §1.2',
    reason: 'Non-canonical brand name variant detected. Must reflect verified corporate naming standard.',
    offsetPercent: 28,
  },
  {
    id: 'issue-2',
    ruleId: 'R2 & R3',
    ruleName: 'Unsupported Absolute Claim',
    type: 'claim',
    severity: 'high',
    label: 'Prohibited Claim',
    originalText: 'guarantees 100% test outcomes for every single student',
    correctedText: 'supports online preparation with verified curriculum and live mentorship',
    evidenceSnippet: 'Fact F-01: Verity Learning provides structured preparation; outcomes depend on student engagement.',
    evidenceSource: 'Grounded Fact Store F-01',
    reason: 'Prohibited absolute outcome guarantee with zero approved supporting evidence in knowledge base.',
    offsetPercent: 54,
  },
  {
    id: 'issue-3',
    ruleId: 'R6',
    ruleName: 'Voice & Tone Consistency',
    type: 'tone',
    severity: 'medium',
    label: 'Hyperbolic Slang',
    originalText: 'super crazy discount deal',
    correctedText: 'transparent institutional pricing',
    evidenceSnippet: 'Voice Guide §4.1: Maintain an authoritative, respectful, and educational voice at all times.',
    evidenceSource: 'Editorial Style Guide §4.1',
    reason: 'Overly casual promotional slang breaches enterprise governance standard.',
    offsetPercent: 78,
  },
];

export function CinematicHeroExperience({ onNavigateReview, onNavigateDashboard }) {
  const prefersReduced = useReducedMotion();
  const [currentStage, setCurrentStage] = useState(0); 
  // Stages:
  // 0: Brand Emblem Formation (1.6s)
  // 1: Document Materialisation (2.0s)
  // 2: Intelligent Scanning (2.2s)
  // 3: Evidence & Intent-Preserving Corrections (2.5s)
  // 4: Human Review & Approval Seal (2.0s)

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIssueId, setHoveredIssueId] = useState(null);

  // Subtle Mouse Parallax Tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Math.max(-4, Math.min(4, yRel * -8)), // Tilt on X axis from Y movement
      y: Math.max(-4, Math.min(4, xRel * 8)),  // Tilt on Y axis from X movement
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredIssueId(null);
  };

  // Stage Progression Timeline
  useEffect(() => {
    if (isPaused || prefersReduced) return;

    const stageDurations = [2000, 2400, 2600, 3000, 2600];
    const duration = stageDurations[currentStage] || 2500;

    const timer = setTimeout(() => {
      setCurrentStage((prev) => (prev + 1) % 5);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStage, isPaused, prefersReduced]);

  const handleReplay = () => {
    setCurrentStage(0);
    setIsPaused(false);
    setHoveredIssueId(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-navy/90 border border-gold/40 shadow-2xl p-5 sm:p-7 backdrop-blur-xl overflow-hidden transition-transform duration-300 ease-out select-none"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        boxShadow: '0 20px 60px -15px rgba(10, 17, 40, 0.9), 0 0 35px -5px rgba(200, 163, 90, 0.25)',
      }}
    >
      {/* Background Animated Particle Dust */}
      <VerityParticleField active={currentStage === 0 || currentStage === 2} density={32} />

      {/* Decorative Top Bar Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-navy-2/90">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-gold-light uppercase">
            VERITY REASONING SIMULATOR
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-navy-2 text-gray-300 border border-gray-700">
            SHA-256 v2.4
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-mono text-[11px] text-gold/90">
            {currentStage === 0 && 'Phase 1: Emblem Formation'}
            {currentStage === 1 && 'Phase 2: Document Ingestion'}
            {currentStage === 2 && 'Phase 3: Multi-Layer Scan'}
            {currentStage === 3 && 'Phase 4: Fact Grounding & Diff'}
            {currentStage === 4 && 'Phase 5: Human Sign-Off'}
          </span>
        </div>
      </div>

      {/* Main Multi-Stage Cinematic Canvas */}
      <div className="relative z-10 min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
        
        {/* SCENE 1: Brand Emblem Formation */}
        {currentStage === 0 && (
          <motion.div
            key="scene-1"
            className="w-full flex items-center justify-center py-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <VerityLogoReveal visible={true} />
          </motion.div>
        )}

        {/* SCENES 2, 3, 4: Document Materialisation, Intelligent Scanning, Evidence & Diff */}
        {(currentStage === 1 || currentStage === 2 || currentStage === 3) && (
          <motion.div
            key="scene-doc"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left: Document Panel (7 cols on lg) */}
            <div className="lg:col-span-7 relative bg-midnight/95 rounded-2xl border border-gray-800/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between overflow-hidden">
              
              {/* Intelligent Scanning Laser Beam on Stage 2 */}
              <BrandScanningBeam active={currentStage === 2} duration={2.2} />

              {/* Document Header Tag */}
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gold" />
                    <span className="font-mono text-gray-300 font-semibold uppercase tracking-wider">
                      Ad_Campaign_Q3_Draft.md
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy text-gold-light border border-gold/30">
                    Channel: Social & Search
                  </span>
                </div>

                {/* Campaign Headline */}
                <h4 className="font-serif text-lg font-bold text-white mb-3">
                  Next-Gen Learning Launch Campaign
                </h4>

                {/* Document Body Lines with Highlighted Violations */}
                <div className="space-y-3.5 text-xs sm:text-sm font-sans leading-relaxed text-gray-200">
                  {/* Line 1: Terminology */}
                  <div className="relative group">
                    <span>Welcome to the new era with </span>
                    <span
                      className={`transition-all duration-300 px-1.5 py-0.5 rounded ${
                        currentStage >= 2
                          ? currentStage === 3
                            ? 'bg-teal/20 text-teal font-medium border border-teal/40'
                            : 'bg-amber/25 text-amber-300 border border-amber/40 underline decoration-wavy'
                          : 'text-white'
                      } ${hoveredIssueId === 'issue-1' ? 'ring-2 ring-gold' : ''}`}
                    >
                      {currentStage === 3 ? 'Verity Learning' : 'Verity EdTech'}
                    </span>
                    <span>, designed to empower every modern educator.</span>

                    {/* Finding Marker on Stage 2 */}
                    {currentStage === 2 && (
                      <div className="inline-block ml-2 align-middle">
                        <FindingMarker
                          id="issue-1"
                          type="term"
                          ruleId="R1"
                          label="Naming"
                          isHovered={hoveredIssueId === 'issue-1'}
                          onHover={setHoveredIssueId}
                        />
                      </div>
                    )}
                  </div>

                  {/* Line 2: Absolute Claim */}
                  <div className="relative group">
                    <span>Our flagship platform </span>
                    <span
                      className={`transition-all duration-300 px-1.5 py-0.5 rounded ${
                        currentStage >= 2
                          ? currentStage === 3
                            ? 'bg-teal/20 text-teal font-medium border border-teal/40'
                            : 'bg-coral/25 text-coral border border-coral/40 underline decoration-wavy'
                          : 'text-white'
                      } ${hoveredIssueId === 'issue-2' ? 'ring-2 ring-gold' : ''}`}
                    >
                      {currentStage === 3
                        ? 'supports online preparation with verified curriculum and live mentorship'
                        : 'guarantees 100% test outcomes for every single student'}
                    </span>
                    <span> nationwide.</span>

                    {/* Finding Marker on Stage 2 */}
                    {currentStage === 2 && (
                      <div className="inline-block ml-2 align-middle">
                        <FindingMarker
                          id="issue-2"
                          type="claim"
                          ruleId="R2"
                          label="Absolute"
                          isHovered={hoveredIssueId === 'issue-2'}
                          onHover={setHoveredIssueId}
                        />
                      </div>
                    )}
                  </div>

                  {/* Line 3: Casual Tone Slang */}
                  <div className="relative group">
                    <span>Sign up today to unlock our </span>
                    <span
                      className={`transition-all duration-300 px-1.5 py-0.5 rounded ${
                        currentStage >= 2
                          ? currentStage === 3
                            ? 'bg-teal/20 text-teal font-medium border border-teal/40'
                            : 'bg-sky/25 text-sky-300 border border-sky/40 underline decoration-wavy'
                          : 'text-white'
                      } ${hoveredIssueId === 'issue-3' ? 'ring-2 ring-gold' : ''}`}
                    >
                      {currentStage === 3
                        ? 'transparent institutional pricing'
                        : 'super crazy discount deal'}
                    </span>
                    <span> before the upcoming quarter begins.</span>

                    {/* Finding Marker on Stage 2 */}
                    {currentStage === 2 && (
                      <div className="inline-block ml-2 align-middle">
                        <FindingMarker
                          id="issue-3"
                          type="tone"
                          ruleId="R6"
                          label="Tone"
                          isHovered={hoveredIssueId === 'issue-3'}
                          onHover={setHoveredIssueId}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Footer Status */}
              <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-teal" />
                  <span>3 Findings · 0 Unresolved Conflicts</span>
                </div>
                <span className="text-[10px] text-gold-light italic">
                  {currentStage === 1 && 'Ingesting document text...'}
                  {currentStage === 2 && '3 Breaches identified by Layer 1 & 2'}
                  {currentStage === 3 && 'Intent-preserving diff synthesized'}
                </span>
              </div>
            </div>

            {/* Right: Evidence Cards Panel (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="text-xs font-mono text-gold-light uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gold" />
                  <span>Governance Citations</span>
                </span>
                <span className="text-[10px] text-gray-400 font-sans">
                  {currentStage === 1 ? 'Standby...' : 'Active Grounding'}
                </span>
              </div>

              {/* Cards for each issue */}
              <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                {currentStage === 1 && (
                  <div className="h-full min-h-[220px] rounded-xl border border-dashed border-gray-800 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                    <FileText className="w-8 h-8 text-gray-600 mb-2 animate-bounce" />
                    <p className="text-xs font-mono">Parsing draft AST structure...</p>
                    <p className="text-[10px] text-gray-500 mt-1">Applying Inkloom governance ruleset</p>
                  </div>
                )}

                {(currentStage === 2 || currentStage === 3) && (
                  SAMPLE_ISSUES.map((issue) => (
                    <CorrectionTransition
                      key={issue.id}
                      item={issue}
                      isHighlighted={hoveredIssueId === issue.id}
                      onHover={setHoveredIssueId}
                    />
                  ))
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* SCENE 5: Human Approval Verification Seal */}
        {currentStage === 4 && (
          <motion.div
            key="scene-5"
            className="w-full flex items-center justify-center py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5 }}
          >
            <ApprovalSeal onReplay={handleReplay} />
          </motion.div>
        )}

      </div>

      {/* Interactive Control Toolbar */}
      <AnalysisReplayButton
        currentStage={currentStage}
        setStage={setCurrentStage}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onReplay={handleReplay}
      />
    </div>
  );
}

