import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight,
  Layers, RefreshCw, ThumbsUp, Edit3, XCircle, Flag, Download,
  ChevronDown, ChevronUp, FileText, BarChart2
} from 'lucide-react';
import { getSubmissionDetail, updateFindingStatus } from '../lib/api';
import { VerdictBadge, SeverityBadge } from '../components/VerdictBadge';
import { GoldRefineWord } from '../components/animation/GoldRefineWord';

export function AnalysisResultsPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [activeTab, setActiveTab] = useState('findings'); // findings | ledger | score
  const [loading, setLoading] = useState(true);
  const [expandedFinding, setExpandedFinding] = useState(null);
  const [acceptingFindingId, setAcceptingFindingId] = useState(null);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const [subData, scoreRes, ledgerRes] = await Promise.all([
        getSubmissionDetail(submissionId),
        fetch(`/api/submissions/${submissionId}/score`).then(r => r.json()).catch(() => null),
        fetch(`/api/submissions/${submissionId}/ledger`).then(r => r.json()).catch(() => [])
      ]);
      setDetail(subData);
      setScoreData(scoreRes);
      setLedgerData(ledgerRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const handleAction = async (findingId, status, extra = {}) => {
    try {
      await updateFindingStatus(findingId, {
        status,
        decided_by: role === 'reviewer' ? 'Elena Vance' : 'Creator User',
        ...extra
      });
      loadData();
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

  if (loading || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading analysis findings & evidence grounding...
      </div>
    );
  }

  const latestVersion = detail.versions[detail.versions.length - 1];
  const run = latestVersion?.analysis_run;
  const findings = run?.findings || [];
  const modeFlags = run?.mode_flags || {};

  const total = findings.length;
  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;
  const resolved = findings.filter(f => ['accepted', 'edited', 'dismissed'].includes(f.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Analysis Run Results</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-mist text-ink">v{latestVersion.version_number}</span>
            <span className="text-xs text-gray-400 font-mono">Hash: {latestVersion.content_hash.slice(0, 8)}...</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">{detail.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">Author: {detail.author_name} • Status: {detail.status}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export PDF Button */}
          <a
            href={`/api/submissions/${submissionId}/report.pdf`}
            download
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-mist text-ink text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Export PDF Report</span>
          </a>

          <button
            onClick={() => setActivePage('correction')}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-midnight text-xs font-bold transition-all shadow-glow flex items-center gap-1.5"
          >
            <span>Open Correction Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('review')}
            className="px-3.5 py-2 rounded-xl bg-navy hover:bg-navy-2 text-white text-xs font-semibold transition-all"
          >
            <span>Review Sign-off</span>
          </button>
        </div>
      </div>

      {/* Engine Layer Status Badges Strip */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gold" />
          <span className="font-semibold text-ink">Pipeline Engine Layers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/15 text-teal font-medium border border-teal/30">
            <span className="w-2 h-2 rounded-full bg-teal" />
            <span>Layer 1: Rules Engine (Active)</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky/15 text-sky-800 font-medium border border-sky/30">
            <span className="w-2 h-2 rounded-full bg-sky" />
            <span>Layer 2: Fact Retrieval (Active)</span>
          </span>

          {modeFlags.ai === 'ok' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/15 text-teal font-medium border border-teal/30">
              <span className="w-2 h-2 rounded-full bg-teal" />
              <span>Layer 3: AI Context (Validated)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mist text-gray-600 font-medium border border-gray-300" title="Graceful fallback active">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span>AI layer unavailable. Rule-based & retrieval checks ran.</span>
            </span>
          )}
        </div>

        <div className="text-gray-500 font-mono text-[11px]">
          Duration: {run?.duration_ms || 120}ms
        </div>
      </div>

      {/* Brand Compliance Score Highlight Card (Tier 2 Differentiator) */}
      {scoreData && (
        <div className="bg-white rounded-2xl border border-gold/40 p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-midnight to-navy text-ivory flex flex-col items-center justify-center shadow-glow border border-gold/40">
              <span className="font-serif text-2xl font-bold text-gold">{scoreData.overall_score}</span>
              <span className="text-[10px] text-gray-300 font-semibold">GRADE {scoreData.grade}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">Transparent Evaluation</span>
              <h3 className="font-serif text-lg font-bold text-ink">Brand Compliance Score</h3>
              <p className="text-xs text-gray-600 mt-0.5">{scoreData.summary}</p>
              <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                Formula: {scoreData.formula}
              </span>
            </div>
          </div>

          {/* Component Score Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {Object.entries(scoreData.components || {}).map(([name, c]) => (
              <div key={name} className="p-2 rounded-xl bg-mist/60 border border-gray-200">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">{name}</span>
                <span className="font-serif font-bold text-ink text-sm mt-0.5 block">{c.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: Findings vs Evidence Ledger */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'findings' ? 'bg-midnight text-ivory shadow' : 'text-gray-600 hover:text-ink'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Evidence-Linked Findings ({findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ledger' ? 'bg-midnight text-ivory shadow' : 'text-gray-600 hover:text-ink'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>Evidence Ledger ({ledgerData.length} Claims)</span>
        </button>
      </div>

      {/* TAB 1: FINDINGS */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          
          {/* Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">Total Findings</span>
              <p className="font-serif text-2xl font-bold text-ink mt-1">{total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-coral/30 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-coral uppercase flex items-center justify-center gap-1">
                ▲ High Severity
              </span>
              <p className="font-serif text-2xl font-bold text-coral mt-1">{high}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber/30 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-amber-700 uppercase flex items-center justify-center gap-1">
                ◆ Medium
              </span>
              <p className="font-serif text-2xl font-bold text-amber-700 mt-1">{medium}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-sky/30 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-sky-800 uppercase flex items-center justify-center gap-1">
                ● Low
              </span>
              <p className="font-serif text-2xl font-bold text-sky-800 mt-1">{low}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-teal/30 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-teal uppercase">Resolved</span>
              <p className="font-serif text-2xl font-bold text-teal mt-1">{resolved}</p>
            </div>
          </div>

          {/* Content Annotated Text Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <h3 className="font-serif text-base font-bold text-ink mb-2">Reviewed Content Copy</h3>
            <div className="p-4 bg-mist/50 rounded-xl border border-gray-200 text-sm leading-relaxed text-ink whitespace-pre-wrap font-sans">
              {latestVersion.content}
            </div>
          </div>

          {/* Findings Cards */}
          {findings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-teal/40 p-8 text-center shadow-sm">
              <CheckCircle className="w-10 h-10 text-teal mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-ink mb-1">Zero Violations Detected</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
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
                      ? 'border-teal/30 bg-[#F0FDF4]/70' 
                      : f.severity === 'high' 
                      ? 'border-coral/40 shadow-card' 
                      : 'border-gray-200'
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
                        <span className="text-xs font-medium text-teal capitalize px-2 py-0.5 rounded bg-teal/15 font-bold">
                          ✓ {f.status}
                        </span>
                      ) : (
                        <span className="text-xs text-coral font-medium">Unresolved</span>
                      )}
                    </div>
                  </div>

                  {/* Title & Quoted Span with Gold Refinement */}
                  <h4 className="font-bold text-ink text-base mb-1">{f.title}</h4>
                  <div className="my-2 p-2.5 bg-mist rounded-lg border border-gray-200 font-mono text-xs text-ink">
                    <span className="text-gray-500 font-sans block text-[10px] mb-0.5">Flagged Text Quote:</span>
                    {acceptingFindingId === f.id ? (
                      <GoldRefineWord
                        originalText={f.quote}
                        correctedText={f.suggested_replacement || ''}
                        isRefining={true}
                        durationMs={450}
                        isLightBackground={true}
                      />
                    ) : isResolved && f.suggested_replacement ? (
                      <span className="text-teal font-semibold">"{f.suggested_replacement}"</span>
                    ) : (
                      <span>"{f.quote}"</span>
                    )}
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-gray-700 leading-relaxed mb-4">{f.explanation}</p>

                  {/* Evidence Grounding */}
                  <div className={`p-4 rounded-xl border mb-4 text-xs ${
                    isNoEvidence ? 'bg-amber/10 border-amber/30 text-amber-900' : 'bg-champagne/40 border-gold/40 text-ink'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <span>Grounding Evidence:</span>
                      {evidence.fact_id && (
                        <span className="font-mono text-[10px] bg-gold/20 px-1.5 py-0.2 rounded text-ink">
                          Fact {evidence.fact_id}
                        </span>
                      )}
                    </div>

                    <p className="font-sans leading-relaxed italic">
                      {evidence.text || "No approved supporting evidence found."}
                    </p>

                    {evidence.source && (
                      <span className="text-[11px] text-gray-500 block mt-1">
                        Source documentation: {evidence.source}
                      </span>
                    )}
                  </div>

                  {/* Intent-Preserving Replacement */}
                  {f.suggested_replacement && (
                    <div className="p-3 bg-teal/10 rounded-xl border border-teal/30 mb-4 text-xs">
                      <span className="font-semibold text-teal block mb-1">
                        Intent-Preserving Correction Suggestion:
                      </span>
                      <p className="font-medium text-ink">"{f.suggested_replacement}"</p>
                      {f.rationale && (
                        <span className="text-[11px] text-gray-500 block mt-1">
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
                      className="text-xs text-gold hover:text-ink font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Why was this flagged?</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3.5 bg-mist rounded-xl border border-gray-200 text-xs space-y-2 text-gray-700 animate-fadeIn">
                        <div>
                          <strong className="block text-ink">1. Detection Rationale:</strong>
                          <span>{f.explanation}</span>
                        </div>
                        <div>
                          <strong className="block text-ink">2. Guideline Rule Citation:</strong>
                          <span>{f.rule_text || f.rule_id}</span>
                        </div>
                        <div>
                          <strong className="block text-ink">3. Intent Preservation Guarantee:</strong>
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
                            className="px-3 py-1.5 rounded-lg bg-teal text-white font-medium hover:bg-teal/90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
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
                          className="px-3 py-1.5 rounded-lg bg-mist text-ink font-medium hover:bg-gray-200 transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                          <span>Edit Fix</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for dismissing this finding:');
                            if (reason) handleAction(f.id, 'dismissed', { dismiss_reason: reason });
                          }}
                          className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-coral hover:bg-coral/10 font-medium transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>

                        <button
                          onClick={() => {
                            const reason = prompt('Explain why this rule may be unclear or in dispute:');
                            if (reason) handleAction(f.id, 'challenged', { challenge_reason: reason });
                          }}
                          className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-amber-800 hover:bg-amber/10 font-medium transition-all flex items-center gap-1"
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

      {/* TAB 2: EVIDENCE LEDGER (Tier 2 Differentiator) */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-ink text-sm">Evidence Ledger</h3>
            <p className="text-gray-500 mt-0.5">Comprehensive audit ledger of every claim extracted from the draft with its grounding status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-mist text-gray-600 uppercase tracking-wider font-semibold border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="px-6 py-3">Claim Quote</th>
                  <th className="px-6 py-3">Status / Verdict</th>
                  <th className="px-6 py-3">Grounding Evidence Citation</th>
                  <th className="px-6 py-3">Source Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ledgerData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-mist/30">
                    <td className="px-6 py-3 font-medium text-ink max-w-xs">
                      "{item.claim}"
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        item.verdict === 'supported' ? 'bg-teal/15 text-teal' :
                        item.verdict === 'conflicting' ? 'bg-coral/15 text-coral' : 'bg-amber/15 text-amber-800'
                      }`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 italic max-w-sm">
                      {item.source_text}
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-[11px]">
                      {item.source_doc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
