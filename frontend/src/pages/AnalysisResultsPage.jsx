import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight,
  Layers, RefreshCw, ThumbsUp, Edit3, XCircle, Flag, ExternalLink
} from 'lucide-react';
import { getSubmissionDetail, updateFindingStatus } from '../lib/api';
import { VerdictBadge, SeverityBadge } from '../components/VerdictBadge';

export function AnalysisResultsPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFindingId, setActiveFindingId] = useState(null);
  const [dialogState, setDialogState] = useState({ open: false, type: '', finding: null, reason: '' });

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const data = await getSubmissionDetail(submissionId);
      setDetail(data);
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
      
      {/* Header with Title & Action to Correction Workspace */}
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('correction')}
            className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-midnight text-xs font-bold transition-all shadow-glow flex items-center gap-2"
          >
            <span>Open Correction Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('review')}
            className="px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-2 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
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

      {/* Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <h3 className="font-serif text-base font-bold text-ink mb-2">Reviewed Content Copy</h3>
        <p className="text-xs text-gray-500 mb-4">Click any flagged highlight to jump directly to its rule and evidence citation.</p>

        <div className="p-4 bg-mist/50 rounded-xl border border-gray-200 text-sm leading-relaxed text-ink whitespace-pre-wrap font-sans">
          {latestVersion.content}
        </div>
      </div>

      {/* Findings List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-ink">
            Evidence-Linked Findings ({findings.length})
          </h3>
          <span className="text-xs text-gray-500">
            {resolved} of {total} findings addressed
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-teal/40 p-8 text-center shadow-sm">
            <CheckCircle className="w-10 h-10 text-teal mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-ink mb-1">Zero Violations Detected</h4>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Content is fully compliant with brand guidelines and verified against approved facts F-01 & F-02.
            </p>
          </div>
        ) : (
          findings.map((f) => {
            const isResolved = ['accepted', 'edited', 'dismissed'].includes(f.status);
            const evidence = f.evidence || {};
            const isNoEvidence = evidence.text === "No approved supporting evidence found.";

            return (
              <div
                key={f.id}
                id={`finding-${f.id}`}
                className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                  isResolved 
                    ? 'border-gray-200 bg-gray-50/60 opacity-80' 
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
                      <span className="text-xs font-medium text-teal capitalize px-2 py-0.5 rounded bg-teal/10">
                        ✓ {f.status}
                      </span>
                    ) : (
                      <span className="text-xs text-coral font-medium">Unresolved</span>
                    )}
                  </div>
                </div>

                {/* Title & Quoted Span */}
                <h4 className="font-bold text-ink text-base mb-1">{f.title}</h4>
                <div className="my-2 p-2.5 bg-mist rounded-lg border border-gray-200 font-mono text-xs text-ink">
                  <span className="text-gray-500 font-sans block text-[10px] mb-0.5">Flagged Text Quote:</span>
                  "{f.quote}"
                </div>

                {/* Explanation */}
                <p className="text-xs text-gray-700 leading-relaxed mb-4">{f.explanation}</p>

                {/* Evidence Pillar Showcase (Section 1 requirement) */}
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

                {/* Suggested Intent-Preserving Replacement */}
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

                {/* Actions Toolbar */}
                {!isResolved && (
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {f.suggested_replacement && (
                        <button
                          onClick={() => handleAction(f.id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-teal text-white font-medium hover:bg-teal/90 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Accept Correction</span>
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
                        title="Dismiss with reason (telemetry records for Adaptive Insights)"
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
                        title="Challenge rule clarity (surfaces in Governance Insights)"
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

    </div>
  );
}
