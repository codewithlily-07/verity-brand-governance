import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { BrandScanningBeam } from './BrandScanningBeam';
import { FindingMarker } from './FindingMarker';

/**
 * Frame 2: Document Materialisation & Live Scanner Canvas
 * Contains realistic document interface, channel metadata, AST content lines,
 * and integrated scanning laser / issue markers.
 */
export function DocumentMaterialisation({
  currentFrame = 2, // 1: emblem, 2: doc appears, 3: scan, 4: evidence, 5: correction, 6: approval
  hoveredIssueId = null,
  onHoverIssue,
  issues = [],
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-2xl bg-[#0B1428]/95 border border-gray-800/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden"
      style={{
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8), 0 0 20px rgba(198,161,91,0.1)',
      }}
    >
      {/* Scanning Laser Beam during Frame 3 */}
      <BrandScanningBeam active={currentFrame === 3} duration={2.0} />

      <div>
        {/* Document Header & Metadata Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-800/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#18285A] text-[#C6A15B] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-mono text-gray-200 font-semibold tracking-wide text-xs">
                Campaign: Spring Product Launch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#18285A] text-[#E6C77B] border border-[#C6A15B]/30">
              <Tag className="w-2.5 h-2.5" />
              <span>Advertisement</span>
            </span>
          </div>
        </div>

        {/* Campaign Title Line with Dynamic Draw */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Head Copy</span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
            Discover our latest solution and experience a better way to manage your workflow.
          </h3>
        </motion.div>

        {/* Body Text AST Paragraphs with 3 Flagged Issues */}
        <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-gray-300">
          
          {/* Paragraph 1: Terminology Mismatch (Rule R1) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-2.5 rounded-lg bg-[#101B35]/60 border border-gray-800/60 transition-colors"
          >
            <span>Welcome to the new standard from </span>
            <span
              className={`transition-all duration-300 px-1.5 py-0.5 rounded font-medium ${
                currentFrame >= 3
                  ? currentFrame >= 5
                    ? 'bg-teal/20 text-teal border border-teal/40 font-semibold'
                    : 'bg-amber/25 text-amber-300 border border-amber/40 underline decoration-wavy'
                  : 'text-white'
              } ${hoveredIssueId === 'issue-1' ? 'ring-2 ring-[#C6A15B] shadow-glow' : ''}`}
            >
              {currentFrame >= 5 ? 'Verity Learning' : 'Verity EdTech'}
            </span>
            <span>, empowering teams with automated governance across every channel.</span>

            {/* Finding Marker on Frame 3 & 4 */}
            {(currentFrame === 3 || currentFrame === 4) && (
              <div className="inline-block ml-2 align-middle">
                <FindingMarker
                  id="issue-1"
                  type="term"
                  ruleId="R1"
                  label="Terminology"
                  isHovered={hoveredIssueId === 'issue-1'}
                  onHover={onHoverIssue}
                />
              </div>
            )}
          </motion.div>

          {/* Paragraph 2: Unsupported Absolute Claim (Rule R2 & R3) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-2.5 rounded-lg bg-[#101B35]/60 border border-gray-800/60 transition-colors"
          >
            <span>Our intelligent platform </span>
            <span
              className={`transition-all duration-300 px-1.5 py-0.5 rounded font-medium ${
                currentFrame >= 3
                  ? currentFrame >= 5
                    ? 'bg-teal/20 text-teal border border-teal/40 font-semibold'
                    : 'bg-coral/25 text-coral border border-coral/40 underline decoration-wavy'
                  : 'text-white'
              } ${hoveredIssueId === 'issue-2' ? 'ring-2 ring-[#C6A15B] shadow-glow' : ''}`}
            >
              {currentFrame >= 5
                ? 'supports online workflow acceleration with verified team benchmarks'
                : 'guarantees 100% workflow speed gains for every single business'}
            </span>
            <span> with zero setup friction.</span>

            {/* Finding Marker on Frame 3 & 4 */}
            {(currentFrame === 3 || currentFrame === 4) && (
              <div className="inline-block ml-2 align-middle">
                <FindingMarker
                  id="issue-2"
                  type="claim"
                  ruleId="R2"
                  label="Unsupported Claim"
                  isHovered={hoveredIssueId === 'issue-2'}
                  onHover={onHoverIssue}
                />
              </div>
            )}
          </motion.div>

          {/* Paragraph 3: Hyperbolic Sales Tone (Rule R6) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-2.5 rounded-lg bg-[#101B35]/60 border border-gray-800/60 transition-colors"
          >
            <span>Sign up before the launch window closes to claim our </span>
            <span
              className={`transition-all duration-300 px-1.5 py-0.5 rounded font-medium ${
                currentFrame >= 3
                  ? currentFrame >= 5
                    ? 'bg-teal/20 text-teal border border-teal/40 font-semibold'
                    : 'bg-sky/25 text-sky-300 border border-sky/40 underline decoration-wavy'
                  : 'text-white'
              } ${hoveredIssueId === 'issue-3' ? 'ring-2 ring-[#C6A15B] shadow-glow' : ''}`}
            >
              {currentFrame >= 5
                ? 'standard institutional launch pricing'
                : 'insane crazy discount deal for everybody'}
            </span>
            <span> today.</span>

            {/* Finding Marker on Frame 3 & 4 */}
            {(currentFrame === 3 || currentFrame === 4) && (
              <div className="inline-block ml-2 align-middle">
                <FindingMarker
                  id="issue-3"
                  type="tone"
                  ruleId="R6"
                  label="Tone Breach"
                  isHovered={hoveredIssueId === 'issue-3'}
                  onHover={onHoverIssue}
                />
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Document Footer Status Bar */}
      <div className="mt-5 pt-3.5 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-teal" />
          <span>Status: {currentFrame >= 5 ? 'Ready for Human Approval' : currentFrame === 3 ? 'Analyzing Ast Tokens...' : '3 Findings Identified'}</span>
        </div>
        <span className="text-[10px] font-mono text-[#E6C77B]">
          Deterministic Engine L1-L3
        </span>
      </div>
    </motion.div>
  );
}

