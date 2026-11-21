import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, AlertTriangle, ShieldCheck, 
  HelpCircle, Flag, ArrowRight, CheckCircle2, Grid, Download, Play, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { getInsights, runGuidedDemo } from '../lib/api';

const COLORS = ['#0A1230', '#8A6A00', '#065F46', '#B45309', '#6D28D9', '#B91C1C'];

export function GovernanceInsightsPage({ setActivePage }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInsights();
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunDemo = async () => {
    setDemoLoading(true);
    try {
      await runGuidedDemo();
      await loadData();
    } catch (err) {
      alert("Failed to run demo: " + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  if (loading || !insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[15px] text-[#5B6478]">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading real governance insights & database telemetry...</p>
      </div>
    );
  }

  const categoryChartData = (insights.common_categories || []).map((c, i) => ({
    name: c.category,
    count: c.count,
    color: COLORS[i % COLORS.length]
  }));

  const getHeatmapColor = (val) => {
    if (val >= 5) return 'bg-[#FEE2E2] text-[#B91C1C] font-bold border-[#B91C1C]/40';
    if (val >= 3) return 'bg-[#FEF3C7] text-[#B45309] font-medium border-[#B45309]/30';
    if (val >= 1) return 'bg-[#FBF1CF] text-[#8A6A00] font-medium border-[#8A6A00]/20';
    return 'bg-[#FAF8F3] text-gray-400 border-[#E6DDC8]/60';
  };

  const hasData = insights.has_enough_data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DDC8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#614A00]">Continuous Policy Learning</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] font-semibold border border-[#065F46]/20">
              {insights.label || 'Measured workspace data'}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A1230] mt-1">Adaptive Governance Insights</h1>
          <p className="text-[16px] text-[#5B6478] mt-1">
            Real-time analytics on rule violations, review velocity, and policy phrasing friction points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('quality')}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DDC8] hover:bg-[#FAF8F3] text-[#0A1230] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="View automated quality benchmarks & engine test harness"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E78]" />
            <span>Engine Quality</span>
          </button>

          <a
            href="/api/feedback/export.csv"
            download="verity_user_testing_feedback.csv"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DDC8] hover:bg-[#FAF8F3] text-[#0A1230] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Download tester feedback CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>Export User Feedback (CSV)</span>
          </a>

          <button
            onClick={() => setActivePage('brand-hub')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0A1230] flex items-center gap-1.5 shadow-sm transition-all hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
            }}
          >
            <span>Manage Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0A1230]" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#0A1230] shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
          <span className="text-[13px] font-medium text-[#5B6478] block">Total Evaluated Copy</span>
          <p className="font-serif text-[32px] font-bold text-[#0A1230] mt-1">{insights.total_submissions}</p>
          <span className="text-[12px] text-[#5B6478] mt-0.5 block">Submissions processed</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#065F46] shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
          <span className="text-[13px] font-medium text-[#5B6478] block">Pre-Review Fix Rate</span>
          <p className="font-serif text-[32px] font-bold text-[#065F46] mt-1">
            {insights.pre_review_fix_rate !== null ? `${insights.pre_review_fix_rate}%` : 'Not enough data yet'}
          </p>
          <span className="text-[12px] text-[#5B6478] mt-0.5 block">Self-corrected by creator</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#D97706] shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
          <span className="text-[13px] font-medium text-[#5B6478] block">Avg Review Turnaround</span>
          <p className="font-serif text-[32px] font-bold text-[#0A1230] mt-1">
            {insights.average_decision_time_minutes !== null ? `${insights.average_decision_time_minutes}m` : 'Not enough data yet'}
          </p>
          <span className="text-[12px] text-[#5B6478] mt-0.5 block">Submission to decision</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#B91C1C] shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
          <span className="text-[13px] font-medium text-[#5B6478] block">High-Severity Interceptions</span>
          <p className="font-serif text-[32px] font-bold text-[#B91C1C] mt-1">{insights.high_severity_count}</p>
          <span className="text-[12px] text-[#5B6478] mt-0.5 block">Blockers flagged</span>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-12 text-center shadow-[0_1px_2px_rgba(10,18,48,0.06)] mb-8">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#E6DDC8] flex items-center justify-center mx-auto mb-3 text-[#8A6A00]">
            <BarChart3 className="w-7 h-7 text-[#8A6A00]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#0A1230] mb-1">Not enough data yet</h3>
          <p className="text-[14px] text-[#5B6478] max-w-md mx-auto mb-5">
            Submit drafts for review or run the guided demo to generate real policy friction metrics, violation frequency distributions, and channel heatmaps.
          </p>
          <button
            onClick={handleRunDemo}
            disabled={demoLoading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#0A1230] shadow transition-all hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
            }}
          >
            {demoLoading ? 'Running Demo...' : 'Run guided demo'}
          </button>
        </div>
      ) : (
        <>
          {/* Main Analytics Row: Common Categories Chart & Unclear Rules Detection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Common Rule Categories Breakdown */}
            <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1230]">Friction by Governance Category</h3>
                  <p className="text-[13px] text-[#5B6478]">Frequency of automated findings across active rules.</p>
                </div>
                <BarChart3 className="w-4 h-4 text-[#8A6A00]" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6478' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5B6478' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1230', borderRadius: '10px', color: '#F7F2E7', fontSize: '12px' }}
                      formatter={(val) => [`${val} flags`, 'Frequency']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rules Identified as Friction Points */}
            <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0A1230]">Policy Phrasing Recommendations</h3>
                    <p className="text-[13px] text-[#5B6478]">Rules with highest flag or challenge frequency.</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                </div>

                <div className="space-y-3">
                  {(insights.rules_possibly_unclear?.length > 0 ? insights.rules_possibly_unclear : insights.most_violated_rules?.slice(0, 3))?.map((r) => (
                    <div key={r.code} className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[#0A1230] bg-[#F6F1E7] px-2 py-0.5 rounded border border-[#E6DDC8]">
                          {r.code} • {r.category}
                        </span>
                        <span className="text-[11px] font-semibold text-[#B91C1C]">
                          Flagged {r.times_flagged} times
                        </span>
                      </div>
                      <h4 className="font-bold text-[#0A1230] text-[13px] mt-1">{r.title}</h4>
                      <p className="text-[#5B6478] text-[12px] mt-1 leading-relaxed">
                        {r.suggestion || 'Review policy phrasing in the Brand Knowledge Hub to provide clearer guidance for copy creators.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DDC8] text-[12px] text-[#5B6478] flex items-center justify-between">
                <span>Derived from database audit log</span>
                <button
                  onClick={() => setActivePage('brand-hub')}
                  className="font-bold text-[#8A6A00] hover:text-[#0A1230] flex items-center gap-1"
                >
                  Edit Rules <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Real Channel Risk Heatmap */}
          <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0A1230]">Cross-Channel Policy Risk Heatmap</h3>
                <p className="text-[13px] text-[#5B6478]">Distribution of flagged issues by publication channel and risk category.</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#5B6478]">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FAF8F3] border border-[#E6DDC8]" /> 0</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FBF1CF]" /> 1–2</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FEF3C7]" /> 3–4</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FEE2E2]" /> 5+</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="border-b border-[#E6DDC8]">
                    <th className="py-2.5 px-4 text-left font-bold text-[#0A1230] uppercase text-[11px]">Category</th>
                    {(insights.content_types || []).map((type) => (
                      <th key={type} className="py-2.5 px-3 font-semibold text-[#5B6478] uppercase text-[11px]">
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DDC8]/60">
                  {(insights.risk_categories || []).map((cat) => (
                    <tr key={cat}>
                      <td className="py-3 px-4 text-left font-bold text-[#0A1230]">{cat}</td>
                      {(insights.content_types || []).map((type) => {
                        const val = insights.risk_heatmap?.[cat]?.[type] || 0;
                        return (
                          <td key={type} className="py-3 px-3">
                            <span className={`inline-block w-8 py-1 rounded border text-[11px] font-mono ${getHeatmapColor(val)}`}>
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
