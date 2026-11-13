import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, 
  FileText, ArrowRight, Zap, RefreshCw, Eye
} from 'lucide-react';

import { VerityParticleField } from './VerityParticleField';
import { VerityLogoReveal } from './VerityLogoReveal';
import { DocumentMaterialisation } from './DocumentMaterialisation';
import { BrandScanningBeam } from './BrandScanningBeam';
import { FindingMarker } from './FindingMarker';
import { EvidenceConnector } from './EvidenceConnector';
import { CorrectionTransition } from './CorrectionTransition';
import { ApprovalSeal } from './ApprovalSeal';
import { AnalysisReplayButton } from './AnalysisReplayButton';

const SAMPLE_ISSUES = [
  {
    id: 'issue-1',
    ruleId: 'Rule R1',
    ruleName: 'Canonical Brand Terminology',
    type: 'term',
    severity: 'medium',
    label: 'Terminology Mismatch',
    originalText: 'Verity EdTech',
    correctedText: 'Verity Learning',
    evidenceSnippet: 'Brand Guide §1.2: The corporate brand name is strictly "Verity Learning".',
    evidenceSource: 'Corporate Brand Guide §1.2',
    reason: 'Non-canonical brand variant used. Replace with approved corporate trademark.',
  },
  {
    id: 'issue-2',
    ruleId: 'Rule R2 & R3',
    ruleName: 'Unsupported Absolute Claim',
    type: 'claim',
    severity: 'high',
    label: 'Unsupported Claim',
    originalText: 'guarantees 100% workflow speed gains for every single business',
    correctedText: 'supports online workflow acceleration with verified team benchmarks',
    evidenceSnippet: 'Fact F-01: Verity Learning supports workflow acceleration; gains depend on implementation depth.',
    evidenceSource: 'Knowledge Vault Fact F-01',
    reason: 'Prohibited absolute guarantee with zero factual substantiation in knowledge vault.',
  },
  {
    id: 'issue-3',
    ruleId: 'Rule R6',
    ruleName: 'Editorial Voice & Tone',
    type: 'tone',
    severity: 'medium',
    label: 'Tone Inconsistency',
    originalText: 'insane crazy discount deal for everybody',
    correctedText: 'standard institutional launch pricing',
    evidenceSnippet: 'Voice Guide §4.1: Maintain an authoritative, respectful, and educational voice at all times.',
    evidenceSource: 'Editorial Style Guide §4.1',
    reason: 'Overly casual promotional slang breaches enterprise governance standard.',
  },
];

export function CinematicHeroExperience({ onNavigateReview, onNavigateDashboard }) {
  const prefersReduced = useReducedMotion();
  
  // 6 Frames:
  // 1: Brand Identity Formation (~1.8s)
  // 2: Document Appears (~2.0s)
  // 3: Intelligent Scanning (~2.2s)
  // 4: Evidence Citations (~2.5s)
  // 5: Morphing Corrections (~2.2s)
  // 6: Human Approval Seal (~2.2s)
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIssueId, setHoveredIssueId] = useState(null);

  // Subtle Mouse Parallax Tilt (restrained to ±3.5 degrees)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Math.max(-3.5, Math.min(3.5, yRel * -7)),
      y: Math.max(-3.5, Math.min(3.5, xRel * 7)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredIssueId(null);
  };

  // Frame Progression Timeline
  useEffect(() => {
    if (isPaused || prefersReduced) return;

    const frameDurations = {
      1: 2000, // Brand Identity
      2: 2200, // Document Appears
      3: 2400, // Scanning
      4: 2800, // Evidence
      5: 2600, // Correction
      6: 2800, // Human Approval
    };

    const duration = frameDurations[currentFrame] || 2500;
    const timer = setTimeout(() => {
      setCurrentFrame((prev) => (prev % 6) + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentFrame, isPaused, prefersReduced]);

  const handleReplay = () => {
    setCurrentFrame(1);
    setIsPaused(false);
    setHoveredIssueId(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl bg-[#0B1428]/95 border border-[#C6A15B]/40 shadow-2xl p-4 sm:p-6 backdrop-blur-xl overflow-hidden transition-transform duration-300 ease-out select-none"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px -5px rgba(198,161,91,0.2)',
      }}
    >
      {/* Background Animated Particle Field */}
      <VerityParticleField active={currentFrame === 1 || currentFrame === 3} density={28} />

      {/* Top Header Status Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A15B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A15B]" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-[#E6C77B] uppercase">
            LIVE GOVERNANCE ENGINE
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#18285A] text-gray-300 border border-gray-700">
            FRAME {currentFrame}/6
          </span>
        </div>

        <div className="text-xs font-mono text-gray-400">
          <span className="text-[#C6A15B] font-semibold">
            {currentFrame === 1 && 'Frame 1: Brand Identity'}
            {currentFrame === 2 && 'Frame 2: Document Ingestion'}
            {currentFrame === 3 && 'Frame 3: Intelligent Laser Scan'}
            {currentFrame === 4 && 'Frame 4: Grounded Evidence Citations'}
            {currentFrame === 5 && 'Frame 5: Intent-Preserving Corrections'}
            {currentFrame === 6 && 'Frame 6: Human Approval Sign-off'}
          </span>
        </div>
      </div>

      {/* Main Multi-Stage Cinematic Canvas */}
      <div className="relative z-10 min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
        
        {/* FRAME 1: Brand Identity Formation */}
        {currentFrame === 1 && (
          <motion.div
            key="frame-1"
            className="w-full flex items-center justify-center py-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <VerityLogoReveal visible={true} />
          </motion.div>
        )}

        {/* FRAMES 2, 3, 4, 5: Document Materialisation, Scanning, Evidence Panels, Corrections */}
        {(currentFrame >= 2 && currentFrame <= 5) && (
          <motion.div
            key="frame-doc-mode"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left: Document Panel (7 cols on lg, or full width on Frame 2) */}
            <div className={`${currentFrame >= 4 ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-500`}>
              <DocumentMaterialisation
                currentFrame={currentFrame}
                hoveredIssueId={hoveredIssueId}
                onHoverIssue={setHoveredIssueId}
                issues={SAMPLE_ISSUES}
              />
            </div>

            {/* Right: Three Evidence Panels entering on Frame 4 & 5 (5 cols on lg) */}
            {currentFrame >= 4 && (
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 flex flex-col justify-between space-y-2.5"
              >
                <div className="text-xs font-mono text-[#E6C77B] uppercase tracking-wider flex items-center justify-between pb-1 border-b border-gray-800">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Zap className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Evidence Citations</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-sans">
                    3 Rules Evaluated
                  </span>
                </div>

                {/* The 3 Evidence Panels */}
                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  {SAMPLE_ISSUES.map((issue) => (
                    <CorrectionTransition
                      key={issue.id}
                      item={issue}
                      isHighlighted={hoveredIssueId === issue.id}
                      onHover={setHoveredIssueId}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        )}

        {/* FRAME 6: Human Approval & Verification Seal */}
        {currentFrame === 6 && (
          <motion.div
            key="frame-6"
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
      <div className="relative z-10 mt-4">
        <AnalysisReplayButton
          currentStage={currentFrame - 1}
          setStage={(idx) => setCurrentFrame(idx + 1)}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onReplay={handleReplay}
        />
      </div>
    </div>
  );
}
