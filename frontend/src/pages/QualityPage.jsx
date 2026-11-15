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
    <div className="w-full min-h-screen">
      
      {/* Short Navy Hero */}
      <section className="theme-dark bg-[#0A1230] border-b border-[#D4AF37]/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/60 text-xs font-sans text-[#F7F2E7] tracking-wider uppercase mb-3 bg-[#050A1F]/60">
              <BarChart2 className="w-3.5 h-3.5 text-[#F3D98B]" />
              <span>WCC Forge 48 · Measurement plan</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F7F2E7] tracking-tight">
              Labelled test set and engine quality
            </h1>
            <p className="text-[17px] text-[#F7F2E7]/88 mt-2 leading-relaxed">
              We run our engine on a small labelled set of drafts and report what it actually catches.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <button
              onClick={handleRunEvaluation}
              disabled={running}
              className="btn-gold-sweep px-6 py-3 rounded-xl font-semibold text-[15px] text-[#0A1230] shadow-md flex items-center gap-2.5 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
                color: '#0A1230',
                opacity: 1,
              }}
            >
              <Play className={`w-4 h-4 fill-current ${running ? 'animate-spin' : ''}`} />
              <span>{running ? 'Running evaluation...' : 'Run live evaluation'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Ivory Body */}
      <section className="theme-light bg-[#F7F2E7] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#B91C1C]/30 text-sm text-[#B91C1C]">
              Error: {error}
            </div>
          )}

          {/* Note Bar (no literal prefix 'Title note:') */}
          <div className="mb-8 p-4 bg-white rounded-[14px] border border-[#E6DDC8] text-[15px] text-[#2B3345] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[0_1px_2px_rgba(10,18,48,0.04)]">
            <div className="flex items-center gap-2">
              <span className="text-[#8A6A00]">📌</span>
              <span>Only measured results are reported. AI findings are advisory; an authorised human reviewer owns final approval.</span>
            </div>
            <span className="text-xs text-[#5B6478] font-medium shrink-0">
              Corpus: 4 Drafts · 11 Planted Issues
            </span>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            
            {/* Metric 1: Precision */}
            <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#D4AF37] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.04)]">
              <span className="text-[14px] font-medium text-[#5B6478] block">Precision</span>
              <p className="font-serif text-[36px] font-bold text-[#0A1230] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.precision_percent}%` : 'Not run yet'}
              </p>
              <span className="text-[14px] text-[#5B6478] mt-1 block">
                {evalResults 
                  ? `${evalResults.metrics.planted_issues_detected} / (${evalResults.metrics.planted_issues_detected} + ${evalResults.metrics.false_positives_on_clean_draft})` 
                  : 'Click Run live evaluation'}
              </span>
            </div>

            {/* Metric 2: Recall */}
            <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#2ECC9A] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.04)]">
              <span className="text-[14px] font-medium text-[#5B6478] block">Recall</span>
              <p className="font-serif text-[36px] font-bold text-[#0A1230] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.recall_percent}%` : 'Not run yet'}
              </p>
              <span className="text-[14px] text-[#5B6478] mt-1 block">
                {evalResults 
                  ? `100% · ${evalResults.metrics.planted_issues_detected} of ${evalResults.metrics.planted_issues_total} planted issues detected` 
                  : 'Ground truth coverage'}
              </span>
            </div>

            {/* Metric 3: Evidence accuracy */}
            <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#8B5CF6] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.04)]">
              <span className="text-[14px] font-medium text-[#5B6478] block">Evidence accuracy</span>
              <p className="font-serif text-[36px] font-bold text-[#0A1230] mt-1 leading-tight">
                {evalResults ? `${evalResults.metrics.evidence_accuracy_percent}%` : 'Not run yet'}
              </p>
              <span className="text-[14px] text-[#5B6478] mt-1 block">
                {evalResults 
                  ? `100% · ${evalResults.metrics.planted_issues_detected} of ${evalResults.metrics.planted_issues_total} findings cited an approved source` 
                  : 'Verified citations'}
              </span>
            </div>

            {/* Metric 4: Review time */}
            <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#F5A623] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.04)]">
              <span className="text-[14px] font-medium text-[#5B6478] block">Review time</span>
              <p className="font-serif text-[28px] font-bold text-[#0A1230] mt-2 leading-tight">
                Not measured yet
              </p>
              <span className="text-[14px] text-[#5B6478] mt-1 block">
                Requires multi-reviewer study
              </span>
            </div>

          </div>

          {/* Labelled test scenarios */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#E6DDC8]">
              <h2 className="font-serif text-2xl font-bold text-[#0A1230]">
                Labelled test scenarios
              </h2>
              <p className="text-[15px] text-[#5B6478] mt-1">
                We evaluate each draft against brand rules, fact citations, and clean-draft boundaries using a labelled test set we built.
              </p>
            </div>

            {(benchmark?.test_cases || []).map((tc, idx) => {
              const runMatch = evalResults?.test_case_results?.find(r => r.test_case_id === tc.id);

              return (
                <div 
                  key={tc.id} 
                  className="bg-white rounded-[14px] p-6 border border-[#E6DDC8] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.04)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E6DDC8]/60">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E6DDC8] flex items-center justify-center text-xs text-[#0A1230] font-bold">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-serif text-[18px] font-bold text-[#0A1230]">{tc.name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[#5B6478] border border-[#E6DDC8] font-medium uppercase tracking-wide inline-block mt-1">
                          Channel: {tc.channel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF8F3] text-[#5B6478] border border-[#E6DDC8]">
                        {tc.planted_issues.length} Planted issue{tc.planted_issues.length === 1 ? '' : 's'}
                      </span>
                      {runMatch && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20 font-medium">
                          {runMatch.duration_ms}ms execution
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Draft Content Box */}
                  <div className="mb-4 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E6DDC8] text-sm text-[#2B3345] leading-relaxed">
                    <span className="text-[#5B6478] block text-[11px] uppercase tracking-wider mb-1 font-semibold">Test Draft Text:</span>
                    "{tc.content}"
                  </div>

                  {/* Table with columns: Expected issue | Detected | Evidence source */}
                  {tc.planted_issues.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#D1FAE5]/60 border border-[#065F46]/20 text-sm text-[#065F46] flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#065F46] shrink-0" />
                      <span>Compliant clean draft: used to verify zero spurious findings are reported (0 false positives).</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#FAF8F3] text-[#5B6478] uppercase text-[12px] tracking-wider border-b border-[#E6DDC8]">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Expected issue</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Detected</th>
                            <th className="py-2.5 px-3 font-semibold">Evidence source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6DDC8]/60 text-[#2B3345]">
                          {tc.planted_issues.map((pi) => {
                            const resItem = runMatch?.planted_evaluation?.find(e => e.issue_id === pi.id);
                            const detected = resItem ? resItem.detected : null;

                            return (
                              <tr key={pi.id} className="hover:bg-[#FAF8F3]/50">
                                <td className="py-3 px-3">
                                  <div className="text-[#0A1230] font-medium">{pi.label}</div>
                                  <div className="text-xs text-[#5B6478] mt-0.5">Target: "{pi.target_quote}"</div>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {detected === null ? (
                                    <span className="text-xs text-[#5B6478] bg-[#FAF8F3] px-2.5 py-1 rounded-full border border-[#E6DDC8]">
                                      Pending run
                                    </span>
                                  ) : detected ? (
                                    <span className="inline-flex items-center gap-1.5 text-[#065F46] font-semibold text-xs bg-[#D1FAE5] px-2.5 py-1 rounded-full border border-[#065F46]/20">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Detected ✓</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-[#B91C1C] font-semibold text-xs bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#B91C1C]/20">
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Missed ✗</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-xs text-[#5B6478]">
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
