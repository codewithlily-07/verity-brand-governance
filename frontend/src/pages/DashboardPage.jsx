import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, CheckCircle, AlertTriangle, Clock, ArrowRight,
  TrendingUp, Shield, RefreshCw
} from 'lucide-react';
import { getSubmissions } from '../lib/api';

export function DashboardPage({ setActivePage, setSelectedSubmissionId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const total = submissions.length;
  const inReview = submissions.filter(s => ['In Review', 'Submitted', 'Resubmitted'].includes(s.status)).length;
  const approved = submissions.filter(s => s.status === 'Approved').length;
  const changesRequested = submissions.filter(s => s.status === 'Changes Requested').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Demonstration Workspace Banner */}
      <div className="bg-champagne/60 border border-gold/40 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-ink text-sm sm:text-base">Demonstration Workspace: Verity Learning</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-gold">Active</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Isolated judge session with seeded brand guidelines, rules R1–R7, and verified facts F-01–F-03.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('new-review')}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-midnight text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Review New Content</span>
          </button>
        </div>
      </div>

      {/* How it works one-line strip */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 mb-8 flex items-center justify-between text-xs text-gray-600 overflow-x-auto shadow-sm">
        <span className="font-semibold text-ink whitespace-nowrap">Governance Flow:</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px]">1</span>
          Setup Brand Hub
        </span>
        <span className="text-gray-300">→</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px]">2</span>
          Submit Copy
        </span>
        <span className="text-gray-300">→</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px]">3</span>
          3-Layer Engine
        </span>
        <span className="text-gray-300">→</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px]">4</span>
          Evidence & Diff
        </span>
        <span className="text-gray-300">→</span>
        <span className="flex items-center gap-1 text-teal font-medium whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-teal/20 text-teal flex items-center justify-center font-bold text-[10px]">5</span>
          Human Approval
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Submissions</span>
          <p className="font-serif text-3xl font-bold text-ink mt-2">{total}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">In workspace</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Awaiting Review</span>
          <p className="font-serif text-3xl font-bold text-amber-600 mt-2">{inReview}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Needs reviewer decision</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal">Approved</span>
          <p className="font-serif text-3xl font-bold text-teal mt-2">{approved}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Passed human sign-off</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-coral">Changes Requested</span>
          <p className="font-serif text-3xl font-bold text-coral mt-2">{changesRequested}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Returned to creator</span>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">Recent Content Reviews</h3>
            <p className="text-xs text-gray-500 mt-0.5">Click any submission to view evidence, inspect diffs, or execute review approvals.</p>
          </div>
          <button
            onClick={loadData}
            className="p-1.5 text-gray-400 hover:text-ink rounded-lg transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-600 mb-3">No submissions yet in this workspace.</p>
            <button
              onClick={() => setActivePage('new-review')}
              className="px-4 py-2 rounded-xl bg-gold text-midnight text-xs font-bold"
            >
              Submit First Copy
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist text-xs font-semibold uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Title & Campaign</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Versions</th>
                  <th className="px-6 py-3">Findings</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {submissions.map((sub) => {
                  let statusColor = 'bg-gray-100 text-gray-700';
                  if (sub.status === 'Approved') statusColor = 'bg-teal/15 text-teal border border-teal/30';
                  else if (sub.status === 'Changes Requested') statusColor = 'bg-coral/15 text-coral border border-coral/30';
                  else if (['In Review', 'Submitted', 'Resubmitted'].includes(sub.status)) statusColor = 'bg-amber/15 text-amber-800 border border-amber/30';

                  return (
                    <tr 
                      key={sub.id} 
                      className="hover:bg-mist/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedSubmissionId(sub.id);
                        setActivePage('results');
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-ink block">{sub.title}</span>
                        <span className="text-xs text-gray-500">{sub.campaign || 'General'} • By {sub.author_name}</span>
                      </td>
                      <td className="px-6 py-4 capitalize text-xs text-gray-600">
                        {sub.content_type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-600">
                        v{sub.version_count}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {sub.findings_count > 0 ? (
                          <span className="text-coral flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {sub.findings_count} findings
                          </span>
                        ) : (
                          <span className="text-teal flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-gold hover:text-ink flex items-center justify-end gap-1">
                          Inspect <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

