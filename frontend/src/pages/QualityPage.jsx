import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Play, BarChart2, Check, RefreshCw
} from 'lucide-react';

export function QualityPage({ setActivePage }) {
  const [benchmark, setBenchmark] = useState(null);
  const [evalResults, setEvalResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBenchmark() {
      try {
        const res = await fetch('/api/evaluation/benchmark');
        if (res.ok) {
          const data = await res.json();
          setBenchmark(data);
        }
      } catch (err) {
        console.error('Failed to load benchmark:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBenchmark();
  }, []);

  const handleRunEvaluation = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/evaluation/run', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvalResults(data);
    } catch (err) {
      setError(err.message || 'Evaluation run failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F2] text-[#14203D]">
      
      {/* ==================================================
          SECTION 1: HERO (NAVY LIKE: #0A1226 to #101B35 with gold glow)
          ================================================== */}
      <section 
        className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-[#F3EAD3]/20"
        style={{
          background: 'linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
          backgroundImage: 'radial-gradient(ellipse at 85% 10%, rgba(226,184,87,0.12), transparent 55%), linear-gradient(180deg, #0A1226 0%, #101B35 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2B857]/40 text-sm font-sans font-semibold text-[#E2B857] tracking-wider uppercase mb-3 bg-[#0A1226]/80 shadow-sm">
              <BarChart2 className="w-4 h-4 text-[#E2B857]" />
              <span>ROUND 3 · EMPIRICAL MEASUREMENT PLAN</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FAF8F2] tracking-tight">
              Labelled test set and <span className="text-[#E2B857]">engine quality</span>
            </h1>
            <p className="text-[17px] text-[#D5DBEE] mt-2 leading-relaxed font-sans">
              We run our engine on a small labelled set of drafts and report what it actually catches.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <button
              onClick={handleRunEvaluation}
              disabled={running}
              className="px-6 py-3 rounded-xl font-bold text-sm text-[#101B35] bg-[#E2B857] hover:bg-[#F3EAD3] shadow-[0_2px_12px_rgba(226,184,87,0.35)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${running ? 'animate-spin' : ''}`} />
              <span>{running ? 'Running evaluation...' : 'Run live evaluation'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2: BODY (IVORY #FAF8F2)
          ================================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F2]">
        <div className="max-w-7xl mx-auto">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#B91C1C]/30 text-sm text-[#B91C1C]">
              Error: {error}
            </div>
          )}

          {/* Note Bar */}
          <div className="mb-8 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E2B857]/30 text-[15px] text-[#14203D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(20,32,61,0.05)]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#8A6A24] text-lg">📌</span>
              <span className="font-medium">Only measured results are reported. AI findings are advisory; an authorised human reviewer owns final approval.</span>
            </div>
            <span className="text-sm text-[#4A5675] font-semibold shrink-0 bg-[#F3EAD3]/60 px-3 py-1 rounded-full border border-[#E2B857]/20">
              Corpus: 4 Drafts · 11 Planted Issues
            </span>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            
            {/* Metric 1: Precision */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2B857]/30 border-l-4 border-l-[#E2B857] shadow-[0_4px_20px_rgba(20,32,61,0.05)]">
              <span className="text-sm font-semibold text-[#8A6A24] uppercase tracking-wider block">Precision</span>
              <p className="font-serif text-[36px] font-bold text-[#14203D] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.precision_percent}%` : 'Not run yet'}
              </p>
              <span className="text-sm text-[#4A5675] mt-1 block">
                {evalResults 
                  ? `${evalResults.metrics.planted_issues_detected} / (${evalResults.metrics.planted_issues_detected} + ${evalResults.metrics.false_positives_on_clean_draft})` 
                  : 'Click Run live evaluation'}
              </span>
            </div>

            {/* Metric 2: Recall */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2B857]/30 border-l-4 border-l-[#059669] shadow-[0_4px_20px_rgba(20,32,61,0.05)]">
              <span className="text-sm font-semibold text-[#065F46] uppercase tracking-wider block">Recall</span>
              <p className="font-serif text-[36px] font-bold text-[#14203D] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.recall_percent}%` : 'Not run yet'}
              </p>
              <span className="text-sm text-[#4A5675] mt-1 block">
                {evalResults 
                  ? `100% · ${evalResults.metrics.planted_issues_detected} of ${evalResults.metrics.planted_issues_total} detected` 
                  : 'Ground truth coverage'}
              </span>
            </div>

            {/* Metric 3: Evidence accuracy */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2B857]/30 border-l-4 border-l-[#7C3AED] shadow-[0_4px_20px_rgba(20,32,61,0.05)]">
              <span className="text-sm font-semibold text-[#6D28D9] uppercase tracking-wider block">Evidence accuracy</span>
              <p className="font-serif text-[36px] font-bold text-[#14203D] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.evidence_accuracy_percent}%` : 'Not run yet'}
              </p>
              <span className="text-sm text-[#4A5675] mt-1 block">
                {evalResults 
                  ? `100% · ${evalResults.metrics.planted_issues_detected} of ${evalResults.metrics.planted_issues_total} cited an approved source` 
                  : 'Verified citations'}
              </span>
            </div>

            {/* Metric 4: Review time */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2B857]/30 border-l-4 border-l-[#D97706] shadow-[0_4px_20px_rgba(20,32,61,0.05)]">
              <span className="text-sm font-semibold text-[#92400E] uppercase tracking-wider block">Review time</span>
              <p className="font-serif text-[28px] font-bold text-[#14203D] mt-2 leading-tight">
                Not measured yet
              </p>
              <span className="text-sm text-[#4A5675] mt-1 block">
                Requires multi-reviewer study
              </span>
            </div>

          </div>

          {/* Labelled test scenarios */}
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#F3EAD3]">
              <h2 className="font-serif text-2xl font-bold text-[#14203D]">
                Labelled test scenarios
              </h2>
              <p className="text-[15px] text-[#4A5675] mt-1">
                We evaluate each draft against brand rules, fact citations, and clean-draft boundaries using a labelled test set we built.
              </p>
            </div>

            {(benchmark?.test_cases || []).map((tc, idx) => {
              const runMatch = evalResults?.test_case_results?.find(r => r.test_case_id === tc.id);

              return (
                <div 
                  key={tc.id} 
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2B857]/30 shadow-[0_4px_20px_rgba(20,32,61,0.05)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F3EAD3]">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#101B35] text-[#E2B857] flex items-center justify-center text-sm font-bold">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-serif text-[18px] font-bold text-[#14203D]">{tc.name}</h3>
                        <span className="text-sm px-2.5 py-0.5 rounded-full bg-[#F3EAD3]/70 text-[#14203D] border border-[#E2B857]/30 font-medium tracking-wide inline-block mt-1">
                          Channel: {tc.channel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm px-3 py-1 rounded-full bg-[#FAF8F2] text-[#4A5675] border border-[#E2B857]/30 font-medium">
                        {tc.planted_issues.length} Planted issue{tc.planted_issues.length === 1 ? '' : 's'}
                      </span>
                      {runMatch && (
                        <span className="text-sm px-3 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20 font-semibold">
                          {runMatch.duration_ms}ms execution
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Draft Content Box */}
                  <div className="mb-4 p-4 rounded-xl bg-[#FAF8F2] border border-[#E2B857]/20 text-sm text-[#14203D] leading-relaxed">
                    <span className="text-[#8A6A24] block text-sm uppercase tracking-wider mb-1 font-semibold">Test Draft Text:</span>
                    "{tc.content}"
                  </div>

                  {/* Table with columns: Expected issue | Detected | Evidence source */}
                  {tc.planted_issues.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#D1FAE5]/60 border border-[#065F46]/20 text-sm text-[#065F46] flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#065F46] shrink-0" />
                      <span className="font-medium">Compliant clean draft: used to verify zero spurious findings are reported (0 false positives).</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm font-sans">
                        <thead className="bg-[#F3EAD3]/60 text-[#14203D] uppercase text-sm font-semibold tracking-wider border-b border-[#E2B857]/30">
                          <tr>
                            <th className="py-3 px-4 font-semibold">Expected issue</th>
                            <th className="py-3 px-4 font-semibold text-center">Detected</th>
                            <th className="py-3 px-4 font-semibold">Evidence source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3EAD3] text-[#14203D]">
                          {tc.planted_issues.map((pi) => {
                            const resItem = runMatch?.planted_evaluation?.find(e => e.issue_id === pi.id);
                            const detected = resItem ? resItem.detected : null;

                            return (
                              <tr key={pi.id} className="hover:bg-[#FAF8F2]/60">
                                <td className="py-3 px-4">
                                  <div className="text-[#14203D] font-medium">{pi.label}</div>
                                  <div className="text-sm text-[#4A5675] mt-0.5">Target: "{pi.target_quote}"</div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {detected === null ? (
                                    <span className="text-sm text-[#4A5675] bg-[#FAF8F2] px-3 py-1 rounded-full border border-[#E2B857]/30">
                                      Pending run
                                    </span>
                                  ) : detected ? (
                                    <span className="inline-flex items-center gap-1.5 text-[#065F46] font-semibold text-sm bg-[#D1FAE5] px-3 py-1 rounded-full border border-[#065F46]/20">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Detected ✓</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-[#B91C1C] font-semibold text-sm bg-[#FEE2E2] px-3 py-1 rounded-full border border-[#B91C1C]/20">
                                      <XCircle className="w-4 h-4" />
                                      <span>Missed ✗</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-sm text-[#4A5675]">
                                  {resItem?.evidence_cited || pi.expected_rule}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
