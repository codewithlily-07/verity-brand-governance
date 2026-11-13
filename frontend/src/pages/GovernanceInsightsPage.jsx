import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, AlertTriangle, ShieldCheck, 
  HelpCircle, Flag, ArrowRight, CheckCircle2, Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Pie } from 'recharts';
import { getInsights } from '../lib/api';

const COLORS = ['#0A1128', '#C8A35A', '#19A883', '#E9A23B', '#5B8DEF', '#E5484D'];

export function GovernanceInsightsPage({ setActivePage }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInsights();
        setInsights(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading governance insights & telemetry...
      </div>
    );
  }

  const categoryChartData = (insights.common_categories || []).map((c, i) => ({
    name: c.category,
    count: c.count,
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Continuous Policy Learning</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-champagne text-ink font-semibold border border-gold/30">
              Demonstration data
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">Adaptive Governance Insights</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time analytics on rule violations, review velocity, and policy phrasing friction points.
          </p>
        </div>

        <button
          onClick={() => setActivePage('brand-hub')}
          className="px-4 py-2 rounded-xl bg-midnight text-ivory hover:bg-navy text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>Manage Guidelines in Hub</span>
          <ArrowRight className="w-3.5 h-3.5 text-gold" />
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pre-Review Fix Rate</span>
          <p className="font-serif text-3xl font-bold text-teal mt-2">{insights.pre_review_fix_rate}%</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Resolved before reviewer gate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">Avg Decision Time</span>
          <p className="font-serif text-3xl font-bold text-ink mt-2">{insights.average_decision_time_minutes}m</p>
          <span className="text-[11px] text-gray-400 mt-1 block">From draft to approval</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-coral">High-Severity Flags</span>
          <p className="font-serif text-3xl font-bold text-coral mt-2">{insights.high_severity_count}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Absolute claims & conflicts</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Findings Resolved</span>
          <p className="font-serif text-3xl font-bold text-gold-dark mt-2">{insights.total_findings_resolved}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">{insights.resolution_rate}% resolution rate</span>
        </div>
      </div>

      {/* THIRD IMPROVEMENT HIGHLIGHT: "Rules That May Be Unclear" */}
      <div className="bg-white rounded-2xl border-2 border-gold/40 p-6 mb-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold">Adaptive Governance Telemetry</span>
            <h3 className="font-serif text-lg font-bold text-ink">Rules That May Be Unclear (Frequently Challenged)</h3>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-4 max-w-3xl leading-relaxed">
          The system monitors feedback when content creators dismiss findings or submit challenges. Instead of letting AI autonomously rewrite policy, VERITY highlights friction rules to your compliance administrators.
        </p>

        {insights.rules_possibly_unclear?.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No rules currently exceed the challenge threshold.</p>
        ) : (
          <div className="space-y-3">
            {insights.rules_possibly_unclear.map((r) => (
              <div key={r.code} className="p-4 bg-mist/60 rounded-xl border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-midnight bg-white px-2 py-0.5 rounded border border-gray-200">
                      {r.code}
                    </span>
                    <span className="font-bold text-ink">{r.title}</span>
                    <span className="text-[10px] uppercase font-semibold text-coral bg-coral/10 px-1.5 py-0.5 rounded">
                      {r.dismiss_rate_pct}% Challenge/Dismiss Rate
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px]">{r.suggestion}</p>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-[11px]">
                    {r.times_dismissed} dismissed • {r.times_challenged} challenged
                  </span>
                  <button
                    onClick={() => setActivePage('brand-hub')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-ink font-semibold hover:border-gold transition-colors text-xs"
                  >
                    Edit Guideline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts & Most Violated Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-ink mb-1">Violations by Policy Category</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution of flagged findings across active channels.</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#C8A35A" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Frequently Violated Rules Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-ink mb-1">Top Flagged Brand Rules</h3>
            <p className="text-xs text-gray-500 mb-4">Rules triggered most often in draft content.</p>

            <div className="space-y-3">
              {insights.most_violated_rules?.map((r) => (
                <div key={r.code} className="flex items-center justify-between p-3 bg-mist/50 rounded-xl border border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink bg-white px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                      {r.code}
                    </span>
                    <span className="font-medium text-ink line-clamp-1 max-w-[220px]">{r.title}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-ink">{r.times_flagged} flags</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Governance data updated in real time</span>
            <span>Verity Engine v1.0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
