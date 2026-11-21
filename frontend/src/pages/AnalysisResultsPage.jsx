import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight,
  Layers, RefreshCw, ThumbsUp, Edit3, XCircle, Flag, Download,
  ChevronDown, ChevronUp, FileText, BarChart2, Sparkles, Undo2,
  CheckCheck, AlertCircle, X
} from 'lucide-react';
import { getSubmissionDetail, updateFindingStatus, getSubmissions } from '../lib/api';
import { VerdictBadge, SeverityBadge } from '../components/VerdictBadge';
import { GoldRefineWord } from '../components/animation/GoldRefineWord';

export function AnalysisResultsPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [activeTab, setActiveTab] = useState('findings'); // findings | ledger
  const [loading, setLoading] = useState(true);
  const [expandedFinding, setExpandedFinding] = useState(null);
  const [acceptingFindingId, setAcceptingFindingId] = useState(null);

  // Apply all safe fixes & undo state
  const [showSafeFixModal, setShowSafeFixModal] = useState(false);
  const [applyingSafeFixes, setApplyingSafeFixes] = useState(false);
  const [undoToast, setUndoToast] = useState(null); // { findingIds: [], timerId }

  const undoTimeoutRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      let targetId = submissionId;
      if (!targetId) {
        targetId = sessionStorage.getItem('verity_last_submission_id');
      }
      if (!targetId) {
        const subs = await getSubmissions();
        if (subs && subs.length > 0) {
          targetId = subs[0].id;
        }
      }

      if (!targetId) {
        setLoading(false);
        setDetail(null);
        return;
      }

      const [subData, scoreRes, ledgerRes] = await Promise.all([
        getSubmissionDetail(targetId),
        fetch(`/api/submissions/${targetId}/score`).then(r => r.json()).catch(() => null),
        fetch(`/api/submissions/${targetId}/ledger`).then(r => r.json()).catch(() => [])
      ]);
      setDetail(subData);
      setScoreData(scoreRes);
      setLedgerData(ledgerRes || []);
    } catch (err) {
      console.error('Error loading analysis details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, [submissionId]);

  const handleAction = async (findingId, status, extra = {}) => {
    try {
      await updateFindingStatus(findingId, {
        status,
        decided_by: role === 'reviewer' ? 'Elena Vance' : 'Creator User',
        ...extra
      });
      await loadData();
    } catch (err) {
      alert('Error updating finding: ' + err.message);
    }
  };

  const handleAcceptCorrection = async (finding) => {
    setAcceptingFindingId(finding.id);
    setTimeout(async () => {
      await handleAction(finding.id, 'accepted');
      setAcceptingFindingId(null);
    }, 450);
  };

  // Safe fixes: findings that have suggested replacements and are unresolved
  const latestVersion = detail?.versions ? detail.versions[detail.versions.length - 1] : null;
  const findings = latestVersion?.analysis_run?.findings || [];
  const safeFixes = findings.filter(
    (f) => f.suggested_replacement && !['accepted', 'edited', 'dismissed'].includes(f.status)
  );

  const handleApplyAllSafeFixes = async () => {
    if (safeFixes.length === 0 || applyingSafeFixes) return;
    setApplyingSafeFixes(true);
    const appliedIds = safeFixes.map(f => f.id);

    try {
      await Promise.all(
        appliedIds.map(id =>
          updateFindingStatus(id, {
            status: 'accepted',
            decided_by: role === 'reviewer' ? 'Elena Vance' : 'Creator User'
          })
        )
      );

      setShowSafeFixModal(false);
      await loadData();

      // Show Undo Toast for 8 seconds
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      setUndoToast({ findingIds: appliedIds, count: appliedIds.length });
      undoTimeoutRef.current = setTimeout(() => {
        setUndoToast(null);
      }, 8000);
    } catch (err) {
      alert('Error applying safe fixes: ' + err.message);
    } finally {
      setApplyingSafeFixes(false);
    }
  };

  const handleUndoSafeFixes = async () => {
    if (!undoToast) return;
    const { findingIds } = undoToast;
    setUndoToast(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    try {
      await Promise.all(
        findingIds.map(id =>
          updateFindingStatus(id, {
            status: 'pending',
            decided_by: role === 'reviewer' ? 'Elena Vance' : 'Creator User'
          })
        )
      );
      await loadData();
    } catch (err) {
      alert('Error undoing fixes: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-[#5B6478]">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full mb-3" />
        <p>Loading analysis findings & evidence grounding...</p>
      </div>
    );
  }

  if (!detail || !latestVersion) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E6DDC8] mx-auto flex items-center justify-center text-[#8A6A00] mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1230] mb-2">No Analysis Selected</h2>
        <p className="text-sm text-[#5B6478] mb-6">
          Submit a new draft or select an existing draft from your dashboard to view findings.
        </p>
        <button
          onClick={() => setActivePage('new-review')}
          className="px-5 py-2.5 rounded-xl bg-[#0A1230] text-[#D4AF37] text-xs font-bold hover:bg-[#0A1230]/90 transition-all shadow-sm cursor-pointer"
        >
          Submit New Review
        </button>
      </div>
    );
  }

  const run = latestVersion?.analysis_run;
  const modeFlags = run?.mode_flags || {};

  const total = findings.length;
  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;
  const resolved = findings.filter(f => ['accepted', 'edited', 'dismissed'].includes(f.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Undo Toast */}
      {undoToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1230] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#D4AF37]/50 flex items-center gap-3 animate-slideUp text-xs">
          <CheckCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Applied <strong>{undoToast.count} safe fixes</strong> successfully.</span>
          <button
            type="button"
            onClick={handleUndoSafeFixes}
            className="ml-2 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#0A1230] font-bold hover:bg-[#F3D98B] transition-colors flex items-center gap-1"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => setUndoToast(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6DDC8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A00]">Analysis Run Results</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#FAF8F3] border border-[#E6DDC8] text-[#0A1230]">v{latestVersion.version_number}</span>
            <span className="text-xs text-[#5B6478] font-mono">Hash: {latestVersion.content_hash?.slice(0, 8)}...</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A1230] mt-1">{detail.title}</h1>
          <p className="text-xs text-[#5B6478] mt-0.5">Author: <strong className="text-[#0A1230]">{detail.author_name}</strong> • Status: <span className="capitalize font-semibold text-[#0A1230]">{detail.status}</span></p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export PDF Button */}
          <a
            href={`/api/submissions/${detail.id}/report.pdf`}
            download
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E6DDC8] hover:bg-[#FAF8F3] text-[#0A1230] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>Export PDF Report</span>
          </a>

          <button
            onClick={() => setActivePage('correction')}
            className="px-4 py-2 rounded-xl bg-[#0A1230] text-[#D4AF37] text-xs font-bold hover:bg-[#0A1230]/90 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Open Correction Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('review')}
            className="px-3.5 py-2 rounded-xl bg-[#0A1230] text-white hover:bg-[#0A1230]/80 text-xs font-semibold transition-all"
          >
            <span>Review Sign-off</span>
          </button>
        </div>
      </div>

      {/* Engine Layer Status Badges Strip */}
      <div className="bg-white rounded-xl border border-[#E6DDC8] p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#8A6A00]" />
          <span className="font-semibold text-[#0A1230]">Pipeline Engine Layers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#065F46]/10 text-[#065F46] font-medium border border-[#065F46]/25">
            <span className="w-2 h-2 rounded-full bg-[#065F46]" />
            <span>Layer 1: Rules Engine (Active)</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0369A1]/10 text-[#0369A1] font-medium border border-[#0369A1]/25">
            <span className="w-2 h-2 rounded-full bg-[#0369A1]" />
            <span>Layer 2: Fact Retrieval (Active)</span>
          </span>

          {modeFlags.ai === 'ok' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#065F46]/10 text-[#065F46] font-medium border border-[#065F46]/25">
              <span className="w-2 h-2 rounded-full bg-[#065F46]" />
              <span>Layer 3: AI Context (Validated)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F3] text-[#5B6478] font-medium border border-[#E6DDC8]" title="Graceful fallback active">
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
              <span>AI layer unavailable. Rule-based & retrieval checks ran.</span>
            </span>
          )}
        </div>

        <div className="text-[#5B6478] font-mono text-[11px]">
          Duration: {run?.duration_ms || 120}ms
        </div>
      </div>

      {/* Brand Compliance Score Highlight Card */}
      {scoreData && (
        <div className="bg-white rounded-2xl border border-[#D4AF37]/50 p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0A1230] to-[#14214D] text-[#FAF8F3] flex flex-col items-center justify-center shadow-sm border border-[#D4AF37]/40">
              <span className="font-serif text-2xl font-bold text-[#D4AF37]">{scoreData.overall_score}</span>
              <span className="text-[10px] text-gray-300 font-semibold">GRADE {scoreData.grade}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A00]">Transparent Evaluation</span>
              <h3 className="font-serif text-lg font-bold text-[#0A1230]">Brand Compliance Score</h3>
              <p className="text-xs text-[#5B6478] mt-0.5">{scoreData.summary}</p>
              <span className="text-[10px] text-[#5B6478] font-mono mt-1 block">
                Formula: {scoreData.formula}
              </span>
            </div>
          </div>

          {/* Component Score Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {Object.entries(scoreData.components || {}).map(([name, c]) => (
              <div key={name} className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E6DDC8]">
                <span className="text-[10px] text-[#5B6478] block uppercase font-medium">{name}</span>
                <span className="font-serif font-bold text-[#0A1230] text-sm mt-0.5 block">{c.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: Findings vs Evidence Ledger */}
      <div className="flex gap-2 border-b border-[#E6DDC8] mb-6 pb-2">
        <button
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'findings' ? 'bg-[#0A1230] text-[#FAF8F3] shadow-sm' : 'text-[#5B6478] hover:text-[#0A1230]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Findings & Issues ({total})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ledger' ? 'bg-[#0A1230] text-[#FAF8F3] shadow-sm' : 'text-[#5B6478] hover:text-[#0A1230]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Claim Evidence Ledger ({ledgerData.length})</span>
        </button>
      </div>

      {/* TAB 1: FINDINGS */}
      {activeTab === 'findings' && (
        <div className="space-y-6">
          
          {/* Summary counters and Apply All Safe Fixes Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-grow max-w-xl">
              <div className="bg-white rounded-xl p-3 border border-[#DC2626]/30 shadow-sm text-center">
                <span className="text-[11px] font-semibold text-[#DC2626] uppercase flex items-center justify-center gap-1">
                  ▲ High
                </span>
                <p className="font-serif text-2xl font-bold text-[#DC2626] mt-0.5">{high}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#B45309]/30 shadow-sm text-center">
                <span className="text-[11px] font-semibold text-[#B45309] uppercase flex items-center justify-center gap-1">
                  ◆ Medium
                </span>
                <p className="font-serif text-2xl font-bold text-[#B45309] mt-0.5">{medium}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#0369A1]/30 shadow-sm text-center">
                <span className="text-[11px] font-semibold text-[#0369A1] uppercase flex items-center justify-center gap-1">
                  ● Low
                </span>
                <p className="font-serif text-2xl font-bold text-[#0369A1] mt-0.5">{low}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#065F46]/30 shadow-sm text-center">
                <span className="text-[11px] font-semibold text-[#065F46] uppercase">Resolved</span>
                <p className="font-serif text-2xl font-bold text-[#065F46] mt-0.5">{resolved}</p>
              </div>
            </div>

            {/* Apply All Safe Fixes Button */}
            {safeFixes.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSafeFixModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#065F46] text-white hover:bg-[#065F46]/90 font-bold text-xs shadow-sm flex items-center gap-2 transition-all self-start sm:self-center"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Apply All Safe Fixes ({safeFixes.length})</span>
              </button>
            )}
          </div>

          {/* Content Annotated Text Box */}
          <div className="bg-white rounded-2xl border border-[#E6DDC8] p-6 shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#0A1230] mb-2">Reviewed Content Copy</h3>
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-sm leading-relaxed text-[#0A1230] whitespace-pre-wrap font-sans">
              {latestVersion.content}
            </div>
          </div>

          {/* Findings Cards */}
          {findings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#065F46]/40 p-8 text-center shadow-sm">
              <CheckCircle className="w-10 h-10 text-[#065F46] mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-[#0A1230] mb-1">Zero Violations Detected</h4>
              <p className="text-xs text-[#5B6478] max-w-md mx-auto">
                Content complies fully with brand guidelines and verified facts.
              </p>
            </div>
          ) : (
            findings.map((f) => {
              const isResolved = ['accepted', 'edited', 'dismissed'].includes(f.status);
              const evidence = f.evidence || {};
              const isNoEvidence = evidence.text === "No approved supporting evidence found.";
              const isExpanded = expandedFinding === f.id;

              return (
                <div
                  key={f.id}
                  className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                    isResolved 
                      ? 'border-[#065F46]/30 bg-[#F0FDF4]/70' 
                      : f.severity === 'high' 
                      ? 'border-[#DC2626]/40 shadow-sm' 
                      : 'border-[#E6DDC8]'
                  }`}
                >
                  {/* Finding Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={f.severity} />
                      <VerdictBadge verdict={f.verdict} />
                      {f.rule_id && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {f.rule_id}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isResolved ? (
                        <span className="text-xs font-medium text-[#065F46] capitalize px-2 py-0.5 rounded bg-[#065F46]/15 font-bold">
                          ✓ {f.status}
                        </span>
                      ) : (
                        <span className="text-xs text-[#DC2626] font-medium">Unresolved</span>
                      )}
                    </div>
                  </div>

                  {/* Title & Quoted Span with Gold Refinement */}
                  <h4 className="font-bold text-[#0A1230] text-base mb-1">{f.title}</h4>
                  <div className="my-2 p-2.5 bg-[#FAF8F3] rounded-lg border border-[#E6DDC8] font-mono text-xs text-[#0A1230]">
                    <span className="text-[#5B6478] font-sans block text-[10px] mb-0.5">Flagged Text Quote:</span>
                    {acceptingFindingId === f.id ? (
                      <GoldRefineWord
                        originalText={f.quote}
                        correctedText={f.suggested_replacement || ''}
                        isRefining={true}
                        durationMs={450}
                        isLightBackground={true}
                      />
                    ) : isResolved && f.suggested_replacement ? (
                      <span className="text-[#065F46] font-semibold">"{f.suggested_replacement}"</span>
                    ) : (
                      <span>"{f.quote}"</span>
                    )}
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-[#2B3345] leading-relaxed mb-4">{f.explanation}</p>

                  {/* Evidence Grounding */}
                  <div className={`p-4 rounded-xl border mb-4 text-xs ${
                    isNoEvidence ? 'bg-[#FEF3C7]/40 border-[#B45309]/30 text-[#92400E]' : 'bg-[#FAF8F3] border-[#D4AF37]/40 text-[#0A1230]'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#8A6A00]" />
                      <span>Grounding Evidence:</span>
                      {evidence.fact_id && (
                        <span className="font-mono text-[10px] bg-[#D4AF37]/20 px-1.5 py-0.2 rounded text-[#0A1230]">
                          Fact {evidence.fact_id}
                        </span>
                      )}
                    </div>

                    <p className="font-sans leading-relaxed italic">
                      {evidence.text || "No approved supporting evidence found."}
                    </p>

                    {evidence.source && (
                      <span className="text-[11px] text-[#5B6478] block mt-1">
                        Source documentation: {evidence.source}
                      </span>
                    )}
                  </div>

                  {/* Intent-Preserving Replacement */}
                  {f.suggested_replacement && (
                    <div className="p-3 bg-[#065F46]/10 rounded-xl border border-[#065F46]/30 mb-4 text-xs">
                      <span className="font-semibold text-[#065F46] block mb-1">
                        Intent-Preserving Correction Suggestion:
                      </span>
                      <p className="font-medium text-[#0A1230]">"{f.suggested_replacement}"</p>
                      {f.rationale && (
                        <span className="text-[11px] text-[#5B6478] block mt-1">
                          Rationale: {f.rationale}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expandable "Why was this flagged?" */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setExpandedFinding(isExpanded ? null : f.id)}
                      className="text-xs text-[#8A6A00] hover:text-[#0A1230] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Why was this flagged?</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-xs space-y-2 text-[#2B3345] animate-fadeIn">
                        <div>
                          <strong className="block text-[#0A1230]">1. Detection Rationale:</strong>
                          <span>{f.explanation}</span>
                        </div>
                        <div>
                          <strong className="block text-[#0A1230]">2. Guideline Rule Citation:</strong>
                          <span>{f.rule_text || f.rule_id}</span>
                        </div>
                        <div>
                          <strong className="block text-[#0A1230]">3. Intent Preservation Guarantee:</strong>
                          <span>Correction strictly reuses original vocabulary or approved fact phrasing without fabricating claims.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  {!isResolved && (
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {f.suggested_replacement && (
                          <button
                            type="button"
                            onClick={() => handleAcceptCorrection(f)}
                            disabled={acceptingFindingId === f.id}
                            className="px-3 py-1.5 rounded-lg bg-[#065F46] text-white font-medium hover:bg-[#065F46]/90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{acceptingFindingId === f.id ? 'Refining...' : 'Accept Correction'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const custom = prompt('Edit replacement text:', f.suggested_replacement || f.quote);
                            if (custom) handleAction(f.id, 'edited', { user_edited_replacement: custom });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] text-[#0A1230] font-medium hover:bg-[#E6DDC8] transition-all flex items-center gap-1 border border-[#E6DDC8]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#5B6478]" />
                          <span>Edit Fix</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for dismissing this finding:');
                            if (reason) handleAction(f.id, 'dismissed', { dismiss_reason: reason });
                          }}
                          className="px-3 py-1.5 rounded-lg text-[#5B6478] hover:text-[#DC2626] hover:bg-[#FEE2E2] font-medium transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>

                        <button
                          onClick={() => {
                            const reason = prompt('Explain why this rule may be unclear or in dispute:');
                            if (reason) handleAction(f.id, 'challenged', { challenge_reason: reason });
                          }}
                          className="px-3 py-1.5 rounded-lg text-[#5B6478] hover:text-[#B45309] hover:bg-[#FEF3C7] font-medium transition-all flex items-center gap-1"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Challenge Rule</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: EVIDENCE LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-[#E6DDC8] shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-[#E6DDC8]">
            <h3 className="font-bold text-[#0A1230] text-sm">Evidence Ledger</h3>
            <p className="text-[#5B6478] mt-0.5">Comprehensive audit ledger of every claim extracted from the draft with its grounding status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F3] text-[#5B6478] uppercase tracking-wider font-semibold border-b border-[#E6DDC8] text-[11px]">
                <tr>
                  <th className="px-6 py-3">Claim Quote</th>
                  <th className="px-6 py-3">Status / Verdict</th>
                  <th className="px-6 py-3">Grounding Evidence Citation</th>
                  <th className="px-6 py-3">Source Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DDC8]">
                {ledgerData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F3]/60">
                    <td className="px-6 py-3 font-medium text-[#0A1230] max-w-xs">
                      "{item.claim}"
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        item.verdict === 'supported' ? 'bg-[#065F46]/15 text-[#065F46]' :
                        item.verdict === 'conflicting' ? 'bg-[#DC2626]/15 text-[#DC2626]' : 'bg-[#B45309]/15 text-[#B45309]'
                      }`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#2B3345] italic max-w-sm">
                      {item.source_text}
                    </td>
                    <td className="px-6 py-3 text-[#5B6478] text-[11px]">
                      {item.source_doc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Preview Safe Fixes Before Applying */}
      {showSafeFixModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#D4AF37]/50 max-h-[90vh] flex flex-col text-xs text-[#0A1230]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DDC8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8A6A00]" />
                <h3 className="font-serif text-lg font-bold text-[#0A1230]">
                  Preview Safe Corrections ({safeFixes.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSafeFixModal(false)}
                className="text-[#5B6478] hover:text-[#0A1230] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="py-3 text-[#5B6478]">
              The following {safeFixes.length} changes conform strictly to approved Brand Hub guidelines and fact citations. You can undo this action immediately after applying.
            </p>

            <div className="flex-grow overflow-y-auto space-y-3 py-2 pr-1">
              {safeFixes.map((f) => (
                <div key={f.id} className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0A1230]">{f.title}</span>
                    <span className="font-mono text-[10px] text-[#5B6478]">{f.rule_id}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-white border border-[#DC2626]/20">
                      <span className="text-[10px] font-semibold text-[#DC2626] block">Flagged:</span>
                      <span className="text-[#2B3345] line-through decoration-[#DC2626]/40">{f.quote}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#065F46]/20">
                      <span className="text-[10px] font-semibold text-[#065F46] block">Suggested Fix:</span>
                      <span className="text-[#065F46] font-semibold">{f.suggested_replacement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-[#E6DDC8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSafeFixModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E6DDC8] font-semibold text-[#5B6478] hover:bg-[#FAF8F3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyAllSafeFixes}
                disabled={applyingSafeFixes}
                className="px-5 py-2.5 rounded-xl bg-[#065F46] text-white font-bold hover:bg-[#065F46]/90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <CheckCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>{applyingSafeFixes ? 'Applying...' : `Confirm & Apply All (${safeFixes.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
